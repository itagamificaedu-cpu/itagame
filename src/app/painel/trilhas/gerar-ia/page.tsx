import Link from "next/link";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import FormularioGerarTrilhaIa from "./FormularioGerarTrilhaIa";

export default async function PaginaGerarTrilhaIa() {
  const sessao = await exigirAssinaturaAtiva();
  const turmas = await prisma.turma.findMany({
    where: { professorId: sessao.userId },
    orderBy: { nome: "asc" },
  });

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/painel/trilhas" className="text-sm font-semibold text-[#1a3fd4]">
          ← Trilhas educativas
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-neutral-900">✨ Gerar trilha com IA</h1>
        <p className="mt-1 text-sm text-neutral-500">
          A IA monta a trilha inteira — nome, descrição e todas as missões em sequência — alinhada
          à BNCC Computação (Pensamento Computacional, Mundo Digital e Cultura Digital). A trilha
          nasce como rascunho, você pode revisar e ajustar tudo antes de publicar pros alunos.
        </p>

        {turmas.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
            <p className="text-3xl">🏫</p>
            <p className="mt-2 font-semibold text-neutral-700">Crie uma turma primeiro</p>
            <Link
              href="/painel/turmas/nova"
              className="mt-4 inline-block rounded-lg bg-[#1a3fd4] px-4 py-2 text-sm font-bold text-white hover:brightness-110"
            >
              + Nova turma
            </Link>
          </div>
        ) : (
          <FormularioGerarTrilhaIa turmas={turmas} />
        )}
      </div>
    </main>
  );
}
