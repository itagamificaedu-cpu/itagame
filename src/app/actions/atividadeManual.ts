"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verificarSessao } from "@/lib/acessoDados";

// Criação manual de atividade — pra quando o professor já tem as perguntas
// prontas e não precisa da IA. Mesma lógica do criador de quiz do ITA
// System: título, perguntas uma a uma, alternativas com a correta marcada.
// Salva na mesma tabela/formato da atividade gerada por IA (mesmo
// "conteudoGerado"/"gabarito"), então funciona igual em tudo depois:
// sala ao vivo, exportar Word/PDF/PowerPoint etc.

export type TipoAtividadeManual = "quiz" | "verdadeiro_falso" | "completar_frase";

export type QuestaoManual = {
  enunciado: string;
  alternativas: string[];
  respostaCorreta: string;
};

export type ResultadoAtividadeManual = { ok: true } | { ok: false; erro: string };

export async function criarAtividadeManual(input: {
  tipo: TipoAtividadeManual;
  disciplina: string;
  serie: string;
  tema: string;
  questoes: QuestaoManual[];
}): Promise<ResultadoAtividadeManual> {
  const sessao = await verificarSessao();

  const disciplina = input.disciplina.trim();
  const serie = input.serie.trim();
  const tema = input.tema.trim();

  if (!disciplina || !serie) {
    return { ok: false, erro: "Preencha a disciplina e a série/ano." };
  }
  if (!tema) {
    return { ok: false, erro: "Dê um título para a atividade." };
  }
  if (input.questoes.length === 0) {
    return { ok: false, erro: "Adicione pelo menos uma pergunta." };
  }

  for (const [indice, questao] of input.questoes.entries()) {
    const numero = indice + 1;
    const enunciado = questao.enunciado.trim();
    if (!enunciado) {
      return { ok: false, erro: `Escreva o texto da pergunta ${numero}.` };
    }

    if (input.tipo === "quiz") {
      const alternativas = questao.alternativas.map((a) => a.trim()).filter(Boolean);
      if (alternativas.length < 2) {
        return { ok: false, erro: `A pergunta ${numero} precisa de pelo menos 2 alternativas preenchidas.` };
      }
      if (!questao.respostaCorreta.trim() || !alternativas.includes(questao.respostaCorreta.trim())) {
        return { ok: false, erro: `Marque qual é a alternativa correta da pergunta ${numero}.` };
      }
    } else if (input.tipo === "verdadeiro_falso") {
      if (questao.respostaCorreta !== "verdadeiro" && questao.respostaCorreta !== "falso") {
        return { ok: false, erro: `Marque se a pergunta ${numero} é verdadeira ou falsa.` };
      }
    } else {
      if (!questao.respostaCorreta.trim()) {
        return { ok: false, erro: `Informe a resposta certa da pergunta ${numero}.` };
      }
    }
  }

  const questoesLimpas = input.questoes.map((questao) => ({
    enunciado: questao.enunciado.trim(),
    alternativas:
      input.tipo === "quiz" ? questao.alternativas.map((a) => a.trim()).filter(Boolean) : [],
  }));

  const gabarito = input.questoes.map((questao) => ({
    enunciado: questao.enunciado.trim(),
    respostaCorreta: questao.respostaCorreta.trim(),
    explicacao: null,
  }));

  const atividade = await prisma.atividade.create({
    data: {
      tipo: input.tipo,
      disciplina,
      serie,
      tema,
      conteudoGerado: { titulo: tema, questoes: questoesLimpas } as Prisma.InputJsonValue,
      gabarito: gabarito as Prisma.InputJsonValue,
      competenciasBncc: [],
      professorId: sessao.userId,
    },
  });

  revalidatePath("/painel/atividades");
  redirect(`/painel/atividades/${atividade.id}`);
}
