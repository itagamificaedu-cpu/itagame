"use client";

import { useRef, useState } from "react";
import type { PontoMapaMissao } from "@/app/actions/missoes";

// Editor de conteúdo do mapa interativo: o professor sobe uma imagem (mapa,
// planta, foto de satélite etc.), clica nos pontos que quer que o aluno
// identifique e dá um nome pra cada um. Mesmo mecanismo de clique-e-marca do
// EditorMapaPontos.jsx do Professor Conectado, adaptado pra guardar a
// imagem como base64 (sem disco persistente no container, mesmo padrão da
// capa da trilha) em vez de depender de uma URL externa.
function comprimirImagemDoMapa(arquivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onerror = () => reject(new Error("Não consegui ler o arquivo."));
    leitor.onload = () => {
      const imagem = new Image();
      imagem.onerror = () => reject(new Error("Arquivo não é uma imagem válida."));
      imagem.onload = () => {
        // Mapa precisa de mais detalhe que uma capa comum pra dar pra clicar
        // com precisão — largura maior que os 900px usados na capa da trilha.
        const larguraMaxima = 1400;
        const escala = Math.min(1, larguraMaxima / imagem.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(imagem.width * escala);
        canvas.height = Math.round(imagem.height * escala);
        const contexto = canvas.getContext("2d");
        if (!contexto) {
          reject(new Error("Não consegui processar a imagem."));
          return;
        }
        contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      imagem.src = leitor.result as string;
    };
    leitor.readAsDataURL(arquivo);
  });
}

function gerarIdPonto() {
  return Math.random().toString(36).slice(2, 10);
}

type Props = {
  imagemUrl: string;
  pontos: PontoMapaMissao[];
  onChangeImagem: (dataUri: string) => void;
  onChangePontos: (pontos: PontoMapaMissao[]) => void;
};

export function EditorMapaPontosMissao({ imagemUrl, pontos, onChangeImagem, onChangePontos }: Props) {
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const imagemRef = useRef<HTMLDivElement>(null);

  async function aoEscolherArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    e.target.value = "";
    if (!arquivo) return;

    setErro(null);
    setEnviando(true);
    try {
      const dataUri = await comprimirImagemDoMapa(arquivo);
      onChangeImagem(dataUri);
      onChangePontos([]); // troca de imagem invalida os pontos marcados antes
    } catch {
      setErro("Não consegui processar essa imagem. Tente outro arquivo.");
    } finally {
      setEnviando(false);
    }
  }

  function clicarNaImagem(e: React.MouseEvent<HTMLDivElement>) {
    if (!imagemRef.current) return;
    const retangulo = imagemRef.current.getBoundingClientRect();
    const x = ((e.clientX - retangulo.left) / retangulo.width) * 100;
    const y = ((e.clientY - retangulo.top) / retangulo.height) * 100;
    onChangePontos([...pontos, { id: gerarIdPonto(), label: "", x, y }]);
  }

  function atualizarLabel(id: string, label: string) {
    onChangePontos(pontos.map((p) => (p.id === id ? { ...p, label } : p)));
  }

  function removerPonto(id: string) {
    onChangePontos(pontos.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-3 rounded-xl border border-neutral-200 p-5">
      <div>
        <label className="text-sm font-medium text-neutral-700">Imagem do mapa</label>
        <p className="mt-0.5 text-xs text-neutral-500">
          Uma foto ou imagem do mapa/planta que o aluno vai olhar pra achar os pontos.
        </p>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={aoEscolherArquivo} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={enviando}
          className="mt-2 rounded-lg border border-[#1a3fd4] px-3 py-1.5 text-xs font-bold text-[#1a3fd4] hover:bg-[#1a3fd4]/5 disabled:opacity-60"
        >
          {enviando ? "Processando..." : imagemUrl ? "Trocar imagem" : "Escolher imagem"}
        </button>
        {erro && <p className="mt-1 text-xs text-red-600">{erro}</p>}
      </div>

      {imagemUrl && (
        <>
          <p className="text-xs font-semibold text-neutral-500 uppercase">
            Clique na imagem pra marcar um ponto ({pontos.length} marcado{pontos.length === 1 ? "" : "s"})
          </p>
          <div
            ref={imagemRef}
            onClick={clicarNaImagem}
            className="relative w-full cursor-crosshair overflow-hidden rounded-lg border border-neutral-200 select-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagemUrl} alt="Mapa" className="block w-full" draggable={false} />
            {pontos.map((ponto, indice) => (
              <div
                key={ponto.id}
                style={{ left: `${ponto.x}%`, top: `${ponto.y}%` }}
                className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#ff5470] text-xs font-extrabold text-white shadow"
              >
                {indice + 1}
              </div>
            ))}
          </div>

          {pontos.length > 0 && (
            <div className="space-y-2">
              {pontos.map((ponto, indice) => (
                <div key={ponto.id} className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff5470]/10 text-xs font-extrabold text-[#ff5470]">
                    {indice + 1}
                  </span>
                  <input
                    value={ponto.label}
                    onChange={(e) => atualizarLabel(ponto.id, e.target.value)}
                    placeholder="Nome do ponto (ex: Praça Central)"
                    className="flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
                  />
                  <button
                    type="button"
                    onClick={() => removerPonto(ponto.id)}
                    className="text-xs font-semibold text-red-500 hover:text-red-700"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
