import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { ResultadosMatematicaCliente } from "./ResultadosMatematicaCliente";

// Relatório de Desempenho do 9º ano no formato do SISPAI, mas só com o que
// os alunos fizeram DENTRO do ItaGame a partir desta data (Simulados/Cabo de
// Guerra SPAECE na Sala Ao Vivo + missões das trilhas SPAECE). Os
// resultados oficiais antigos (SISPAI I/II, Diagnóstico Bimestral) continuam
// no banco, mas saíram da tela por pedido do Genezio — serviram só de modelo.
const INICIO_RELATORIO = new Date("2026-10-02T08:00:00-03:00");

// Dado sensível do CEITEC (nomes reais de alunos) — só o dono da plataforma
// e os professores colaboradores da aba SPAECE dele.
export default async function ResultadosSispaiMatematica({
  searchParams,
}: {
  searchParams: Promise<{ disciplina?: string }>;
}) {
  const { disciplina: disciplinaParam } = await searchParams;
  const ehPortugues = disciplinaParam === "portugues";
  const nomeDisciplina = ehPortugues ? "Língua Portuguesa" : "Matemática";
  const sessao = await exigirAssinaturaAtiva();
  if (sessao.papel !== "ita_owner" && !sessao.colaborador) {
    notFound();
  }

  const [turmas, respostas, progressos, missoesPorTrilha] = await Promise.all([
    prisma.turma.findMany({
      where: { professorId: sessao.userId, nome: { startsWith: "9º Ano" } },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, alunos: { select: { id: true, nome: true }, orderBy: { nome: "asc" } } },
    }),
    // Só resposta de aluno de verdade (entrou com turma + PIN), nunca apelido livre.
    prisma.respostaParticipante.findMany({
      where: {
        respondidaEm: { gte: INICIO_RELATORIO },
        participante: {
          alunoId: { not: null },
          sala: {
            atividade: {
              professorId: sessao.userId,
              disciplina: nomeDisciplina,
              tema: { contains: "(SPAECE)" },
            },
          },
        },
      },
      select: {
        correta: true,
        participante: { select: { alunoId: true, sala: { select: { atividade: { select: { id: true, tema: true } } } } } },
      },
    }),
    prisma.progressoAluno.findMany({
      where: {
        status: "concluida",
        concluidaEm: { gte: INICIO_RELATORIO },
        missao: { trilha: { professorId: sessao.userId, eixoSpaece: { not: null } } },
      },
      select: { alunoId: true, xpGanho: true },
    }),
    prisma.trilha.findMany({
      where: { professorId: sessao.userId, eixoSpaece: { not: null }, status: "publicada" },
      select: { turmaId: true, _count: { select: { missoes: true } } },
    }),
  ]);

  const missoesDaTurma = new Map<string, number>();
  for (const t of missoesPorTrilha) {
    missoesDaTurma.set(t.turmaId, (missoesDaTurma.get(t.turmaId) ?? 0) + t._count.missoes);
  }

  const turmaDoAluno = new Map<string, string>();
  for (const turma of turmas) for (const aluno of turma.alunos) turmaDoAluno.set(aluno.id, turma.nome);

  // Avaliação separada por turma, pro filtro de turma valer também aqui.
  type Soma = { corretas: number; total: number };
  const respostasPorAluno = new Map<string, Soma>();
  const porAtividade = new Map<string, { tema: string; turma: string; alunos: Set<string> } & Soma>();
  for (const r of respostas) {
    const alunoId = r.participante.alunoId;
    const turmaNome = alunoId ? turmaDoAluno.get(alunoId) : undefined;
    if (!alunoId || !turmaNome) continue;
    const somaAluno = respostasPorAluno.get(alunoId) ?? { corretas: 0, total: 0 };
    somaAluno.total += 1;
    if (r.correta) somaAluno.corretas += 1;
    respostasPorAluno.set(alunoId, somaAluno);

    const atividade = r.participante.sala.atividade;
    const chave = `${atividade.id}|${turmaNome}`;
    const somaAtividade = porAtividade.get(chave) ?? {
      tema: atividade.tema,
      turma: turmaNome,
      alunos: new Set<string>(),
      corretas: 0,
      total: 0,
    };
    somaAtividade.total += 1;
    if (r.correta) somaAtividade.corretas += 1;
    somaAtividade.alunos.add(alunoId);
    porAtividade.set(chave, somaAtividade);
  }

  const trilhaPorAluno = new Map<string, { missoes: number; xp: number }>();
  for (const p of progressos) {
    const atual = trilhaPorAluno.get(p.alunoId) ?? { missoes: 0, xp: 0 };
    atual.missoes += 1;
    atual.xp += p.xpGanho;
    trilhaPorAluno.set(p.alunoId, atual);
  }

  const alunos = turmas.flatMap((turma) =>
    turma.alunos.map((aluno) => {
      const soma = respostasPorAluno.get(aluno.id);
      const trilha = trilhaPorAluno.get(aluno.id);
      return {
        alunoId: aluno.id,
        nome: aluno.nome,
        turma: turma.nome,
        corretas: soma?.corretas ?? 0,
        total: soma?.total ?? 0,
        percentual: soma ? (soma.corretas / soma.total) * 100 : null,
        missoesConcluidas: trilha?.missoes ?? 0,
        missoesTotal: missoesDaTurma.get(turma.id) ?? 0,
        xp: trilha?.xp ?? 0,
      };
    })
  );

  const avaliacoes = Array.from(porAtividade.values())
    .map((a) => ({ tema: a.tema.replace(/CEITEC\s*/gi, "").replace(/\s+/g, " ").trim(), turma: a.turma, alunos: a.alunos.size, corretas: a.corretas, total: a.total }))
    .sort((a, b) => a.tema.localeCompare(b.tema) || a.turma.localeCompare(b.turma));

  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link href="/painel/spaece" className="text-sm font-semibold text-[#0d6efd] hover:underline">
          ← Voltar ao SPAECE 9º ano
        </Link>

        {/* Cabeçalho no mesmo formato do "Relatório de Desempenho Consolidado" do SISPAI */}
        <div className="mt-6 border-b-2 border-[#0d6efd] pb-4 text-center">
          <h1 className="text-2xl font-bold text-[#0d6efd] sm:text-3xl">Relatório de Desempenho Consolidado</h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-neutral-500">Teste SPAECE</p>
        </div>

        <div className="mt-4 flex justify-center gap-2 text-sm font-semibold">
          <Link
            href="/painel/spaece/resultados-matematica"
            className={`rounded-full px-4 py-1.5 ${!ehPortugues ? "bg-[#0d6efd] text-white" : "border border-neutral-300 text-neutral-700"}`}
          >
            Matemática
          </Link>
          <Link
            href="/painel/spaece/resultados-matematica?disciplina=portugues"
            className={`rounded-full px-4 py-1.5 ${ehPortugues ? "bg-[#0d6efd] text-white" : "border border-neutral-300 text-neutral-700"}`}
          >
            Língua Portuguesa
          </Link>
        </div>

        <div className="mt-6 rounded-md border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-800">
          <p className="border-b border-neutral-200 pb-2">
            <strong>Teste:</strong>{" "}
            <span className="font-bold text-[#0d6efd]">Teste SPAECE</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-x-8 gap-y-1">
            <p>
              <strong>Avaliação:</strong> Simulados e Trilhas SPAECE no ItaGame
            </p>
            <p>
              <strong>Série:</strong> 9º ANO
            </p>
            <p>
              <strong>Disciplina:</strong> {nomeDisciplina}
            </p>
            <p>
              <strong>Desde:</strong> {INICIO_RELATORIO.toLocaleDateString("pt-BR", { timeZone: "America/Fortaleza" })}
            </p>
          </div>
        </div>

        <ResultadosMatematicaCliente
          turmas={turmas.map((t) => t.nome)}
          alunos={alunos}
          avaliacoes={avaliacoes}
        />
      </div>
    </main>
  );
}
