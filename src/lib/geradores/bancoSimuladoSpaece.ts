import { embaralhar } from "./aleatorio";

export type TemaSimulado =
  | "potenciacao"
  | "raizQuadrada"
  | "equacao1Grau"
  | "sistemaEquacoes"
  | "equacao2Grau";

export const ROTULO_TEMA_SIMULADO: Record<TemaSimulado, string> = {
  potenciacao: "Potenciação",
  raizQuadrada: "Raiz Quadrada",
  equacao1Grau: "Equação do 1º Grau",
  sistemaEquacoes: "Sistema de Equações",
  equacao2Grau: "Equação do 2º Grau",
};

export type QuestaoSimulado = {
  enunciado: string;
  alternativas: string[];
  /** índice (0-3) da alternativa correta */
  respostaCorreta: number;
  tema: TemaSimulado;
  descritor: string;
  habilidadeBncc: string;
};

/**
 * Banco de questões contextualizadas, no estilo de item do SPAECE/SAEB
 * (múltipla escolha, 4 alternativas), pesquisado e alinhado aos descritores
 * oficiais da Matriz de Referência de Matemática do 9º ano e às habilidades
 * da BNCC. Cada questão cita o descritor e a habilidade pra o professor
 * saber exatamente o que está sendo trabalhado.
 *
 * Fontes usadas na pesquisa (04/ago/2026):
 * - Matriz de Referência de Matemática do SAEB/SPAECE (INEP / SEDUC-CE)
 * - BNCC — Matemática, Ensino Fundamental (EF07MA18, EF08MA01, EF08MA02,
 *   EF08MA07, EF08MA08, EF09MA09)
 */
export const BANCO_SIMULADO_SPAECE: QuestaoSimulado[] = [
  // ---------------------------------------------------------------------
  // Potenciação — SPAECE/SAEB D18, D25 · BNCC EF08MA01
  // ---------------------------------------------------------------------
  {
    tema: "potenciacao",
    descritor: "D18/D25 — Efetuar cálculos envolvendo potenciação",
    habilidadeBncc: "EF08MA01",
    enunciado:
      "Um vírus se multiplica dobrando de quantidade a cada dia. Começando com 3 vírus, quantos vírus existirão depois de 4 dias?",
    alternativas: ["11", "24", "48", "81"],
    respostaCorreta: 2,
  },
  {
    tema: "potenciacao",
    descritor: "D18/D25 — Efetuar cálculos envolvendo potenciação",
    habilidadeBncc: "EF08MA01",
    enunciado: "O valor da expressão 2³ + 3² é:",
    alternativas: ["11", "12", "17", "31"],
    respostaCorreta: 2,
  },
  {
    tema: "potenciacao",
    descritor: "D18/D25 — Efetuar cálculos envolvendo potenciação",
    habilidadeBncc: "EF08MA01",
    enunciado:
      "Numa fábrica, cada caixa grande contém 5² pacotes pequenos, e cada pacote pequeno contém 5 unidades. Quantas unidades cabem em uma caixa grande?",
    alternativas: ["25", "50", "125", "250"],
    respostaCorreta: 2,
  },
  {
    tema: "potenciacao",
    descritor: "D18/D25 — Efetuar cálculos envolvendo potenciação",
    habilidadeBncc: "EF08MA01",
    enunciado: "Qual é o valor de (-2)⁴?",
    alternativas: ["-16", "-8", "8", "16"],
    respostaCorreta: 3,
  },

  // ---------------------------------------------------------------------
  // Raiz Quadrada — SPAECE/SAEB D27 · BNCC EF08MA02
  // ---------------------------------------------------------------------
  {
    tema: "raizQuadrada",
    descritor: "D27 — Efetuar cálculos com valores aproximados de radicais",
    habilidadeBncc: "EF08MA02",
    enunciado: "Um terreno quadrado tem área de 144 m². Qual é a medida do lado desse terreno?",
    alternativas: ["12 m", "14 m", "36 m", "72 m"],
    respostaCorreta: 0,
  },
  {
    tema: "raizQuadrada",
    descritor: "D27 — Efetuar cálculos com valores aproximados de radicais",
    habilidadeBncc: "EF08MA02",
    enunciado: "√81 é igual a:",
    alternativas: ["8", "9", "18", "40,5"],
    respostaCorreta: 1,
  },
  {
    tema: "raizQuadrada",
    descritor: "D27 — Efetuar cálculos com valores aproximados de radicais",
    habilidadeBncc: "EF08MA02",
    enunciado: "O número 50 não é um quadrado perfeito. Entre quais dois números inteiros consecutivos está √50?",
    alternativas: ["Entre 5 e 6", "Entre 6 e 7", "Entre 7 e 8", "Entre 8 e 9"],
    respostaCorreta: 2,
  },
  {
    tema: "raizQuadrada",
    descritor: "D27 — Efetuar cálculos com valores aproximados de radicais",
    habilidadeBncc: "EF08MA02",
    enunciado:
      "A raiz quadrada de 225 representa a medida do lado de um quadrado cuja área é 225 cm². Qual é essa medida?",
    alternativas: ["15 cm", "25 cm", "45 cm", "112,5 cm"],
    respostaCorreta: 0,
  },

  // ---------------------------------------------------------------------
  // Equação do 1º Grau — SPAECE/SAEB D33 · BNCC EF07MA18
  // ---------------------------------------------------------------------
  {
    tema: "equacao1Grau",
    descritor: "D33 — Identificar uma equação do 1º grau que expressa um problema",
    habilidadeBncc: "EF07MA18",
    enunciado: "Pensei em um número, somei 8 a ele e obtive 23. Qual número pensei?",
    alternativas: ["3", "8", "15", "31"],
    respostaCorreta: 2,
  },
  {
    tema: "equacao1Grau",
    descritor: "D33 — Identificar uma equação do 1º grau que expressa um problema",
    habilidadeBncc: "EF07MA18",
    enunciado: "Marina tinha uma quantia em dinheiro, gastou R$ 25,00 e ficou com R$ 40,00. Quanto ela tinha no início?",
    alternativas: ["R$ 15,00", "R$ 25,00", "R$ 65,00", "R$ 90,00"],
    respostaCorreta: 2,
  },
  {
    tema: "equacao1Grau",
    descritor: "D33 — Identificar uma equação do 1º grau que expressa um problema",
    habilidadeBncc: "EF07MA18",
    enunciado: "O triplo de um número, mais 4, é igual a 25. Qual é esse número?",
    alternativas: ["7", "10", "29", "70"],
    respostaCorreta: 0,
  },
  {
    tema: "equacao1Grau",
    descritor: "D33 — Identificar uma equação do 1º grau que expressa um problema",
    habilidadeBncc: "EF07MA18",
    enunciado: "Cinco vezes um número, menos 3, é igual a 32. Qual é o número?",
    alternativas: ["6", "7", "29", "35"],
    respostaCorreta: 1,
  },

  // ---------------------------------------------------------------------
  // Sistema de Equações — SPAECE/SAEB D34, D35 · BNCC EF08MA07, EF08MA08
  // ---------------------------------------------------------------------
  {
    tema: "sistemaEquacoes",
    descritor: "D34 — Identificar um sistema de equações do 1º grau que expressa um problema",
    habilidadeBncc: "EF08MA07 / EF08MA08",
    enunciado:
      "Numa lanchonete, 2 sanduíches e 1 suco custam R$ 23,00. Já 1 sanduíche e 1 suco custam R$ 14,00. Qual é o preço de um sanduíche?",
    alternativas: ["R$ 5,00", "R$ 9,00", "R$ 14,00", "R$ 23,00"],
    respostaCorreta: 1,
  },
  {
    tema: "sistemaEquacoes",
    descritor: "D34 — Identificar um sistema de equações do 1º grau que expressa um problema",
    habilidadeBncc: "EF08MA07 / EF08MA08",
    enunciado: "A soma de dois números é 20 e a diferença entre eles é 4. Quais são esses números?",
    alternativas: ["10 e 10", "12 e 8", "14 e 6", "16 e 4"],
    respostaCorreta: 1,
  },
  {
    tema: "sistemaEquacoes",
    descritor: "D35 — Relação entre representações algébrica e geométrica de um sistema",
    habilidadeBncc: "EF08MA07 / EF08MA08",
    enunciado: "Num sistema de duas equações, x + y = 10 e x - y = 2. Qual é o valor de x?",
    alternativas: ["4", "6", "8", "10"],
    respostaCorreta: 1,
  },
  {
    tema: "sistemaEquacoes",
    descritor: "D34 — Identificar um sistema de equações do 1º grau que expressa um problema",
    habilidadeBncc: "EF08MA07 / EF08MA08",
    enunciado:
      "Pedro comprou 3 cadernos e 2 canetas por R$ 38,00. Cada caderno custa R$ 2,00 a mais que o dobro do preço de uma caneta. Qual é o preço de uma caneta?",
    alternativas: ["R$ 2,00", "R$ 4,00", "R$ 6,00", "R$ 10,00"],
    respostaCorreta: 1,
  },

  // ---------------------------------------------------------------------
  // Equação do 2º Grau — SPAECE/SAEB D31 · BNCC EF09MA09
  // ---------------------------------------------------------------------
  {
    tema: "equacao2Grau",
    descritor: "D31 — Resolver problema que envolva equação do 2º grau",
    habilidadeBncc: "EF09MA09",
    enunciado:
      "Um terreno retangular tem largura x e comprimento (x + 3). Sabendo que sua área é 40 m², qual é a largura x?",
    alternativas: ["3 m", "5 m", "8 m", "40 m"],
    respostaCorreta: 1,
  },
  {
    tema: "equacao2Grau",
    descritor: "D31 — Resolver problema que envolva equação do 2º grau",
    habilidadeBncc: "EF09MA09",
    enunciado: "As raízes da equação x² - 7x + 10 = 0 são:",
    alternativas: ["2 e 5", "-2 e -5", "1 e 10", "7 e 10"],
    respostaCorreta: 0,
  },
  {
    tema: "equacao2Grau",
    descritor: "D31 — Resolver problema que envolva equação do 2º grau",
    habilidadeBncc: "EF09MA09",
    enunciado: "Quais são os valores de x na equação x² = 49?",
    alternativas: ["Apenas 7", "7 e -7", "24,5", "98"],
    respostaCorreta: 1,
  },
  {
    tema: "equacao2Grau",
    descritor: "D31 — Resolver problema que envolva equação do 2º grau",
    habilidadeBncc: "EF09MA09",
    enunciado:
      "Um objeto é lançado para cima e sua altura h (em metros) após t segundos é dada por h = -t² + 6t. Em que instante t, diferente de 0, o objeto retorna ao chão (h = 0)?",
    alternativas: ["2 s", "3 s", "6 s", "12 s"],
    respostaCorreta: 2,
  },
];

/** Sorteia `quantidade` questões do banco, filtrando por tema quando informado. */
export function sortearQuestoesSimulado(quantidade: number, tema: TemaSimulado | "todos"): QuestaoSimulado[] {
  const banco = tema === "todos" ? BANCO_SIMULADO_SPAECE : BANCO_SIMULADO_SPAECE.filter((q) => q.tema === tema);
  return embaralhar(banco).slice(0, Math.min(quantidade, banco.length));
}
