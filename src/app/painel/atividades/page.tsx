import Link from "next/link";
import { verificarSessao } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";

const RESUMO_TIPO: Record<string, string> = {
  quiz: "Quiz",
  verdadeiro_falso: "Verdadeiro ou falso",
  completar_frase: "Completar frase",
  caca_palavras: "Caça-palavras",
  associar_colunas: "Associar colunas",
  apresentacao: "Apresentação",
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
          <div className="mt-10 rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
            <p className="font-semibold text-neutral-700">Nenhuma atividade ainda</p>
            <p className="mt-1 text-sm">Gere sua primeira atividade com IA em poucos minutos.</p>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {atividades.map((atividade) => (
              <li key={atividade.id}>
                <Link
                  href={`/painel/atividades/${atividade.id}`}
                  className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-[#1a3fd4]"
                >
                  <div>
                    <p className="font-semibold text-neutral-900">{atividade.tema}</p>
                    <p className="mt-0.5 text-sm text-neutral-500">
                      {atividade.disciplina} · {atividade.serie} · {RESUMO_TIPO[atividade.tipo] ?? atividade.tipo}
                    </p>
                  </div>
                  <span className="text-sm text-neutral-400">
                    {atividade.criadaEm.toLocaleDateString("pt-BR")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
