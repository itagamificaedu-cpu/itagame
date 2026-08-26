import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { removerProfessorEscola } from "@/app/actions/escola";
import FormularioAdicionarProfessor from "./FormularioAdicionarProfessor";

export default async function PaginaPainelEscola() {
  const sessao = await exigirAssinaturaAtiva();

  const usuario = await prisma.usuario.findUnique({ where: { id: sessao.userId } });
  if (!usuario || usuario.papel !== "escola_admin" || !usuario.escolaId) {
    notFound();
  }

  const escola = await prisma.escola.findUnique({
    where: { id: usuario.escolaId },
    include: { assinatura: true },
  });
  if (!escola) {
    notFound();
  }

  const professores = await prisma.usuario.findMany({
    where: { escolaId: escola.id, papel: "professor" },
    orderBy: { nome: "asc" },
    select: {
      id: true,
      nome: true,
      email: true,
      _count: {
        select: { atividadesCriadas: true, turmasComoProfessor: true, correcoesRedacao: true },
      },
    },
  });

  const totais = professores.reduce(
    (acumulado, professor) => ({
      atividades: acumulado.atividades + professor._count.atividadesCriadas,
      turmas: acumulado.turmas + professor._count.turmasComoProfessor,
      redacoes: acumulado.redacoes + professor._count.correcoesRedacao,
    }),
    { atividades: 0, turmas: 0, redacoes: 0 }
  );

  const proAtivo =
    escola.assinatura?.plano === "pro" &&
    escola.assinatura.status === "ativa" &&
    (!escola.assinatura.validade || escola.assinatura.validade > new Date());

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/painel" className="text-sm font-semibold text-[#1a3fd4]">
          ← Voltar ao painel
        </Link>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{escola.nome}</h1>
            <p className="mt-1 text-sm text-neutral-500">Painel do coordenador</p>
          </div>
          <span
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${
              proAtivo ? "bg-[#1a3fd4]/10 text-[#1a3fd4]" : "bg-neutral-100 text-neutral-500"
            }`}
          >
            {proAtivo ? "👑 Pro" : "Plano gratuito"}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <p className="text-2xl">📚</p>
            <p className="mt-2 text-2xl font-extrabold text-neutral-900">{totais.atividades}</p>
            <p className="text-sm text-neutral-500">atividades na escola</p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <p className="text-2xl">🏫</p>
            <p className="mt-2 text-2xl font-extrabold text-neutral-900">{totais.turmas}</p>
            <p className="text-sm text-neutral-500">turmas na escola</p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <p className="text-2xl">✍️</p>
            <p className="mt-2 text-2xl font-extrabold text-neutral-900">{totais.redacoes}</p>
            <p className="text-sm text-neutral-500">redações corrigidas</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="font-bold text-neutral-900">Adicionar professor à escola</p>
          <p className="mt-1 text-sm text-neutral-500">
            O professor precisa já ter uma conta criada em{" "}
            <Link href="/cadastro" className="font-semibold text-[#1a3fd4]">
              itagame.itatecnologiaeducacional.tech/cadastro
            </Link>
            .
          </p>
          <div className="mt-3">
            <FormularioAdicionarProfessor />
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="font-bold text-neutral-900">Professores da escola</p>

          {professores.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-500">Nenhum professor vinculado ainda.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {professores.map((professor) => (
                <li
                  key={professor.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-neutral-900">{professor.nome}</p>
                    <p className="truncate text-xs text-neutral-500">{professor.email}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <span className="text-xs text-neutral-500">
                      {professor._count.atividadesCriadas} ativ. · {professor._count.turmasComoProfessor}{" "}
                      turmas · {professor._count.correcoesRedacao} redações
                    </span>
                    <form action={removerProfessorEscola.bind(null, professor.id)}>
                      <button type="submit" className="text-xs font-semibold text-red-500 hover:text-red-700">
                        Remover
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
