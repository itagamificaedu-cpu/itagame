"use client";

import { useEffect, useState } from "react";
import { responder } from "@/app/actions/salas";

type Participante = { id: string; apelido: string; pontuacao: number };

type EstadoSala = {
  status: "aberta" | "em_andamento" | "encerrada";
  perguntaAtual: number;
  totalQuestoes: number;
  titulo: string;
  perguntaAtualConteudo: { enunciado: string; alternativas: string[] } | null;
  participantes: Participante[];
  meuId: string | null;
  minhaPontuacao: number | null;
  euJaRespondiPerguntaAtual: boolean;
};

const FORMAS = [
  { cor: "bg-[#ff5470]", forma: <path d="M12 4 L21 20 L3 20 Z" /> },
  { cor: "bg-[#1a3fd4]", forma: <path d="M12 3 L21 12 L12 21 L3 12 Z" /> },
  { cor: "bg-[#ffb020]", forma: <circle cx="12" cy="12" r="9" /> },
  { cor: "bg-[#00c264]", forma: <rect x="4" y="4" width="16" height="16" rx="3" /> },
];

function Forma({ indice }: { indice: number }) {
  const item = FORMAS[indice % FORMAS.length];
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white/90">
      {item.forma}
    </svg>
  );
}

function PontinhosProgresso({ total, atual }: { total: number; atual: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: total }, (_, indice) => (
        <span
          key={indice}
          className={`h-1.5 rounded-full transition-all ${
            indice === atual
              ? "w-6 bg-[#1a3fd4]"
              : indice < atual
                ? "w-1.5 bg-[#1a3fd4]/40"
                : "w-1.5 bg-neutral-200"
          }`}
        />
      ))}
    </div>
  );
}

function PontinhosCarregando() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {[0, 1, 2].map((indice) => (
        <span
          key={indice}
          className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#1a3fd4]"
          style={{ animationDelay: `${indice * 0.12}s` }}
        />
      ))}
    </div>
  );
}

export function JogoCliente({ codigo }: { codigo: string }) {
  const [dados, setDados] = useState<EstadoSala | null>(null);
  const [respostaEnviada, setRespostaEnviada] = useState(false);
  const [feedback, setFeedback] = useState<{ correta: boolean; pontosGanhos: number } | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const origem = new EventSource(`/api/salas/${codigo}/eventos`);

    origem.onmessage = (evento) => {
      const payload = JSON.parse(evento.data) as EstadoSala;
      setDados((anterior) => {
        if (anterior && anterior.perguntaAtual !== payload.perguntaAtual) {
          setRespostaEnviada(false);
          setFeedback(null);
        }
        return payload;
      });
    };

    return () => origem.close();
  }, [codigo]);

  async function enviarResposta(alternativa: string) {
    if (respostaEnviada || enviando) return;
    setEnviando(true);
    const resultado = await responder(codigo, alternativa);
    setEnviando(false);

    if (resultado.ok) {
      setRespostaEnviada(true);
      setFeedback({ correta: resultado.correta, pontosGanhos: resultado.pontosGanhos });
    }
  }

  if (!dados) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-50 px-4">
        <PontinhosCarregando />
        <p className="text-sm font-medium text-neutral-400">Conectando à sala...</p>
      </main>
    );
  }

  if (dados.status === "encerrada") {
    const ranking = dados.participantes;
    const posicao = ranking.findIndex((p) => p.id === dados.meuId) + 1;
    const podio = ranking.slice(0, 3);
    const resto = ranking.slice(3, 10);
    const medalha = ["🥇", "🥈", "🥉"];

    return (
      <main className="flex min-h-screen flex-col items-center bg-neutral-50 px-4 py-12">
        <div className="w-full max-w-sm text-center">
          <p className="text-sm font-semibold text-neutral-400">Jogo encerrado</p>
          <p className="mt-1 text-4xl font-extrabold text-neutral-900">
            {posicao > 0 ? `${posicao}º lugar` : "Fim de jogo"}
          </p>
          <p className="mt-1 text-lg font-semibold text-[#1a3fd4]">
            {dados.minhaPontuacao ?? 0} pontos
          </p>

          {podio.length > 0 && (
            <div className="mt-8 flex items-end justify-center gap-3">
              {[podio[1], podio[0], podio[2]].map((p, ordem) =>
                p ? (
                  <div
                    key={p.id}
                    className={`flex flex-col items-center rounded-2xl px-3 pt-4 pb-3 ${
                      ordem === 1 ? "order-2 bg-[#1a3fd4] pb-5" : "order-none bg-white shadow-sm"
                    } ${p.id === dados.meuId ? "ring-2 ring-[#00c264]" : ""}`}
                    style={{ minWidth: "84px" }}
                  >
                    <span className="text-2xl">{medalha[ordem === 1 ? 0 : ordem === 0 ? 1 : 2]}</span>
                    <span
                      className={`mt-1 max-w-[76px] truncate text-xs font-bold ${
                        ordem === 1 ? "text-white" : "text-neutral-800"
                      }`}
                    >
                      {p.apelido}
                    </span>
                    <span className={`text-xs ${ordem === 1 ? "text-white/80" : "text-neutral-500"}`}>
                      {p.pontuacao} pts
                    </span>
                  </div>
                ) : null
              )}
            </div>
          )}

          {resto.length > 0 && (
            <ol className="mt-6 space-y-1.5 text-left">
              {resto.map((p, indice) => (
                <li
                  key={p.id}
                  className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm ${
                    p.id === dados.meuId
                      ? "bg-[#1a3fd4]/10 font-bold text-[#1a3fd4]"
                      : "bg-white text-neutral-600"
                  }`}
                >
                  <span>
                    {indice + 4}. {p.apelido}
                  </span>
                  <span>{p.pontuacao} pts</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </main>
    );
  }

  if (dados.status === "aberta" || !dados.perguntaAtualConteudo) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-neutral-50 px-4 text-center">
        <p className="text-sm font-semibold tracking-wide text-neutral-400 uppercase">
          {dados.titulo}
        </p>
        <PontinhosCarregando />
        <div>
          <p className="text-xl font-extrabold text-neutral-900">Aguardando o professor iniciar</p>
          <p className="mt-1 text-sm text-neutral-500">Fique nesta tela, já vai começar 👀</p>
        </div>
      </main>
    );
  }

  if (respostaEnviada || dados.euJaRespondiPerguntaAtual) {
    const acertou = feedback?.correta;
    return (
      <main
        className={`flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center transition-colors ${
          acertou === true ? "bg-[#00c264]" : acertou === false ? "bg-[#ff5470]" : "bg-neutral-50"
        }`}
      >
        <span className="text-5xl">{acertou === true ? "🎉" : acertou === false ? "😬" : "✅"}</span>
        <p className={`text-2xl font-extrabold ${feedback ? "text-white" : "text-neutral-900"}`}>
          {feedback
            ? acertou
              ? `Certinho! +${feedback.pontosGanhos} pontos`
              : "Não foi dessa vez"
            : "Resposta enviada!"}
        </p>
        <p className={`text-sm ${feedback ? "text-white/80" : "text-neutral-500"}`}>
          Aguardando os outros colegas...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8">
      <div className="mx-auto max-w-lg">
        <PontinhosProgresso total={dados.totalQuestoes} atual={dados.perguntaAtual} />
        <p className="mt-3 text-center text-xs font-bold tracking-wide text-neutral-400 uppercase">
          Pergunta {dados.perguntaAtual + 1} de {dados.totalQuestoes}
        </p>
        <h1 className="mt-3 text-center text-xl font-extrabold text-neutral-900">
          {dados.perguntaAtualConteudo.enunciado}
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {dados.perguntaAtualConteudo.alternativas.length > 0
            ? dados.perguntaAtualConteudo.alternativas.map((alternativa, indice) => (
                <button
                  key={alternativa}
                  onClick={() => enviarResposta(alternativa)}
                  disabled={enviando}
                  className={`flex items-center gap-3 rounded-2xl px-5 py-5 text-left font-bold text-white shadow-sm transition active:scale-[0.98] disabled:opacity-60 ${FORMAS[indice % 4].cor}`}
                >
                  <Forma indice={indice} />
                  {alternativa}
                </button>
              ))
            : ["verdadeiro", "falso"].map((opcao, indice) => (
                <button
                  key={opcao}
                  onClick={() => enviarResposta(opcao)}
                  disabled={enviando}
                  className={`flex items-center justify-center gap-3 rounded-2xl px-5 py-6 text-center text-lg font-extrabold text-white shadow-sm transition active:scale-[0.98] disabled:opacity-60 ${
                    opcao === "verdadeiro" ? "bg-[#00c264]" : "bg-[#ff5470]"
                  }`}
                >
                  <Forma indice={indice} />
                  {opcao === "verdadeiro" ? "Verdadeiro" : "Falso"}
                </button>
              ))}
        </div>
      </div>
    </main>
  );
}
