import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { VERDE_SPAECE } from "@/lib/spaece";
import { ControleProvaCliente } from "@/components/prova/ControleProvaCliente";

export default async function PaginaControleProva({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  const sessao = await exigirAssinaturaAtiva();

  const prova = await prisma.provaCronometrada.findUnique({ where: { codigo }, select: { professorId: true, turma: { select: { acessoAlunosBloqueado: true } } } });
  if (!prova || prova.professorId !== sessao.userId) notFound();
  if (sessao.colaborador && prova.turma.acessoAlunosBloqueado) notFound();

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/painel/spaece/prova" className="text-sm font-semibold" style={{ color: VERDE_SPAECE }}>
          ← Provas cronometradas
        </Link>
        <ControleProvaCliente codigo={codigo} />
      </div>
    </main>
  );
}
