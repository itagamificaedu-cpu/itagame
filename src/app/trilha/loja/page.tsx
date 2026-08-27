import Link from "next/link";
import { verificarSessaoAluno } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { ResgatarItemCliente } from "@/components/loja/ResgatarItemCliente";

export default async function PaginaLojaAluno() {
  const aluno = await verificarSessaoAluno();

  const [itens, xpTransacoes, resgates] = await Promise.all([
    prisma.itemLoja.findMany({ where: { turmaId: aluno.turmaId, ativo: true }, orderBy: { custoXp: "asc" } }),
    prisma.xpTransacao.findMany({ where: { alunoId: aluno.id } }),
    prisma.resgateLoja.findMany({ where: { alunoId: aluno.id }, orderBy: { resgatadoEm: "desc" } }),
  ]);

  const xpTotal = xpTransacoes.reduce((soma, t) => soma + t.quantidade, 0);
  const resgatePorItem = new Map(
    resgates.filter((r) => r.status !== "cancelado").map((r) => [r.itemId, r])
  );

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/trilha" className="text-sm font-semibold text-[#1a3fd4]">
          ← Minhas trilhas
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">💰 Loja de recompensas</h1>

        <div className="mt-4 rounded-2xl border border-[#1a3fd4]/20 bg-[#1a3fd4]/5 p-5">
          <p className="text-sm text-neutral-600">Seu XP disponível</p>
          <p className="text-3xl font-extrabold text-[#1a3fd4]">{xpTotal} XP</p>
        </div>

        {itens.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
            <p className="text-3xl">💰</p>
            <p className="mt-2 font-semibold text-neutral-700">Nenhum item na loja ainda</p>
            <p className="mt-1 text-sm text-neutral-500">
              Assim que seu professor cadastrar prêmios, eles aparecem aqui.
            </p>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {itens.map((item) => {
              const resgate = resgatePorItem.get(item.id);
              return (
                <li key={item.id} className="rounded-xl border border-neutral-200 bg-white p-5">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1a3fd4]/10 text-2xl">
                      {item.icone}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-neutral-900">{item.nome}</p>
                      {item.descricao && (
                        <p className="text-sm text-neutral-500">{item.descricao}</p>
                      )}
                      <p className="mt-1 text-sm font-bold text-[#1a3fd4]">{item.custoXp} XP</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    {resgate ? (
                      <p
                        className={`rounded-lg px-3 py-2 text-center text-sm font-semibold ${
                          resgate.status === "entregue"
                            ? "bg-[#00c264]/10 text-[#00854a]"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {resgate.status === "entregue" ? "✅ Entregue" : "⏳ Aguardando entrega"}
                      </p>
                    ) : (
                      <ResgatarItemCliente
                        itemId={item.id}
                        xpTotal={xpTotal}
                        custoXp={item.custoXp}
                        estoqueEsgotado={item.estoque !== null && item.estoque <= 0}
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
