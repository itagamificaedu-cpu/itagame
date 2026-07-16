import Link from "next/link";
import { getUsuarioAtual } from "@/lib/acessoDados";
import { sair } from "@/app/actions/autenticacao";
import { prisma } from "@/lib/prisma";

export default async function PaginaPainel() {
  const usuario = await getUsuarioAtual();

  const atividadesRecentes = usuario
    ? await prisma.atividade.findMany({
        where: { professorId: usuario.id },
        orderBy: { criadaEm: "desc" },
        take: 3,
      })
    : [];

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              Olá, {usuario?.nome ?? "professor"}
            </h1>
            <p className="text-sm text-neutral-500">{usuario?.email}</p>
          </div>
          <form action={sair}>
            <button
              type="submit"
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
            >
              Sair
            </button>
          </form>
        </div>

        <div className="mt-10 flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-8">
          <div>
            <p className="font-semibold text-neutral-900">Gerador de atividades com IA</p>
            <p className="mt-1 text-sm text-neutral-500">
              Crie quizzes e atividades de verdadeiro ou falso em poucos minutos.
            </p>
          </div>
          <Link
            href="/painel/atividades/nova"
            className="rounded-lg bg-[#1a3fd4] px-4 py-2 text-sm font-bold text-white hover:brightness-110"
          >
            + Gerar atividade
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-8">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-neutral-900">Atividades recentes</p>
            <Link href="/painel/atividades" className="text-sm font-semibold text-[#1a3fd4]">
              Ver todas
            </Link>
          </div>

          {atividadesRecentes.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-500">
              Você ainda não gerou nenhuma atividade.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {atividadesRecentes.map((atividade) => (
                <li key={atividade.id}>
                  <Link
                    href={`/painel/atividades/${atividade.id}`}
                    className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3 text-sm hover:border-[#1a3fd4]"
                  >
                    <span className="font-medium text-neutral-800">{atividade.tema}</span>
                    <span className="text-neutral-400">
                      {atividade.disciplina} · {atividade.serie}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
          <p className="font-semibold text-neutral-700">Em construção</p>
          <p className="mt-1 text-sm">Próximos passos: sala ao vivo e turmas.</p>
        </div>
      </div>
    </main>
  );
}
