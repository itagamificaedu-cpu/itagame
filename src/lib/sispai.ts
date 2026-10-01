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

export type CorCelula = { fundo: string; texto: string };

// Cores exatas do "Relatório de Desempenho Consolidado" do portal SISPAI: a
// célula do padrão vem pintada inteira (vermelho, laranja, verde-claro,
// verde-escuro).
export const PADRAO_SISPAI_CELULA: Record<string, CorCelula> = {
  abaixo_do_basico: { fundo: "#ff0000", texto: "#ffffff" },
  basico: { fundo: "#ffa500", texto: "#000000" },
  adequado: { fundo: "#90ee90", texto: "#000000" },
  avancado: { fundo: "#006400", texto: "#ffffff" },
};

// Mesma paleta aplicada a percentual de acerto (habilidades, simulados do
// ItaGame) — rótulos próprios pra não se passar pela classificação oficial.
export type NivelSemaforo = "vermelho" | "amarelo" | "verde" | "verde_escuro";

export const SEMAFORO_ORDEM: NivelSemaforo[] = ["vermelho", "amarelo", "verde", "verde_escuro"];

export const SEMAFORO_LABEL: Record<NivelSemaforo, string> = {
  vermelho: "Crítico",
  amarelo: "Atenção",
  verde: "Bom",
  verde_escuro: "Ótimo",
};

export const SEMAFORO_FAIXA: Record<NivelSemaforo, string> = {
  vermelho: "< 50%",
  amarelo: "50–69%",
  verde: "70–89%",
  verde_escuro: "≥ 90%",
};

export const SEMAFORO_CELULA: Record<NivelSemaforo, CorCelula> = {
  vermelho: PADRAO_SISPAI_CELULA.abaixo_do_basico,
  amarelo: PADRAO_SISPAI_CELULA.basico,
  verde: PADRAO_SISPAI_CELULA.adequado,
  verde_escuro: PADRAO_SISPAI_CELULA.avancado,
};

export function nivelSemaforo(percentual: number): NivelSemaforo {
  if (percentual < 50) return "vermelho";
  if (percentual < 70) return "amarelo";
  if (percentual < 90) return "verde";
  return "verde_escuro";
}

// "Nota baixa" pro CEITEC = os dois padrões abaixo do adequado.
export function notaBaixaSispai(padrao: string | null): boolean {
  return padrao === "abaixo_do_basico" || padrao === "basico";
}


// Diagnóstico Bimestral de Matemática — aplicado a cada bimestre (diferente
// do SISPAI, que é semestral), quebrado nas 8 habilidades básicas. A SME já
// classifica cada aluno como "avançou pouco" (fraco) ou "não avançou"
// (crítico) em cada habilidade que ele não domina.
export const SITUACAO_BIMESTRAL_LABEL: Record<string, string> = {
  avancou_pouco: "Avançou pouco",
  nao_avancou: "Não avançou",
};

export const SITUACAO_BIMESTRAL_CELULA: Record<string, CorCelula> = {
  avancou_pouco: PADRAO_SISPAI_CELULA.basico,
  nao_avancou: PADRAO_SISPAI_CELULA.abaixo_do_basico,
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
