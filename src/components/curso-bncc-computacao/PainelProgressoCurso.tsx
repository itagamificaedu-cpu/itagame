"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { SemanaCurso } from "@/lib/cursoBnccComputacao";
import { alternarSemanaConcluidaCurso, emitirCertificadoCurso } from "@/app/actions/cursoBnccComputacao";

type BlocoExibicao = {
  chave: string;
  nome: string;
  icone: string;
  cor: string;
  semanas: SemanaCurso[];
};

export function PainelProgressoCurso({
  blocos,
  totalSemanas,
  semanasConcluidasIniciais,
  certificadoJaEmitido,
}: {
  blocos: BlocoExibicao[];
  totalSemanas: number;
  semanasConcluidasIniciais: number[];
  certificadoJaEmitido: boolean;
}) {
  const [concluidas, setConcluidas] = useState<Set<number>>(new Set(semanasConcluidasIniciais));
  const [blocoAberto, setBlocoAberto] = useState<string | null>(blocos[0]?.chave ?? null);
  const [pendente, iniciarTransicao] = useTransition();
  const [erroEmissao, setErroEmissao] = useState<string | null>(null);
  const [emitindo, setEmitindo] = useState(false);

  const totalConcluidas = concluidas.size;
  const percentual = Math.round((totalConcluidas / totalSemanas) * 100);
  const cursoCompleto = totalConcluidas >= totalSemanas;

  function alternarSemana(semana: number) {
    setConcluidas((atual) => {
      const novo = new Set(atual);
      if (novo.has(semana)) {
        novo.delete(semana);
      } else {
        novo.add(semana);
      }
      return novo;
    });
    iniciarTransicao(async () => {
      await alternarSemanaConcluidaCurso(semana);
    });
  }

  async function handleEmitirCertificado() {
    setErroEmissao(null);
    setEmitindo(true);
    try {
      await emitirCertificadoCurso();
      window.location.href = "/painel/bncc-computacao/curso/certificado";
    } catch (erro) {
      setErroEmissao(erro instanceof Error ? erro.message : "Não foi possível emitir o certificado.");
      setEmitindo(false);
    }
  }

  return (
    <div>
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-neutral-800">Seu progresso no curso</p>
            <p className="text-xs text-neutral-500">
              {totalConcluidas} de {totalSemanas} semanas concluídas
            </p>
          </div>
          <span className="text-2xl font-extrabold text-[#1a3fd4]">{percentual}%</span>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#1a3fd4] to-[#00c264] transition-all"
            style={{ width: `${percentual}%` }}
          />
        </div>

        {cursoCompleto ? (
          certificadoJaEmitido ? (
            <Link
              href="/painel/bncc-computacao/curso/certificado"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#00c264] px-4 py-2 text-sm font-bold text-white hover:brightness-110"
            >
              🎓 Ver meu certificado
            </Link>
          ) : (
            <div className="mt-4">
              <button
                type="button"
                onClick={handleEmitirCertificado}
                disabled={emitindo}
                className="inline-flex items-center gap-2 rounded-lg bg-[#00c264] px-4 py-2 text-sm font-bold text-white hover:brightness-110 disabled:opacity-60"
              >
                {emitindo ? "Emitindo..." : "🎓 Emitir certificado (40h)"}
              </button>
              {erroEmissao && <p className="mt-2 text-xs font-semibold text-[#a8283f]">{erroEmissao}</p>}
            </div>
          )
        ) : (
          <p className="mt-3 text-xs text-neutral-400">
            Marque as semanas conforme for aplicando em sala — o certificado libera ao concluir as {totalSemanas}.
          </p>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {blocos.map((bloco) => {
          const aberto = blocoAberto === bloco.chave;
          const concluidasDoBloco = bloco.semanas.filter((s) => concluidas.has(s.semana)).length;
          return (
            <div key={bloco.chave} className="overflow-hidden rounded-2xl border" style={{ borderColor: `${bloco.cor}33` }}>
              <button
                type="button"
                onClick={() => setBlocoAberto(aberto ? null : bloco.chave)}
                className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:brightness-95"
                style={{ backgroundColor: `${bloco.cor}0a` }}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg"
                    style={{ backgroundColor: `${bloco.cor}15` }}
                  >
                    {bloco.icone}
                  </span>
                  <span>
                    <span className="block text-sm font-extrabold text-neutral-900">{bloco.nome}</span>
                    <span className="block text-xs text-neutral-500">
                      Semanas {bloco.semanas[0]?.semana}–{bloco.semanas[bloco.semanas.length - 1]?.semana} ·{" "}
                      {concluidasDoBloco}/{bloco.semanas.length} concluídas
                    </span>
                  </span>
                </span>
                <span className="text-sm text-neutral-400">{aberto ? "▲" : "▼"}</span>
              </button>

              {aberto && (
                <ul className="divide-y divide-neutral-100 border-t border-neutral-100 bg-white">
                  {bloco.semanas.map((s) => {
                    const feita = concluidas.has(s.semana);
                    return (
                      <li key={s.semana} className="flex items-start gap-3 p-3">
                        <button
                          type="button"
                          onClick={() => alternarSemana(s.semana)}
                          disabled={pendente}
                          aria-label={feita ? "Marcar como não concluída" : "Marcar como concluída"}
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                            feita
                              ? "border-[#00c264] bg-[#00c264] text-white"
                              : "border-neutral-300 text-transparent hover:border-neutral-400"
                          }`}
                        >
                          ✓
                        </button>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-bold text-neutral-400">Semana {s.semana}</span>
                          <span className="block text-sm font-semibold text-neutral-800">{s.tema}</span>
                          <span className="block text-xs text-neutral-500">{s.atividade}</span>
                          <span className="mt-0.5 inline-block text-[11px] font-medium text-neutral-400">
                            {s.modalidade}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
