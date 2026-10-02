import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import BotaoImprimir from "./BotaoImprimir";

// Lista de nomes + PIN da turma, pronta pra imprimir e recortar ou colar na
// lousa. O PIN do aluno é um só e vale pra todas as atividades.
export default async function PaginaPinsTurma({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessao = await exigirAssinaturaAtiva();

  const turma = await prisma.turma.findUnique({
    where: { id },
    include: { alunos: { orderBy: { nome: "asc" } } },
  });
  if (!turma || turma.professorId !== sessao.userId) notFound();

  return (
    <main className="min-h-screen bg-white px-6 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-4 print:hidden">
          <Link href={`/painel/turmas/${turma.id}`} className="text-sm font-semibold text-[#1a3fd4]">
            ← Voltar à turma
          </Link>
          <BotaoImprimir />
        </div>

        <h1 className="mt-4 text-xl font-bold text-neutral-900">{turma.nome}: acesso dos alunos</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Entrar em <strong>itagame.itatecnologiaeducacional.tech/entrar-trilha</strong> com o código da turma{" "}
          <strong className="tracking-widest">{turma.codigoAcesso ?? "-"}</strong>, escolher o nome e digitar o PIN. O PIN é
          sempre o mesmo, em todas as atividades.
        </p>

        <table className="mt-4 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-neutral-800 text-left">
              <th className="w-10 py-1.5">Nº</th>
              <th className="py-1.5">Aluno</th>
              <th className="w-24 py-1.5 text-center">PIN</th>
            </tr>
          </thead>
          <tbody>
            {turma.alunos.map((aluno, i) => (
              <tr key={aluno.id} className="border-b border-neutral-300">
                <td className="py-1.5 text-neutral-500">{String(i + 1).padStart(2, "0")}</td>
                <td className="py-1.5">{aluno.nome}</td>
                <td className="py-1.5 text-center font-bold tracking-widest">{aluno.pinTexto ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
