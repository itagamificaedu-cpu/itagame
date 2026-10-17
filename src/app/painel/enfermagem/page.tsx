import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";

// Tela inicial do acesso temporário da turma de Enfermagem: só criar atividade
// com IA e o Simulador de Prontuário. O proxy (src/proxy.ts) fecha o resto.
export default async function PaginaEnfermagem() {
  const sessao = await exigirAssinaturaAtiva();
  if (sessao.colaborador && sessao.colaborador.acessoRestrito !== "enfermagem") notFound();

  const turma = await prisma.turma.findFirst({
    where: { professorId: sessao.userId, areaExclusiva: "enfermagem" },
    select: { id: true, nome: true, codigoAcesso: true, _count: { select: { alunos: true } } },
  });

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-extrabold text-neutral-900">Enfermagem · acesso temporário</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Aqui você pode criar atividades com a ajuda da IA e usar o Simulador de Prontuário Eletrônico com a turma.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href="/painel/atividades/nova"
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-[#1a3fd4] hover:bg-[#1a3fd4]/5"
          >
            <p className="text-3xl">✨</p>
            <p className="mt-2 text-lg font-bold text-neutral-900">Criar atividade com IA</p>
            <p className="mt-1 text-sm text-neutral-600">Descreva o tema e a IA monta as questões prontas.</p>
          </Link>

          {turma ? (
            <Link
              href={`/painel/turmas/${turma.id}/prontuario`}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-[#1a3fd4] hover:bg-[#1a3fd4]/5"
            >
              <p className="text-3xl">🩺</p>
              <p className="mt-2 text-lg font-bold text-neutral-900">Prontuário Eletrônico</p>
              <p className="mt-1 text-sm text-neutral-600">Cadastre casos clínicos e acompanhe quem já registrou.</p>
            </Link>
          ) : (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-6 text-sm text-neutral-500">
              A turma de Enfermagem ainda não foi criada.
            </div>
          )}
        </div>

        {turma && (
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 text-sm text-neutral-700">
            <p className="font-bold text-neutral-900">{turma.nome}</p>
            <p className="mt-1">
              {turma._count.alunos} {turma._count.alunos === 1 ? "aluno" : "alunos"} ·{" "}
              <Link href={`/painel/turmas/${turma.id}`} className="font-semibold text-[#1a3fd4] underline">
                lista de alunos e PINs
              </Link>
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              Os alunos entram no prontuário em <b>itagame.itatecnologiaeducacional.tech/entrar-trilha</b>, com o código{" "}
              <b>{turma.codigoAcesso}</b>, o nome e o PIN.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
