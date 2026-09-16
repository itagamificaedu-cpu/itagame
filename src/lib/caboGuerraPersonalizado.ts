import type { Atividade } from "@prisma/client";

export type QuestaoCaboGuerraPersonalizada = {
  enunciado: string;
  alternativas: string[];
  indiceCorreto: number;
};

type ConteudoAtividade = { questoes: { enunciado: string; alternativas: string[] }[] };
type ItemGabarito = { enunciado: string; respostaCorreta: string };

// Atividades geradas por IA tendem a vir com a resposta certa sempre na
// primeira alternativa (viés conhecido de LLM). Embaralha aqui, a cada
// preparo da partida, pra "certa sempre na letra A" não virar padrão
// visível — inclusive pra atividades antigas já salvas assim no banco.
function embaralharAlternativas(alternativas: string[], indiceCorreto: number) {
  const respostaCorreta = alternativas[indiceCorreto];
  const embaralhadas = [...alternativas];
  for (let i = embaralhadas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [embaralhadas[i], embaralhadas[j]] = [embaralhadas[j], embaralhadas[i]];
  }
  return { alternativas: embaralhadas, indiceCorreto: embaralhadas.indexOf(respostaCorreta) };
}

export function prepararPerguntasPersonalizadas(atividade: Atividade): QuestaoCaboGuerraPersonalizada[] {
  const conteudo = atividade.conteudoGerado as ConteudoAtividade;
  const gabarito = atividade.gabarito as ItemGabarito[];

  return conteudo.questoes
    .map((questao, indice) => {
      const respostaCorreta = gabarito[indice]?.respostaCorreta;
      const indiceCorreto = questao.alternativas.indexOf(respostaCorreta ?? "");
      if (indiceCorreto < 0) return { enunciado: questao.enunciado, alternativas: questao.alternativas, indiceCorreto };
      const embaralhado = embaralharAlternativas(questao.alternativas, indiceCorreto);
      return { enunciado: questao.enunciado, ...embaralhado };
    })
    .filter((questao) => questao.alternativas.length >= 2 && questao.indiceCorreto >= 0);
}
