import Link from "next/link";
import { getUsuarioAtual } from "@/lib/acessoDados";
import { sair } from "@/app/actions/autenticacao";
import { prisma } from "@/lib/prisma";

const RESUMO_TIPO: Record<string, { rotulo: string; icone: string }> = {
  quiz: { rotulo: "Quiz", icone: "❓" },
  verdadeiro_falso: { rotulo: "Verdadeiro ou falso", icone: "⚖️" },
  completar_frase: { rotulo: "Completar frase", icone: "✏️" },
  caca_palavras: { rotulo: "Caça-palavras", icone: "🔤" },
  associar_colunas: { rotulo: "Associar colunas", icone: "🔗" },
  apresentacao: { rotulo: "Apresentação", icone: "📽️" },
};

export default async function PaginaPainel() {
  const usuario = await getUsuarioAtual();

  const [atividadesRecentes, totalAtividades, totalSalas, totalRedacoes, totalTurmas, assinatura] =
    usuario
      ? await Promise.all([
          prisma.atividade.findMany({
            where: { professorId: usuario.id },
            orderBy: { criadaEm: "desc" },
            take: 5,
          }),
          prisma.atividade.count({ where: { professorId: usuario.id } }),
          prisma.salaAoVivo.count({ where: { atividade: { professorId: usuario.id } } }),
          prisma.correcaoRedacao.count({ where: { professorId: usuario.id } }),
          prisma.turma.count({ where: { professorId: usuario.id } }),
          prisma.assinatura.findUnique({ where: { professorId: usuario.id } }),
        ])
      : [[], 0, 0, 0, 0, null];

  const proAtivo =
    assinatura?.plano === "pro" && assinatura.status === "ativa" && assinatura.validade! > new Date();

  const iniciais = (usuario?.nome ?? "P")
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join("");

  return (
    <main className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-[#1a3fd4]">
            ItaGame
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/painel/assinatura"
              className={`hidden rounded-full px-3 py-1 text-xs font-bold sm:inline-flex ${
                proAtivo
                  ? "bg-[#1a3fd4]/10 text-[#1a3fd4]"
                  : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
              }`}
            >
              {proAtivo ? "👑 Pro" : "Plano gratuito"}
            </Link>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a3fd4] text-sm font-bold text-white">
              {iniciais}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-neutral-900">{usuario?.nome ?? "Professor"}</p>
              <p className="text-xs text-neutral-500">{usuario?.email}</p>
            </div>
            <form action={sair}>
              <button
                type="submit"
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-100"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a3fd4] to-[#0e2694] p-8 text-white shadow-sm">
          <p className="text-sm font-medium text-white/70">Bem-vindo de volta</p>
          <h1 className="mt-1 text-2xl font-extrabold">Olá, {usuario?.nome ?? "professor"} 👋</h1>
          <p className="mt-2 max-w-md text-sm text-white/80">
            Gere uma atividade nova com IA ou inicie uma sala ao vivo com uma atividade que
            você já criou.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/painel/atividades/nova"
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-[#1a3fd4] transition hover:brightness-95"
            >
              ✨ Gerar atividade com IA
            </Link>
            <Link
              href="/painel/atividades"
              className="rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              Ver minhas atividades
            </Link>
            <Link
              href="/painel/redacoes/nova"
              className="rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              ✍️ Corrigir redação
            </Link>
            <Link
              href="/painel/turmas/nova"
              className="rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              🏫 Nova turma
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <p className="text-2xl">📚</p>
            <p className="mt-2 text-2xl font-extrabold text-neutral-900">{totalAtividades}</p>
            <p className="text-sm text-neutral-500">
              {totalAtividades === 1 ? "atividade criada" : "atividades criadas"}
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <p className="text-2xl">🎮</p>
            <p className="mt-2 text-2xl font-extrabold text-neutral-900">{totalSalas}</p>
            <p className="text-sm text-neutral-500">
              {totalSalas === 1 ? "sala ao vivo realizada" : "salas ao vivo realizadas"}
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <p className="text-2xl">✍️</p>
            <p className="mt-2 text-2xl font-extrabold text-neutral-900">{totalRedacoes}</p>
            <p className="text-sm text-neutral-500">
              {totalRedacoes === 1 ? "redação corrigida" : "redações corrigidas"}
            </p>
          </div>
          <Link
            href="/painel/turmas"
            className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-[#1a3fd4] hover:bg-[#1a3fd4]/5"
          >
            <p className="text-2xl">🏫</p>
            <p className="mt-2 text-2xl font-extrabold text-neutral-900">{totalTurmas}</p>
            <p className="text-sm text-neutral-500">{totalTurmas === 1 ? "turma" : "turmas"}</p>
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <p className="font-bold text-neutral-900">Atividades recentes</p>
            <Link href="/painel/atividades" className="text-sm font-semibold text-[#1a3fd4]">
              Ver todas →
            </Link>
          </div>

          {atividadesRecentes.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-neutral-300 p-8 text-center">
              <p className="text-3xl">✨</p>
              <p className="mt-2 text-sm font-semibold text-neutral-700">
                Você ainda não gerou nenhuma atividade
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                Crie a primeira em menos de um minuto.
              </p>
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {atividadesRecentes.map((atividade) => {
                const info = RESUMO_TIPO[atividade.tipo] ?? { rotulo: atividade.tipo, icone: "📄" };
                return (
                  <li key={atividade.id}>
                    <Link
                      href={`/painel/atividades/${atividade.id}`}
                      className="flex items-center gap-4 rounded-xl border border-neutral-200 px-4 py-3 transition hover:border-[#1a3fd4] hover:bg-[#1a3fd4]/5"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1a3fd4]/10 text-lg">
                        {info.icone}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-neutral-800">
                          {atividade.tema}
                        </span>
                        <span className="block text-sm text-neutral-500">
                          {atividade.disciplina} · {atividade.serie} · {info.rotulo}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
