import Link from "next/link";
import { verificarSessao } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";

const RESUMO_TIPO: Record<string, { rotulo: string; icone: string }> = {
  quiz: { rotulo: "Quiz", icone: "❓" },
  verdadeiro_falso: { rotulo: "Verdadeiro ou falso", icone: "⚖️" },
  completar_frase: { rotulo: "Completar frase", icone: "✏️" },
  caca_palavras: { rotulo: "Caça-palavras", icone: "🔤" },
  associar_colunas: { rotulo: "Associar colunas", icone: "🔗" },
  apresentacao: { rotulo: "Apresentação", icone: "📽️" },
};

export default async function PaginaAtividades() {
  const sessao = await verificarSessao();

  const atividades = await prisma.atividade.findMany({
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
            <h1 className="mt-2 text-2xl font-bold text-neutral-900">Minhas atividades</h1>
          </div>
          <Link
            href="/painel/atividades/nova"
            className="rounded-lg bg-[#1a3fd4] px-4 py-2 text-sm font-bold text-white hover:brightness-110"
          >
            + Gerar atividade
          </Link>
        </div>

        {atividades.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
            <p className="text-3xl">✨</p>
            <p className="mt-2 font-semibold text-neutral-700">Nenhuma atividade ainda</p>
            <p className="mt-1 text-sm text-neutral-500">
              Gere sua primeira atividade com IA em poucos minutos.
            </p>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {atividades.map((atividade) => {
              const info = RESUMO_TIPO[atividade.tipo] ?? { rotulo: atividade.tipo, icone: "📄" };
              return (
                <li key={atividade.id}>
                  <Link
                    href={`/painel/atividades/${atividade.id}`}
                    className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-[#1a3fd4] hover:bg-[#1a3fd4]/5"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1a3fd4]/10 text-xl">
                      {info.icone}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-neutral-900">{atividade.tema}</p>
                      <p className="mt-0.5 text-sm text-neutral-500">
                        {atividade.disciplina} · {atividade.serie} · {info.rotulo}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm text-neutral-400">
                      {atividade.criadaEm.toLocaleDateString("pt-BR")}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
