import banco from "../../scripts/banco-questoes-spaece-matematica.json";
import { eixoSpaecePorChave, type EixoSpaece9Ano } from "@/lib/spaece";

// Banco de questões ORIGINAIS de Matemática do SPAECE (9º ano), escritas à
// mão por descritor oficial da Matriz de Referência (mesmos 25 descritores
// do "Caderno de Itens — Matemática — 9º ano" usado como referência de
// estrutura/dificuldade) — nunca as perguntas literais do caderno, só os
// mesmos descritores e o mesmo nível de exigência. 5 questões por
// descritor, gabarito já conferido questão a questão.
//
// Usado pra montar Trilha + Simulado + Cabo de Guerra da aba SPAECE sem
// depender da IA (ver criarConteudoSpaeceMatematicaDoBanco em
// actions/trilhas.ts) — funciona mesmo com o crédito da Anthropic zerado.

export type QuestaoBancoSpaece = {
  enunciado: string;
  alternativas: string[];
  respostaCorreta: string;
  explicacao?: string;
};

const BANCO_QUESTOES_SPAECE_MATEMATICA = banco as Record<string, QuestaoBancoSpaece[]>;

export function questoesDoDescritor(codigo: string): QuestaoBancoSpaece[] {
  return BANCO_QUESTOES_SPAECE_MATEMATICA[codigo] ?? [];
}

// Todas as questões dos descritores de um eixo, já marcadas com o
// descritor de origem (pra virar o título de cada missão da trilha).
export function questoesDoEixoMatematica(eixoChave: EixoSpaece9Ano) {
  const eixo = eixoSpaecePorChave(eixoChave);
  if (!eixo || eixo.disciplina !== "matematica") return [];

  return eixo.descritores.map((descritor) => ({
    descritor,
    questoes: questoesDoDescritor(descritor.codigo),
  }));
}
