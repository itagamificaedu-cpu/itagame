// SISPAI — Sistema Permanente de Avaliação de Itapipoca (Lei Municipal nº
// 059/2023). Avaliação diagnóstica própria da rede municipal, diferente da
// Matriz oficial do SPAECE estadual (ver spaece.ts). Cada aluno já chega
// com o resultado calculado pela SME: percentual de acerto, nota na escala
// TRI (Teoria de Resposta ao Item, a mesma técnica do SPAECE/SAEB), um
// nível (N1 a N8) e um padrão de desempenho — não recalculamos nada aqui,
// só exibimos com a classificação oficial.

export const PADRAO_SISPAI_LABEL: Record<string, string> = {
  abaixo_do_basico: "Abaixo do Básico",
  basico: "Básico",
  adequado: "Adequado",
  avancado: "Avançado",
};

export const PADRAO_SISPAI_COR: Record<string, string> = {
  abaixo_do_basico: "bg-red-100 text-red-700",
  basico: "bg-orange-100 text-orange-700",
  adequado: "bg-blue-100 text-blue-700",
  avancado: "bg-green-100 text-green-700",
};

// "Nota baixa" pro CEITEC = os dois padrões abaixo do adequado.
export function notaBaixaSispai(padrao: string | null): boolean {
  return padrao === "abaixo_do_basico" || padrao === "basico";
}

// Classificação ESTIMADA (não oficial) pra uso só nos Simulados/Cabo de
// Guerra internos do ItaGame — reaproveita os mesmos 4 rótulos/cores do
// padrão oficial do SISPAI só por familiaridade visual, mas calculada aqui
// por uma faixa simples de percentual de acerto, nunca pela TRI real. Ver
// aviso explícito na tela de resultados pra não confundir com o padrão
// oficial calculado pela SME.
export function classificarPadraoPorPercentual(percentual: number): string {
  if (percentual < 25) return "abaixo_do_basico";
  if (percentual < 50) return "basico";
  if (percentual < 75) return "adequado";
  return "avancado";
}

export function corPercentualHabilidade(percentual: number): string {
  if (percentual === 0) return "bg-red-100 text-red-700";
  if (percentual < 60) return "bg-orange-100 text-orange-700";
  if (percentual < 100) return "bg-blue-100 text-blue-700";
  return "bg-green-100 text-green-700";
}

// Diagnóstico Bimestral de Matemática — aplicado a cada bimestre (diferente
// do SISPAI, que é semestral), quebrado nas 8 habilidades básicas. A SME já
// classifica cada aluno como "avançou pouco" (fraco) ou "não avançou"
// (crítico) em cada habilidade que ele não domina.
export const SITUACAO_BIMESTRAL_LABEL: Record<string, string> = {
  avancou_pouco: "Avançou pouco",
  nao_avancou: "Não avançou",
};

export const SITUACAO_BIMESTRAL_COR: Record<string, string> = {
  avancou_pouco: "bg-orange-100 text-orange-700",
  nao_avancou: "bg-red-100 text-red-700",
};

// Abrevia os nomes longos das 8 habilidades do Diagnóstico Bimestral pra
// caber em tabela.
export function abreviarHabilidadeBimestral(habilidade: string): string {
  return habilidade
    .replace("RESOLVER OPERAÇÃO DE ", "Operação: ")
    .replace("RESOLVER SITUAÇÃO-PROBLEMA DE ", "Situação-problema: ")
    .toLowerCase()
    .replace(/^./, (c) => c.toUpperCase());
}
