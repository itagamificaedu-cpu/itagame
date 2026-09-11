import { notFound } from "next/navigation";
import Link from "next/link";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { PainelGincanaCliente } from "@/components/gincana/PainelGincanaCliente";

const TIPOS_QUIZ_AO_VIVO = ["quiz", "verdadeiro_falso", "completar_frase", "associar_colunas"];

export default async function PaginaGincana({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessao = await exigirAssinaturaAtiva();

  const gincana = await prisma.gincana.findUnique({
    where: { id },
    include: { times: { include: { turma: true } } },
  });
  if (!gincana || gincana.professorId !== sessao.userId) {
    notFound();
  }

  const [atividadesQuiz, atividadesCaboGuerra, todasTurmas] = await Promise.all([
    prisma.atividade.findMany({
      where: { professorId: sessao.userId, tipo: { in: TIPOS_QUIZ_AO_VIVO as never } },
      orderBy: { criadaEm: "desc" },
      select: { id: true, conteudoGerado: true, disciplina: true, serie: true },
    }),
    prisma.atividade.findMany({
      where: { professorId: sessao.userId, tipo: "cabo_de_guerra" },
      orderBy: { criadaEm: "desc" },
      select: { id: true, conteudoGerado: true, disciplina: true, serie: true },
    }),
    prisma.turma.findMany({
      where: { professorId: sessao.userId },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true },
    }),
  ]);

  const turmaIdsNaGincana = new Set(gincana.times.map((t) => t.turmaId));
  const turmasDisponiveis = todasTurmas.filter((t) => !turmaIdsNaGincana.has(t.id));

  const paraOpcao = (a: { id: string; conteudoGerado: unknown; disciplina: string; serie: string }) => ({
    id: a.id,
    titulo: (a.conteudoGerado as { titulo?: string })?.titulo ?? "Atividade",
    disciplina: a.disciplina,
    serie: a.serie,
  });

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/painel/gincana" className="text-sm font-semibold text-[#1a3fd4]">
          ← Gincanas
        </Link>

        <PainelGincanaCliente
          gincanaId={gincana.id}
          nome={gincana.nome}
          atividadesQuiz={atividadesQuiz.map(paraOpcao)}
          atividadesCaboGuerra={atividadesCaboGuerra.map(paraOpcao)}
          timesAtuais={gincana.times.map((t) => ({ id: t.id, turmaId: t.turmaId, turmaNome: t.turma.nome }))}
          turmasDisponiveis={turmasDisponiveis}
        />
      </div>
    </main>
  );
}
