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
      <main className="flex min-h-screen items-center justify-center bg-[#0b1230] px-4 text-white">
        Conectando à sala...
      </main>
    );
  }

  if (dados.status === "encerrada") {
    const posicao = dados.participantes.findIndex((p) => p.id === dados.meuId) + 1;

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b1230] px-4">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white">
          <p className="text-sm text-white/60">Jogo encerrado</p>
          <p className="mt-2 text-3xl font-extrabold">{posicao > 0 ? `${posicao}º lugar` : "—"}</p>
          <p className="mt-1 text-white/70">{dados.minhaPontuacao ?? 0} pontos</p>

          <ol className="mt-6 space-y-2 text-left">
            {dados.participantes.slice(0, 10).map((p, indice) => (
              <li
                key={p.id}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                  p.id === dados.meuId ? "bg-[#00c264]/20 font-semibold" : "bg-white/5"
                }`}
              >
                <span>
                  {indice + 1}. {p.apelido}
                </span>
                <span>{p.pontuacao} pts</span>
              </li>
            ))}
          </ol>
        </div>
      </main>
    );
  }

  if (dados.status === "aberta" || !dados.perguntaAtualConteudo) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#0b1230] px-4 text-center text-white">
        <p className="text-sm text-white/60">{dados.titulo}</p>
        <p className="mt-4 text-2xl font-bold">Aguardando o professor iniciar...</p>
        <p className="mt-2 text-white/60">Fique nesta tela.</p>
      </main>
    );
  }

  if (respostaEnviada || dados.euJaRespondiPerguntaAtual) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#0b1230] px-4 text-center text-white">
        <p className="text-2xl font-bold">Resposta enviada!</p>
        {feedback && (
          <p className={`mt-2 text-lg ${feedback.correta ? "text-[#00c264]" : "text-red-400"}`}>
            {feedback.correta ? `Certinho! +${feedback.pontosGanhos} pontos` : "Não foi dessa vez"}
          </p>
        )}
        <p className="mt-4 text-white/60">Aguardando os outros colegas...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b1230] px-4 py-8 text-white">
      <div className="mx-auto max-w-lg">
        <p className="text-center text-sm text-white/60">
          Pergunta {dados.perguntaAtual + 1} de {dados.totalQuestoes}
        </p>
        <h1 className="mt-3 text-center text-xl font-bold">
          {dados.perguntaAtualConteudo.enunciado}
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {dados.perguntaAtualConteudo.alternativas.length > 0
            ? dados.perguntaAtualConteudo.alternativas.map((alternativa, indice) => (
                <button
                  key={alternativa}
                  onClick={() => enviarResposta(alternativa)}
                  disabled={enviando}
                  className={`rounded-xl px-4 py-5 text-left font-semibold text-white transition disabled:opacity-60 ${
                    ["bg-[#1a3fd4]", "bg-[#00c264]", "bg-[#f5a623]", "bg-[#e0457b]"][indice % 4]
                  }`}
                >
                  {alternativa}
                </button>
              ))
            : ["verdadeiro", "falso"].map((opcao) => (
                <button
                  key={opcao}
                  onClick={() => enviarResposta(opcao)}
                  disabled={enviando}
                  className={`rounded-xl px-4 py-5 text-center text-lg font-bold text-white transition disabled:opacity-60 ${
                    opcao === "verdadeiro" ? "bg-[#00c264]" : "bg-[#e0457b]"
                  }`}
                >
                  {opcao === "verdadeiro" ? "Verdadeiro" : "Falso"}
                </button>
              ))}
        </div>
      </div>
    </main>
  );
}
