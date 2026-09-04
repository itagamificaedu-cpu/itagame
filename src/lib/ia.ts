import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { EIXOS_BNCC_COMPUTACAO, eixoBnccPorChave, type EixoBnccComputacao } from "@/lib/bnccComputacao";
import { eixoSpaecePorChave, type EixoSpaece9Ano } from "@/lib/spaece";

const cliente = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODELO = "claude-sonnet-5";

export type TipoAtividadeGeravel =
  | "quiz"
  | "verdadeiro_falso"
  | "completar_frase"
  | "caca_palavras"
  | "associar_colunas"
  | "apresentacao"
  | "cabo_de_guerra";

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
  cabo_de_guerra:
    "Cada questão deve ser de múltipla escolha, curta e rápida de responder (é um jogo de velocidade entre duas equipes, o aluno precisa decidir na hora): exatamente 4 alternativas curtas (poucas palavras cada) e apenas uma correta, sem enunciados longos ou pegadinhas complexas.",
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

// --- geração de trilha (BNCC Computação) ---

export type QuestaoTrilhaGerada = {
  enunciado: string;
  alternativas: string[];
  respostaCorreta: string;
};

export type MissaoTrilhaGerada = {
  titulo: string;
  descricao: string;
  tipoAtividade: "video" | "quiz" | "pratica" | "projeto" | "leitura" | "desafio";
  xp: number;
  checkpointTipo: "quiz_automatico" | "correcao_professor";
  quizPerguntas?: QuestaoTrilhaGerada[];
};

export type TrilhaGerada = {
  nome: string;
  descricao: string;
  competenciasBncc: string[];
  missoes: MissaoTrilhaGerada[];
};

// Eixos oficiais da BNCC Computação (Parecer CNE/CEB nº 2/2022) — toda
// trilha gerada precisa se apoiar em pelo menos um deles. Lista completa e
// textos em src/lib/bnccComputacao.ts (fonte única, também usada nas
// páginas da aba "BNCC Computação").
const TEXTO_EIXOS_BNCC_COMPUTACAO = EIXOS_BNCC_COMPUTACAO.map(
  (eixo) => `- ${eixo.nome} (${eixo.subconceitos.join(", ")}): ${eixo.resumo}`
).join("\n");

const FERRAMENTA_SALVAR_TRILHA: Anthropic.Tool = {
  name: "salvar_trilha",
  description: "Salva uma trilha de aprendizagem gamificada, com suas missões em sequência, alinhada à BNCC Computação.",
  input_schema: {
    type: "object",
    properties: {
      nome: { type: "string", description: "Nome curto e atrativo da trilha" },
      descricao: { type: "string", description: "O que o aluno vai aprender ao longo da trilha (1-2 frases)" },
      competenciasBncc: {
        type: "array",
        items: { type: "string" },
        description: "Habilidades/eixos da BNCC Computação trabalhados nessa trilha (ex: 'Pensamento Computacional — reconhecimento de padrões')",
      },
      missoes: {
        type: "array",
        description: "Missões em ordem — cada uma libera a próxima quando concluída.",
        items: {
          type: "object",
          properties: {
            titulo: { type: "string" },
            descricao: { type: "string", description: "O que o aluno precisa fazer nessa missão, de forma clara e prática" },
            tipoAtividade: {
              type: "string",
              enum: ["video", "quiz", "pratica", "projeto", "leitura", "desafio"],
            },
            xp: { type: "number", description: "XP da missão, entre 10 e 50 — mais difícil/trabalhosa, mais XP" },
            checkpointTipo: {
              type: "string",
              enum: ["quiz_automatico", "correcao_professor"],
              description:
                "'quiz_automatico' quando dá pra verificar a resposta certa automaticamente (conceitos, teoria). 'correcao_professor' quando o aluno precisa produzir algo (prática, projeto, redação) que só um humano avalia.",
            },
            quizPerguntas: {
              type: "array",
              description: "Só preencher quando checkpointTipo = quiz_automatico. De 2 a 4 perguntas de múltipla escolha.",
              items: {
                type: "object",
                properties: {
                  enunciado: { type: "string" },
                  alternativas: {
                    type: "array",
                    items: { type: "string" },
                    description: "Exatamente 4 alternativas plausíveis",
                  },
                  respostaCorreta: { type: "string", description: "Texto exato da alternativa correta" },
                },
                required: ["enunciado", "alternativas", "respostaCorreta"],
              },
            },
          },
          required: ["titulo", "descricao", "tipoAtividade", "xp", "checkpointTipo"],
        },
      },
    },
    required: ["nome", "descricao", "competenciasBncc", "missoes"],
  },
};

export async function gerarTrilhaComIa(params: {
  nivel: string;
  tema?: string;
  quantidadeMissoes: number;
  // Quando vem da aba "BNCC Computação", trava a trilha inteira nesse eixo
  // específico (e nos subconceitos dele) em vez de deixar a IA escolher
  // livremente entre os três.
  eixo?: EixoBnccComputacao;
  // Quando vem da aba "SPAECE 9º ano", trava a trilha inteira nesse eixo da
  // matriz oficial (Língua Portuguesa ou Matemática), treinando os
  // descritores reais dele — mutuamente exclusivo com `eixo` (BNCC).
  eixoSpaece?: EixoSpaece9Ano;
}): Promise<TrilhaGerada> {
  const { nivel, tema, quantidadeMissoes, eixo, eixoSpaece } = params;
  const eixoEscolhido = eixoBnccPorChave(eixo);
  const eixoSpaeceEscolhido = eixoSpaecePorChave(eixoSpaece);

  const instrucaoEixo = eixoSpaeceEscolhido
    ? `A trilha precisa treinar especificamente as habilidades do eixo "${eixoSpaeceEscolhido.nome}" da Matriz de Referência oficial do SPAECE (${eixoSpaeceEscolhido.disciplina === "matematica" ? "Matemática" : "Língua Portuguesa"}, 9º ano). Descritores oficiais desse eixo, cada um DEVE ser trabalhado em pelo menos uma missão/questão:\n${eixoSpaeceEscolhido.descritores.map((d) => `- ${d.codigo}: ${d.habilidade}`).join("\n")}\nEm "competenciasBncc" cite o código e o nome de cada descritor trabalhado em cada missão (ex: "D01 — Localizar informação explícita").`
    : eixoEscolhido
      ? `A trilha precisa trabalhar especificamente o eixo "${eixoEscolhido.nome}" da BNCC Computação, cobrindo seus subconceitos (${eixoEscolhido.subconceitos.join(", ")}). Em "competenciasBncc" cite esse eixo e os subconceitos trabalhados em cada missão.`
      : `A trilha precisa trabalhar pelo menos um dos três eixos oficiais da BNCC Computação:\n${TEXTO_EIXOS_BNCC_COMPUTACAO}`;

  const instrucao = `Crie uma trilha de aprendizagem gamificada em português do Brasil, ${
    eixoSpaeceEscolhido
      ? `sobre ${eixoSpaeceEscolhido.disciplina === "matematica" ? "Matemática" : "Língua Portuguesa"} (preparatória para o SPAECE)`
      : "sobre Computação/Tecnologia"
  }, pra uma turma de nível "${nivel}"${
    tema ? `, com foco no tema "${tema}"` : ", escolhendo você mesmo um tema interessante e adequado à idade"
  }.

${instrucaoEixo}

Gere exatamente ${quantidadeMissoes} missões, em ordem progressiva (da mais simples pra mais desafiadora), formando uma sequência linear onde cada missão prepara o aluno pra próxima.
Varie os tipos de missão (vídeo, quiz, prática, projeto, leitura, desafio) — não deixe tudo igual.
Pelo menos uma missão deve ser do tipo "quiz" com checkpointTipo "quiz_automatico"${eixoSpaeceEscolhido ? ", com perguntas no estilo de item de prova do SPAECE (situação-problema/texto de apoio + pergunta objetiva)" : ""}.
Use linguagem simples e adequada à faixa etária. Chame a ferramenta "salvar_trilha" com o resultado.`;

  const resposta = await cliente.messages.create({
    model: MODELO,
    max_tokens: 8192,
    tools: [FERRAMENTA_SALVAR_TRILHA],
    tool_choice: { type: "tool", name: "salvar_trilha" },
    messages: [{ role: "user", content: instrucao }],
  });

  const blocoFerramenta = resposta.content.find((bloco) => bloco.type === "tool_use");
  if (!blocoFerramenta || blocoFerramenta.type !== "tool_use") {
    throw new Error("A IA não retornou a trilha no formato esperado.");
  }

  return blocoFerramenta.input as TrilhaGerada;
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
