"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  obterEstadoGincana,
  criarRodadaQuiz,
  criarRodadaCaboDeGuerra,
  ajustarPontosManuais,
  adicionarTurmaNaGincana,
  encerrarGincana,
  excluirGincana,
  type EstadoGincana,
} from "@/app/actions/gincana";

type Opcao = { id: string; titulo: string; disciplina: string; serie: string };
type TimeAtual = { id: string; turmaId: string; turmaNome: string };
type TurmaDisponivel = { id: string; nome: string };

export function PainelGincanaCliente({
  gincanaId,
  nome,
  atividadesQuiz,
  atividadesCaboGuerra,
  timesAtuais,
  turmasDisponiveis,
}: {
  gincanaId: string;
  nome: string;
  atividadesQuiz: Opcao[];
  atividadesCaboGuerra: Opcao[];
  timesAtuais: TimeAtual[];
  turmasDisponiveis: TurmaDisponivel[];
}) {
  const [estado, setEstado] = useState<EstadoGincana | null>(null);
  const [pendente, iniciarTransicao] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  const [atividadeQuizEscolhida, setAtividadeQuizEscolhida] = useState("");
  const [atividadeCaboEscolhida, setAtividadeCaboEscolhida] = useState("");
  const [equipe1, setEquipe1] = useState("");
  const [equipe2, setEquipe2] = useState("");
  const [turmaParaAdicionar, setTurmaParaAdicionar] = useState("");

  useEffect(() => {
    let ativo = true;
    async function atualizar() {
      try {
        const dados = await obterEstadoGincana(gincanaId);
        if (ativo) setEstado(dados);
      } catch {
        // silencioso — próxima rodada de polling tenta de novo
      }
    }
    atualizar();
    const intervalo = setInterval(atualizar, 4000);
    return () => {
      ativo = false;
      clearInterval(intervalo);
    };
  }, [gincanaId]);

  function executar(acao: () => Promise<unknown>) {
    setErro(null);
    iniciarTransicao(async () => {
      try {
        await acao();
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Não foi possível completar a ação.");
      }
    });
  }

  const ranking = estado?.ranking ?? [];
  const medalhas = ["🥇", "🥈", "🥉"];

  // Deriva a lista de times a partir do ranking ao vivo (não da prop inicial
  // da SSR) pra turma recém-adicionada já aparecer nos seletores sem precisar
  // recarregar a página.
  const timesParaSelecao =
    ranking.length > 0
      ? ranking.map((r) => ({ turmaId: r.turmaId, turmaNome: r.turmaNome }))
      : timesAtuais.map((t) => ({ turmaId: t.turmaId, turmaNome: t.turmaNome }));
  const turmasAindaDisponiveis = turmasDisponiveis.filter(
    (t) => !timesParaSelecao.some((x) => x.turmaId === t.id)
  );

  return (
    <div className="mt-4 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">🏆 {nome}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Status: {estado?.status === "encerrada" ? "🏁 Encerrada" : estado?.status === "em_andamento" ? "🟢 Em andamento" : "🛠️ Preparando"}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          {estado?.status === "encerrada" && (
            <Link
              href={`/painel/gincana/${gincanaId}/podio`}
              className="whitespace-nowrap rounded-lg bg-[#f5a623] px-4 py-2 text-sm font-bold text-white hover:brightness-105"
            >
              🏆 Ver pódio
            </Link>
          )}
          {estado?.status !== "encerrada" && (
            <button
              type="button"
              onClick={() => {
                if (confirm("Encerrar a gincana e ir pro pódio? Não dá pra criar mais rodadas depois.")) {
                  executar(() => encerrarGincana(gincanaId));
                }
              }}
              disabled={pendente}
              className="whitespace-nowrap rounded-lg border-2 border-[#1a3fd4] px-4 py-2 text-sm font-bold text-[#1a3fd4] hover:bg-[#1a3fd4]/5"
            >
              🏁 Encerrar gincana
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (confirm("Excluir essa gincana? Essa ação não pode ser desfeita.")) {
                executar(() => excluirGincana(gincanaId));
              }
            }}
            disabled={pendente}
            className="whitespace-nowrap rounded-lg border border-red-200 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
          >
            Excluir
          </button>
        </div>
      </div>

      {erro && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
          {erro}
        </p>
      )}

      {/* Ranking ao vivo */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <p className="font-bold text-neutral-900">📊 Ranking em tempo real</p>
        {!estado ? (
          <p className="mt-4 text-sm text-neutral-500">Carregando...</p>
        ) : ranking.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">Nenhuma turma nessa gincana ainda.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {ranking.map((time, indice) => (
              <li
                key={time.timeId}
                className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="w-7 shrink-0 text-center text-lg">
                    {medalhas[indice] ?? `${indice + 1}º`}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-neutral-800">{time.turmaNome}</p>
                    <p className="text-xs text-neutral-400">
                      Quiz: {time.pontosQuiz} · Cabo de Guerra: {time.pontosCaboGuerra} · Manual:{" "}
                      {time.pontosManuais}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xl font-extrabold text-[#1a3fd4]">{time.total}</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={pendente}
                      onClick={() => executar(() => ajustarPontosManuais(gincanaId, time.timeId, 10))}
                      className="rounded border border-neutral-300 px-2 py-1 text-xs font-bold text-neutral-600 hover:bg-neutral-50"
                    >
                      +10
                    </button>
                    <button
                      type="button"
                      disabled={pendente}
                      onClick={() => executar(() => ajustarPontosManuais(gincanaId, time.timeId, -10))}
                      className="rounded border border-neutral-300 px-2 py-1 text-xs font-bold text-neutral-600 hover:bg-neutral-50"
                    >
                      -10
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Adicionar turma */}
      {turmasAindaDisponiveis.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="font-bold text-neutral-900">+ Adicionar turma</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <select
              value={turmaParaAdicionar}
              onChange={(e) => setTurmaParaAdicionar(e.target.value)}
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="">Escolha uma turma...</option>
              {turmasAindaDisponiveis.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!turmaParaAdicionar || pendente}
              onClick={() => {
                const fd = new FormData();
                fd.set("turmaId", turmaParaAdicionar);
                executar(() => adicionarTurmaNaGincana(gincanaId, fd));
                setTurmaParaAdicionar("");
              }}
              className="rounded-lg bg-[#1a3fd4] px-4 py-2 text-sm font-bold text-white hover:brightness-110 disabled:opacity-40"
            >
              Adicionar
            </button>
          </div>
        </div>
      )}

      {estado?.status !== "encerrada" && (
        <>
          {/* Nova rodada de quiz */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="font-bold text-neutral-900">🎯 Nova rodada — Quiz ao vivo</p>
            <p className="mt-1 text-xs text-neutral-500">
              Cria uma sala pra cada turma da gincana com a mesma atividade — todo mundo joga ao
              mesmo tempo e os pontos somam pro time.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <select
                value={atividadeQuizEscolhida}
                onChange={(e) => setAtividadeQuizEscolhida(e.target.value)}
                className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              >
                <option value="">Escolha uma atividade...</option>
                {atividadesQuiz.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.titulo} — {a.disciplina} ({a.serie})
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={!atividadeQuizEscolhida || pendente || timesParaSelecao.length === 0}
                onClick={() => {
                  executar(() => criarRodadaQuiz(gincanaId, atividadeQuizEscolhida));
                  setAtividadeQuizEscolhida("");
                }}
                className="rounded-lg bg-[#00c264] px-4 py-2 text-sm font-bold text-white hover:brightness-110 disabled:opacity-40"
              >
                Criar rodada
              </button>
            </div>
          </div>

          {/* Nova rodada de cabo de guerra */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="font-bold text-neutral-900">🪢 Nova rodada — Cabo de Guerra</p>
            <p className="mt-1 text-xs text-neutral-500">
              Só disputa 2 turmas por vez — escolha o confronto.
            </p>
            <div className="mt-3 space-y-2">
              <select
                value={atividadeCaboEscolhida}
                onChange={(e) => setAtividadeCaboEscolhida(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              >
                <option value="">Escolha uma atividade de Cabo de Guerra...</option>
                {atividadesCaboGuerra.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.titulo} — {a.disciplina} ({a.serie})
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap gap-2">
                <select
                  value={equipe1}
                  onChange={(e) => setEquipe1(e.target.value)}
                  className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                >
                  <option value="">Turma 1...</option>
                  {timesParaSelecao.map((t) => (
                    <option key={t.turmaId} value={t.turmaId}>
                      {t.turmaNome}
                    </option>
                  ))}
                </select>
                <span className="self-center text-sm font-bold text-neutral-400">vs</span>
                <select
                  value={equipe2}
                  onChange={(e) => setEquipe2(e.target.value)}
                  className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                >
                  <option value="">Turma 2...</option>
                  {timesParaSelecao.map((t) => (
                    <option key={t.turmaId} value={t.turmaId}>
                      {t.turmaNome}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                disabled={!atividadeCaboEscolhida || !equipe1 || !equipe2 || equipe1 === equipe2 || pendente}
                onClick={() => {
                  executar(() =>
                    criarRodadaCaboDeGuerra(gincanaId, atividadeCaboEscolhida, equipe1, equipe2)
                  );
                  setAtividadeCaboEscolhida("");
                  setEquipe1("");
                  setEquipe2("");
                }}
                className="w-full rounded-lg bg-[#FF8F00] py-2 text-sm font-bold text-white hover:brightness-110 disabled:opacity-40"
              >
                Criar partida
              </button>
            </div>
          </div>
        </>
      )}

      {/* Histórico de rodadas + links de projeção */}
      {estado && estado.rodadas.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="font-bold text-neutral-900">Rodadas criadas</p>
          <ul className="mt-3 space-y-3">
            {estado.rodadas.map((r) => (
              <li key={r.id} className="rounded-lg border border-neutral-200 p-3">
                <p className="text-sm font-semibold text-neutral-800">
                  {r.tipo === "quiz" ? "🎯" : "🪢"} {r.atividadeTitulo}
                </p>
                {r.tipo === "quiz" && r.salasQuiz && (
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {r.salasQuiz.map((s) => (
                      <li key={s.salaCodigo}>
                        <Link
                          href={`/painel/salas/${s.salaCodigo}`}
                          target="_blank"
                          className="rounded-full bg-[#1a3fd4]/10 px-3 py-1 text-xs font-bold text-[#1a3fd4] hover:bg-[#1a3fd4]/20"
                        >
                          {s.turmaNome}: abrir sala {s.salaCodigo}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {r.tipo === "cabo_de_guerra" && r.salaCaboGuerra && (
                  <Link
                    href={`/painel/cabo-de-guerra-online/${r.salaCaboGuerra.salaCodigo}`}
                    target="_blank"
                    className="mt-2 inline-block rounded-full bg-[#FF8F00]/10 px-3 py-1 text-xs font-bold text-[#FF8F00] hover:bg-[#FF8F00]/20"
                  >
                    {r.salaCaboGuerra.equipe1Nome} vs {r.salaCaboGuerra.equipe2Nome}: abrir sala{" "}
                    {r.salaCaboGuerra.salaCodigo}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
