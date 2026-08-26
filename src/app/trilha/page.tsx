import Link from "next/link";
import { verificarSessaoAluno } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { sairComoAluno } from "@/app/actions/trilhaAcesso";

export default async function PaginaTrilhaAluno() {
  const aluno = await verificarSessaoAluno();

  const [xpTransacoes, badgesConcedidas, trilhas] = await Promise.all([
    prisma.xpTransacao.findMany({ where: { alunoId: aluno.id } }),
    prisma.badgeConcedida.findMany({ where: { alunoId: aluno.id }, include: { badge: true } }),
    prisma.trilha.findMany({
      where: { turmaId: aluno.turmaId, status: "publicada" },
      include: { missoes: true },
      orderBy: { criadaEm: "desc" },
    }),
  ]);

  const xpTotal = xpTransacoes.reduce((soma, t) => soma + t.quantidade, 0);

  const progressos = await prisma.progressoAluno.findMany({
    where: { alunoId: aluno.id, missao: { trilhaId: { in: trilhas.map((t) => t.id) } } },
  });

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500">Olá,</p>
            <h1 className="text-2xl font-bold text-neutral-900">{aluno.nome} 👋</h1>
          </div>
          <form action={sairComoAluno}>
            <button
              type="submit"
              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-100"
            >
              Sair
            </button>
          </form>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <p className="text-2xl">⚡</p>
            <p className="mt-2 text-2xl font-extrabold text-neutral-900">{xpTotal}</p>
            <p className="text-sm text-neutral-500">XP total</p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <p className="text-2xl">🏅</p>
            <p className="mt-2 text-2xl font-extrabold text-neutral-900">{badgesConcedidas.length}</p>
            <p className="text-sm text-neutral-500">
              {badgesConcedidas.length === 1 ? "badge conquistado" : "badges conquistados"}
            </p>
          </div>
        </div>

        {badgesConcedidas.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {badgesConcedidas.map((b) => (
              <span
                key={b.id}
                title={b.badge.descricao}
                className="flex items-center gap-1 rounded-full bg-[#1a3fd4]/10 px-3 py-1 text-sm font-semibold text-[#1a3fd4]"
              >
                {b.badge.icone} {b.badge.nome}
              </span>
            ))}
          </div>
        )}

        <p className="mt-8 font-bold text-neutral-900">Minhas trilhas</p>

        {trilhas.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
            <p className="text-3xl">🧭</p>
            <p className="mt-2 font-semibold text-neutral-700">Nenhuma trilha publicada ainda</p>
            <p className="mt-1 text-sm text-neutral-500">
              Assim que seu professor publicar uma trilha, ela aparece aqui.
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {trilhas.map((trilha) => {
              const concluidas = progressos.filter(
                (p) => p.status === "concluida" && trilha.missoes.some((m) => m.id === p.missaoId)
              ).length;
              return (
                <li key={trilha.id}>
                  <Link
                    href={`/trilha/${trilha.id}`}
                    className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-[#1a3fd4] hover:bg-[#1a3fd4]/5"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1a3fd4]/10 text-xl">
                      🧭
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-neutral-900">{trilha.nome}</p>
                      <p className="mt-0.5 text-sm text-neutral-500">
                        {concluidas}/{trilha.missoes.length} missões concluídas
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
