import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { VERDE_SPAECE, VERDE_SPAECE_ESCURO } from "@/lib/spaece";
import { PADRAO_SISPAI_LABEL, PADRAO_SISPAI_COR, notaBaixaSispai, corPercentualHabilidade } from "@/lib/sispai";

// Dado sensível e específico do CEITEC (nomes reais de alunos) — só o dono
// da plataforma vê por enquanto, igual ao padrão já usado em
// /painel/admin/formacao-ia. Ver feedback_teste_admin na memória: testar
// tudo no perfil do Genezio antes de decidir se libera pra outras escolas.
export default async function ResultadosSispaiMatematica() {
  const sessao = await exigirAssinaturaAtiva();
  if (sessao.papel !== "ita_owner") {
    notFound();
  }

  const [resultados, habilidades] = await Promise.all([
    prisma.resultadoSispaiMatematica.findMany({ where: { professorId: sessao.userId } }),
    prisma.habilidadeSispaiMatematica.findMany({
      where: { professorId: sessao.userId },
      orderBy: { percentualAcertoGeral: "asc" },
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

  type Combinado = {
    turma: string;
    nome: string;
    pctRodada1: number | null;
    pctRodada2: number | null;
    tri: number | null;
    nivel: string | null;
    padrao: string | null;
  };

  const porAluno = new Map<string, Combinado>();
  for (const r of resultados) {
    const chave = `${r.turma}|${r.nomeAluno}`;
    const atual = porAluno.get(chave) ?? {
      turma: r.turma,
      nome: r.nomeAluno,
      pctRodada1: null,
      pctRodada2: null,
      tri: null,
      nivel: null,
      padrao: null,
    };
    if (r.rodada === 1) {
      atual.pctRodada1 = Number(r.percentualAcerto);
      atual.tri = r.triScore ? Number(r.triScore) : null;
      atual.nivel = r.nivel;
      atual.padrao = r.padrao;
    } else {
      atual.pctRodada2 = Number(r.percentualAcerto);
    }
    porAluno.set(chave, atual);
  }

  const alunos = Array.from(porAluno.values());
  const classificados = alunos.filter((a) => a.padrao !== null);
  const notaBaixa = classificados.filter((a) => notaBaixaSispai(a.padrao));

  const mediaRodada1 =
    alunos.filter((a) => a.pctRodada1 !== null).reduce((s, a) => s + (a.pctRodada1 ?? 0), 0) /
    Math.max(1, alunos.filter((a) => a.pctRodada1 !== null).length);
  const mediaRodada2 =
    alunos.filter((a) => a.pctRodada2 !== null).reduce((s, a) => s + (a.pctRodada2 ?? 0), 0) /
    Math.max(1, alunos.filter((a) => a.pctRodada2 !== null).length);

  const turmas = Array.from(new Set(alunos.map((a) => a.turma))).sort();

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
            <p className="text-xs text-neutral-500">alunos avaliados (Rodada 1)</p>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
            <p className="text-2xl font-extrabold text-red-700">{notaBaixa.length}</p>
            <p className="text-xs text-red-700">nota baixa (Básico ou Abaixo do Básico)</p>
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
          <div className="mt-8">
            <h2 className="text-lg font-extrabold text-neutral-900">📉 Habilidades mais críticas do 9º ano</h2>
            <p className="mt-1 text-xs text-neutral-500">
              Percentual de acerto do 9º ano inteiro (todas as turmas) em cada habilidade da prova —
              organizado nas 5 Trilhas de Matemática da BNCC. Quanto mais perto de 0%, mais prioritário
              pro reforço.
            </p>
            <div className="mt-3 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                  <tr>
                    <th className="px-4 py-2">Trilha</th>
                    <th className="px-4 py-2">Habilidade (SAEB / BNCC)</th>
                    <th className="px-4 py-2 text-right">Acerto</th>
                  </tr>
                </thead>
                <tbody>
                  {habilidades.map((h) => (
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
        )}

        <div className="mt-8 space-y-6">
          <h2 className="text-lg font-extrabold text-neutral-900">👥 Alunos por turma</h2>
          {turmas.map((turma) => {
            const daTurma = alunos
              .filter((a) => a.turma === turma)
              .sort((a, b) => (a.tri ?? 999) - (b.tri ?? 999));
            return (
              <div key={turma} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                <div className="border-b border-neutral-100 px-4 py-2">
                  <p className="text-sm font-extrabold text-neutral-900">Turma {turma}</p>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                    <tr>
                      <th className="px-4 py-2">Aluno</th>
                      <th className="px-4 py-2 text-right">Rodada 1</th>
                      <th className="px-4 py-2 text-right">Rodada 2</th>
                      <th className="px-4 py-2 text-right">TRI</th>
                      <th className="px-4 py-2 text-right">Nível</th>
                      <th className="px-4 py-2 text-right">Padrão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {daTurma.map((a) => (
                      <tr
                        key={a.nome}
                        className={`border-t border-neutral-100 ${notaBaixaSispai(a.padrao) ? "bg-red-50/40" : ""}`}
                      >
                        <td className="px-4 py-2 font-medium text-neutral-800">{a.nome}</td>
                        <td className="px-4 py-2 text-right text-neutral-600">
                          {a.pctRodada1 !== null ? `${a.pctRodada1.toFixed(1)}%` : "—"}
                        </td>
                        <td className="px-4 py-2 text-right text-neutral-600">
                          {a.pctRodada2 !== null ? `${a.pctRodada2.toFixed(1)}%` : "—"}
                        </td>
                        <td className="px-4 py-2 text-right text-neutral-600">{a.tri !== null ? a.tri.toFixed(1) : "—"}</td>
                        <td className="px-4 py-2 text-right text-neutral-600">{a.nivel ?? "—"}</td>
                        <td className="px-4 py-2 text-right">
                          {a.padrao ? (
                            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${PADRAO_SISPAI_COR[a.padrao]}`}>
                              {PADRAO_SISPAI_LABEL[a.padrao]}
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
