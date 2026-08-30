"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { gerarAtividadeComIa } from "@/lib/ia";
import { gerarGradeCacaPalavras } from "@/lib/cacaPalavras";
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
