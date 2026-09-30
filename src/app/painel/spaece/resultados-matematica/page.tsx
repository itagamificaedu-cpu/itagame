import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { VERDE_SPAECE, VERDE_SPAECE_ESCURO } from "@/lib/spaece";
import {
  PADRAO_SISPAI_LABEL,
  PADRAO_SISPAI_COR,
  notaBaixaSispai,
  corPercentualHabilidade,
  SITUACAO_BIMESTRAL_COR,
  abreviarHabilidadeBimestral,
} from "@/lib/sispai";

// Dado sensível e específico do CEITEC (nomes reais de alunos) — só o dono
// da plataforma vê por enquanto, igual ao padrão já usado em
// /painel/admin/formacao-ia. Ver feedback_teste_admin na memória: testar
// tudo no perfil do Genezio antes de decidir se libera pra outras escolas.
export default async function ResultadosSispaiMatematica() {
  const sessao = await exigirAssinaturaAtiva();
  if (sessao.papel !== "ita_owner") {
    notFound();
  }

  const [resultados, habilidades, diagnosticosBimestrais, habilidadesBimestrais] = await Promise.all([
    prisma.resultadoSispaiMatematica.findMany({ where: { professorId: sessao.userId } }),
    prisma.habilidadeSispaiMatematica.findMany({
      where: { professorId: sessao.userId },
      orderBy: { percentualAcertoGeral: "asc" },
    }),
    prisma.diagnosticoBimestralMatematica.findMany({ where: { professorId: sessao.userId } }),
    prisma.habilidadeBimestralMatematica.findMany({
      where: { professorId: sessao.userId },
      orderBy: [{ habilidade: "asc" }, { bimestre: "asc" }],
    }),
  ]);

  if (resultados.length === 0) {
    return (
      <main className="min-h-screen bg-neutral-50 px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <Link href="/painel/spaece" className="text-sm font-semibold" style={{ color: VERDE_SPAECE }}>
            ← Voltar ao SPAECE 9º ano
          </Link>
          <p className="mt-6 text-sm text-neutral-500">
            Nenhum resultado do SISPAI importado ainda para esta conta.
          </p>
        </div>
      </main>
    );
  }

  type Rodada = { pct: number; tri: number | null; nivel: string | null; padrao: string | null };
  type Combinado = { turma: string; nome: string; r1: Rodada | null; r2: Rodada | null };

  const porAluno = new Map<string, Combinado>();
  for (const r of resultados) {
    const chave = `${r.turma}|${r.nomeAluno}`;
    const atual = porAluno.get(chave) ?? { turma: r.turma, nome: r.nomeAluno, r1: null, r2: null };
    const dados: Rodada = {
      pct: Number(r.percentualAcerto),
      tri: r.triScore ? Number(r.triScore) : null,
      nivel: r.nivel,
      padrao: r.padrao,
    };
    if (r.rodada === 1) atual.r1 = dados;
    else atual.r2 = dados;
    porAluno.set(chave, atual);
  }

  const alunos = Array.from(porAluno.values());
  // A rodada mais recente (2) manda na classificação de "nota baixa" — reflete
  // melhor a situação atual do aluno do que o resultado da rodada anterior.
  const atual = (a: Combinado) => a.r2 ?? a.r1;
  const classificados = alunos.filter((a) => atual(a)?.padrao);
  const notaBaixa = classificados.filter((a) => notaBaixaSispai(atual(a)?.padrao ?? null));

  const mediaRodada1 =
    alunos.filter((a) => a.r1).reduce((s, a) => s + (a.r1?.pct ?? 0), 0) / Math.max(1, alunos.filter((a) => a.r1).length);
  const mediaRodada2 =
    alunos.filter((a) => a.r2).reduce((s, a) => s + (a.r2?.pct ?? 0), 0) / Math.max(1, alunos.filter((a) => a.r2).length);

  const turmas = Array.from(new Set(alunos.map((a) => a.turma))).sort();
  const habilidadesPorRodada = [1, 2].map((rodada) => ({
    rodada,
    itens: habilidades.filter((h) => h.rodada === rodada),
  }));

  // Diagnóstico Bimestral — evolução do 9º ano inteiro nas 8 habilidades
  // básicas, bimestre a bimestre.
  const habilidadesUnicas = Array.from(new Set(habilidadesBimestrais.map((h) => h.habilidade)));
  const evolucaoBimestral = habilidadesUnicas
    .map((habilidade) => ({
      habilidade,
      porBimestre: habilidadesBimestrais.filter((h) => h.habilidade === habilidade),
    }))
    .sort((a, b) => {
      const ultimoA = a.porBimestre.at(-1);
      const ultimoB = b.porBimestre.at(-1);
      return Number(ultimoA?.percentualAcertoGeral ?? 100) - Number(ultimoB?.percentualAcertoGeral ?? 100);
    });

  // Pontos de atenção por aluno, agrupados por turma e ordenados pela
  // quantidade de habilidades críticas ("não avançou" pesa mais que
  // "avançou pouco") — quem tem mais pontos de atenção aparece primeiro.
  type PontoAtencao = { habilidade: string; situacao: string };
  type AlunoCritico = { nome: string; matricula: string; turma: string; pontos: PontoAtencao[]; peso: number };
  const criticosPorAluno = new Map<string, AlunoCritico>();
  for (const d of diagnosticosBimestrais) {
    const chave = `${d.turma}|${d.matricula}`;
    const atual = criticosPorAluno.get(chave) ?? {
      nome: d.nomeAluno,
      matricula: d.matricula,
      turma: d.turma,
      pontos: [],
      peso: 0,
    };
    atual.pontos.push({ habilidade: d.habilidade, situacao: d.situacao });
    atual.peso += d.situacao === "nao_avancou" ? 2 : 1;
    criticosPorAluno.set(chave, atual);
  }
  const turmasComCriticos = Array.from(new Set(diagnosticosBimestrais.map((d) => d.turma))).sort();
  const bimestreDiagnostico = diagnosticosBimestrais[0]?.bimestre ?? null;

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/painel/spaece" className="text-sm font-semibold" style={{ color: VERDE_SPAECE }}>
          ← Voltar ao SPAECE 9º ano
        </Link>

        <div
          className="mt-4 overflow-hidden rounded-2xl p-8 text-white shadow-sm"
          style={{ backgroundImage: `linear-gradient(to bottom right, ${VERDE_SPAECE}, ${VERDE_SPAECE_ESCURO})` }}
        >
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
            🟩 SISPAI · Sistema Permanente de Avaliação de Itapipoca
          </p>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">Resultados de Matemática — 9º ano</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/85">
            Avaliação diagnóstica da SME de Itapipoca (Lei Municipal nº 059/2023), aplicada em duas rodadas.
            Cada aluno já vem com o percentual de acerto, a nota na escala TRI e o padrão de desempenho
            calculados pela Secretaria de Educação, então esta tela só organiza e exibe esses dados.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
            <p className="text-2xl font-extrabold text-neutral-900">{classificados.length}</p>
            <p className="text-xs text-neutral-500">alunos classificados</p>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
            <p className="text-2xl font-extrabold text-red-700">{notaBaixa.length}</p>
            <p className="text-xs text-red-700">nota baixa agora (Rodada 2, Básico/Abaixo)</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
            <p className="text-2xl font-extrabold text-neutral-900">{mediaRodada1.toFixed(1)}%</p>
            <p className="text-xs text-neutral-500">média de acerto — Rodada 1</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
            <p className="text-2xl font-extrabold text-neutral-900">{mediaRodada2.toFixed(1)}%</p>
            <p className="text-xs text-neutral-500">média de acerto — Rodada 2</p>
          </div>
        </div>

        {habilidades.length > 0 && (
          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-neutral-900">📉 Habilidades mais críticas do 9º ano</h2>
              <p className="mt-1 text-xs text-neutral-500">
                Percentual de acerto do 9º ano inteiro (todas as turmas) em cada habilidade da prova —
                organizado nas 5 Trilhas de Matemática da BNCC. Quanto mais perto de 0%, mais prioritário
                pro reforço.
              </p>
            </div>
            {habilidadesPorRodada.map(
              ({ rodada, itens }) =>
                itens.length > 0 && (
                  <div key={rodada}>
                    <p className="mb-2 text-sm font-bold text-neutral-700">SISPAI {rodada === 1 ? "I" : "II"}</p>
                    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                          <tr>
                            <th className="px-4 py-2">Trilha</th>
                            <th className="px-4 py-2">Habilidade (SAEB / BNCC)</th>
                            <th className="px-4 py-2 text-right">Acerto</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itens.map((h) => (
                            <tr key={h.id} className="border-t border-neutral-100">
                              <td className="px-4 py-2 align-top font-semibold text-neutral-700">{h.trilha}</td>
                              <td className="px-4 py-2 align-top text-neutral-600">
                                <span className="font-mono text-xs text-neutral-400">
                                  {h.codigoSaeb} · {h.codigoBncc}
                                </span>
                                <p className="mt-0.5 text-justify">{h.descricaoHabilidade}</p>
                              </td>
                              <td className="px-4 py-2 align-top text-right">
                                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${corPercentualHabilidade(Number(h.percentualAcertoGeral))}`}>
                                  {Number(h.percentualAcertoGeral).toFixed(0)}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
              Diferente do SISPAI (2x por ano), este diagnóstico é aplicado a cada bimestre e olha só pras
              8 habilidades básicas de operações e situações-problema. Bom pra ver se o reforço está
              funcionando bimestre a bimestre.
            </p>
            <div className="mt-3 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                  <tr>
                    <th className="px-4 py-2">Habilidade</th>
                    {Array.from(new Set(habilidadesBimestrais.map((h) => h.bimestre)))
                      .sort()
                      .map((b) => (
                        <th key={b} className="px-4 py-2 text-right">
                          {b}º Bim.
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {evolucaoBimestral.map(({ habilidade, porBimestre }) => (
                    <tr key={habilidade} className="border-t border-neutral-100">
                      <td className="px-4 py-2 font-semibold text-neutral-700">{abreviarHabilidadeBimestral(habilidade)}</td>
                      {porBimestre.map((h) => (
                        <td key={h.bimestre} className="px-4 py-2 text-right">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${corPercentualHabilidade(Number(h.percentualAcertoGeral))}`}>
                            {Number(h.percentualAcertoGeral).toFixed(0)}%
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {turmasComCriticos.length > 0 && (
          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-neutral-900">🎯 Foco Pedagógico — alunos com pontos de atenção</h2>
              <p className="mt-1 text-xs text-neutral-500">
                Lista de alunos que a SME identificou como estagnados em alguma das 8 habilidades básicas no
                {bimestreDiagnostico ? ` ${bimestreDiagnostico}º bimestre` : " bimestre"}. Quem tem mais itens em
                vermelho ("não avançou") precisa de atenção mais urgente.
              </p>
            </div>
            {turmasComCriticos.map((turma) => {
              const daTurma = Array.from(criticosPorAluno.values())
                .filter((a) => a.turma === turma)
                .sort((a, b) => b.peso - a.peso);
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
          {turmas.map((turma) => {
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
      </div>
    </main>
  );
}
