import Link from "next/link";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { EIXOS_BNCC_COMPUTACAO } from "@/lib/bnccComputacao";
import { MODELOS_BNCC_COMPUTACAO } from "@/lib/modelosBnccComputacao";

// Hub da aba "BNCC Computação" — carro-chefe da plataforma pro ano letivo de
// 2027 (primeiro ciclo do PNLD com livro próprio de Educação Digital e
// Midiática). Reaproveita o motor de Trilhas já existente: aqui só
// organizamos por eixo oficial e damos um atalho de geração com IA já
// travada em cada eixo — nenhuma mecânica nova de gamificação, só uma
// vitrine dedicada.
export default async function PaginaBnccComputacao() {
  const sessao = await exigirAssinaturaAtiva();

  const trilhas = await prisma.trilha.findMany({
    where: { professorId: sessao.userId, eixoBnccComputacao: { not: null } },
    include: { turma: true, _count: { select: { missoes: true } } },
    orderBy: { criadaEm: "desc" },
  });

  const trilhasPorEixo = new Map(EIXOS_BNCC_COMPUTACAO.map((eixo) => [eixo.chave, trilhas.filter((t) => t.eixoBnccComputacao === eixo.chave)]));

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/painel" className="text-sm font-semibold text-[#1a3fd4]">
          ← Voltar ao painel
        </Link>

        <div className="mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a3fd4] to-[#0e2694] p-8 text-white shadow-sm">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
            🎯 Novidade — obrigatória desde 2026
          </p>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">BNCC Computação</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/85">
            A Computação virou complemento oficial da BNCC pelo Parecer CNE/CEB nº 2/2022 e pela
            Resolução CNE/CEB nº 1/2022 — implementação obrigatória em toda escola do país desde
            2026. O PNLD 2027 (Anos Iniciais) já vai trazer livro próprio de Educação Digital e
            Midiática. Aqui você monta trilhas gamificadas prontas para os 3 eixos oficiais, geradas
            com IA em minutos.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {EIXOS_BNCC_COMPUTACAO.map((eixo) => {
            const trilhasDoEixo = trilhasPorEixo.get(eixo.chave) ?? [];
            return (
              <div
                key={eixo.chave}
                className="flex flex-col rounded-2xl border bg-white p-6 shadow-sm"
                style={{ borderColor: `${eixo.cor}33` }}
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                  style={{ backgroundColor: `${eixo.cor}15` }}
                >
                  {eixo.icone}
                </span>
                <h2 className="mt-4 font-extrabold text-neutral-900">{eixo.nome}</h2>
                <p className="mt-1 text-sm text-neutral-500">{eixo.resumo}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {eixo.subconceitos.map((sub) => (
                    <span
                      key={sub}
                      className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                      style={{ backgroundColor: `${eixo.cor}15`, color: eixo.cor }}
                    >
                      {sub}
                    </span>
                  ))}
                </div>

                {MODELOS_BNCC_COMPUTACAO.filter((modelo) => modelo.eixo === eixo.chave).map((modelo) => (
                  <Link
                    key={modelo.id}
                    href={`/painel/trilhas/usar-modelo/${modelo.id}`}
                    className="mt-4 flex items-start gap-2 rounded-xl border p-3 transition hover:brightness-95"
                    style={{ borderColor: `${eixo.cor}33`, backgroundColor: `${eixo.cor}0a` }}
                  >
                    <span className="text-base">⚡</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-neutral-800">{modelo.nome}</span>
                      <span className="block text-xs text-neutral-500">
                        Pronta · {modelo.missoes.length} desafios · adicionar em 1 clique
                      </span>
                    </span>
                  </Link>
                ))}

                <Link
                  href={`/painel/trilhas/gerar-ia?eixo=${eixo.chave}`}
                  className="mt-3 rounded-lg border py-2 text-center text-sm font-bold transition hover:brightness-95"
                  style={{ borderColor: eixo.cor, color: eixo.cor }}
                >
                  ✨ Ou gerar uma nova com IA
                </Link>

                {trilhasDoEixo.length > 0 && (
                  <ul className="mt-4 space-y-2 border-t border-neutral-100 pt-4">
                    {trilhasDoEixo.map((trilha) => (
                      <li key={trilha.id}>
                        <Link
                          href={`/painel/trilhas/${trilha.id}`}
                          className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-neutral-50"
                        >
                          <span className="min-w-0 truncate font-semibold text-neutral-800">{trilha.nome}</span>
                          <span className="shrink-0 text-xs text-neutral-400">
                            {trilha.status === "publicada" ? "Publicada" : "Rascunho"}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {trilhas.length === 0 && (
          <p className="mt-8 text-center text-sm text-neutral-500">
            Nenhuma trilha de BNCC Computação criada ainda — escolha um eixo acima pra gerar a
            primeira com IA.
          </p>
        )}
      </div>
    </main>
  );
}
