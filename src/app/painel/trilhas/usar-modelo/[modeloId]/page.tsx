import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { eixoBnccPorChave } from "@/lib/bnccComputacao";
import { modeloBnccPorId } from "@/lib/modelosBnccComputacao";
import FormularioUsarModelo from "./FormularioUsarModelo";

const ICONE_TIPO: Record<string, string> = {
  video: "🎬",
  quiz: "❓",
  pratica: "🛠️",
  projeto: "🚀",
  leitura: "📖",
  desafio: "🏆",
};

export default async function PaginaUsarModelo({
  params,
}: {
  params: Promise<{ modeloId: string }>;
}) {
  const sessao = await exigirAssinaturaAtiva();
  const { modeloId } = await params;
  const modelo = modeloBnccPorId(modeloId);
  if (!modelo) notFound();

  const eixo = eixoBnccPorChave(modelo.eixo)!;

  const turmas = await prisma.turma.findMany({
    where: { professorId: sessao.userId },
    orderBy: { nome: "asc" },
  });

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/painel/bncc-computacao" className="text-sm font-semibold" style={{ color: eixo.cor }}>
          ← BNCC Computação
        </Link>

        <div className="mt-4 flex items-center gap-3">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
            style={{ backgroundColor: `${eixo.cor}15` }}
          >
            {eixo.icone}
          </span>
          <div>
            <p className="text-xs font-bold" style={{ color: eixo.cor }}>
              {eixo.nome} · Trilha pronta
            </p>
            <h1 className="text-xl font-extrabold text-neutral-900">{modelo.nome}</h1>
          </div>
        </div>

        <p className="mt-3 text-sm text-neutral-600">{modelo.descricao}</p>
        <p className="mt-1 text-xs text-neutral-400">Sugerido para: {modelo.nivelSugerido}</p>

        <ul className="mt-6 space-y-2">
          {modelo.missoes.map((missao, indice) => (
            <li
              key={missao.titulo}
              className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-sm font-bold text-neutral-500">
                {indice + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-neutral-900">
                  {ICONE_TIPO[missao.tipoAtividade]} {missao.titulo}
                </p>
                <p className="mt-0.5 text-sm text-neutral-500">{missao.descricao}</p>
                <p className="mt-1 text-xs font-bold text-neutral-400">{missao.xp} XP</p>
              </div>
            </li>
          ))}
        </ul>

        {turmas.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
            <p className="text-3xl">🏫</p>
            <p className="mt-2 font-semibold text-neutral-700">Crie uma turma primeiro</p>
            <Link
              href="/painel/turmas/nova"
              className="mt-4 inline-block rounded-lg bg-[#1a3fd4] px-4 py-2 text-sm font-bold text-white hover:brightness-110"
            >
              + Nova turma
            </Link>
          </div>
        ) : (
          <FormularioUsarModelo modeloId={modelo.id} turmas={turmas} cor={eixo.cor} />
        )}

        <p className="mt-4 text-center text-xs text-neutral-400">
          A trilha entra como rascunho na turma escolhida — você pode revisar, editar ou remover
          missões antes de publicar pros alunos.
        </p>
      </div>
    </main>
  );
}
