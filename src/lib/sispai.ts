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

export function corPercentualHabilidade(percentual: number): string {
  if (percentual === 0) return "bg-red-100 text-red-700";
  if (percentual < 60) return "bg-orange-100 text-orange-700";
  if (percentual < 100) return "bg-blue-100 text-blue-700";
  return "bg-green-100 text-green-700";
}
