"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  SEMAFORO_ORDEM,
  SEMAFORO_LABEL,
  SEMAFORO_FAIXA,
  SEMAFORO_CELULA,
  nivelSemaforo,
  type CorCelula,
} from "@/lib/sispai";

// Visual copiado do "Relatório de Desempenho Consolidado" do portal SISPAI
// (cabeçalho preto, nome do aluno em azul, célula do nível pintada inteira),
// mas com o desempenho real dos alunos no ItaGame — não é a classificação
// oficial da SME.

type AlunoRelatorio = {
  alunoId: string;
  nome: string;
  turma: string;
  corretas: number;
  total: number;
  percentual: number | null;
  missoesConcluidas: number;
  missoesTotal: number;
  xp: number;
};
type AvaliacaoRelatorio = { tema: string; turma: string; alunos: number; corretas: number; total: number };

const AZUL_SISPAI = "#0d6efd";
const SEM_DADOS: CorCelula = { fundo: "#e9ecef", texto: "#6c757d" };

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

function CelulaNivel({ percentual }: { percentual: number | null }) {
  if (percentual === null) {
    return (
      <CelulaCor cor={SEM_DADOS} className="w-32">
        Não fez
      </CelulaCor>
    );
  }
  const nivel = nivelSemaforo(percentual);
  return (
    <CelulaCor cor={SEMAFORO_CELULA[nivel]} className="w-32">
      {SEMAFORO_LABEL[nivel]}
    </CelulaCor>
  );
}

const ALINHAMENTO = { left: "text-left", center: "text-center", right: "text-right" } as const;

function Th({ children, alinhar = "left" }: { children: ReactNode; alinhar?: keyof typeof ALINHAMENTO }) {
  return (
    <th className={`px-3 py-2 text-xs font-bold uppercase text-white ${ALINHAMENTO[alinhar]}`}>{children}</th>
  );
}

function Td({ children, alinhar = "center", forte = false }: { children: ReactNode; alinhar?: keyof typeof ALINHAMENTO; forte?: boolean }) {
  return (
    <td className={`border border-neutral-200 px-3 py-2 text-xs ${ALINHAMENTO[alinhar]} ${forte ? "font-bold text-neutral-900" : "text-neutral-700"}`}>
      {children}
    </td>
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

function CaixaNumero({ valor, rotulo }: { valor: ReactNode; rotulo: string }) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white p-3 text-center">
      <p className="text-2xl font-extrabold" style={{ color: AZUL_SISPAI }}>
        {valor}
      </p>
      <p className="text-xs font-bold uppercase text-neutral-600">{rotulo}</p>
    </div>
  );
}

const pct = (valor: number) => `${valor.toFixed(1).replace(".", ",")}%`;

// Gráfico de colunas por aluno (0–100%), cada coluna com a cor do nível.
function GraficoColunasAlunos({ alunos }: { alunos: (AlunoRelatorio & { percentual: number })[] }) {
  return (
    <div className="overflow-x-auto pt-3">
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
        {alunos.map((a) => (
          <div key={a.alunoId} className="flex h-full w-10 shrink-0 flex-col items-center justify-end">
            <span className="mb-1 text-[10px] font-bold text-neutral-800">{a.percentual.toFixed(0)}%</span>
            <div
              className="w-full rounded-t border border-black/10"
              style={{ height: `${Math.max(2, a.percentual)}%`, backgroundColor: SEMAFORO_CELULA[nivelSemaforo(a.percentual)].fundo }}
              title={`${a.nome}: ${a.percentual.toFixed(0)}%`}
            />
          </div>
        ))}
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
  turmas,
  alunos,
  avaliacoes,
}: {
  turmas: string[];
  alunos: AlunoRelatorio[];
  avaliacoes: AvaliacaoRelatorio[];
}) {
  const [turmaSelecionada, setTurmaSelecionada] = useState("todas");
  const naTurma = <T extends { turma: string }>(lista: T[]) =>
    turmaSelecionada === "todas" ? lista : lista.filter((i) => i.turma === turmaSelecionada);

  // Quem já fez vem primeiro, do maior acerto pro menor; quem não fez, por nome.
  const alunosFiltrados = useMemo(
    () =>
      naTurma(alunos)
        .slice()
        .sort((a, b) => (b.percentual ?? -1) - (a.percentual ?? -1) || a.nome.localeCompare(b.nome)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [alunos, turmaSelecionada]
  );
  const quemFez = alunosFiltrados.filter((a): a is AlunoRelatorio & { percentual: number } => a.percentual !== null);

  const resumo = useMemo(() => {
    const contagem: Record<string, number> = { vermelho: 0, amarelo: 0, verde: 0, verde_escuro: 0 };
    for (const a of quemFez) contagem[nivelSemaforo(a.percentual)]++;
    const corretas = quemFez.reduce((s, a) => s + a.corretas, 0);
    const total = quemFez.reduce((s, a) => s + a.total, 0);
    const missoes = alunosFiltrados.reduce((s, a) => s + a.missoesConcluidas, 0);
    return { contagem, media: total > 0 ? (corretas / total) * 100 : null, missoes };
  }, [quemFez, alunosFiltrados]);

  const porTurma = useMemo(
    () =>
      turmas.map((turma) => {
        const daTurma = alunos.filter((a) => a.turma === turma);
        const fizeram = daTurma.filter((a) => a.percentual !== null);
        const corretas = fizeram.reduce((s, a) => s + a.corretas, 0);
        const total = fizeram.reduce((s, a) => s + a.total, 0);
        return {
          turma,
          alunos: daTurma.length,
          fizeram: fizeram.length,
          media: total > 0 ? (corretas / total) * 100 : null,
          missoes: daTurma.reduce((s, a) => s + a.missoesConcluidas, 0),
        };
      }),
    [turmas, alunos]
  );

  // Junta a mesma avaliação de turmas diferentes quando o filtro é "todas".
  const avaliacoesFiltradas = useMemo(() => {
    const mapa = new Map<string, { tema: string; alunos: number; corretas: number; total: number }>();
    for (const a of naTurma(avaliacoes)) {
      const item = mapa.get(a.tema) ?? { tema: a.tema, alunos: 0, corretas: 0, total: 0 };
      item.alunos += a.alunos;
      item.corretas += a.corretas;
      item.total += a.total;
      mapa.set(a.tema, item);
    }
    return Array.from(mapa.values());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avaliacoes, turmaSelecionada]);

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
              {t.toUpperCase()}
            </option>
          ))}
        </select>
        {turmaSelecionada !== "todas" && (
          <button onClick={() => setTurmaSelecionada("todas")} className="text-xs font-semibold text-[#0d6efd] hover:underline">
            Limpar filtro
          </button>
        )}
      </div>

      {/* Resumo */}
      <section className="mt-8">
        <TituloSecao descricao="Percentual de acerto nos Simulados e Cabos de Guerra SPAECE jogados na Sala Ao Vivo.">
          Resumo por Nível
        </TituloSecao>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <CaixaNumero valor={alunosFiltrados.length} rotulo="Alunos" />
          <CaixaNumero valor={quemFez.length} rotulo="Já fizeram" />
          <CaixaNumero valor={resumo.media === null ? "—" : pct(resumo.media)} rotulo="Média de acerto" />
          <CaixaNumero valor={resumo.missoes} rotulo="Missões concluídas" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SEMAFORO_ORDEM.map((nivel) => (
            <CaixaContagem
              key={nivel}
              cor={SEMAFORO_CELULA[nivel]}
              valor={resumo.contagem[nivel]}
              rotulo={SEMAFORO_LABEL[nivel]}
              detalhe={SEMAFORO_FAIXA[nivel]}
            />
          ))}
        </div>
      </section>

      {/* Por turma */}
      {turmaSelecionada === "todas" && (
        <section className="mt-10">
          <TituloSecao>Desempenho por Turma</TituloSecao>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-neutral-200 bg-white text-sm">
              <thead className="bg-[#212529]">
                <tr>
                  <Th>Turma</Th>
                  <Th alinhar="center">Alunos</Th>
                  <Th alinhar="center">Já fizeram</Th>
                  <Th alinhar="center">Missões concluídas</Th>
                  <Th alinhar="center">Acerto</Th>
                  <Th alinhar="center">Nível</Th>
                </tr>
              </thead>
              <tbody>
                {porTurma.map((t) => (
                  <tr key={t.turma}>
                    <td className="border border-neutral-200 px-3 py-2 text-xs font-bold uppercase">
                      <button onClick={() => setTurmaSelecionada(t.turma)} className="uppercase hover:underline" style={{ color: AZUL_SISPAI }}>
                        {t.turma}
                      </button>
                    </td>
                    <Td>{t.alunos}</Td>
                    <Td>{t.fizeram}</Td>
                    <Td>{t.missoes}</Td>
                    <Td forte>{t.media === null ? "—" : pct(t.media)}</Td>
                    <CelulaNivel percentual={t.media} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Por avaliação */}
      <section className="mt-10">
        <TituloSecao>Desempenho por Avaliação</TituloSecao>
        {avaliacoesFiltradas.length === 0 ? (
          <p className="rounded-md border border-neutral-200 bg-neutral-50 p-6 text-center text-sm text-neutral-400">
            Nenhum Simulado ou Cabo de Guerra SPAECE jogado ainda nesse filtro.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-neutral-200 bg-white text-sm">
              <thead className="bg-[#212529]">
                <tr>
                  <Th>Avaliação</Th>
                  <Th alinhar="center">Alunos</Th>
                  <Th alinhar="center">Acerto</Th>
                  <Th alinhar="center">Nível</Th>
                </tr>
              </thead>
              <tbody>
                {avaliacoesFiltradas.map((a) => {
                  const media = (a.corretas / a.total) * 100;
                  return (
                    <tr key={a.tema}>
                      <Td alinhar="left" forte>
                        {a.tema.replace(" (SPAECE)", "")}
                      </Td>
                      <Td>{a.alunos}</Td>
                      <Td forte>{pct(media)}</Td>
                      <CelulaNivel percentual={media} />
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Por aluno */}
      <section className="mt-10">
        <TituloSecao descricao="Ordenado pelo maior acerto. Quem ainda não jogou aparece no fim como “Não fez”.">
          Relação de Estudantes
        </TituloSecao>

        {quemFez.length > 0 && (
          <div className="mb-4 rounded-md border border-neutral-200 bg-white p-4">
            <p className="mb-3 text-sm font-bold text-neutral-700">Acerto por aluno</p>
            <GraficoColunasAlunos alunos={quemFez} />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-neutral-200 bg-white text-sm">
            <thead className="bg-[#212529]">
              <tr>
                <Th alinhar="center">#</Th>
                <Th>Aluno</Th>
                <Th alinhar="center">Turma</Th>
                <Th alinhar="center">Acertos</Th>
                <Th alinhar="center">Erros</Th>
                <Th alinhar="center">Acerto</Th>
                <Th alinhar="center">Missões</Th>
                <Th alinhar="center">Nível</Th>
              </tr>
            </thead>
            <tbody>
              {alunosFiltrados.map((a, i) => (
                <tr key={a.alunoId}>
                  <Td>{i + 1}</Td>
                  <td className="border border-neutral-200 px-3 py-2 text-xs font-bold uppercase" style={{ color: AZUL_SISPAI }}>
                    {a.nome}
                  </td>
                  <Td>{a.turma}</Td>
                  <Td forte>{a.total > 0 ? a.corretas : "—"}</Td>
                  <Td forte>{a.total > 0 ? a.total - a.corretas : "—"}</Td>
                  <Td forte>{a.percentual === null ? "—" : pct(a.percentual)}</Td>
                  <Td>
                    {a.missoesConcluidas}/{a.missoesTotal}
                  </Td>
                  <CelulaNivel percentual={a.percentual} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
