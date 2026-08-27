import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { excluirTrilha } from "@/app/actions/trilhas";
import { AdicionarMissaoCliente } from "@/components/trilhas/AdicionarMissaoCliente";
import { PublicarTrilhaCliente } from "@/components/trilhas/PublicarTrilhaCliente";
import { RemoverMissaoCliente } from "@/components/trilhas/RemoverMissaoCliente";
import { AvaliarEntregaCliente } from "@/components/trilhas/AvaliarEntregaCliente";

const ROTULO_TIPO: Record<string, string> = {
  video: "🎬 Vídeo",
  quiz: "❓ Quiz",
  pratica: "🛠️ Prática",
  projeto: "🚀 Projeto",
  leitura: "📖 Leitura",
  desafio: "🏆 Desafio",
};

export default async function PaginaDetalheTrilha({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sessao = await exigirAssinaturaAtiva();

  const trilha = await prisma.trilha.findUnique({
    where: { id },
    include: {
      turma: true,
      missoes: { orderBy: { ordem: "asc" }, include: { badge: true, preRequisito: true } },
    },
  });

  if (!trilha || trilha.professorId !== sessao.userId) {
    notFound();
  }

  const entregasPendentes = await prisma.progressoAluno.findMany({
    where: { missao: { trilhaId: id }, status: "em_andamento", entregaTexto: { not: null } },
    include: { aluno: true, missao: true },
    orderBy: { atualizadoEm: "asc" },
  });

  const alunosRanking = await prisma.aluno.findMany({
    where: { turmaId: trilha.turmaId },
    include: { xpTransacoes: true, badgesConcedidas: { include: { badge: true } } },
  });

  const ranking = alunosRanking
    .map((aluno) => ({
      id: aluno.id,
      nome: aluno.nome,
      xpTotal: aluno.xpTransacoes.reduce((soma, t) => soma + t.quantidade, 0),
      badges: aluno.badgesConcedidas,
    }))
    .sort((a, b) => b.xpTotal - a.xpTotal);

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/painel/trilhas" className="text-sm font-semibold text-[#1a3fd4]">
          ← Trilhas educativas
        </Link>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{trilha.nome}</h1>
            <p className="mt-1 text-sm text-neutral-500">
              {trilha.turma.nome} · {trilha.tipoEstrutura === "linear" ? "Linear" : "Livre"} ·{" "}
              {trilha.status === "publicada" ? "🟢 Publicada" : "📝 Rascunho"}
            </p>
            <p className="mt-2 max-w-xl text-sm text-neutral-600">{trilha.descricao}</p>
            {trilha.competenciasBncc.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {trilha.competenciasBncc.map((competencia) => (
                  <span
                    key={competencia}
                    className="rounded-full bg-[#1a3fd4]/10 px-2.5 py-1 text-xs font-semibold text-[#1a3fd4]"
                  >
                    🎓 {competencia}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            {trilha.status === "rascunho" && <PublicarTrilhaCliente trilhaId={trilha.id} />}
            <form action={excluirTrilha.bind(null, trilha.id)}>
              <button
                type="submit"
                className="whitespace-nowrap rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
              >
                Excluir trilha
              </button>
            </form>
          </div>
        </div>

        {entregasPendentes.length > 0 && (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <p className="font-bold text-amber-900">
              📋 Entregas aguardando correção ({entregasPendentes.length})
            </p>
            <ul className="mt-4 space-y-4">
              {entregasPendentes.map((entrega) => (
                <li key={entrega.id} className="rounded-xl border border-amber-200 bg-white p-4">
                  <p className="font-semibold text-neutral-900">
                    {entrega.aluno.nome} — {entrega.missao.titulo}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap rounded-lg bg-neutral-50 p-3 text-sm text-neutral-700">
                    {entrega.entregaTexto}
                  </p>
                  <AvaliarEntregaCliente progressoId={entrega.id} />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8">
          <p className="font-bold text-neutral-900">Missões ({trilha.missoes.length})</p>

          {trilha.missoes.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">Nenhuma missão adicionada ainda.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {trilha.missoes.map((missao, indice) => (
                <li
                  key={missao.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-neutral-400">MISSÃO {indice + 1}</p>
                    <p className="font-semibold text-neutral-900">{missao.titulo}</p>
                    <p className="mt-0.5 text-sm text-neutral-500">
                      {ROTULO_TIPO[missao.tipoAtividade]} · {missao.xpRecompensa} XP
                      {missao.preRequisito && ` · requer "${missao.preRequisito.titulo}"`}
                      {missao.badge && ` · badge ${missao.badge.icone} ${missao.badge.nome}`}
                    </p>
                  </div>
                  {trilha.status === "rascunho" && (
                    <RemoverMissaoCliente trilhaId={trilha.id} missaoId={missao.id} />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {trilha.status === "rascunho" && (
          <div className="mt-6">
            <AdicionarMissaoCliente
              trilhaId={trilha.id}
              missoesExistentes={trilha.missoes.map((m) => ({ id: m.id, titulo: m.titulo }))}
            />
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
          <p className="font-bold text-neutral-900">🏆 Ranking da turma {trilha.turma.nome}</p>
          {ranking.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">Nenhum aluno cadastrado nessa turma.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {ranking.map((aluno, posicao) => (
                <li
                  key={aluno.id}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-2"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-neutral-800">
                    <span className="text-neutral-400">#{posicao + 1}</span>
                    {aluno.nome}
                    {aluno.badges.map((b) => (
                      <span key={b.id} title={b.badge.nome}>
                        {b.badge.icone}
                      </span>
                    ))}
                  </span>
                  <span className="text-sm font-bold text-[#1a3fd4]">{aluno.xpTotal} XP</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
