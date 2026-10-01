"use client";

import { useMemo, useState } from "react";
import {
  PADRAO_SISPAI_LABEL,
  PADRAO_SISPAI_COR,
  notaBaixaSispai,
  corPercentualHabilidade,
  SITUACAO_BIMESTRAL_COR,
  abreviarHabilidadeBimestral,
} from "@/lib/sispai";

type Rodada = { pct: number; tri: number | null; nivel: string | null; padrao: string | null };
type AlunoCombinado = { turma: string; nome: string; r1: Rodada | null; r2: Rodada | null };
type HabilidadeItem = {
  id: string;
  trilha: string;
  codigoSaeb: string;
  codigoBncc: string;
  descricaoHabilidade: string;
  percentualAcertoGeral: number;
};
type HabilidadesPorRodada = { rodada: number; itens: HabilidadeItem[] };
type EvolucaoBimestral = { habilidade: string; porBimestre: { bimestre: number; percentualAcertoGeral: number }[] };
type PontoAtencao = { habilidade: string; situacao: string };
type AlunoCritico = { nome: string; matricula: string; turma: string; pontos: PontoAtencao[]; peso: number };

const PADRAO_ORDEM = ["abaixo_do_basico", "basico", "adequado", "avancado"] as const;
const PADRAO_COR_BARRA: Record<string, string> = {
  abaixo_do_basico: "#dc2626",
  basico: "#f97316",
  adequado: "#2563eb",
  avancado: "#00c264",
};

function BarraHorizontal({ pct, cor, altura = "h-2" }: { pct: number; cor: string; altura?: string }) {
  return (
    <div className={`w-full overflow-hidden rounded-full bg-neutral-100 ${altura}`}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%`, backgroundColor: cor }}
      />
    </div>
  );
}

export function ResultadosMatematicaCliente({
  alunos,
  turmas,
  habilidadesPorRodada,
  evolucaoBimestral,
  criticosPorAluno,
  turmasComCriticos,
  bimestreDiagnostico,
}: {
  alunos: AlunoCombinado[];
  turmas: string[];
  habilidadesPorRodada: HabilidadesPorRodada[];
  evolucaoBimestral: EvolucaoBimestral[];
  criticosPorAluno: AlunoCritico[];
  turmasComCriticos: string[];
  bimestreDiagnostico: number | null;
}) {
  const [turmaSelecionada, setTurmaSelecionada] = useState("todas");

  const atual = (a: AlunoCombinado) => a.r2 ?? a.r1;

  const alunosFiltrados = useMemo(
    () => (turmaSelecionada === "todas" ? alunos : alunos.filter((a) => a.turma === turmaSelecionada)),
    [alunos, turmaSelecionada]
  );

  const distribuicaoPadrao = useMemo(() => {
    const contagem: Record<string, number> = { abaixo_do_basico: 0, basico: 0, adequado: 0, avancado: 0 };
    let total = 0;
    for (const a of alunosFiltrados) {
      const padrao = atual(a)?.padrao;
      if (padrao && padrao in contagem) {
        contagem[padrao]++;
        total++;
      }
    }
    return { contagem, total };
  }, [alunosFiltrados]);

  const turmasVisiveis = turmaSelecionada === "todas" ? turmas : turmas.filter((t) => t === turmaSelecionada);
  const turmasCriticosVisiveis =
    turmaSelecionada === "todas" ? turmasComCriticos : turmasComCriticos.filter((t) => t === turmaSelecionada);

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-neutral-200 bg-white p-3">
        <label htmlFor="filtro-turma" className="text-xs font-bold text-neutral-500 uppercase">
          Filtrar por turma
        </label>
        <select
          id="filtro-turma"
          value={turmaSelecionada}
          onChange={(e) => setTurmaSelecionada(e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-semibold text-neutral-700 focus:border-[#00c264] focus:outline-none"
        >
          <option value="todas">Todas as turmas</option>
          {turmas.map((t) => (
            <option key={t} value={t}>
              Turma {t}
            </option>
          ))}
        </select>
        {turmaSelecionada !== "todas" && (
          <button
            onClick={() => setTurmaSelecionada("todas")}
            className="text-xs font-semibold text-[#00854a] hover:underline"
          >
            Limpar filtro
          </button>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-extrabold text-neutral-900">📊 Distribuição por padrão de desempenho</h2>
        <p className="mt-1 text-xs text-neutral-500">
          {turmaSelecionada === "todas" ? "9º ano inteiro" : `Turma ${turmaSelecionada}`} — classificação mais
          recente de cada aluno (Rodada 2, ou Rodada 1 quando a 2 ainda não tem detalhe).
        </p>
        <div className="mt-3 rounded-2xl border border-neutral-200 bg-white p-5">
          {distribuicaoPadrao.total === 0 ? (
            <p className="text-sm text-neutral-400">Sem alunos classificados nesse filtro.</p>
          ) : (
            <>
              <div className="flex h-6 w-full overflow-hidden rounded-full">
                {PADRAO_ORDEM.map((padrao) => {
                  const qtd = distribuicaoPadrao.contagem[padrao];
                  if (qtd === 0) return null;
                  const pct = (qtd / distribuicaoPadrao.total) * 100;
                  return (
                    <div
                      key={padrao}
                      style={{ width: `${pct}%`, backgroundColor: PADRAO_COR_BARRA[padrao] }}
                      title={`${PADRAO_SISPAI_LABEL[padrao]}: ${qtd} aluno(s)`}
                    />
                  );
                })}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {PADRAO_ORDEM.map((padrao) => (
                  <div key={padrao} className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: PADRAO_COR_BARRA[padrao] }}
                    />
                    <div>
                      <p className="text-sm font-extrabold text-neutral-900">{distribuicaoPadrao.contagem[padrao]}</p>
                      <p className="text-[11px] text-neutral-500">{PADRAO_SISPAI_LABEL[padrao]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {habilidadesPorRodada.some((r) => r.itens.length > 0) && (
        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-neutral-900">📉 Habilidades mais críticas do 9º ano</h2>
            <p className="mt-1 text-xs text-neutral-500">
              Percentual de acerto do 9º ano inteiro (todas as turmas) em cada habilidade da prova —
              organizado nas 5 Trilhas de Matemática da BNCC. Quanto mais curta a barra, mais prioritário pro
              reforço.
            </p>
          </div>
          {habilidadesPorRodada.map(
            ({ rodada, itens }) =>
              itens.length > 0 && (
                <div key={rodada}>
                  <p className="mb-2 text-sm font-bold text-neutral-700">SISPAI {rodada === 1 ? "I" : "II"}</p>
                  <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                    <ul className="divide-y divide-neutral-100">
                      {itens.map((h) => {
                        const pct = Number(h.percentualAcertoGeral);
                        const corClasses = corPercentualHabilidade(pct);
                        const corHex = corClasses.includes("red")
                          ? "#dc2626"
                          : corClasses.includes("orange")
                            ? "#f97316"
                            : corClasses.includes("blue")
                              ? "#2563eb"
                              : "#00c264";
                        return (
                          <li key={h.id} className="px-4 py-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-neutral-700">
                                  {h.trilha} · <span className="font-mono text-neutral-400">{h.codigoSaeb}</span>
                                </p>
                                <p className="mt-0.5 text-sm text-neutral-600 text-justify">{h.descricaoHabilidade}</p>
                              </div>
                              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${corClasses}`}>
                                {pct.toFixed(0)}%
                              </span>
                            </div>
                            <div className="mt-2">
                              <BarraHorizontal pct={pct} cor={corHex} />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )
          )}
        </div>
      )}

      {evolucaoBimestral.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-extrabold text-neutral-900">🗓️ Diagnóstico Bimestral — evolução por habilidade</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Diferente do SISPAI (2x por ano), este diagnóstico é aplicado a cada bimestre e olha só pras 8
            habilidades básicas de operações e situações-problema. Barra azul = 1º bimestre, barra verde = 2º
            bimestre.
          </p>
          <div className="mt-3 space-y-4 rounded-2xl border border-neutral-200 bg-white p-5">
            {evolucaoBimestral.map(({ habilidade, porBimestre }) => {
              const r1 = porBimestre.find((b) => b.bimestre === 1);
              const r2 = porBimestre.find((b) => b.bimestre === 2);
              return (
                <div key={habilidade}>
                  <div className="flex items-center justify-between text-xs">
                    <p className="font-semibold text-neutral-700">{abreviarHabilidadeBimestral(habilidade)}</p>
                    <p className="font-mono text-neutral-400">
                      {r1 ? `${Number(r1.percentualAcertoGeral).toFixed(0)}%` : "—"} →{" "}
                      {r2 ? `${Number(r2.percentualAcertoGeral).toFixed(0)}%` : "—"}
                    </p>
                  </div>
                  <div className="mt-1 space-y-1">
                    <BarraHorizontal pct={r1 ? Number(r1.percentualAcertoGeral) : 0} cor="#1a3fd4" altura="h-1.5" />
                    <BarraHorizontal pct={r2 ? Number(r2.percentualAcertoGeral) : 0} cor="#00c264" altura="h-1.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {turmasCriticosVisiveis.length > 0 && (
        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-neutral-900">🎯 Foco Pedagógico — alunos com pontos de atenção</h2>
            <p className="mt-1 text-xs text-neutral-500">
              Lista de alunos que a SME identificou como estagnados em alguma das 8 habilidades básicas no
              {bimestreDiagnostico ? ` ${bimestreDiagnostico}º bimestre` : " bimestre"}. Quem tem mais itens em
              vermelho ("não avançou") precisa de atenção mais urgente.
            </p>
          </div>
          {turmasCriticosVisiveis.map((turma) => {
            const daTurma = criticosPorAluno.filter((a) => a.turma === turma).sort((a, b) => b.peso - a.peso);
            return (
              <div key={turma} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                <div className="border-b border-neutral-100 px-4 py-2">
                  <p className="text-sm font-extrabold text-neutral-900">
                    Turma {turma} <span className="font-normal text-neutral-400">({daTurma.length} alunos)</span>
                  </p>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                    <tr>
                      <th className="px-4 py-2">Aluno</th>
                      <th className="px-4 py-2">Pontos de atenção</th>
                    </tr>
                  </thead>
                  <tbody>
                    {daTurma.map((a) => (
                      <tr key={a.matricula} className="border-t border-neutral-100 align-top">
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-neutral-800">{a.nome}</td>
                        <td className="flex flex-wrap gap-1.5 px-4 py-2">
                          {a.pontos.map((p, i) => (
                            <span
                              key={i}
                              className={`rounded-full px-2 py-0.5 text-xs font-bold ${SITUACAO_BIMESTRAL_COR[p.situacao]}`}
                              title={p.situacao === "nao_avancou" ? "Não avançou" : "Avançou pouco"}
                            >
                              {abreviarHabilidadeBimestral(p.habilidade)}
                            </span>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 space-y-6">
        <h2 className="text-lg font-extrabold text-neutral-900">👥 Alunos por turma — SISPAI</h2>
        {turmasVisiveis.map((turma) => {
          const daTurma = alunos
            .filter((a) => a.turma === turma)
            .sort((a, b) => (atual(a)?.tri ?? 999) - (atual(b)?.tri ?? 999));
          return (
            <div key={turma} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              <div className="border-b border-neutral-100 px-4 py-2">
                <p className="text-sm font-extrabold text-neutral-900">Turma {turma}</p>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                  <tr>
                    <th className="px-4 py-2">Aluno</th>
                    <th className="px-4 py-2 text-right">Acerto R1</th>
                    <th className="px-4 py-2 text-right">Padrão R1</th>
                    <th className="px-4 py-2 text-right">Acerto R2</th>
                    <th className="px-4 py-2 text-right">TRI R2</th>
                    <th className="px-4 py-2 text-right">Nível R2</th>
                    <th className="px-4 py-2 text-right">Padrão R2</th>
                  </tr>
                </thead>
                <tbody>
                  {daTurma.map((a) => (
                    <tr
                      key={a.nome}
                      className={`border-t border-neutral-100 ${notaBaixaSispai(atual(a)?.padrao ?? null) ? "bg-red-50/40" : ""}`}
                    >
                      <td className="px-4 py-2 font-medium text-neutral-800">{a.nome}</td>
                      <td className="px-4 py-2 text-right text-neutral-600">
                        {a.r1 ? `${a.r1.pct.toFixed(1)}%` : "—"}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {a.r1?.padrao ? (
                          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${PADRAO_SISPAI_COR[a.r1.padrao]}`}>
                            {PADRAO_SISPAI_LABEL[a.r1.padrao]}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-2 text-right text-neutral-600">
                        {a.r2 ? `${a.r2.pct.toFixed(1)}%` : "—"}
                      </td>
                      <td className="px-4 py-2 text-right text-neutral-600">
                        {a.r2?.tri !== null && a.r2?.tri !== undefined ? a.r2.tri.toFixed(1) : "—"}
                      </td>
                      <td className="px-4 py-2 text-right text-neutral-600">{a.r2?.nivel ?? "—"}</td>
                      <td className="px-4 py-2 text-right">
                        {a.r2?.padrao ? (
                          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${PADRAO_SISPAI_COR[a.r2.padrao]}`}>
                            {PADRAO_SISPAI_LABEL[a.r2.padrao]}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </>
  );
}
