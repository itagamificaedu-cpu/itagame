"use server";

import { gerarAtividadeComIa, type AtividadeGerada, type TipoAtividadeGeravel } from "@/lib/ia";

// Ação pública (sem login) usada só pelo "Simulador — prévia" da página inicial.
// Não grava nada no banco — é só uma demonstração real da IA para quem ainda
// não tem conta. A atividade de verdade (que fica salva) é gerada dentro do
// painel, em /painel/atividades/nova, e continua sem nenhum limite (online
// ou para imprimir). O limite de 1 prévia por visitante fica no componente
// cliente (Simulador.tsx, via localStorage) — aqui no servidor não há como
// saber "quem" está pedindo sem exigir login, o que tiraria a graça da
// demonstração.

const MAPA_TIPO: Record<string, TipoAtividadeGeravel> = {
  Quiz: "quiz",
  "Verdadeiro ou Falso": "verdadeiro_falso",
  "Caça-palavras": "caca_palavras",
};

// Fixo e baixo de propósito: é só uma prévia, não precisa gerar muita coisa
// e mantém o custo de IA da demonstração pública sob controle.
const QUESTOES_NA_PREVIA = 2;
const TAMANHO_MAXIMO_TEMA = 60;

export type ResultadoPreviaPublica =
  | { ok: true; atividade: AtividadeGerada }
  | { ok: false; erro: string };

export async function gerarPreviaPublica(input: {
  tipoRotulo: string;
  disciplina: string;
  serie: string;
  tema: string;
}): Promise<ResultadoPreviaPublica> {
  const tipo = MAPA_TIPO[input.tipoRotulo];
  const tema = input.tema.trim().slice(0, TAMANHO_MAXIMO_TEMA);

  if (!tipo || !tema) {
    return { ok: false, erro: "Escolha um tipo e informe um tema para gerar a prévia." };
  }

  try {
    const atividade = await gerarAtividadeComIa({
      tipo,
      disciplina: input.disciplina,
      serie: input.serie,
      tema,
      quantidadeQuestoes: QUESTOES_NA_PREVIA,
    });
    return { ok: true, atividade };
  } catch {
    return { ok: false, erro: "Não consegui gerar a prévia agora. Tente novamente em instantes." };
  }
}
