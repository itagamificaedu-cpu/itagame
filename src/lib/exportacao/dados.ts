import "server-only";
import type { Atividade } from "@prisma/client";

export type QuestaoExport = { enunciado: string; alternativas: string[] };
export type GabaritoExport = { enunciado: string; respostaCorreta: string; explicacao: string | null };

export type DadosAtividadeExport = {
  titulo: string;
  tipo: string;
  disciplina: string;
  serie: string;
  tema: string;
  competenciasBncc: string[];
  questoes: QuestaoExport[];
  gabarito: GabaritoExport[];
  colunaB?: string[];
  grade?: string[][];
  tamanho?: number;
};

export function extrairDadosAtividade(atividade: Atividade): DadosAtividadeExport {
  const conteudo = atividade.conteudoGerado as {
    titulo: string;
    questoes: QuestaoExport[];
    colunaB?: string[];
    grade?: string[][];
    tamanho?: number;
  };

  return {
    titulo: conteudo.titulo,
    tipo: atividade.tipo,
    disciplina: atividade.disciplina,
    serie: atividade.serie,
    tema: atividade.tema,
    competenciasBncc: atividade.competenciasBncc,
    questoes: conteudo.questoes,
    gabarito: atividade.gabarito as GabaritoExport[],
    colunaB: conteudo.colunaB,
    grade: conteudo.grade,
    tamanho: conteudo.tamanho,
  };
}

export function nomeArquivo(dados: DadosAtividadeExport) {
  const base = `${dados.titulo}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return base || "atividade";
}
