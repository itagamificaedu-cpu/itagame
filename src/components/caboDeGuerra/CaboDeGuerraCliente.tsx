"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  TOTAL_RODADAS,
  TEMPO_RODADA,
  PAUSA_MS,
  NOMES_NIVEL,
  SUB_NIVEL,
  nivelDaRodada,
  gerarPergunta,
} from "@/lib/caboGuerraPerguntas";

type Aluno = { id: string; nome: string };
type Turma = { id: string; nome: string; alunos: Aluno[] };

type Fase = "config" | "jogando" | "fim";
type Nivel = 1 | 2 | 3 | 4 | 5;

function usarSom() {
  const ctxRef = useRef<AudioContext | null>(null);

  function obterContexto() {
    if (!ctxRef.current) {
      const AudioContextClasse = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new AudioContextClasse();
    }
    return ctxRef.current;
  }

  function beep(freqs: [number, number, number][], tipo: OscillatorType = "sine") {
    try {
      const ctx = obterContexto();
      freqs.forEach(([f, inicio, duracao]) => {
        const osc = ctx.createOscillator();
        const ganho = ctx.createGain();
        osc.connect(ganho);
        ganho.connect(ctx.destination);
        osc.type = tipo;
        osc.frequency.setValueAtTime(f, ctx.currentTime + inicio);
        ganho.gain.setValueAtTime(0.28, ctx.currentTime + inicio);
        ganho.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + inicio + duracao);
        osc.start(ctx.currentTime + inicio);
        osc.stop(ctx.currentTime + inicio + duracao);
      });
    } catch {
      // áudio é apenas decorativo — ignora falha (ex: navegador bloqueou antes de interação)
    }
  }

  return {
    destravar: () => {
      try {
        obterContexto().resume();
      } catch {
        // ignora
      }
    },
    acerto: () => beep([[523, 0, 0.25], [659, 0.1, 0.25], [784, 0.2, 0.25], [1047, 0.3, 0.3]]),
    erro: () => beep([[200, 0, 0.15], [120, 0.1, 0.2]], "sawtooth"),
    tic: () => beep([[800, 0, 0.05]], "square"),
    fim: () =>
      beep([
        [523, 0, 0.4], [587, 0.08, 0.4], [659, 0.16, 0.4], [698, 0.24, 0.4],
        [784, 0.32, 0.4], [880, 0.4, 0.4], [1047, 0.5, 0.5],
      ]),
  };
}

const TECLAS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "⌫", "0", "✓"];

function Teclado({
  onTecla,
  cor,
}: {
  onTecla: (v: string) => void;
  cor: "azul" | "vermelho";
}) {
  const corBase = cor === "azul" ? "bg-white/20 hover:bg-white/30" : "bg-white/20 hover:bg-white/30";
  return (
    <div className="grid w-full max-w-[220px] grid-cols-3 gap-1.5">
      {TECLAS.map((tecla) => {
        const isOk = tecla === "✓";
        const isDel = tecla === "⌫";
        return (
          <button
            key={tecla}
            onClick={() => onTecla(tecla)}
            className={`rounded-lg py-3 text-lg font-extrabold text-white transition active:scale-90 ${
              isOk
                ? `col-span-3 bg-[#ffd600] text-[#1a1a2e] hover:brightness-105`
                : isDel
                  ? "bg-red-500/40 hover:bg-red-500/55"
                  : corBase
            }`}
          >
            {isOk ? "↵ ENTER" : tecla}
          </button>
        );
      })}
    </div>
  );
}

export function CaboDeGuerraCliente({ turmas }: { turmas: Turma[] }) {
  const som = usarSom();

  const [fase, setFase] = useState<Fase>("config");
  const [turmaId, setTurmaId] = useState<string>(turmas[0]?.id ?? "");
  const [equipe1Nome, setEquipe1Nome] = useState("Equipe 1");
  const [equipe2Nome, setEquipe2Nome] = useState("Equipe 2");
  const [alunosEquipe1, setAlunosEquipe1] = useState<Set<string>>(new Set());
  const [alunosEquipe2, setAlunosEquipe2] = useState<Set<string>>(new Set());

  const [rodada, setRodada] = useState(1);
  const [pontos1, setPontos1] = useState(0);
  const [pontos2, setPontos2] = useState(0);
  const [pergunta, setPergunta] = useState<{ texto: string; resposta: number } | null>(null);
  const [tempoRestante, setTempoRestante] = useState(TEMPO_RODADA);
  const [entrada1, setEntrada1] = useState("");
  const [entrada2, setEntrada2] = useState("");
  const [statusCalc1, setStatusCalc1] = useState<"correto" | "errado" | null>(null);
  const [statusCalc2, setStatusCalc2] = useState<"correto" | "errado" | null>(null);
  const [ativo, setAtivo] = useState(false);
  const [mensagemRodada, setMensagemRodada] = useState<{ emoji: string; titulo: string; sub: string } | null>(null);
  const [nivelUp, setNivelUp] = useState<Nivel | null>(null);
  const [flashEquipe, setFlashEquipe] = useState<1 | 2 | null>(null);
  const [vencedor, setVencedor] = useState<0 | 1 | 2 | null>(null);

  const ativoRef = useRef(ativo);
  ativoRef.current = ativo;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function agendar(fn: () => void, ms: number) {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const turmaAtual = turmas.find((t) => t.id === turmaId);

  function alternarAluno(equipe: 1 | 2, alunoId: string) {
    const outraEquipe = equipe === 1 ? alunosEquipe2 : alunosEquipe1;
    const minhaEquipe = equipe === 1 ? alunosEquipe1 : alunosEquipe2;
    const setMinha = equipe === 1 ? setAlunosEquipe1 : setAlunosEquipe2;
    const setOutra = equipe === 1 ? setAlunosEquipe2 : setAlunosEquipe1;

    const novaMinha = new Set(minhaEquipe);
    if (novaMinha.has(alunoId)) {
      novaMinha.delete(alunoId);
    } else {
      novaMinha.add(alunoId);
      if (outraEquipe.has(alunoId)) {
        const novaOutra = new Set(outraEquipe);
        novaOutra.delete(alunoId);
        setOutra(novaOutra);
      }
    }
    setMinha(novaMinha);
  }

  function pararTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function iniciarTimer() {
    pararTimer();
    setTempoRestante(TEMPO_RODADA);
    let restante = TEMPO_RODADA;
    timerRef.current = setInterval(() => {
      restante -= 1;
      setTempoRestante(restante);
      if (restante <= 5 && restante > 0) som.tic();
      if (restante <= 0) {
        pararTimer();
        if (ativoRef.current) {
          setAtivo(false);
          setMensagemRodada({ emoji: "⏰", titulo: "Tempo esgotado!", sub: "Ninguém pontuou..." });
          agendar(() => proximaRodada(), PAUSA_MS);
        }
      }
    }, 1000);
  }

  function novaPergunta(rodadaAtual: number) {
    setPergunta(gerarPergunta(nivelDaRodada(rodadaAtual)));
  }

  function iniciarPartida() {
    setFase("jogando");
    setRodada(1);
    setPontos1(0);
    setPontos2(0);
    setEntrada1("");
    setEntrada2("");
    setStatusCalc1(null);
    setStatusCalc2(null);
    setVencedor(null);
    novaPergunta(1);
    setAtivo(true);
    iniciarTimer();
  }

  function digitar(equipe: 1 | 2, valor: string) {
    if (!ativoRef.current) return;
    som.tic();
    const setar = equipe === 1 ? setEntrada1 : setEntrada2;

    if (valor === "⌫") {
      setar((atual) => atual.slice(0, -1));
    } else if (valor === "✓") {
      setar((atual) => {
        confirmar(equipe, atual);
        return atual;
      });
    } else {
      setar((atual) => (atual.length < 5 ? atual + valor : atual));
    }
  }

  function confirmar(equipe: 1 | 2, valorDigitado: string) {
    if (!ativoRef.current || !pergunta) return;
    const valor = parseInt(valorDigitado, 10);
    if (Number.isNaN(valor)) return;

    const setStatus = equipe === 1 ? setStatusCalc1 : setStatusCalc2;
    const setEntrada = equipe === 1 ? setEntrada1 : setEntrada2;

    if (valor === pergunta.resposta) {
      setAtivo(false);
      pararTimer();
      som.acerto();
      if (equipe === 1) setPontos1((p) => p + 1);
      else setPontos2((p) => p + 1);
      setStatus("correto");
      setFlashEquipe(equipe);
      agendar(() => setFlashEquipe(null), 700);
      setMensagemRodada({
        emoji: "🎉",
        titulo: `${equipe === 1 ? "🔵 " + equipe1Nome : "🔴 " + equipe2Nome} acertou!`,
        sub: "Próxima pergunta em instantes...",
      });
      agendar(() => proximaRodada(), PAUSA_MS);
    } else {
      som.erro();
      setStatus("errado");
      agendar(() => {
        setStatus(null);
        setEntrada("");
      }, 600);
    }
  }

  function proximaRodada() {
    setMensagemRodada(null);
    setStatusCalc1(null);
    setStatusCalc2(null);
    setEntrada1("");
    setEntrada2("");

    setRodada((rodadaAnterior) => {
      if (rodadaAnterior >= TOTAL_RODADAS) {
        finalizarJogo();
        return rodadaAnterior;
      }
      const novaRodada = rodadaAnterior + 1;
      const nivelAntes = nivelDaRodada(rodadaAnterior);
      const nivelDepois = nivelDaRodada(novaRodada);
      if (nivelDepois > nivelAntes) {
        setNivelUp(nivelDepois);
        agendar(() => setNivelUp(null), 2200);
      }
      novaPergunta(novaRodada);
      setAtivo(true);
      iniciarTimer();
      return novaRodada;
    });
  }

  function finalizarJogo() {
    pararTimer();
    som.fim();
    setFase("fim");
    setPontos1((p1atual) => {
      setPontos2((p2atual) => {
        if (p1atual > p2atual) setVencedor(1);
        else if (p2atual > p1atual) setVencedor(2);
        else setVencedor(0);
        return p2atual;
      });
      return p1atual;
    });
  }

  function jogarNovamente() {
    iniciarPartida();
  }

  function voltarConfiguracao() {
    pararTimer();
    setFase("config");
  }

  const diff = Math.max(-5, Math.min(5, pontos1 - pontos2));
  const offsetPercent = diff * -8;
  const nivelAtual = nivelDaRodada(rodada);

  if (fase === "config") {
    return (
      <main className="min-h-screen bg-neutral-50 px-6 py-10" onPointerDown={som.destravar}>
        <div className="mx-auto max-w-3xl">
          <Link href="/painel" className="text-sm font-semibold text-[#1a3fd4]">
            ← Voltar ao painel
          </Link>

          <h1 className="mt-4 text-2xl font-bold text-neutral-900">🪢 Cabo de Guerra</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Duas equipes disputam contas de matemática numa tela só — quem responde primeiro puxa a corda pro seu lado.
          </p>

          <Link
            href="/painel/cabo-de-guerra-online/nova"
            className="mt-4 inline-flex items-center gap-2 rounded-xl border-2 border-[#1a3fd4] bg-[#1a3fd4]/5 px-4 py-2.5 text-sm font-bold text-[#1a3fd4] transition hover:bg-[#1a3fd4]/10"
          >
            📱 Prefere que cada aluno jogue pelo próprio celular? Use a versão Online →
          </Link>

          {turmas.length > 0 && (
            <div className="mt-6">
              <label className="text-sm font-medium text-neutral-700">Turma (opcional, pra montar as equipes)</label>
              <select
                value={turmaId}
                onChange={(evento) => setTurmaId(evento.target.value)}
                className="mt-1 w-full max-w-sm rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
              >
                <option value="">Sem turma — só nomes das equipes</option>
                {turmas.map((turma) => (
                  <option key={turma.id} value={turma.id}>
                    {turma.nome} ({turma.alunos.length} alunos)
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border-2 border-[#42A5F5] bg-white p-5">
              <p className="text-center text-xs font-extrabold tracking-wide text-[#1565C0] uppercase">🔵 Equipe 1</p>
              <input
                value={equipe1Nome}
                onChange={(evento) => setEquipe1Nome(evento.target.value)}
                maxLength={20}
                className="mt-3 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm font-bold focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
              />
              {turmaAtual && (
                <div className="mt-3 max-h-40 space-y-1 overflow-y-auto">
                  {turmaAtual.alunos.map((aluno) => (
                    <button
                      key={aluno.id}
                      onClick={() => alternarAluno(1, aluno.id)}
                      className={`block w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition ${
                        alunosEquipe1.has(aluno.id)
                          ? "bg-[#1565C0]/10 text-[#1565C0]"
                          : "text-neutral-500 hover:bg-neutral-100"
                      }`}
                    >
                      {alunosEquipe1.has(aluno.id) ? "✓ " : ""}
                      {aluno.nome}
                    </button>
                  ))}
                </div>
              )}
              {turmaAtual && (
                <p className="mt-2 text-center text-xs text-neutral-400">
                  {alunosEquipe1.size} aluno{alunosEquipe1.size === 1 ? "" : "s"} nesta equipe
                </p>
              )}
            </div>

            <div className="rounded-2xl border-2 border-[#EF5350] bg-white p-5">
              <p className="text-center text-xs font-extrabold tracking-wide text-[#C62828] uppercase">🔴 Equipe 2</p>
              <input
                value={equipe2Nome}
                onChange={(evento) => setEquipe2Nome(evento.target.value)}
                maxLength={20}
                className="mt-3 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm font-bold focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
              />
              {turmaAtual && (
                <div className="mt-3 max-h-40 space-y-1 overflow-y-auto">
                  {turmaAtual.alunos.map((aluno) => (
                    <button
                      key={aluno.id}
                      onClick={() => alternarAluno(2, aluno.id)}
                      className={`block w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition ${
                        alunosEquipe2.has(aluno.id)
                          ? "bg-[#C62828]/10 text-[#C62828]"
                          : "text-neutral-500 hover:bg-neutral-100"
                      }`}
                    >
                      {alunosEquipe2.has(aluno.id) ? "✓ " : ""}
                      {aluno.nome}
                    </button>
                  ))}
                </div>
              )}
              {turmaAtual && (
                <p className="mt-2 text-center text-xs text-neutral-400">
                  {alunosEquipe2.size} aluno{alunosEquipe2.size === 1 ? "" : "s"} nesta equipe
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={iniciarPartida}
              className="rounded-2xl bg-gradient-to-br from-[#FFD600] to-[#FF8F00] px-10 py-4 text-lg font-extrabold tracking-wide text-[#1a1a2e] shadow-lg transition active:scale-95"
            >
              ⚔️ COMEÇAR JOGO
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (fase === "fim") {
    const corFundo =
      vencedor === 1
        ? "bg-gradient-to-br from-[#0D47A1] to-[#42A5F5]"
        : vencedor === 2
          ? "bg-gradient-to-br from-[#B71C1C] to-[#EF5350]"
          : "bg-gradient-to-br from-[#1a1a2e] to-[#2d2d5e]";

    return (
      <main className={`flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center ${corFundo}`}>
        <span className="text-7xl">{vencedor === 0 ? "🤝" : "🏆"}</span>
        <p className="text-3xl font-extrabold text-white">
          {vencedor === 0
            ? "EMPATE!"
            : vencedor === 1
              ? `🔵 ${equipe1Nome.toUpperCase()} VENCEU!`
              : `🔴 ${equipe2Nome.toUpperCase()} VENCEU!`}
        </p>
        <p className="text-lg text-white/85">
          Placar final: {pontos1} × {pontos2}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={jogarNovamente}
            className="rounded-xl bg-[#FFD600] px-8 py-3 text-base font-extrabold text-[#1a1a2e] transition active:scale-95"
          >
            🔄 Jogar Novamente
          </button>
          <button
            onClick={voltarConfiguracao}
            className="rounded-xl border-2 border-white/40 px-8 py-3 text-base font-bold text-white transition hover:bg-white/10"
          >
            Configurar de novo
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#0d0d1a]">
      {flashEquipe && (
        <div
          className={`pointer-events-none fixed inset-0 z-10 ${
            flashEquipe === 1 ? "bg-[#42A5F5]/20" : "bg-[#EF5350]/20"
          }`}
        />
      )}

      {nivelUp && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40">
          <div className="text-center">
            <p className="text-5xl">🔥</p>
            <p className="text-4xl font-extrabold text-[#FFD600] drop-shadow-lg">{NOMES_NIVEL[nivelUp]}</p>
            <p className="mt-1 text-white">{SUB_NIVEL[nivelUp]}</p>
          </div>
        </div>
      )}

      {mensagemRodada && (
        <div className="fixed top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-[#FFD600] bg-black/90 px-8 py-5 text-center">
          <p className="text-4xl">{mensagemRodada.emoji}</p>
          <p className="mt-1 text-lg font-extrabold text-[#FFD600]">{mensagemRodada.titulo}</p>
          <p className="mt-1 text-sm text-neutral-400">{mensagemRodada.sub}</p>
        </div>
      )}

      <div className="flex items-center justify-between border-b-4 border-[#FFD600] bg-black/30 px-4 py-2">
        <div className="rounded-xl border-2 border-white/15 bg-white/10 px-4 py-1.5">
          <p className="text-[0.6rem] font-bold tracking-wide text-neutral-400 uppercase">{equipe1Nome}</p>
          <p className="text-2xl font-extrabold text-[#42A5F5]">{pontos1}</p>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="rounded-xl border-2 border-[#FFD600] bg-[#FFD600]/15 px-4 py-1">
            <p className="text-center text-[0.6rem] font-bold tracking-widest text-neutral-400 uppercase">Tempo</p>
            <p className={`text-center text-2xl font-extrabold ${tempoRestante <= 5 ? "animate-pulse text-red-400" : "text-[#FFD600]"}`}>
              {tempoRestante}
            </p>
          </div>
          <p className="text-xs text-neutral-400">
            Rodada <b className="text-white">{rodada}</b>/{TOTAL_RODADAS} · {NOMES_NIVEL[nivelAtual]}
          </p>
        </div>
        <div className="rounded-xl border-2 border-white/15 bg-white/10 px-4 py-1.5 text-right">
          <p className="text-[0.6rem] font-bold tracking-wide text-neutral-400 uppercase">{equipe2Nome}</p>
          <p className="text-2xl font-extrabold text-[#EF5350]">{pontos2}</p>
        </div>
      </div>

      <div className="h-1 w-full bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-[#FFD600] to-[#FF8F00] transition-[width] duration-1000 ease-linear"
          style={{ width: `${(tempoRestante / TEMPO_RODADA) * 100}%` }}
        />
      </div>

      <div className="border-b-4 border-black/25 bg-gradient-to-br from-[#FFD600] to-[#FF8F00] px-4 py-2 text-center">
        <p className="text-[0.65rem] font-semibold tracking-widest text-black/45 uppercase">
          ⚡ Responda primeiro e puxe a corda! ⚡
        </p>
        <p className="text-4xl font-extrabold tracking-wide text-[#1a1a2e]">{pergunta?.texto ?? "..."}</p>
      </div>

      <div className="grid flex-1 grid-cols-[1fr_1.2fr_1fr]">
        <div className="flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#0d47a1] to-[#1565C0] p-3">
          <p className="text-center text-sm font-extrabold text-white">🔵 {equipe1Nome.toUpperCase()}</p>
          <div
            className={`flex min-h-[44px] w-full max-w-[220px] items-center justify-end gap-2 rounded-lg border-2 bg-black/40 px-3 py-2 ${
              statusCalc1 === "correto"
                ? "border-[#69F0AE]"
                : statusCalc1 === "errado"
                  ? "animate-pulse border-[#EF5350]"
                  : "border-white/20"
            }`}
          >
            <span>{statusCalc1 === "correto" ? "✅" : statusCalc1 === "errado" ? "❌" : ""}</span>
            <span className="text-xl font-extrabold text-white">{entrada1 || "_"}</span>
          </div>
          <Teclado cor="azul" onTecla={(v) => digitar(1, v)} />
        </div>

        <div className="flex flex-col items-center justify-center gap-2 border-x-2 border-white/10 bg-gradient-to-b from-[#08081a] via-[#10103a] to-[#08081a] px-2 py-3">
          <div className="relative h-14 w-full max-w-sm">
            <div className="absolute inset-x-4 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#42A5F5] via-[#c8960a] to-[#EF5350]" />
            <div
              className="absolute top-1/2 text-2xl transition-all duration-500"
              style={{ left: `calc(50% + ${offsetPercent}%)`, transform: "translate(-50%, -50%)" }}
            >
              🚩
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border-2 border-[#FFD600]/50 bg-black/60 px-4 py-1">
            <span className="text-xl font-extrabold text-[#42A5F5]">{pontos1}</span>
            <span className="text-neutral-500">×</span>
            <span className="text-xl font-extrabold text-[#EF5350]">{pontos2}</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#b71c1c] to-[#C62828] p-3">
          <p className="text-center text-sm font-extrabold text-white">🔴 {equipe2Nome.toUpperCase()}</p>
          <div
            className={`flex min-h-[44px] w-full max-w-[220px] items-center justify-end gap-2 rounded-lg border-2 bg-black/40 px-3 py-2 ${
              statusCalc2 === "correto"
                ? "border-[#69F0AE]"
                : statusCalc2 === "errado"
                  ? "animate-pulse border-[#EF5350]"
                  : "border-white/20"
            }`}
          >
            <span>{statusCalc2 === "correto" ? "✅" : statusCalc2 === "errado" ? "❌" : ""}</span>
            <span className="text-xl font-extrabold text-white">{entrada2 || "_"}</span>
          </div>
          <Teclado cor="vermelho" onTecla={(v) => digitar(2, v)} />
        </div>
      </div>
    </main>
  );
}
