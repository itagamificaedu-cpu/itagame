import Link from "next/link";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { eixoBnccPorChave } from "@/lib/bnccComputacao";
import { eixoSpaecePorChave, VERDE_SPAECE } from "@/lib/spaece";

export default async function PaginaTrilhas() {
  const sessao = await exigirAssinaturaAtiva();

  const trilhas = await prisma.trilha.findMany({
    where: { professorId: sessao.userId },
    orderBy: { criadaEm: "desc" },
    include: { turma: true, _count: { select: { missoes: true } } },
  });

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/painel" className="text-sm font-semibold text-[#1a3fd4]">
              ← Voltar ao painel
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-neutral-900">Trilhas educativas</h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/painel/trilhas/gerar-ia"
              className="rounded-lg border border-[#1a3fd4] px-4 py-2 text-sm font-bold text-[#1a3fd4] hover:bg-[#1a3fd4]/5"
            >
              ✨ Gerar com IA
            </Link>
            <Link
              href="/painel/trilhas/nova"
              className="rounded-lg bg-[#1a3fd4] px-4 py-2 text-sm font-bold text-white hover:brightness-110"
            >
              + Nova trilha
            </Link>
          </div>
        </div>

        <Link
          href="/painel/bncc-computacao"
          className="mt-4 flex items-center gap-3 rounded-xl border border-[#1a3fd4]/30 bg-[#1a3fd4]/5 p-4 transition hover:bg-[#1a3fd4]/10"
        >
          <span className="text-xl">🎯</span>
          <span className="text-sm font-bold text-[#1a3fd4]">
            Nova: aba BNCC Computação — trilhas prontas pros 3 eixos oficiais →
          </span>
        </Link>

        {trilhas.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
            <p className="text-3xl">🧭</p>
            <p className="mt-2 font-semibold text-neutral-700">Nenhuma trilha ainda</p>
            <p className="mt-1 text-sm text-neutral-500">
              Crie uma sequência de missões pros seus alunos completarem, com XP e badges.
            </p>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {trilhas.map((trilha) => {
              const eixo = eixoBnccPorChave(trilha.eixoBnccComputacao);
              const eixoSpaece = eixoSpaecePorChave(trilha.eixoSpaece);
              return (
                <li key={trilha.id}>
                  <Link
                    href={`/painel/trilhas/${trilha.id}`}
                    className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-[#1a3fd4] hover:bg-[#1a3fd4]/5"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1a3fd4]/10 text-xl">
                      {eixo?.icone ?? (eixoSpaece ? "🟩" : "🧭")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold text-neutral-900">{trilha.nome}</p>
                        {eixo && (
                          <span
                            className="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold"
                            style={{ backgroundColor: `${eixo.cor}15`, color: eixo.cor }}
                          >
                            BNCC · {eixo.nome}
                          </span>
                        )}
                        {eixoSpaece && (
                          <span
                            className="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold"
                            style={{ backgroundColor: `${VERDE_SPAECE}15`, color: VERDE_SPAECE }}
                          >
                            SPAECE · {eixoSpaece.nome}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-neutral-500">
                        {trilha.turma.nome} · {trilha._count.missoes}{" "}
                        {trilha._count.missoes === 1 ? "missão" : "missões"} ·{" "}
                        {trilha.status === "publicada" ? "Publicada" : "Rascunho"}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
