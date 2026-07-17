import "server-only";
import Anthropic from "@anthropic-ai/sdk";

const cliente = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODELO = "claude-sonnet-5";

export type TipoAtividadeGeravel =
  | "quiz"
  | "verdadeiro_falso"
  | "completar_frase"
  | "caca_palavras"
  | "associar_colunas"
  | "apresentacao";

type QuestaoGerada = {
  enunciado: string;
  alternativas?: string[];
  respostaCorreta: string;
  explicacao?: string;
};

export type AtividadeGerada = {
  titulo: string;
  competenciasBncc: string[];
  questoes: QuestaoGerada[];
};

const FERRAMENTA_SALVAR_ATIVIDADE: Anthropic.Tool = {
  name: "salvar_atividade",
  description: "Salva a atividade pedagógica gerada, já pronta para aplicação em sala.",
  input_schema: {
    type: "object",
    properties: {
      titulo: { type: "string", description: "Título curto da atividade" },
      competenciasBncc: {
        type: "array",
        items: { type: "string" },
        description: "Códigos ou descrições das competências da BNCC trabalhadas",
      },
      questoes: {
        type: "array",
        items: {
          type: "object",
          properties: {
            enunciado: { type: "string" },
            alternativas: {
              type: "array",
              items: { type: "string" },
              description:
                "Para quiz: as 4 opções de múltipla escolha. Para apresentação: os tópicos/bullet points do slide. Demais tipos: deixe vazio.",
            },
            respostaCorreta: {
              type: "string",
              description: "Texto exato da alternativa correta, ou 'verdadeiro'/'falso'",
            },
            explicacao: { type: "string", description: "Justificativa pedagógica da resposta" },
          },
          required: ["enunciado", "respostaCorreta"],
        },
      },
    },
    required: ["titulo", "competenciasBncc", "questoes"],
  },
};

const ORIENTACAO_POR_TIPO: Record<TipoAtividadeGeravel, string> = {
  quiz: "Cada questão deve ser de múltipla escolha, com exatamente 4 alternativas plausíveis e apenas uma correta.",
  verdadeiro_falso:
    "Cada questão deve ser uma afirmação para o aluno julgar como verdadeira ou falsa. Não preencha 'alternativas'; em 'respostaCorreta' escreva apenas 'verdadeiro' ou 'falso'.",
  completar_frase:
    "Cada questão deve ser uma frase com uma lacuna, representada por '_____', para o aluno completar. Não preencha 'alternativas'; em 'respostaCorreta' escreva apenas a palavra ou expressão que completa a lacuna corretamente.",
  caca_palavras:
    "Não gere frases. Cada questão representa uma palavra do caça-palavras: em 'enunciado' escreva uma dica curta (definição ou contexto) sobre a palavra, e em 'respostaCorreta' escreva a palavra em si, em maiúsculas, sem espaços, números ou acentos (uma única palavra, entre 3 e 12 letras). Não preencha 'alternativas'.",
  associar_colunas:
    "Cada questão é um par para associação: em 'enunciado' escreva o termo (coluna A) e em 'respostaCorreta' a definição ou conceito correspondente (coluna B), curto e sem ambiguidade com os demais pares. Não preencha 'alternativas'.",
  apresentacao:
    "Cada questão representa um slide: em 'enunciado' escreva o título do slide e em 'alternativas' liste de 3 a 5 tópicos/bullet points do slide (frases curtas). Em 'respostaCorreta' escreva uma breve fala sugerida para o professor apresentar esse slide.",
};

function montarInstrucao(params: {
  tipo: TipoAtividadeGeravel;
  disciplina: string;
  serie: string;
  tema: string;
  quantidadeQuestoes: number;
}) {
  const { tipo, disciplina, serie, tema, quantidadeQuestoes } = params;

  return `Crie uma atividade pedagógica em português do Brasil para uma turma de ${serie}, na disciplina de ${disciplina}, sobre o tema "${tema}".
Gere exatamente ${quantidadeQuestoes} questões do tipo ${tipo}. ${ORIENTACAO_POR_TIPO[tipo]}
Alinhe o conteúdo à BNCC e informe as competências trabalhadas. Use linguagem adequada à faixa etária. Chame a ferramenta "salvar_atividade" com o resultado.`;
}

export async function gerarAtividadeComIa(params: {
  tipo: TipoAtividadeGeravel;
  disciplina: string;
  serie: string;
  tema: string;
  quantidadeQuestoes: number;
}): Promise<AtividadeGerada> {
  const resposta = await cliente.messages.create({
    model: MODELO,
    max_tokens: 4096,
    tools: [FERRAMENTA_SALVAR_ATIVIDADE],
    tool_choice: { type: "tool", name: "salvar_atividade" },
    messages: [{ role: "user", content: montarInstrucao(params) }],
  });

  const blocoFerramenta = resposta.content.find((bloco) => bloco.type === "tool_use");
  if (!blocoFerramenta || blocoFerramenta.type !== "tool_use") {
    throw new Error("A IA não retornou a atividade no formato esperado.");
  }

  return blocoFerramenta.input as AtividadeGerada;
}

export const CRITERIOS_REDACAO = ["Gramática", "Coerência", "Argumentação", "Repertório"] as const;

export type NotaCriterio = { criterio: string; nota: number; comentario: string };

export type CorrecaoRedacaoGerada = {
  notaGeral: number;
  feedbackGeral: string;
  notasPorCriterio: NotaCriterio[];
};

const FERRAMENTA_CORRIGIR_REDACAO: Anthropic.Tool = {
  name: "salvar_correcao",
  description: "Salva a correção da redação com nota e comentário por critério.",
  input_schema: {
    type: "object",
    properties: {
      notaGeral: {
        type: "number",
        description: "Média das notas dos 4 critérios, de 0 a 10 (pode ter uma casa decimal)",
      },
      feedbackGeral: {
        type: "string",
        description: "Parágrafo curto com a impressão geral e as principais recomendações",
      },
      notasPorCriterio: {
        type: "array",
        items: {
          type: "object",
          properties: {
            criterio: { type: "string", enum: [...CRITERIOS_REDACAO] },
            nota: { type: "number", description: "Nota de 0 a 10 para este critério" },
            comentario: { type: "string", description: "Comentário específico sobre este critério" },
          },
          required: ["criterio", "nota", "comentario"],
        },
      },
    },
    required: ["notaGeral", "feedbackGeral", "notasPorCriterio"],
  },
};

export async function corrigirRedacaoComIa(params: {
  tema: string;
  texto: string;
}): Promise<CorrecaoRedacaoGerada> {
  const instrucao = `Corrija a redação abaixo, escrita em português do Brasil por um aluno sobre o tema "${params.tema}".
Avalie separadamente os critérios: ${CRITERIOS_REDACAO.join(", ")} — cada um com nota de 0 a 10 e um comentário específico.
Dê uma nota geral (média dos critérios) e um feedback geral construtivo, apontando pontos fortes e o que melhorar.
Seja rigoroso mas encorajador, adequado ao contexto escolar.

Redação do aluno:
"""
${params.texto}
"""

Chame a ferramenta "salvar_correcao" com o resultado.`;

  const resposta = await cliente.messages.create({
    model: MODELO,
    max_tokens: 2048,
    tools: [FERRAMENTA_CORRIGIR_REDACAO],
    tool_choice: { type: "tool", name: "salvar_correcao" },
    messages: [{ role: "user", content: instrucao }],
  });

  const blocoFerramenta = resposta.content.find((bloco) => bloco.type === "tool_use");
  if (!blocoFerramenta || blocoFerramenta.type !== "tool_use") {
    throw new Error("A IA não retornou a correção no formato esperado.");
  }

  return blocoFerramenta.input as CorrecaoRedacaoGerada;
}
