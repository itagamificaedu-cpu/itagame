"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { iniciarPartidaCaboGuerra, encerrarSalaCaboGuerra } from "@/app/actions/caboGuerraOnline";
import { NOMES_NIVEL, type Nivel } from "@/lib/caboGuerraPerguntas";

type Participante = { id: string; apelido: string };

type EstadoSala = {
  status: "aberta" | "em_andamento" | "encerrada";
  nomeEquipe1: string;
  nomeEquipe2: string;
  rodadaAtual: number;
  totalRodadas: number;
  modoPersonalizado: boolean;
  nivel: Nivel;
  pontosEquipe1: number;
  pontosEquipe2: number;
  perguntaTexto: string | null;
  tempoRestante: number;
  rodadaGanhaPor: number | null;
  equipe1: Participante[];
  equipe2: Participante[];
  vencedorFinal: number | null;
};

export function ControleCaboGuerraOnlineCliente({ codigo }: { codigo: string }) {
  const [dados, setDados] = useState<EstadoSala | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  useEffect(() => {
    const origem = new EventSource(`/api/cabo-guerra/${codigo}/eventos`);
    origem.onmessage = (evento) => setDados(JSON.parse(evento.data));
    return () => origem.close();
  }, [codigo]);

  if (!dados) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50">
        Carregando sala...
      </main>
    );
  }

  if (dados.status === "aberta") {
    return (
      <main className="min-h-screen bg-neutral-50 px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <Link href="/painel/cabo-de-guerra" className="text-sm font-semibold text-[#1a3fd4]">
            ← Voltar
          </Link>

          <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-8 text-center">
            <p className="text-sm font-semibold text-neutral-500">Código da sala</p>
            <p className="text-5xl font-extrabold tracking-widest text-[#1a3fd4]">{codigo}</p>
            <p className="mt-2 text-sm text-neutral-500">
              Peça para os alunos acessarem{" "}
              <strong>itagame.itatecnologiaeducacional.tech/entrar-cabo-guerra</strong> e escolherem um time
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border-2 border-[#42A5F5] bg-white p-5">
              <p className="text-center text-sm font-extrabold text-[#1565C0]">🔵 {dados.nomeEquipe1}</p>
              <p className="mt-1 text-center text-2xl font-extrabold text-neutral-900">
                {dados.equipe1.length}
              </p>
              <ul className="mt-3 flex flex-wrap justify-center gap-2">
                {dados.equipe1.map((p) => (
                  <li key={p.id} className="rounded-full bg-[#1565C0]/10 px-3 py-1 text-xs text-[#1565C0]">
                    {p.apelido}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-[#EF5350] bg-white p-5">
              <p className="text-center text-sm font-extrabold text-[#C62828]">🔴 {dados.nomeEquipe2}</p>
              <p className="mt-1 text-center text-2xl font-extrabold text-neutral-900">
                {dados.equipe2.length}
              </p>
              <ul className="mt-3 flex flex-wrap justify-center gap-2">
                {dados.equipe2.map((p) => (
                  <li key={p.id} className="rounded-full bg-[#C62828]/10 px-3 py-1 text-xs text-[#C62828]">
                    {p.apelido}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => iniciarTransicao(() => iniciarPartidaCaboGuerra(codigo))}
            disabled={pendente || dados.equipe1.length + dados.equipe2.length === 0}
            className="mt-6 w-full rounded-xl bg-gradient-to-br from-[#FFD600] to-[#FF8F00] py-3.5 text-base font-extrabold text-[#1a1a2e] transition disabled:opacity-50"
          >
            ⚔️ Iniciar jogo
          </button>
        </div>
      </main>
    );
  }

  if (dados.status === "em_andamento") {
    return (
      <main className="min-h-screen bg-[#0d0d1a] px-6 py-10 text-white">
        <div className="mx-auto max-w-2xl">
          <p className="text-center text-xs font-bold tracking-widest text-neutral-400 uppercase">
            {dados.modoPersonalizado
              ? `Pergunta ${dados.rodadaAtual}/${dados.totalRodadas}`
              : `Rodada ${dados.rodadaAtual}/${dados.totalRodadas} · ${NOMES_NIVEL[dados.nivel]}`}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-center">
              <p className="text-xs font-bold text-[#42A5F5] uppercase">{dados.nomeEquipe1}</p>
              <p className="text-4xl font-extrabold text-[#42A5F5]">{dados.pontosEquipe1}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-neutral-400 uppercase">Tempo</p>
              <p className={`text-4xl font-extrabold ${dados.tempoRestante <= 5 ? "text-red-400" : "text-[#FFD600]"}`}>
                {dados.tempoRestante}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-[#EF5350] uppercase">{dados.nomeEquipe2}</p>
              <p className="text-4xl font-extrabold text-[#EF5350]">{dados.pontosEquipe2}</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border-2 border-[#FFD600] bg-black/40 p-6 text-center">
            <p className="text-3xl font-extrabold">{dados.perguntaTexto}</p>
          </div>

          {dados.rodadaGanhaPor !== null && (
            <p className="mt-4 text-center text-sm font-semibold text-[#FFD600]">
              {dados.rodadaGanhaPor === 0
                ? "⏰ Tempo esgotado — ninguém pontuou"
                : dados.rodadaGanhaPor === 1
                  ? `🎉 ${dados.nomeEquipe1} acertou!`
                  : `🎉 ${dados.nomeEquipe2} acertou!`}
            </p>
          )}

          <button
            onClick={() => iniciarTransicao(() => encerrarSalaCaboGuerra(codigo))}
            disabled={pendente}
            className="mt-8 w-full rounded-lg border border-white/20 py-2.5 text-sm font-semibold text-neutral-300 hover:bg-white/10 disabled:opacity-60"
          >
            Encerrar partida
          </button>
        </div>
      </main>
    );
  }

  const corFundo =
    dados.vencedorFinal === 1
      ? "bg-gradient-to-br from-[#0D47A1] to-[#42A5F5]"
      : dados.vencedorFinal === 2
        ? "bg-gradient-to-br from-[#B71C1C] to-[#EF5350]"
        : "bg-gradient-to-br from-[#1a1a2e] to-[#2d2d5e]";

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center ${corFundo}`}>
      <span className="text-7xl">{dados.vencedorFinal === 0 ? "🤝" : "🏆"}</span>
      <p className="text-3xl font-extrabold text-white">
        {dados.vencedorFinal === 0
          ? "EMPATE!"
          : dados.vencedorFinal === 1
            ? `🔵 ${dados.nomeEquipe1.toUpperCase()} VENCEU!`
            : `🔴 ${dados.nomeEquipe2.toUpperCase()} VENCEU!`}
      </p>
      <p className="text-lg text-white/85">
        Placar final: {dados.pontosEquipe1} × {dados.pontosEquipe2}
      </p>
      <Link
        href="/painel/cabo-de-guerra-online/nova"
        className="mt-6 rounded-xl bg-[#FFD600] px-8 py-3 text-base font-extrabold text-[#1a1a2e]"
      >
        🔄 Nova partida
      </Link>
    </main>
  );
}
