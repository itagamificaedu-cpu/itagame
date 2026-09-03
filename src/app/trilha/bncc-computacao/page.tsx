import Link from "next/link";
import { verificarSessaoAluno } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { EIXOS_BNCC_COMPUTACAO } from "@/lib/bnccComputacao";

const NOME_BADGE_MESTRE_BNCC = "Mestre da Computação";

// Vitrine da aba BNCC Computação pro ALUNO — mesma ideia dos "3 eixos" do
// hub do professor (src/app/painel/bncc-computacao/page.tsx), só que em
// linguagem de aluno ("3 mundos") e com progresso pessoal em vez de botão
// de gerar trilha. Cosmético/motivacional só: as trilhas e o progresso são
// os mesmos de sempre (ProgressoAluno), aqui é só uma vitrine organizada
// por eixo. O badge especial é concedido automaticamente em
// verificarConquistaBnccComputacao (src/app/actions/missoes.ts).
export default async function PaginaBnccComputacaoAluno() {
  const aluno = await verificarSessaoAluno();

  const trilhas = await prisma.trilha.findMany({
    where: { turmaId: aluno.turmaId, status: "publicada", eixoBnccComputacao: { not: null } },
    include: { missoes: { select: { id: true } } },
    orderBy: { criadaEm: "asc" },
  });

  const progressos = await prisma.progressoAluno.findMany({
    where: {
      alunoId: aluno.id,
      status: "concluida",
      missao: { trilhaId: { in: trilhas.map((t) => t.id) } },
    },
    select: { missaoId: true },
  });
  const missoesConcluidasIds = new Set(progressos.map((p) => p.missaoId));

  const badgeConquistado = await prisma.badgeConcedida.findFirst({
    where: { alunoId: aluno.id, badge: { nome: NOME_BADGE_MESTRE_BNCC } },
  });

  function progressoDaTrilha(trilha: (typeof trilhas)[number]) {
    const total = trilha.missoes.length;
    const concluidas = trilha.missoes.filter((m) => missoesConcluidasIds.has(m.id)).length;
    return { total, concluidas, completa: total > 0 && concluidas === total };
  }

  const eixosComDados = EIXOS_BNCC_COMPUTACAO.map((eixo) => {
    const trilhasDoEixo = trilhas.filter((t) => t.eixoBnccComputacao === eixo.chave);
    const completas = trilhasDoEixo.filter((t) => progressoDaTrilha(t).completa).length;
    return { ...eixo, trilhasDoEixo, completas };
  });

  const mundosCompletos = eixosComDados.filter((e) => e.trilhasDoEixo.length > 0 && e.completas > 0).length;

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/trilha" className="text-sm font-semibold text-[#1a3fd4]">
          ← Minhas trilhas
        </Link>

        <div className="mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a3fd4] to-[#0e2694] p-6 text-white shadow-sm">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
            🎮 Meus Desafios de Tecnologia
          </p>
          <p className="mt-3 text-sm text-white/85">
            Aqui você vira um verdadeiro programador, detetive digital e cidadão da internet!
            Complete pelo menos uma trilha de cada mundo abaixo pra desbloquear o emblema especial.
          </p>
        </div>

        <div
          className={`mt-5 flex items-center gap-3 rounded-2xl border-2 p-4 ${
            badgeConquistado ? "border-[#f59e0b] bg-[#f59e0b]/10" : "border-dashed border-neutral-300 bg-white"
          }`}
        >
          <span className="text-3xl">{badgeConquistado ? "🏆" : "🔒"}</span>
          <div>
            <p className="font-extrabold text-neutral-900">
              {badgeConquistado ? "Mestre da Computação — conquistado!" : "Mestre da Computação"}
            </p>
            <p className="text-sm text-neutral-500">
              {badgeConquistado
                ? "Você completou pelo menos uma trilha de cada um dos 3 mundos. Parabéns!"
                : `Complete 1 trilha de cada mundo pra desbloquear (${mundosCompletos}/3 até agora).`}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {eixosComDados.map((eixo) => (
            <div key={eixo.chave} className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: `${eixo.cor}33` }}>
              <div className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                  style={{ backgroundColor: `${eixo.cor}15` }}
                >
                  {eixo.icone}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold text-neutral-900">{eixo.nome}</p>
                  <p className="text-xs text-neutral-500">
                    {eixo.trilhasDoEixo.length === 0
                      ? "Nenhuma trilha publicada ainda"
                      : `${eixo.completas} de ${eixo.trilhasDoEixo.length} trilhas completas`}
                  </p>
                </div>
              </div>

              {eixo.trilhasDoEixo.length > 0 && (
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(eixo.completas / eixo.trilhasDoEixo.length) * 100}%`,
                      backgroundColor: eixo.cor,
                    }}
                  />
                </div>
              )}

              {eixo.trilhasDoEixo.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {eixo.trilhasDoEixo.map((trilha) => {
                    const { total, concluidas, completa } = progressoDaTrilha(trilha);
                    return (
                      <li key={trilha.id}>
                        <Link
                          href={`/trilha/${trilha.id}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 px-4 py-3 transition hover:bg-neutral-50"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-neutral-800">
                              {trilha.nome}
                            </span>
                            <span className="block text-xs text-neutral-500">
                              {concluidas}/{total} missões concluídas
                            </span>
                          </span>
                          <span
                            className="shrink-0 rounded-full px-3 py-1 text-xs font-bold"
                            style={{ backgroundColor: `${eixo.cor}15`, color: eixo.cor }}
                          >
                            {completa ? "Concluída 🎉" : concluidas > 0 ? "Continuar" : "Começar"}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
