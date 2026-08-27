import Link from "next/link";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { FormularioItemLojaCliente } from "@/components/loja/FormularioItemLojaCliente";
import { RemoverItemLojaCliente } from "@/components/loja/RemoverItemLojaCliente";
import { AcaoResgateLojaCliente } from "@/components/loja/AcaoResgateLojaCliente";

export default async function PaginaLoja({
  searchParams,
}: {
  searchParams: Promise<{ turma?: string }>;
}) {
  const sessao = await exigirAssinaturaAtiva();
  const { turma: turmaIdParam } = await searchParams;

  const turmas = await prisma.turma.findMany({
    where: { professorId: sessao.userId },
    orderBy: { nome: "asc" },
  });

  if (turmas.length === 0) {
    return (
      <main className="min-h-screen bg-neutral-50 px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <Link href="/painel" className="text-sm font-semibold text-[#1a3fd4]">
            ← Voltar ao painel
          </Link>
          <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
            <p className="text-3xl">🏫</p>
            <p className="mt-2 font-semibold text-neutral-700">Crie uma turma primeiro</p>
            <p className="mt-1 text-sm text-neutral-500">
              A loja de recompensas pertence a uma turma — cadastre a turma antes.
            </p>
            <Link
              href="/painel/turmas/nova"
              className="mt-4 inline-block rounded-lg bg-[#1a3fd4] px-4 py-2 text-sm font-bold text-white hover:brightness-110"
            >
              + Nova turma
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const turmaId = turmaIdParam && turmas.some((t) => t.id === turmaIdParam) ? turmaIdParam : turmas[0].id;

  const [itens, resgatesPendentes] = await Promise.all([
    prisma.itemLoja.findMany({ where: { turmaId, ativo: true }, orderBy: { criadoEm: "asc" } }),
    prisma.resgateLoja.findMany({
      where: { status: "pendente", item: { turmaId } },
      include: { aluno: true, item: true },
      orderBy: { resgatadoEm: "asc" },
    }),
  ]);

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/painel" className="text-sm font-semibold text-[#1a3fd4]">
          ← Voltar ao painel
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-neutral-900">💰 Loja de recompensas</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Cadastre prêmios que os alunos trocam pelo XP acumulado nas trilhas.
        </p>

        {turmas.length > 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {turmas.map((turma) => (
              <Link
                key={turma.id}
                href={`/painel/loja?turma=${turma.id}`}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                  turma.id === turmaId
                    ? "bg-[#1a3fd4] text-white"
                    : "border border-neutral-200 bg-white text-neutral-600 hover:border-[#1a3fd4]"
                }`}
              >
                {turma.nome}
              </Link>
            ))}
          </div>
        )}

        {resgatesPendentes.length > 0 && (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <p className="font-bold text-amber-900">
              🎁 Resgates aguardando entrega ({resgatesPendentes.length})
            </p>
            <ul className="mt-4 space-y-3">
              {resgatesPendentes.map((resgate) => (
                <li
                  key={resgate.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-white p-4"
                >
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {resgate.aluno.nome} — {resgate.item.icone} {resgate.item.nome}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {resgate.custoXp} XP · resgatado em{" "}
                      {resgate.resgatadoEm.toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <AcaoResgateLojaCliente resgateId={resgate.id} />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8">
          <p className="font-bold text-neutral-900">Itens da loja ({itens.length})</p>

          {itens.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">Nenhum item cadastrado ainda.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {itens.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-neutral-900">
                      {item.icone} {item.nome}
                    </p>
                    {item.descricao && (
                      <p className="mt-0.5 text-sm text-neutral-500">{item.descricao}</p>
                    )}
                    <p className="mt-0.5 text-sm text-neutral-500">
                      {item.custoXp} XP
                      {item.estoque !== null && ` · ${item.estoque} em estoque`}
                    </p>
                  </div>
                  <RemoverItemLojaCliente turmaId={turmaId} itemId={item.id} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6">
          <FormularioItemLojaCliente turmaId={turmaId} />
        </div>
      </div>
    </main>
  );
}
