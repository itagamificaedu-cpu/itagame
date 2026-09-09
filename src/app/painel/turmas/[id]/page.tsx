import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { excluirTurma, removerAluno } from "@/app/actions/turmas";
import FormularioAdicionarAluno from "./FormularioAdicionarAluno";
import GerarPinCliente from "./GerarPinCliente";
import CopiarLinkTrilhaCliente from "./CopiarLinkTrilhaCliente";

export default async function PaginaDetalheTurma({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sessao = await exigirAssinaturaAtiva();

  const turma = await prisma.turma.findUnique({
    where: { id },
    include: { alunos: { orderBy: { nome: "asc" } } },
  });

  if (!turma || turma.professorId !== sessao.userId) {
    notFound();
  }

  // Pontuação acumulada por aluno em jogos ao vivo (Cabo de Guerra + Salas ao
  // Vivo) — só existe pra quem entrou pelo nome da turma + PIN, não pra quem
  // digitou apelido avulso. Ver comentário em ParticipanteCaboGuerra.alunoId.
  const alunoIds = turma.alunos.map((a) => a.id);
  const [pontosCaboGuerra, pontosSalas] = await Promise.all([
    prisma.participanteCaboGuerra.groupBy({
      by: ["alunoId"],
      where: { alunoId: { in: alunoIds } },
      _sum: { pontuacao: true },
      _count: { _all: true },
    }),
    prisma.participanteSala.groupBy({
      by: ["alunoId"],
      where: { alunoId: { in: alunoIds } },
      _sum: { pontuacao: true },
      _count: { _all: true },
    }),
  ]);

  const pontuacaoPorAluno = new Map<string, { pontos: number; jogos: number }>();
  for (const linha of [...pontosCaboGuerra, ...pontosSalas]) {
    if (!linha.alunoId) continue;
    const atual = pontuacaoPorAluno.get(linha.alunoId) ?? { pontos: 0, jogos: 0 };
    atual.pontos += linha._sum.pontuacao ?? 0;
    atual.jogos += linha._count._all;
    pontuacaoPorAluno.set(linha.alunoId, atual);
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/painel/turmas" className="text-sm font-semibold text-[#1a3fd4]">
          ← Minhas turmas
        </Link>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{turma.nome}</h1>
            <p className="mt-1 text-sm text-neutral-500">
              {turma.serie} · {turma.alunos.length}{" "}
              {turma.alunos.length === 1 ? "aluno" : "alunos"}
            </p>
          </div>
          <form action={excluirTurma.bind(null, turma.id)}>
            <button
              type="submit"
              className="whitespace-nowrap rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
            >
              Excluir turma
            </button>
          </form>
        </div>

        <div className="mt-8 rounded-2xl border border-[#1a3fd4]/20 bg-[#1a3fd4]/5 p-6">
          <p className="font-bold text-neutral-900">🧭 Acesso às Trilhas</p>
          <p className="mt-1 text-sm text-neutral-600">
            Pra entrar nas trilhas dessa turma, o aluno usa este código junto com o nome dele e o
            PIN de 4 dígitos (gere um pra cada aluno na lista abaixo).
          </p>
          <p className="mt-3 text-2xl font-extrabold tracking-widest text-[#1a3fd4]">
            {turma.codigoAcesso ?? "—"}
          </p>
          <CopiarLinkTrilhaCliente />
        </div>

        <Link
          href={`/painel/turmas/${turma.id}/prontuario`}
          className="mt-6 flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-[#1a3fd4] hover:bg-[#1a3fd4]/5"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1a3fd4]/10 text-xl">
            🩺
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-neutral-900">Simulador de Prontuário Eletrônico</p>
            <p className="mt-0.5 text-sm text-neutral-500">Casos clínicos + registro estruturado de enfermagem</p>
          </div>
        </Link>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="font-bold text-neutral-900">Adicionar aluno</p>
          <div className="mt-3">
            <FormularioAdicionarAluno turmaId={turma.id} />
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="font-bold text-neutral-900">Lista de alunos</p>

          {turma.alunos.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-500">Nenhum aluno cadastrado ainda.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {turma.alunos.map((aluno) => {
                const pontuacao = pontuacaoPorAluno.get(aluno.id);
                return (
                <li
                  key={aluno.id}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-2"
                >
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-neutral-800">{aluno.nome}</span>
                    {pontuacao && (
                      <p className="text-xs text-neutral-400">
                        🏆 {pontuacao.pontos} pts em {pontuacao.jogos}{" "}
                        {pontuacao.jogos === 1 ? "jogo" : "jogos"}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <GerarPinCliente
                      turmaId={turma.id}
                      alunoId={aluno.id}
                      temPin={aluno.pinHash !== null}
                    />
                    <form action={removerAluno.bind(null, turma.id, aluno.id)}>
                      <button
                        type="submit"
                        className="text-xs font-semibold text-red-500 hover:text-red-700"
                      >
                        Remover
                      </button>
                    </form>
                  </div>
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
