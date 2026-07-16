"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verificarSessao } from "@/lib/acessoDados";
import { gerarAtividadeComIa } from "@/lib/ia";
import { EsquemaGeracaoAtividade, EstadoGeracaoAtividade } from "@/lib/definicoes";

export async function gerarAtividade(
  _estado: EstadoGeracaoAtividade,
  formData: FormData
): Promise<EstadoGeracaoAtividade> {
  const sessao = await verificarSessao();

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

  let atividadeGerada;
  try {
    atividadeGerada = await gerarAtividadeComIa({ tipo, disciplina, serie, tema, quantidadeQuestoes });
  } catch {
    return { mensagem: "Não consegui gerar a atividade agora. Tente novamente em instantes." };
  }

  const atividade = await prisma.atividade.create({
    data: {
      tipo,
      disciplina,
      serie,
      tema,
      conteudoGerado: {
        titulo: atividadeGerada.titulo,
        questoes: atividadeGerada.questoes.map((questao) => ({
          enunciado: questao.enunciado,
          alternativas: questao.alternativas ?? [],
        })),
      },
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
