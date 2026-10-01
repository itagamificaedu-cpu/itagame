"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  PADRAO_SISPAI_LABEL,
  PADRAO_SISPAI_CELULA,
  SEMAFORO_ORDEM,
  SEMAFORO_LABEL,
  SEMAFORO_FAIXA,
  SEMAFORO_CELULA,
  nivelSemaforo,
  SITUACAO_BIMESTRAL_CELULA,
  SITUACAO_BIMESTRAL_LABEL,
  abreviarHabilidadeBimestral,
  type CorCelula,
} from "@/lib/sispai";

// Visual copiado do "Relatório de Desempenho Consolidado" do portal SISPAI
// (Prefeitura de Itapipoca): tabela com cabeçalho preto, nome do aluno em
// azul e a célula do nível pintada inteira — vermelho, laranja, verde-claro,
// verde-escuro.

type Rodada = { pct: number; tri: number | null; nivel: string | null; padrao: string | null };
type AlunoCombinado = { turma: string; nome: string; r1: Rodada | null; r2: Rodada | null };
type HabilidadeItem = {
  id: string;
  trilha: string;
  codigoSaeb: string;
  codigoBncc: string;
  descricaoHabilidade: string;
  percentualAcertoGeral: number;
};
type HabilidadesPorRodada = { rodada: number; itens: HabilidadeItem[] };
type EvolucaoBimestral = { habilidade: string; porBimestre: { bimestre: number; percentualAcertoGeral: number }[] };
type PontoAtencao = { habilidade: string; situacao: string };
type AlunoCritico = { nome: string; matricula: string; turma: string; pontos: PontoAtencao[]; peso: number };
type DesempenhoSimuladoAluno = {
  alunoId: string;
  nome: string;
  turma: string;
  corretas: number;
  total: number;
  percentual: number;
};

const AZUL_SISPAI = "#0d6efd";
const PADRAO_ORDEM = ["abaixo_do_basico", "basico", "adequado", "avancado"] as const;

function TituloSecao({ children, descricao }: { children: ReactNode; descricao?: ReactNode }) {
  return (
    <div className="mb-3 border-b border-neutral-300 pb-2">
      <h2 className="text-xl font-semibold text-[#6c757d]">{children}</h2>
      {descricao && <p className="mt-1 text-xs text-neutral-500">{descricao}</p>}
    </div>
  );
}

function CelulaCor({ cor, children, className = "" }: { cor: CorCelula; children: ReactNode; className?: string }) {
  return (
    <td
      className={`border border-neutral-200 px-3 py-2 text-center text-xs font-bold uppercase ${className}`}
      style={{ backgroundColor: cor.fundo, color: cor.texto }}
    >
      {children}
    </td>
  );
}

const ALINHAMENTO = { left: "text-left", center: "text-center", right: "text-right" } as const;

function Th({ children, alinhar = "left" }: { children: ReactNode; alinhar?: keyof typeof ALINHAMENTO }) {
  return (
    <th className={`px-3 py-2 text-xs font-bold uppercase text-white ${ALINHAMENTO[alinhar]}`}>{children}</th>
  );
}

function CaixaContagem({ cor, valor, rotulo, detalhe }: { cor: CorCelula; valor: ReactNode; rotulo: string; detalhe?: string }) {
  return (
    <div className="rounded-md p-3 text-center" style={{ backgroundColor: cor.fundo, color: cor.texto }}>
      <p className="text-2xl font-extrabold">{valor}</p>
      <p className="text-xs font-bold uppercase">{rotulo}</p>
      {detalhe && <p className="text-[11px] opacity-80">{detalhe}</p>}
    </div>
  );
}

// Gráfico de colunas por aluno (0–100%), cada coluna com a cor do nível.
function GraficoColunasAlunos({ alunos }: { alunos: DesempenhoSimuladoAluno[] }) {
  return (
    <div className="overflow-x-auto">
      <div className="relative flex h-56 min-w-full items-end gap-3 border-b border-l border-neutral-300 pl-9 pr-2">
        {[100, 90, 70, 50].map((marca) => (
          <div
            key={marca}
            className="pointer-events-none absolute left-9 right-0 border-t border-dashed border-neutral-300"
            style={{ bottom: `${marca}%` }}
          >
            <span className="absolute -left-9 -translate-y-1/2 text-[10px] text-neutral-400">{marca}%</span>
          </div>
        ))}
        {alunos.map((a) => {
          const cor = SEMAFORO_CELULA[nivelSemaforo(a.percentual)];
          return (
            <div key={a.alunoId} className="flex h-full w-10 shrink-0 flex-col items-center justify-end">
              <span className="mb-1 text-[10px] font-bold text-neutral-800">{a.percentual.toFixed(0)}%</span>
              <div
                className="w-full rounded-t border border-black/10"
                style={{ height: `${Math.max(2, a.percentual)}%`, backgroundColor: cor.fundo }}
                title={`${a.nome}: ${a.percentual.toFixed(0)}%`}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 pl-9 pr-2 pt-1">
        {alunos.map((a) => (
          <p key={a.alunoId} className="w-10 shrink-0 truncate text-center text-[10px] font-semibold text-[#0d6efd]" title={a.nome}>
            {a.nome.split(" ")[0]}
          </p>
        ))}
      </div>
    </div>
  );
}

export function ResultadosMatematicaCliente({
  alunos,
  turmas,
  habilidadesPorRodada,
  evolucaoBimestral,
  criticosPorAluno,
  turmasComCriticos,
  bimestreDiagnostico,
  desempenhoSimulados,
}: {
  alunos: AlunoCombinado[];
  turmas: string[];
  habilidadesPorRodada: HabilidadesPorRodada[];
  evolucaoBimestral: EvolucaoBimestral[];
  criticosPorAluno: AlunoCritico[];
  turmasComCriticos: string[];
  bimestreDiagnostico: number | null;
  desempenhoSimulados: DesempenhoSimuladoAluno[];
}) {
  const [turmaSelecionada, setTurmaSelecionada] = useState("todas");

  const atual = (a: AlunoCombinado) => a.r2 ?? a.r1;

  // Mesma ordem do relatório do SISPAI: TRI mais alta primeiro.
  const alunosFiltrados = useMemo(
    () =>
      (turmaSelecionada === "todas" ? alunos : alunos.filter((a) => a.turma === turmaSelecionada))
        .slice()
        .sort((a, b) => (atual(b)?.tri ?? -1) - (atual(a)?.tri ?? -1)),
    [alunos, turmaSelecionada]
  );

  // As turmas do ItaGame têm nome tipo "9º Ano A" e as do SISPAI só "A" —
  // casa pelo final do nome pra o mesmo filtro valer nas duas fontes.
  const simuladosFiltrados = useMemo(
    () =>
      (turmaSelecionada === "todas"
        ? desempenhoSimulados
        : desempenhoSimulados.filter((a) => a.turma === turmaSelecionada || a.turma.endsWith(` ${turmaSelecionada}`))
      )
        .slice()
        .sort((a, b) => b.percentual - a.percentual),
    [desempenhoSimulados, turmaSelecionada]
  );

  const distribuicaoPadrao = useMemo(() => {
    const contagem: Record<string, number> = { abaixo_do_basico: 0, basico: 0, adequado: 0, avancado: 0 };
    let total = 0;
    for (const a of alunosFiltrados) {
      const padrao = atual(a)?.padrao;
      if (padrao && padrao in contagem) {
        contagem[padrao]++;
        total++;
      }
    }
    return { contagem, total };
  }, [alunosFiltrados]);

  const resumoSimulados = useMemo(() => {
    const contagem: Record<string, number> = { vermelho: 0, amarelo: 0, verde: 0, verde_escuro: 0 };
    for (const a of simuladosFiltrados) contagem[nivelSemaforo(a.percentual)]++;
    const media =
      simuladosFiltrados.length > 0
        ? simuladosFiltrados.reduce((s, a) => s + a.percentual, 0) / simuladosFiltrados.length
        : 0;
    return { contagem, media };
  }, [simuladosFiltrados]);

  const turmasCriticosVisiveis =
    turmaSelecionada === "todas" ? turmasComCriticos : turmasComCriticos.filter((t) => t === turmaSelecionada);

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-md border border-neutral-200 bg-neutral-50 p-4">
        <label htmlFor="filtro-turma" className="text-sm font-bold text-neutral-800">
          Série / Turma:
        </label>
        <select
          id="filtro-turma"
          value={turmaSelecionada}
          onChange={(e) => setTurmaSelecionada(e.target.value)}
          className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-700 focus:border-[#0d6efd] focus:outline-none"
        >
          <option value="todas">9º ANO | Todas</option>
          {turmas.map((t) => (
            <option key={t} value={t}>
              9º ANO | Turma {t}
            </option>
          ))}
        </select>
        {turmaSelecionada !== "todas" && (
          <button onClick={() => setTurmaSelecionada("todas")} className="text-xs font-semibold text-[#0d6efd] hover:underline">
            Limpar filtro
          </button>
        )}
      </div>

      {/* Resumo oficial por padrão */}
      <section className="mt-8">
        <TituloSecao descricao="Classificação oficial da SME — Rodada 2 (ou Rodada 1 quando a 2 ainda não tem detalhe).">
          Resumo por Padrão — SISPAI
        </TituloSecao>
        {distribuicaoPadrao.total === 0 ? (
          <p className="text-sm text-neutral-400">Sem alunos classificados nesse filtro.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PADRAO_ORDEM.map((padrao) => (
                <CaixaContagem
                  key={padrao}
                  cor={PADRAO_SISPAI_CELULA[padrao]}
                  valor={distribuicaoPadrao.contagem[padrao]}
                  rotulo={PADRAO_SISPAI_LABEL[padrao]}
                  detalhe={`${((distribuicaoPadrao.contagem[padrao] / distribuicaoPadrao.total) * 100).toFixed(0)}% dos alunos`}
                />
              ))}
            </div>
            <div className="mt-3 flex h-4 w-full overflow-hidden rounded border border-neutral-300">
              {PADRAO_ORDEM.map((padrao) => {
                const qtd = distribuicaoPadrao.contagem[padrao];
                if (qtd === 0) return null;
                return (
                  <div
                    key={padrao}
                    style={{ width: `${(qtd / distribuicaoPadrao.total) * 100}%`, backgroundColor: PADRAO_SISPAI_CELULA[padrao].fundo }}
                    title={`${PADRAO_SISPAI_LABEL[padrao]}: ${qtd} aluno(s)`}
                  />
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* Simulados do ItaGame — dado interno */}
      <section className="mt-10">
        <TituloSecao
          descricao={
            <>
              Respostas reais dos alunos no Simulado/Cabo de Guerra jogados no ItaGame. É prática interna, calculada
              pelo percentual de acerto — <strong>não é a classificação oficial do SISPAI</strong>.
            </>
          }
        >
          Simulados SPAECE no ItaGame
        </TituloSecao>

        {simuladosFiltrados.length === 0 ? (
          <p className="rounded-md border border-neutral-200 bg-neutral-50 p-6 text-center text-sm text-neutral-400">
            Nenhum aluno dessa turma jogou um Simulado ainda.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <div className="rounded-md border border-neutral-200 bg-white p-3 text-center">
                <p className="text-2xl font-extrabold" style={{ color: AZUL_SISPAI }}>
                  {resumoSimulados.media.toFixed(0)}%
                </p>
                <p className="text-xs font-bold uppercase text-neutral-600">Média de acerto</p>
              </div>
              {SEMAFORO_ORDEM.map((nivel) => (
                <CaixaContagem
                  key={nivel}
                  cor={SEMAFORO_CELULA[nivel]}
                  valor={resumoSimulados.contagem[nivel]}
                  rotulo={SEMAFORO_LABEL[nivel]}
                  detalhe={SEMAFORO_FAIXA[nivel]}
                />
              ))}
            </div>

            <div className="mt-4 rounded-md border border-neutral-200 bg-white p-4">
              <p className="mb-3 text-sm font-bold text-neutral-700">Acerto por aluno</p>
              <GraficoColunasAlunos alunos={simuladosFiltrados} />
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse border border-neutral-200 bg-white text-sm">
                <thead className="bg-[#212529]">
                  <tr>
                    <Th alinhar="center">#</Th>
                    <Th>Aluno</Th>
                    <Th alinhar="center">Turma</Th>
                    <Th alinhar="center">Acertos</Th>
                    <Th alinhar="center">Erros</Th>
                    <Th alinhar="center">Acerto</Th>
                    <Th alinhar="center">Nível</Th>
                  </tr>
                </thead>
                <tbody>
                  {simuladosFiltrados.map((a, i) => {
                    const nivel = nivelSemaforo(a.percentual);
                    return (
                      <tr key={a.alunoId}>
                        <td className="border border-neutral-200 px-3 py-2 text-center text-xs text-neutral-500">{i + 1}</td>
                        <td className="border border-neutral-200 px-3 py-2 text-xs font-bold uppercase" style={{ color: AZUL_SISPAI }}>
                          {a.nome}
                        </td>
                        <td className="border border-neutral-200 px-3 py-2 text-center text-xs text-neutral-600">{a.turma}</td>
                        <td className="border border-neutral-200 px-3 py-2 text-center text-xs font-bold text-neutral-800">{a.corretas}</td>
                        <td className="border border-neutral-200 px-3 py-2 text-center text-xs font-bold text-neutral-800">
                          {a.total - a.corretas}
                        </td>
                        <td className="border border-neutral-200 px-3 py-2 text-center text-xs font-bold text-neutral-900">
                          {a.percentual.toFixed(2).replace(".", ",")}%
                        </td>
                        <CelulaCor cor={SEMAFORO_CELULA[nivel]} className="w-32">
                          {SEMAFORO_LABEL[nivel]}
                        </CelulaCor>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* Habilidades */}
      {habilidadesPorRodada.some((r) => r.itens.length > 0) && (
        <section className="mt-10 space-y-6">
          <TituloSecao descricao="Percentual de acerto do 9º ano inteiro em cada habilidade. Vermelho = prioridade de reforço.">
            Desempenho por Habilidade
          </TituloSecao>
          {habilidadesPorRodada.map(
            ({ rodada, itens }) =>
              itens.length > 0 && (
                <div key={rodada}>
                  <p className="mb-2 text-sm font-bold text-neutral-700">SISPAI {rodada === 1 ? "I" : "II"}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-neutral-200 bg-white text-sm">
                      <thead className="bg-[#212529]">
                        <tr>
                          <Th alinhar="center">Trilha</Th>
                          <Th>Descrição / Habilidade</Th>
                          <Th alinhar="center">Acerto</Th>
                        </tr>
                      </thead>
                      <tbody>
                        {itens.map((h, i) => {
                          const pct = Number(h.percentualAcertoGeral);
                          const nivel = nivelSemaforo(pct);
                          return (
                            <tr key={h.id} className={i % 2 === 0 ? "bg-neutral-50" : "bg-white"}>
                              <td className="w-28 border border-neutral-200 px-3 py-2 text-center text-xs font-bold text-neutral-800">
                                {h.trilha}
                              </td>
                              <td className="border border-neutral-200 px-3 py-2 text-xs text-neutral-800">
                                <span className="font-bold" style={{ color: AZUL_SISPAI }}>
                                  (SAEB) {h.codigoSaeb}
                                </span>{" "}
                                <span className="font-semibold">{h.descricaoHabilidade}</span>
                                {h.codigoBncc && (
                                  <span className="mt-0.5 block text-[11px] font-bold" style={{ color: AZUL_SISPAI }}>
                                    {h.codigoBncc}
                                  </span>
                                )}
                              </td>
                              <CelulaCor cor={SEMAFORO_CELULA[nivel]} className="w-24 text-sm">
                                {nivel === "vermelho" ? "⊗ " : ""}
                                {pct.toFixed(0)}%
                              </CelulaCor>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
          )}
        </section>
      )}

      {/* Diagnóstico Bimestral */}
      {evolucaoBimestral.length > 0 && (
        <section className="mt-10">
          <TituloSecao descricao="Aplicado a cada bimestre nas 8 habilidades básicas de operações e situações-problema.">
            Diagnóstico Bimestral — evolução
          </TituloSecao>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-neutral-200 bg-white text-sm">
              <thead className="bg-[#212529]">
                <tr>
                  <Th>Habilidade</Th>
                  <Th alinhar="center">1º Bimestre</Th>
                  <Th alinhar="center">2º Bimestre</Th>
                </tr>
              </thead>
              <tbody>
                {evolucaoBimestral.map(({ habilidade, porBimestre }, i) => (
                  <tr key={habilidade} className={i % 2 === 0 ? "bg-neutral-50" : "bg-white"}>
                    <td className="border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-800">
                      {abreviarHabilidadeBimestral(habilidade)}
                    </td>
                    {[1, 2].map((bimestre) => {
                      const item = porBimestre.find((b) => b.bimestre === bimestre);
                      if (!item) {
                        return (
                          <td key={bimestre} className="w-32 border border-neutral-200 px-3 py-2 text-center text-xs text-neutral-400">
                            —
                          </td>
                        );
                      }
                      const pct = Number(item.percentualAcertoGeral);
                      return (
                        <CelulaCor key={bimestre} cor={SEMAFORO_CELULA[nivelSemaforo(pct)]} className="w-32">
                          {pct.toFixed(0)}%
                        </CelulaCor>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Foco Pedagógico */}
      {turmasCriticosVisiveis.length > 0 && (
        <section className="mt-10 space-y-6">
          <TituloSecao
            descricao={`Alunos que a SME identificou como estagnados no ${bimestreDiagnostico ? `${bimestreDiagnostico}º ` : ""}bimestre. Vermelho = não avançou, laranja = avançou pouco.`}
          >
            Foco Pedagógico
          </TituloSecao>
          {turmasCriticosVisiveis.map((turma) => {
            const daTurma = criticosPorAluno.filter((a) => a.turma === turma).sort((a, b) => b.peso - a.peso);
            return (
              <div key={turma}>
                <p className="mb-2 text-sm font-bold text-neutral-700">
                  Turma {turma} <span className="font-normal text-neutral-400">({daTurma.length} alunos)</span>
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-neutral-200 bg-white text-sm">
                    <thead className="bg-[#212529]">
                      <tr>
                        <Th alinhar="center">#</Th>
                        <Th>Aluno</Th>
                        <Th>Pontos de atenção</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {daTurma.map((a, i) => (
                        <tr key={a.matricula}>
                          <td className="border border-neutral-200 px-3 py-2 text-center text-xs text-neutral-500">{i + 1}</td>
                          <td className="whitespace-nowrap border border-neutral-200 px-3 py-2 text-xs font-bold uppercase" style={{ color: AZUL_SISPAI }}>
                            {a.nome}
                          </td>
                          <td className="border border-neutral-200 px-3 py-2">
                            <div className="flex flex-wrap gap-1.5">
                              {a.pontos.map((p, j) => {
                                const cor = SITUACAO_BIMESTRAL_CELULA[p.situacao];
                                return (
                                  <span
                                    key={j}
                                    className="rounded px-2 py-0.5 text-[11px] font-bold"
                                    style={{ backgroundColor: cor.fundo, color: cor.texto }}
                                    title={SITUACAO_BIMESTRAL_LABEL[p.situacao]}
                                  >
                                    {abreviarHabilidadeBimestral(p.habilidade)}
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Relação de Estudantes — igual ao relatório oficial */}
      <section className="mt-10">
        <TituloSecao descricao="Ordenado pela TRI mais recente, do maior para o menor — mesma ordem do relatório oficial do SISPAI.">
          Relação de Estudantes — SISPAI
        </TituloSecao>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-neutral-200 bg-white text-sm">
            <thead className="bg-[#212529]">
              <tr>
                <Th alinhar="center">#</Th>
                <Th>Aluno</Th>
                <Th alinhar="center">Turma</Th>
                <Th alinhar="center">Acerto R1</Th>
                <Th alinhar="center">Padrão R1</Th>
                <Th alinhar="center">Acerto R2</Th>
                <Th alinhar="center">TRI</Th>
                <Th alinhar="center">Nível</Th>
                <Th alinhar="center">Padrão</Th>
              </tr>
            </thead>
            <tbody>
              {alunosFiltrados.map((a, i) => {
                const padraoAtual = atual(a)?.padrao;
                return (
                  <tr key={`${a.turma}-${a.nome}`}>
                    <td className="border border-neutral-200 px-3 py-2 text-center text-xs text-neutral-500">{i + 1}</td>
                    <td className="border border-neutral-200 px-3 py-2 text-xs font-bold uppercase" style={{ color: AZUL_SISPAI }}>
                      {a.nome}
                    </td>
                    <td className="border border-neutral-200 px-3 py-2 text-center text-xs text-neutral-700">{a.turma}</td>
                    <td className="border border-neutral-200 px-3 py-2 text-center text-xs font-bold text-neutral-900">
                      {a.r1 ? `${a.r1.pct.toFixed(2).replace(".", ",")}%` : "—"}
                    </td>
                    {a.r1?.padrao ? (
                      <CelulaCor cor={PADRAO_SISPAI_CELULA[a.r1.padrao]} className="w-36">
                        {PADRAO_SISPAI_LABEL[a.r1.padrao]}
                      </CelulaCor>
                    ) : (
                      <td className="border border-neutral-200 px-3 py-2 text-center text-xs text-neutral-400">—</td>
                    )}
                    <td className="border border-neutral-200 px-3 py-2 text-center text-xs font-bold text-neutral-900">
                      {a.r2 ? `${a.r2.pct.toFixed(2).replace(".", ",")}%` : "—"}
                    </td>
                    <td className="border border-neutral-200 px-3 py-2 text-center text-xs text-neutral-700">
                      {atual(a)?.tri != null ? Number(atual(a)?.tri).toFixed(2).replace(".", ",") : "—"}
                    </td>
                    <td className="border border-neutral-200 px-3 py-2 text-center text-xs text-neutral-700">{atual(a)?.nivel ?? "—"}</td>
                    {padraoAtual ? (
                      <CelulaCor cor={PADRAO_SISPAI_CELULA[padraoAtual]} className="w-36">
                        {PADRAO_SISPAI_LABEL[padraoAtual]}
                      </CelulaCor>
                    ) : (
                      <td className="border border-neutral-200 px-3 py-2 text-center text-xs text-neutral-400">—</td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
