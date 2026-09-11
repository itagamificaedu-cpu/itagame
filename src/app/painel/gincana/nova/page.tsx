import Link from "next/link";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { criarGincana } from "@/app/actions/gincana";

export default async function PaginaNovaGincana() {
  const sessao = await exigirAssinaturaAtiva();

  const turmas = await prisma.turma.findMany({
    where: { professorId: sessao.userId },
    orderBy: { nome: "asc" },
    select: { id: true, nome: true, serie: true, _count: { select: { alunos: true } } },
  });

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-xl">
        <Link href="/painel/gincana" className="text-sm font-semibold text-[#1a3fd4]">
          ← Gincanas
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-neutral-900">🏆 Nova gincana</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Dê um nome pra gincana e escolha as turmas já cadastradas que vão competir. Depois
          disso, é só entrar no painel da gincana pra escolher as atividades e acompanhar o
          ranking.
        </p>

        <form action={criarGincana} className="mt-6 space-y-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div>
            <label htmlFor="nome" className="text-sm font-bold text-neutral-700">
              Nome da gincana
            </label>
            <input
              id="nome"
              name="nome"
              required
              minLength={2}
              placeholder="Ex: Gincana Interativa de Olho no SPAECE 2026"
              className="mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
            />
          </div>

          <div>
            <p className="text-sm font-bold text-neutral-700">Turmas participantes (times)</p>
            <p className="mt-0.5 text-xs text-neutral-500">Escolha pelo menos 2 turmas.</p>

            {turmas.length === 0 ? (
              <p className="mt-3 rounded-lg border border-dashed border-neutral-300 p-4 text-center text-sm text-neutral-500">
                Você ainda não tem turmas cadastradas.{" "}
                <Link href="/painel/turmas/nova" className="font-semibold text-[#1a3fd4]">
                  Criar turma
                </Link>
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {turmas.map((turma) => (
                  <label
                    key={turma.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 px-4 py-2.5 hover:bg-neutral-50"
                  >
                    <input type="checkbox" name="turmaIds" value={turma.id} className="h-4 w-4" />
                    <div className="min-w-0">
                      <span className="text-sm font-semibold text-neutral-800">{turma.nome}</span>
                      <span className="ml-2 text-xs text-neutral-400">
                        {turma.serie} · {turma._count.alunos}{" "}
                        {turma._count.alunos === 1 ? "aluno" : "alunos"}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={turmas.length < 2}
            className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Criar gincana
          </button>
        </form>
      </div>
    </main>
  );
}
