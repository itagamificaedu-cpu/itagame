import Link from "next/link";
import { notFound } from "next/navigation";
import { verificarSessaoAluno } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";

const ROTULO_TIPO: Record<string, string> = {
  video: "🎬 Vídeo",
  quiz: "❓ Quiz",
  pratica: "🛠️ Prática",
  projeto: "🚀 Projeto",
  leitura: "📖 Leitura",
  desafio: "🏆 Desafio",
};

const ICONE_STATUS: Record<string, string> = {
  bloqueada: "🔒",
  disponivel: "▶️",
  em_andamento: "⏳",
  concluida: "✅",
};

export default async function PaginaTrilhaDetalheAluno({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const aluno = await verificarSessaoAluno();

  const trilha = await prisma.trilha.findUnique({
    where: { id },
    include: { missoes: { orderBy: { ordem: "asc" }, include: { badge: true } } },
  });

  if (!trilha || trilha.turmaId !== aluno.turmaId || trilha.status !== "publicada") {
    notFound();
  }

  const progressos = await prisma.progressoAluno.findMany({
    where: { alunoId: aluno.id, missaoId: { in: trilha.missoes.map((m) => m.id) } },
  });
  const progressoPorMissao = new Map(progressos.map((p) => [p.missaoId, p]));

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/trilha" className="text-sm font-semibold text-[#1a3fd4]">
          ← Minhas trilhas
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-neutral-900">{trilha.nome}</h1>
        <p className="mt-1 text-sm text-neutral-600">{trilha.descricao}</p>

        <ul className="mt-8 space-y-3">
          {trilha.missoes.map((missao, indice) => {
            const progresso = progressoPorMissao.get(missao.id);
            const status = progresso?.status ?? "bloqueada";
            const bloqueada = status === "bloqueada";

            const conteudo = (
              <div
                className={`flex items-center gap-4 rounded-xl border p-5 shadow-sm transition ${
                  bloqueada
                    ? "border-neutral-200 bg-neutral-100 opacity-60"
                    : "border-neutral-200 bg-white hover:border-[#1a3fd4] hover:bg-[#1a3fd4]/5"
                }`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1a3fd4]/10 text-xl">
                  {ICONE_STATUS[status]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-neutral-400">MISSÃO {indice + 1}</p>
                  <p className="truncate font-semibold text-neutral-900">{missao.titulo}</p>
                  <p className="mt-0.5 text-sm text-neutral-500">
                    {ROTULO_TIPO[missao.tipoAtividade]} · {missao.xpRecompensa} XP
                    {missao.badge && ` · badge ${missao.badge.icone} ${missao.badge.nome}`}
                  </p>
                </div>
              </div>
            );

            return (
              <li key={missao.id}>
                {bloqueada ? (
                  conteudo
                ) : (
                  <Link href={`/trilha/${trilha.id}/missoes/${missao.id}`}>{conteudo}</Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
