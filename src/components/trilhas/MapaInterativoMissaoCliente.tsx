"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { responderMapaMissao, type PontoMapaMissao } from "@/app/actions/missoes";

// Jogo do mapa interativo: mostra um nome por vez ("Clique no ponto: X") e o
// aluno clica na bolinha certa em cima da imagem — não precisa acertar o
// pixel exato, só escolher entre os pontos já marcados pelo professor. Uma
// tentativa por ponto. Mesmo mecanismo do JogoMapaInterativo.jsx do
// Professor Conectado, só troca a chamada final pra responderMapaMissao.
function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function formatarTempo(s: number) {
  const m = Math.floor(s / 60);
  const seg = s % 60;
  return `${String(m).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
}

type Props = {
  progressoId: string;
  imagemUrl: string;
  pontos: PontoMapaMissao[];
  xpRecompensa: number;
};

export function MapaInterativoMissaoCliente({ progressoId, imagemUrl, pontos, xpRecompensa }: Props) {
  const [ordem] = useState(() => embaralhar(pontos));
  const [indice, setIndice] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [feedback, setFeedback] = useState<{ id: string; certo: boolean } | null>(null);
  const [respondidos, setRespondidos] = useState<Record<string, "certo" | "errado">>({});
  const [segundos, setSegundos] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<{ aprovado: boolean; acertos: number; total: number } | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const travado = useRef(false);
  const router = useRouter();

  const acabou = indice >= ordem.length;
  const termoAtual = ordem[indice];

  useEffect(() => {
    if (acabou) return;
    const t = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [acabou]);

  function clicarPonto(ponto: PontoMapaMissao) {
    if (travado.current || acabou || respondidos[ponto.id]) return;
    const certo = ponto.id === termoAtual.id;
    travado.current = true;
    setFeedback({ id: ponto.id, certo });
    setRespondidos((r) => ({ ...r, [ponto.id]: certo ? "certo" : "errado" }));
    if (certo) setAcertos((a) => a + 1);

    setTimeout(() => {
      setFeedback(null);
      travado.current = false;
      setIndice((i) => i + 1);
    }, 700);
  }

  async function enviarResultado() {
    setEnviando(true);
    setErro(null);
    const resposta = await responderMapaMissao(progressoId, acertos, ordem.length);
    setEnviando(false);
    if (!resposta.ok) {
      setErro(resposta.erro);
      return;
    }
    setResultado(resposta);
    if (resposta.aprovado) {
      router.refresh();
    }
  }

  if (resultado && !resultado.aprovado) {
    return (
      <div className="text-center">
        <p className="text-sm font-semibold text-red-600">
          Você acertou {resultado.acertos}/{resultado.total}. Tente de novo!
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110"
        >
          Jogar de novo
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between font-mono text-xs font-bold">
        <span className="text-[#1a3fd4]">⏱ {formatarTempo(segundos)}</span>
        <span className="text-[#00854a]">
          ✔ {acertos}/{ordem.length}
        </span>
      </div>

      {!acabou ? (
        <>
          <div className="mb-3 rounded-lg bg-[#1a3fd4] py-2.5 text-center font-bold text-white">
            Clique no ponto: <span className="text-[#ffb020]">{termoAtual.label}</span>
          </div>
          <div className="relative inline-block w-full overflow-hidden rounded-lg border border-neutral-200 select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagemUrl} alt="Mapa" className="block w-full select-none" draggable={false} />
            {pontos.map((ponto) => {
              const resp = respondidos[ponto.id];
              const emFeedback = feedback?.id === ponto.id;
              let cor = "border-[#1a3fd4] bg-white";
              if (emFeedback) cor = feedback.certo ? "scale-125 border-[#00c264] bg-[#00c264]" : "scale-125 border-[#ff5470] bg-[#ff5470]";
              else if (resp === "certo") cor = "border-[#00c264] bg-[#00c264]/70";
              else if (resp === "errado") cor = "border-[#ff5470] bg-[#ff5470]/40";
              return (
                <button
                  key={ponto.id}
                  type="button"
                  onClick={() => clicarPonto(ponto)}
                  disabled={!!resp}
                  style={{ left: `${ponto.x}%`, top: `${ponto.y}%` }}
                  className={`absolute -ml-3 -mt-3 h-6 w-6 rounded-full border-2 shadow transition-transform ${cor}`}
                />
              );
            })}
          </div>
        </>
      ) : (
        <div className="rounded-xl bg-neutral-50 p-6 text-center">
          <div className="mb-2 text-4xl">
            {acertos === ordem.length ? "🏆" : acertos >= ordem.length / 2 ? "🎉" : "💪"}
          </div>
          <p className="text-lg font-bold text-neutral-900">
            Você acertou {acertos} de {ordem.length}
          </p>
          <p className="mb-4 text-sm text-neutral-500">Tempo: {formatarTempo(segundos)}</p>
          {erro && <p className="mb-2 text-sm text-red-600">{erro}</p>}
          <button
            type="button"
            onClick={enviarResultado}
            disabled={enviando}
            className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {enviando ? "Enviando..." : `Concluir e receber +${xpRecompensa} XP →`}
          </button>
        </div>
      )}
    </div>
  );
}
