import type { Atividade } from "@prisma/client";

export type QuestaoCaboGuerraPersonalizada = {
  enunciado: string;
  alternativas: string[];
  indiceCorreto: number;
};

type ConteudoAtividade = { questoes: { enunciado: string; alternativas: string[] }[] };
type ItemGabarito = { enunciado: string; respostaCorreta: string };

export function prepararPerguntasPersonalizadas(atividade: Atividade): QuestaoCaboGuerraPersonalizada[] {
  const conteudo = atividade.conteudoGerado as ConteudoAtividade;
  const gabarito = atividade.gabarito as ItemGabarito[];

  return conteudo.questoes
    .map((questao, indice) => {
      const respostaCorreta = gabarito[indice]?.respostaCorreta;
      const indiceCorreto = questao.alternativas.indexOf(respostaCorreta ?? "");
      return { enunciado: questao.enunciado, alternativas: questao.alternativas, indiceCorreto };
    })
    .filter((questao) => questao.alternativas.length >= 2 && questao.indiceCorreto >= 0);
}
