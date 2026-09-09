"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { gerarAtividadeComIa } from "@/lib/ia";
import { gerarGradeCacaPalavras } from "@/lib/cacaPalavras";
import { eixoSpaecePorChave, type EixoSpaece9Ano } from "@/lib/spaece";
import { EsquemaGeracaoAtividade, EstadoGeracaoAtividade } from "@/lib/definicoes";

function embaralhar<T>(itens: T[]): T[] {
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export async function gerarAtividade(
  _estado: EstadoGeracaoAtividade,
  formData: FormData
): Promise<EstadoGeracaoAtividade> {
  const sessao = await exigirAssinaturaAtiva();

  const camposValidados = EsquemaGeracaoAtividade.safeParse({
    tipo: formData.get("tipo"),
    disciplina: formData.get("disciplina"),
    serie: formData.get("serie"),
    tema: formData.get("tema"),
    quantidadeQuestoes: formData.get("quantidadeQuestoes"),
  });

  if (!camposValidados.success) {
    return { erros: camposValidados.error.flatten().fieldErrors };
  }

  const { tipo, disciplina, serie, tema, quantidadeQuestoes } = camposValidados.data;

  // Acesso cortesia (Desafio Prof Conectado) só gera 1 atividade de cada
  // tipo — dá pra conhecer todo mundo dos 6, mas sem custo ilimitado de IA
  // pra quem ainda não assinou. Assinante pago (cortesia: false) não tem
  // esse limite.
  const assinatura = await prisma.assinatura.findUnique({ where: { professorId: sessao.userId } });
  if (assinatura?.cortesia) {
    const jaGerouEsseTipo = await prisma.atividade.count({
      where: { professorId: sessao.userId, tipo },
    });
    if (jaGerouEsseTipo > 0) {
      return {
        mensagem: `No acesso cortesia você pode gerar 1 atividade de cada tipo pra conhecer a ferramenta — você já gerou uma de "${tipo}". Assine o Pro pra gerar sem limite.`,
      };
    }
  }

  let atividadeGerada;
  try {
    atividadeGerada = await gerarAtividadeComIa({ tipo, disciplina, serie, tema, quantidadeQuestoes });
  } catch {
    return { mensagem: "Não consegui gerar a atividade agora. Tente novamente em instantes." };
  }

  const questoesBase = atividadeGerada.questoes.map((questao) => ({
    enunciado: questao.enunciado,
    alternativas: questao.alternativas ?? [],
  }));

  let conteudoGerado: Record<string, unknown> = {
    titulo: atividadeGerada.titulo,
    questoes: questoesBase,
  };

  if (tipo === "associar_colunas") {
    conteudoGerado = {
      ...conteudoGerado,
      colunaB: embaralhar(atividadeGerada.questoes.map((questao) => questao.respostaCorreta)),
    };
  }

  if (tipo === "caca_palavras") {
    const { tamanho, grade } = gerarGradeCacaPalavras(
      atividadeGerada.questoes.map((questao) => questao.respostaCorreta)
    );
    conteudoGerado = { ...conteudoGerado, tamanho, grade };
  }

  const atividade = await prisma.atividade.create({
    data: {
      tipo,
      disciplina,
      serie,
      tema,
      conteudoGerado: conteudoGerado as Prisma.InputJsonValue,
      gabarito: atividadeGerada.questoes.map((questao) => ({
        enunciado: questao.enunciado,
        respostaCorreta: questao.respostaCorreta,
        explicacao: questao.explicacao ?? null,
      })),
      competenciasBncc: atividadeGerada.competenciasBncc,
      professorId: sessao.userId,
    },
  });

  revalidatePath("/painel/atividades");
  redirect(`/painel/atividades/${atividade.id}`);
}

export type ResultadoAtividadeSpaece =
  | { ok: true; atividadeId: string }
  | { ok: false; erro: string };

// Atalho "1 clique" da aba SPAECE 9º ano: gera uma atividade (quiz pra Sala
// Ao Vivo, ou cabo_de_guerra pro jogo por times/individual) já travada nos
// descritores oficiais do eixo escolhido — de lá o professor já tem os
// botões de jogar online prontos (QR code, turma opcional etc.), sem
// duplicar nenhuma dessas telas.
//
// Não usa redirect() aqui de propósito: com várias dessas ações na mesma
// página (uma por eixo do SPAECE), o redirect do servidor ficava competindo
// com os prefetches dos links "Gerar trilha com IA" da mesma tela e o
// navegador abortava a navegação (ERR_ABORTED) — o professor clicava, a
// atividade era criada de verdade no banco, mas a tela não saía do lugar.
// Devolver o id e deixar o componente cliente navegar com router.push()
// evita essa disputa.
export async function gerarAtividadeSpaece(
  eixoChave: EixoSpaece9Ano,
  tipo: "quiz" | "cabo_de_guerra"
): Promise<ResultadoAtividadeSpaece> {
  const sessao = await exigirAssinaturaAtiva();

  const eixo = eixoSpaecePorChave(eixoChave);
  if (!eixo) {
    return { ok: false, erro: "Eixo do SPAECE não encontrado." };
  }

  const disciplina = eixo.disciplina === "matematica" ? "Matemática" : "Língua Portuguesa";

  let atividadeGerada;
  try {
    atividadeGerada = await gerarAtividadeComIa({
      tipo,
      disciplina,
      serie: "9º ano",
      tema: `${eixo.nome} (SPAECE)`,
      quantidadeQuestoes: tipo === "cabo_de_guerra" ? 12 : 8,
      eixoSpaece: eixoChave,
    });
  } catch {
    return { ok: false, erro: "Não consegui gerar o simulado agora. Tente novamente em instantes." };
  }

  const atividade = await prisma.atividade.create({
    data: {
      tipo,
      disciplina,
      serie: "9º ano",
      tema: `${eixo.nome} (SPAECE)`,
      conteudoGerado: {
        titulo: atividadeGerada.titulo,
        questoes: atividadeGerada.questoes.map((questao) => ({
          enunciado: questao.enunciado,
          alternativas: questao.alternativas ?? [],
        })),
      } as Prisma.InputJsonValue,
      gabarito: atividadeGerada.questoes.map((questao) => ({
        enunciado: questao.enunciado,
        respostaCorreta: questao.respostaCorreta,
        explicacao: questao.explicacao ?? null,
      })),
      competenciasBncc: atividadeGerada.competenciasBncc,
      professorId: sessao.userId,
    },
  });

  revalidatePath("/painel/atividades");
  return { ok: true, atividadeId: atividade.id };
}
