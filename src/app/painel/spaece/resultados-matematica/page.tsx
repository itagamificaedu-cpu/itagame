import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { VERDE_SPAECE, VERDE_SPAECE_ESCURO } from "@/lib/spaece";
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

  const [resultados, habilidades, diagnosticosBimestrais, habilidadesBimestrais] = await Promise.all([
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

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/painel/spaece" className="text-sm font-semibold" style={{ color: VERDE_SPAECE }}>
          ← Voltar ao SPAECE 9º ano
        </Link>

        <div
          className="mt-4 overflow-hidden rounded-2xl p-8 text-white shadow-sm"
          style={{ backgroundImage: `linear-gradient(to bottom right, ${VERDE_SPAECE}, ${VERDE_SPAECE_ESCURO})` }}
        >
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
            🟩 SISPAI · Sistema Permanente de Avaliação de Itapipoca
          </p>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">Resultados de Matemática — 9º ano</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/85">
            Avaliação diagnóstica da SME de Itapipoca (Lei Municipal nº 059/2023), aplicada em duas rodadas.
            Cada aluno já vem com o percentual de acerto, a nota na escala TRI e o padrão de desempenho
            calculados pela Secretaria de Educação, então esta tela só organiza e exibe esses dados.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
            <p className="text-2xl font-extrabold text-neutral-900">{classificados.length}</p>
            <p className="text-xs text-neutral-500">alunos classificados</p>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
            <p className="text-2xl font-extrabold text-red-700">{notaBaixa.length}</p>
            <p className="text-xs text-red-700">nota baixa agora (Rodada 2, Básico/Abaixo)</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
            <p className="text-2xl font-extrabold text-neutral-900">{mediaRodada1.toFixed(1)}%</p>
            <p className="text-xs text-neutral-500">média de acerto — Rodada 1</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
            <p className="text-2xl font-extrabold text-neutral-900">{mediaRodada2.toFixed(1)}%</p>
            <p className="text-xs text-neutral-500">média de acerto — Rodada 2</p>
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
        />
      </div>
    </main>
  );
}
