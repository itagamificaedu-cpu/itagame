import Link from "next/link";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";

const ROTULO_STATUS: Record<string, string> = {
  preparando: "🛠️ Preparando",
  em_andamento: "🟢 Em andamento",
  encerrada: "🏁 Encerrada",
};

export default async function PaginaGincanas() {
  const sessao = await exigirAssinaturaAtiva();

  const gincanas = await prisma.gincana.findMany({
    where: { professorId: sessao.userId },
    include: { times: true },
    orderBy: { criadaEm: "desc" },
  });

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/painel" className="text-sm font-semibold text-[#1a3fd4]">
          ← Voltar ao painel
        </Link>

        <div className="mt-4 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-neutral-900">🏆 Gincana Interativa</h1>
          <Link
            href="/painel/gincana/nova"
            className="whitespace-nowrap rounded-lg bg-[#1a3fd4] px-4 py-2 text-sm font-bold text-white hover:brightness-110"
          >
            + Nova gincana
          </Link>
        </div>
        <p className="mt-1 text-sm text-neutral-500">
          Junte turmas, escolha as atividades online da plataforma e acompanhe o ranking por
          equipe em tempo real, com pódio no final.
        </p>

        <div className="mt-8 space-y-3">
          {gincanas.length === 0 && (
            <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
              Nenhuma gincana criada ainda. Clique em &quot;+ Nova gincana&quot; pra começar.
            </p>
          )}

          {gincanas.map((gincana) => (
            <Link
              key={gincana.id}
              href={`/painel/gincana/${gincana.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-[#1a3fd4] hover:bg-[#1a3fd4]/5"
            >
              <div className="min-w-0">
                <p className="font-bold text-neutral-900">{gincana.nome}</p>
                <p className="mt-1 text-xs text-neutral-500">
                  {gincana.times.length} {gincana.times.length === 1 ? "turma" : "turmas"} ·{" "}
                  {ROTULO_STATUS[gincana.status]}
                </p>
              </div>
              <span className="shrink-0 text-neutral-300">→</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
