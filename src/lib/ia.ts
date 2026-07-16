import "server-only";
import Anthropic from "@anthropic-ai/sdk";

const cliente = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODELO = "claude-sonnet-5";

export type TipoAtividadeGeravel = "quiz" | "verdadeiro_falso";

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
              description: "Somente para questões de múltipla escolha (4 opções)",
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
