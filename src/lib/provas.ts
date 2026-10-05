import "server-only";
import crypto from "node:crypto";
import type { ProvaCronometrada } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { GRACA_ENCERRAMENTO_SEGUNDOS, restanteSegundos } from "@/lib/provaTempo";

export type QuestaoProva = { enunciado: string; alternativas: string[]; imagem?: string };
export type BlocoProva = {
  nome: string;
  atividadeId: string;
  disciplina: string;
  questoes: QuestaoProva[];
  gabarito: string[];
};

export function blocosDaProva(prova: Pick<ProvaCronometrada, "blocos">): BlocoProva[] {
  return prova.blocos as unknown as BlocoProva[];
}

export function gerarCodigoProva() {
  return String(crypto.randomInt(100000, 999999));
}

export function respostasDoParticipante(respostas: unknown): Record<string, string> {
  return respostas && typeof respostas === "object" ? (respostas as Record<string, string>) : {};
}

export function chaveResposta(bloco: number, indice: number) {
  return `${bloco}:${indice}`;
}

// Acertos por bloco de um participante, comparando o texto da alternativa
// marcada com o gabarito do bloco.
export function corrigir(blocos: BlocoProva[], respostas: Record<string, string>) {
  return blocos.map((bloco, b) => {
    const acertos = bloco.gabarito.reduce(
      (soma, certa, q) => soma + (respostas[chaveResposta(b, q)] === certa ? 1 : 0),
      0
    );
    const respondidas = bloco.gabarito.filter((_, q) => respostas[chaveResposta(b, q)] !== undefined).length;
    return { nome: bloco.nome, acertos, total: bloco.gabarito.length, respondidas };
  });
}

// Chamada em toda leitura/escrita da prova: se o tempo acabou, encerra de vez
// e grava os resultados no relatório (uma única vez, mesmo com várias
// chamadas ao mesmo tempo).
export async function finalizarSeNecessario<T extends ProvaCronometrada>(prova: T): Promise<T> {
  let atual: ProvaCronometrada = prova;

  if (atual.status === "em_andamento" && restanteSegundos(atual) <= -GRACA_ENCERRAMENTO_SEGUNDOS) {
    await prisma.provaCronometrada.updateMany({
      where: { id: atual.id, status: "em_andamento" },
      data: { status: "encerrada", encerradaEm: new Date() },
    });
    atual = (await prisma.provaCronometrada.findUnique({ where: { id: atual.id } })) ?? atual;
  }

  if (atual.status === "encerrada" && !atual.resultadosGravadosEm) {
    await gravarResultados(atual.id);
    atual = (await prisma.provaCronometrada.findUnique({ where: { id: atual.id } })) ?? atual;
  }

  return atual as T;
}

// Transforma as respostas da prova em registros iguais aos de uma Sala Ao
// Vivo (um por bloco, ligado à atividade de origem), pra a prova aparecer no
// Relatório de Desempenho sem mudar nada nele. Questão em branco conta como
// errada. Roda em transação e só uma vez (trava resultadosGravadosEm).
async function gravarResultados(provaId: string) {
  await prisma.$transaction(
    async (tx) => {
      const trava = await tx.provaCronometrada.updateMany({
        where: { id: provaId, status: "encerrada", resultadosGravadosEm: null },
        data: { resultadosGravadosEm: new Date() },
      });
      if (trava.count === 0) return;

      const prova = await tx.provaCronometrada.findUnique({
        where: { id: provaId },
        include: { participantes: { include: { aluno: { select: { nome: true } } } } },
      });
      if (!prova) return;

      const blocos = blocosDaProva(prova);
      const momento = prova.encerradaEm ?? new Date();

      for (let b = 0; b < blocos.length; b++) {
        const bloco = blocos[b];

        let codigo = gerarCodigoProva();
        while (await tx.salaAoVivo.findUnique({ where: { codigo } })) codigo = gerarCodigoProva();

        const sala = await tx.salaAoVivo.create({
          data: {
            codigo,
            status: "encerrada",
            perguntaAtual: bloco.gabarito.length - 1,
            atividadeId: bloco.atividadeId,
            turmaId: prova.turmaId,
          },
        });

        const apelidosUsados = new Set<string>();
        for (const participante of prova.participantes) {
          const respostas = respostasDoParticipante(participante.respostas);
          const certas = bloco.gabarito.map((certa, q) => respostas[chaveResposta(b, q)] === certa);

          let apelido = participante.aluno.nome;
          for (let n = 2; apelidosUsados.has(apelido); n++) apelido = `${participante.aluno.nome} (${n})`;
          apelidosUsados.add(apelido);

          const criado = await tx.participanteSala.create({
            data: {
              salaId: sala.id,
              apelido,
              alunoId: participante.alunoId,
              pontuacao: certas.filter(Boolean).length * 100,
            },
          });

          await tx.respostaParticipante.createMany({
            data: certas.map((correta, q) => ({
              participanteId: criado.id,
              indiceQuestao: q,
              correta,
              pontosGanhos: correta ? 100 : 0,
              respondidaEm: participante.entregueEm ?? momento,
            })),
          });
        }
      }
    },
    { timeout: 120000, maxWait: 20000 }
  );
}
