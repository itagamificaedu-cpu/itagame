import Link from "next/link";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";

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
          <Link
            href="/painel/trilhas/nova"
            className="rounded-lg bg-[#1a3fd4] px-4 py-2 text-sm font-bold text-white hover:brightness-110"
          >
            + Nova trilha
          </Link>
        </div>

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
            {trilhas.map((trilha) => (
              <li key={trilha.id}>
                <Link
                  href={`/painel/trilhas/${trilha.id}`}
                  className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-[#1a3fd4] hover:bg-[#1a3fd4]/5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1a3fd4]/10 text-xl">
                    🧭
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-neutral-900">{trilha.nome}</p>
                    <p className="mt-0.5 text-sm text-neutral-500">
                      {trilha.turma.nome} · {trilha._count.missoes}{" "}
                      {trilha._count.missoes === 1 ? "missão" : "missões"} ·{" "}
                      {trilha.status === "publicada" ? "Publicada" : "Rascunho"}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
