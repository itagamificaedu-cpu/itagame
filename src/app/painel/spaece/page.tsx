import Link from "next/link";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { DISCIPLINAS_SPAECE, VERDE_SPAECE, VERDE_SPAECE_ESCURO } from "@/lib/spaece";

// Hub da aba "SPAECE 9º ano" — mesmo padrão da "BNCC Computação": reaproveita
// o motor de Trilhas já existente, organizado pelos eixos oficiais da
// Matriz de Referência do SPAECE (SEDUC-CE), só pro 9º ano do Ensino
// Fundamental (Língua Portuguesa e Matemática). Cor verde oficial em toda a
// tela, por pedido explícito do Genezio.
export default async function PaginaSpaece() {
  const sessao = await exigirAssinaturaAtiva();

  const trilhas = await prisma.trilha.findMany({
    where: { professorId: sessao.userId, eixoSpaece: { not: null } },
    include: { turma: true, _count: { select: { missoes: true } } },
    orderBy: { criadaEm: "desc" },
  });

  const trilhasPorEixo = new Map(
    DISCIPLINAS_SPAECE.flatMap((d) => d.eixos).map((eixo) => [
      eixo.chave,
      trilhas.filter((t) => t.eixoSpaece === eixo.chave),
    ])
  );

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/painel" className="text-sm font-semibold" style={{ color: VERDE_SPAECE }}>
          ← Voltar ao painel
        </Link>

        <div
          className="mt-4 overflow-hidden rounded-2xl p-8 text-white shadow-sm"
          style={{ backgroundImage: `linear-gradient(to bottom right, ${VERDE_SPAECE}, ${VERDE_SPAECE_ESCURO})` }}
        >
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
            🟩 SPAECE 2026 — 9º ano do Ensino Fundamental
          </p>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">SPAECE 9º ano</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/85">
            Trilhas gamificadas alinhadas à Matriz de Referência oficial do SPAECE (SEDUC-CE) — os
            descritores reais de Língua Portuguesa e Matemática do 9º ano, gerados com IA em
            minutos e travados no eixo/descritores certos.
          </p>
        </div>

        {DISCIPLINAS_SPAECE.map((disciplina) => (
          <div key={disciplina.chave} className="mt-8">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-neutral-900">
              <span className="text-xl">{disciplina.icone}</span> {disciplina.nome}
            </h2>

            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {disciplina.eixos.map((eixo) => {
                const trilhasDoEixo = trilhasPorEixo.get(eixo.chave) ?? [];
                return (
                  <div
                    key={eixo.chave}
                    className="flex flex-col rounded-2xl border bg-white p-6 shadow-sm"
                    style={{ borderColor: `${VERDE_SPAECE}33` }}
                  >
                    <h3 className="font-extrabold text-neutral-900">{eixo.nome}</h3>
                    <p className="mt-1 text-xs text-neutral-500">
                      {eixo.descritores.length} descritor{eixo.descritores.length > 1 ? "es" : ""} oficiais
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {eixo.descritores.map((d) => (
                        <span
                          key={d.codigo}
                          title={d.habilidade}
                          className="rounded-full px-2 py-0.5 text-xs font-bold"
                          style={{ backgroundColor: `${VERDE_SPAECE}15`, color: VERDE_SPAECE_ESCURO }}
                        >
                          {d.codigo}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/painel/trilhas/gerar-ia?eixoSpaece=${eixo.chave}`}
                      className="mt-4 rounded-lg border py-2 text-center text-sm font-bold transition hover:brightness-95"
                      style={{ borderColor: VERDE_SPAECE, color: VERDE_SPAECE }}
                    >
                      ✨ Gerar trilha com IA
                    </Link>

                    {trilhasDoEixo.length > 0 && (
                      <ul className="mt-4 space-y-2 border-t border-neutral-100 pt-4">
                        {trilhasDoEixo.map((trilha) => (
                          <li key={trilha.id}>
                            <Link
                              href={`/painel/trilhas/${trilha.id}`}
                              className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-neutral-50"
                            >
                              <span className="min-w-0 truncate font-semibold text-neutral-800">{trilha.nome}</span>
                              <span className="shrink-0 text-xs text-neutral-400">
                                {trilha.status === "publicada" ? "Publicada" : "Rascunho"}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {trilhas.length === 0 && (
          <p className="mt-8 text-center text-sm text-neutral-500">
            Nenhuma trilha de SPAECE criada ainda — escolha um eixo acima pra gerar a primeira com IA.
          </p>
        )}
      </div>
    </main>
  );
}
