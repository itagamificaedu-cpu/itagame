// Metadados dos 3 eixos oficiais da BNCC Computação — usados na aba
// "BNCC Computação" (hub, geração com IA e badges nas trilhas). Fonte:
// Parecer CNE/CEB nº 2/2022 + Resolução CNE/CEB nº 1/2022 (complemento à
// BNCC, implementação obrigatória em todo o país a partir de 2026).
//
// Manter esse arquivo como fonte única desses textos — ia.ts, as páginas do
// painel e as páginas do aluno importam daqui, em vez de duplicar a lista de
// subconceitos em cada lugar.

export type EixoBnccComputacao = "pensamento_computacional" | "mundo_digital" | "cultura_digital";

export const EIXOS_BNCC_COMPUTACAO: {
  chave: EixoBnccComputacao;
  nome: string;
  icone: string;
  cor: string;
  resumo: string;
  subconceitos: string[];
}[] = [
  {
    chave: "pensamento_computacional",
    nome: "Pensamento Computacional",
    icone: "🧩",
    cor: "#1a3fd4",
    resumo: "Resolver problemas de forma lógica e estruturada, com ou sem computador.",
    subconceitos: ["Abstração", "Análise", "Automação"],
  },
  {
    chave: "mundo_digital",
    nome: "Mundo Digital",
    icone: "💻",
    cor: "#00c264",
    resumo: "Entender como computadores, redes e sistemas digitais funcionam por dentro.",
    subconceitos: ["Codificação", "Processamento", "Distribuição"],
  },
  {
    chave: "cultura_digital",
    nome: "Cultura Digital",
    icone: "🌐",
    cor: "#7c3aed",
    resumo: "Usar a tecnologia de forma crítica, ética, segura e responsável.",
    subconceitos: ["Cidadania Digital", "Letramento Digital", "Tecnologia e Sociedade"],
  },
];

export function eixoBnccPorChave(chave: string | null | undefined) {
  return EIXOS_BNCC_COMPUTACAO.find((eixo) => eixo.chave === chave);
}
