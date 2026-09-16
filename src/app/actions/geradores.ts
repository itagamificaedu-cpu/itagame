"use server";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { iniciarSala } from "@/app/actions/salas";

// Ponte entre os Geradores (simulados client-side, sem persistência — banco
// de questões sorteado na hora, ver src/lib/geradores/) e o motor de Sala Ao
// Vivo já existente (Atividade + SalaAoVivo, ver actions/salas.ts). Salva o
// conjunto de questões que o professor sorteou como uma Atividade tipo
// "quiz" normal e já abre a sala em seguida — assim o simulado passa a
// funcionar exatamente como qualquer outra atividade: aluno entra pela
// turma (ou apelido livre), responde ao vivo, e ganha XP de verdade em cada
// acerto (ver XP_POR_ACERTO_SALA_AO_VIVO em actions/salas.ts).
export type QuestaoParaSala = {
  enunciado: string;
  alternativas: string[];
  /** índice (0-3) da alternativa correta */
  respostaCorreta: number;
};

export async function lancarSimuladoComoSala(
  input: {
    disciplina: string;
    serie: string;
    tema: string;
    questoes: QuestaoParaSala[];
  },
  formData: FormData
) {
  const sessao = await exigirAssinaturaAtiva();

  if (input.questoes.length === 0) {
    throw new Error("Sorteie um simulado com pelo menos 1 questão antes de lançar a sala.");
  }

  const conteudoGerado = {
    titulo: input.tema,
    questoes: input.questoes.map((questao) => ({
      enunciado: questao.enunciado,
      alternativas: questao.alternativas,
    })),
  };

  const gabarito = input.questoes.map((questao) => ({
    enunciado: questao.enunciado,
    respostaCorreta: questao.alternativas[questao.respostaCorreta],
    explicacao: null,
  }));

  const atividade = await prisma.atividade.create({
    data: {
      tipo: "quiz",
      disciplina: input.disciplina,
      serie: input.serie,
      tema: input.tema,
      conteudoGerado: conteudoGerado as Prisma.InputJsonValue,
      gabarito: gabarito as Prisma.InputJsonValue,
      competenciasBncc: [],
      professorId: sessao.userId,
    },
  });

  // iniciarSala já faz o redirect pra /painel/salas/[codigo] — propaga
  // normalmente (redirect no Next lança uma exceção de controle de fluxo).
  await iniciarSala(atividade.id, formData);
}
