import Link from "next/link";
import { verificarSessao } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";

function corPorNota(nota: number) {
  if (nota >= 8) return "bg-[#00c264]/10 text-[#00854a]";
  if (nota >= 6) return "bg-[#ffb020]/10 text-[#8a5a00]";
  return "bg-[#ff5470]/10 text-[#a8283f]";
}

export default async function PaginaRedacoes() {
  const sessao = await verificarSessao();

  const correcoes = await prisma.correcaoRedacao.findMany({
    where: { professorId: sessao.userId },
    orderBy: { criadaEm: "desc" },
  });

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/painel" className="text-sm font-semibold text-[#1a3fd4]">
              ← Voltar ao painel
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-neutral-900">Correções de redação</h1>
          </div>
          <Link
            href="/painel/redacoes/nova"
            className="rounded-lg bg-[#1a3fd4] px-4 py-2 text-sm font-bold text-white hover:brightness-110"
          >
            + Corrigir redação
          </Link>
        </div>

        {correcoes.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
            <p className="text-3xl">✍️</p>
            <p className="mt-2 font-semibold text-neutral-700">Nenhuma correção ainda</p>
            <p className="mt-1 text-sm text-neutral-500">
              Cole a primeira redação e receba a nota em segundos.
            </p>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {correcoes.map((correcao) => (
              <li key={correcao.id}>
                <Link
                  href={`/painel/redacoes/${correcao.id}`}
                  className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-[#1a3fd4] hover:bg-[#1a3fd4]/5"
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${corPorNota(correcao.notaGeral)}`}
                  >
                    {correcao.notaGeral.toFixed(1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-neutral-900">{correcao.tema}</p>
                    <p className="mt-0.5 text-sm text-neutral-500">
                      {correcao.criadaEm.toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
