// Contas de tempo da Prova Cronometrada. Sem dependência de servidor: o
// servidor usa pra decidir quando a prova acaba, e a tela do aluno usa o mesmo
// cálculo pra mostrar o ritmo recomendado.

export type TempoProva = {
  status: "aguardando" | "em_andamento" | "pausada" | "encerrada";
  duracaoMin: number;
  iniciadaEm: Date | null;
  pausadoEm: Date | null;
  segundosPausados: number;
  segundosExtras: number;
};

export function duracaoTotalSegundos(p: Pick<TempoProva, "duracaoMin" | "segundosExtras">): number {
  return p.duracaoMin * 60 + p.segundosExtras;
}

// Segundos que ainda restam (pode ficar negativo: o servidor dá uma folga de
// poucos segundos antes de encerrar de vez).
export function restanteSegundos(p: TempoProva, agora: number = Date.now()): number {
  const total = duracaoTotalSegundos(p);
  if (p.status === "aguardando" || !p.iniciadaEm) return total;
  if (p.status === "encerrada") return 0;
  const referencia = p.status === "pausada" && p.pausadoEm ? p.pausadoEm.getTime() : agora;
  const decorrido = (referencia - p.iniciadaEm.getTime()) / 1000 - p.segundosPausados;
  return Math.round(total - decorrido);
}

// Rótulo mm:ss (ou h:mm:ss quando passa de uma hora).
export function formatarRelogio(segundos: number): string {
  const s = Math.max(0, Math.floor(segundos));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const seg = s % 60;
  const dois = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${dois(m)}:${dois(seg)}` : `${dois(m)}:${dois(seg)}`;
}

// Orçamento de tempo recomendado: 10% do tempo fica pra conferência no fim e o
// resto é dividido entre os blocos na proporção do número de questões (na
// prova de 150 min com 26 + 26 questões: 67,5 min por bloco, 2min35 por
// questão, e 15 min de conferência).
export function ritmoRecomendado(questoesPorBloco: number[], duracaoTotalSeg: number, decorridoSeg: number) {
  const totalQuestoes = questoesPorBloco.reduce((a, b) => a + b, 0) || 1;
  const tempoDeResolver = duracaoTotalSeg * 0.9;
  const segPorQuestao = tempoDeResolver / totalQuestoes;

  let consumido = 0;
  const blocos = questoesPorBloco.map((n) => {
    const inicio = consumido;
    const duracao = n * segPorQuestao;
    consumido += duracao;
    const dentro = Math.min(Math.max(decorridoSeg - inicio, 0), duracao);
    return {
      questoesEsperadas: Math.min(n, Math.floor(dentro / segPorQuestao)),
      inicioSeg: inicio,
      fimSeg: inicio + duracao,
    };
  });

  return { segPorQuestao, blocos, inicioConferenciaSeg: tempoDeResolver };
}

export const GRACA_ENCERRAMENTO_SEGUNDOS = 5;
