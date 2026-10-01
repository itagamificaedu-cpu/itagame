import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { VERDE_SPAECE } from "@/lib/spaece";
import { ResultadosMatematicaCliente } from "./ResultadosMatematicaCliente";

// Dado sensível e específico do CEITEC (nomes reais de alunos) — só o dono
// da plataforma vê por enquanto, igual ao padrão já usado em
// /painel/admin/formacao-ia. Ver feedback_teste_admin na memória: testar
// tudo no perfil do Genezio antes de decidir se libera pra outras escolas.
export default async function ResultadosSispaiMatematica() {
  const sessao = await exigirAssinaturaAtiva();
  if (sessao.papel !== "ita_owner") {
    notFound();
  }

  const [resultados, habilidades, diagnosticosBimestrais, habilidadesBimestrais, respostasSimulado] = await Promise.all([
    prisma.resultadoSispaiMatematica.findMany({ where: { professorId: sessao.userId } }),
    prisma.habilidadeSispaiMatematica.findMany({
      where: { professorId: sessao.userId },
      orderBy: { percentualAcertoGeral: "asc" },
    }),
    prisma.diagnosticoBimestralMatematica.findMany({ where: { professorId: sessao.userId } }),
    prisma.habilidadeBimestralMatematica.findMany({
      where: { professorId: sessao.userId },
      orderBy: [{ habilidade: "asc" }, { bimestre: "asc" }],
    }),
    // Desempenho nos Simulados/Cabo de Guerra SPAECE jogados dentro do
    // próprio ItaGame (Sala Ao Vivo) — dado NOSSO, não oficial da SME. Só
    // conta resposta de participante ligado a um Aluno de verdade (turma +
    // PIN), nunca apelido livre, pra poder agregar por aluno de fato.
    prisma.respostaParticipante.findMany({
      where: {
        participante: {
          alunoId: { not: null },
          sala: {
            atividade: {
              professorId: sessao.userId,
              disciplina: "Matemática",
              tema: { contains: "(SPAECE)" },
            },
          },
        },
      },
      select: {
        correta: true,
        participante: {
          select: {
            alunoId: true,
            aluno: { select: { nome: true, turma: { select: { nome: true } } } },
          },
        },
      },
    }),
  ]);

  if (resultados.length === 0) {
    return (
      <main className="min-h-screen bg-neutral-50 px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <Link href="/painel/spaece" className="text-sm font-semibold" style={{ color: VERDE_SPAECE }}>
            ← Voltar ao SPAECE 9º ano
          </Link>
          <p className="mt-6 text-sm text-neutral-500">
            Nenhum resultado do SISPAI importado ainda para esta conta.
          </p>
        </div>
      </main>
    );
  }

  type Rodada = { pct: number; tri: number | null; nivel: string | null; padrao: string | null };
  type Combinado = { turma: string; nome: string; r1: Rodada | null; r2: Rodada | null };

  const porAluno = new Map<string, Combinado>();
  for (const r of resultados) {
    const chave = `${r.turma}|${r.nomeAluno}`;
    const atual = porAluno.get(chave) ?? { turma: r.turma, nome: r.nomeAluno, r1: null, r2: null };
    const dados: Rodada = {
      pct: Number(r.percentualAcerto),
      tri: r.triScore ? Number(r.triScore) : null,
      nivel: r.nivel,
      padrao: r.padrao,
    };
    if (r.rodada === 1) atual.r1 = dados;
    else atual.r2 = dados;
    porAluno.set(chave, atual);
  }

  const alunos = Array.from(porAluno.values());
  // A rodada mais recente (2) manda na classificação de "nota baixa" — reflete
  // melhor a situação atual do aluno do que o resultado da rodada anterior.
  const atual = (a: Combinado) => a.r2 ?? a.r1;
  const classificados = alunos.filter((a) => atual(a)?.padrao);
  const notaBaixa = classificados.filter((a) => atual(a)?.padrao === "abaixo_do_basico" || atual(a)?.padrao === "basico");

  const mediaRodada1 =
    alunos.filter((a) => a.r1).reduce((s, a) => s + (a.r1?.pct ?? 0), 0) / Math.max(1, alunos.filter((a) => a.r1).length);
  const mediaRodada2 =
    alunos.filter((a) => a.r2).reduce((s, a) => s + (a.r2?.pct ?? 0), 0) / Math.max(1, alunos.filter((a) => a.r2).length);

  const turmas = Array.from(new Set(alunos.map((a) => a.turma))).sort();
  const habilidadesPorRodada = [1, 2].map((rodada) => ({
    rodada,
    itens: habilidades
      .filter((h) => h.rodada === rodada)
      .map((h) => ({
        id: h.id,
        trilha: h.trilha,
        codigoSaeb: h.codigoSaeb,
        codigoBncc: h.codigoBncc,
        descricaoHabilidade: h.descricaoHabilidade,
        percentualAcertoGeral: Number(h.percentualAcertoGeral),
      })),
  }));

  // Diagnóstico Bimestral — evolução do 9º ano inteiro nas 8 habilidades
  // básicas, bimestre a bimestre.
  const habilidadesUnicas = Array.from(new Set(habilidadesBimestrais.map((h) => h.habilidade)));
  const evolucaoBimestral = habilidadesUnicas
    .map((habilidade) => ({
      habilidade,
      porBimestre: habilidadesBimestrais
        .filter((h) => h.habilidade === habilidade)
        .map((h) => ({ bimestre: h.bimestre, percentualAcertoGeral: Number(h.percentualAcertoGeral) })),
    }))
    .sort((a, b) => {
      const ultimoA = a.porBimestre.at(-1);
      const ultimoB = b.porBimestre.at(-1);
      return (ultimoA?.percentualAcertoGeral ?? 100) - (ultimoB?.percentualAcertoGeral ?? 100);
    });

  // Pontos de atenção por aluno, ordenados pela quantidade de habilidades
  // críticas ("não avançou" pesa mais que "avançou pouco").
  type PontoAtencao = { habilidade: string; situacao: string };
  type AlunoCritico = { nome: string; matricula: string; turma: string; pontos: PontoAtencao[]; peso: number };
  const criticosPorAlunoMapa = new Map<string, AlunoCritico>();
  for (const d of diagnosticosBimestrais) {
    const chave = `${d.turma}|${d.matricula}`;
    const item = criticosPorAlunoMapa.get(chave) ?? {
      nome: d.nomeAluno,
      matricula: d.matricula,
      turma: d.turma,
      pontos: [],
      peso: 0,
    };
    item.pontos.push({ habilidade: d.habilidade, situacao: d.situacao });
    item.peso += d.situacao === "nao_avancou" ? 2 : 1;
    criticosPorAlunoMapa.set(chave, item);
  }
  const criticosPorAluno = Array.from(criticosPorAlunoMapa.values());
  const turmasComCriticos = Array.from(new Set(diagnosticosBimestrais.map((d) => d.turma))).sort();
  const bimestreDiagnostico = diagnosticosBimestrais[0]?.bimestre ?? null;

  // Agrega as respostas do Simulado/Cabo de Guerra por aluno (soma de todas
  // as salas já jogadas) pra virar um percentual de acerto por aluno.
  type DesempenhoSimuladoAluno = { alunoId: string; nome: string; turma: string; corretas: number; total: number };
  const desempenhoSimuladoMapa = new Map<string, DesempenhoSimuladoAluno>();
  for (const r of respostasSimulado) {
    const alunoId = r.participante.alunoId;
    if (!alunoId || !r.participante.aluno) continue;
    const item = desempenhoSimuladoMapa.get(alunoId) ?? {
      alunoId,
      nome: r.participante.aluno.nome,
      turma: r.participante.aluno.turma.nome,
      corretas: 0,
      total: 0,
    };
    item.total += 1;
    if (r.correta) item.corretas += 1;
    desempenhoSimuladoMapa.set(alunoId, item);
  }
  const desempenhoSimulados = Array.from(desempenhoSimuladoMapa.values())
    .map((a) => ({ ...a, percentual: (a.corretas / a.total) * 100 }))
    .sort((a, b) => a.percentual - b.percentual);

  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link href="/painel/spaece" className="text-sm font-semibold text-[#0d6efd] hover:underline">
          ← Voltar ao SPAECE 9º ano
        </Link>

        {/* Cabeçalho no mesmo formato do "Relatório de Desempenho Consolidado" do SISPAI */}
        <div className="mt-6 border-b-2 border-[#0d6efd] pb-4 text-center">
          <h1 className="text-2xl font-bold text-[#0d6efd] sm:text-3xl">Relatório de Desempenho Consolidado</h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-neutral-500">CEITEC</p>
        </div>

        <div className="mt-6 rounded-md border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-800">
          <p className="border-b border-neutral-200 pb-2">
            <strong>Escola:</strong>{" "}
            <span className="font-bold text-[#0d6efd]">CENTRO EDUCAÇÃO INTEGRAL, INOVAÇÃO E TECNOLOGIA - CEITEC</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-x-8 gap-y-1">
            <p>
              <strong>Ano / Avaliação:</strong> 2026 | SISPAI I e II
            </p>
            <p>
              <strong>Série:</strong> 9º ANO
            </p>
            <p>
              <strong>Disciplina:</strong> Matemática
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-md border border-neutral-200 p-3 text-center">
            <p className="text-2xl font-extrabold text-neutral-900">{classificados.length}</p>
            <p className="text-xs font-bold uppercase text-neutral-500">Alunos classificados</p>
          </div>
          <div className="rounded-md p-3 text-center" style={{ backgroundColor: "#ff0000", color: "#ffffff" }}>
            <p className="text-2xl font-extrabold">{notaBaixa.length}</p>
            <p className="text-xs font-bold uppercase">Básico ou abaixo</p>
          </div>
          <div className="rounded-md border border-neutral-200 p-3 text-center">
            <p className="text-2xl font-extrabold text-neutral-900">{mediaRodada1.toFixed(1).replace(".", ",")}%</p>
            <p className="text-xs font-bold uppercase text-neutral-500">Média de acerto — SISPAI I</p>
          </div>
          <div className="rounded-md border border-neutral-200 p-3 text-center">
            <p className="text-2xl font-extrabold text-neutral-900">{mediaRodada2.toFixed(1).replace(".", ",")}%</p>
            <p className="text-xs font-bold uppercase text-neutral-500">Média de acerto — SISPAI II</p>
          </div>
        </div>

        <ResultadosMatematicaCliente
          alunos={alunos}
          turmas={turmas}
          habilidadesPorRodada={habilidadesPorRodada}
          evolucaoBimestral={evolucaoBimestral}
          criticosPorAluno={criticosPorAluno}
          turmasComCriticos={turmasComCriticos}
          bimestreDiagnostico={bimestreDiagnostico}
          desempenhoSimulados={desempenhoSimulados}
        />
      </div>
    </main>
  );
}
