"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { definirCapaTrilha } from "@/app/actions/trilhas";

// Redimensiona a imagem escolhida pra no máximo 900px de largura e comprime
// em JPEG antes de virar base64 — sem isso, uma foto de celular (4-5MB) ia
// direto pro banco de dados, o que é lento e caro. Tudo isso roda no
// navegador, sem precisar de servidor de upload nem disco no container.
function comprimirImagem(arquivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onerror = () => reject(new Error("Não consegui ler o arquivo."));
    leitor.onload = () => {
      const imagem = new Image();
      imagem.onerror = () => reject(new Error("Arquivo não é uma imagem válida."));
      imagem.onload = () => {
        const larguraMaxima = 900;
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
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      imagem.src = leitor.result as string;
    };
    leitor.readAsDataURL(arquivo);
  });
}

export function DefinirCapaTrilhaCliente({ trilhaId, capaAtual }: { trilhaId: string; capaAtual: string | null }) {
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function aoEscolherArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    e.target.value = ""; // permite escolher o mesmo arquivo de novo depois
    if (!arquivo) return;

    setErro(null);
    try {
      const dataUri = await comprimirImagem(arquivo);
      iniciarTransicao(async () => {
        const resultado = await definirCapaTrilha(trilhaId, dataUri);
        if (!resultado.ok) {
          setErro(resultado.erro);
          return;
        }
        router.refresh();
      });
    } catch {
      setErro("Não consegui processar essa imagem. Tente outro arquivo.");
    }
  }

  function remover() {
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await definirCapaTrilha(trilhaId, null);
      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-4">
      {capaAtual ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={capaAtual} alt="Capa da trilha" className="h-20 w-32 rounded-xl border border-neutral-200 object-cover" />
      ) : (
        <div className="flex h-20 w-32 items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 text-xs text-neutral-400">
          Sem capa
        </div>
      )}
      <div className="flex flex-col items-start gap-1">
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={aoEscolherArquivo} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={pendente}
          className="rounded-lg border border-[#1a3fd4] px-3 py-1.5 text-xs font-bold text-[#1a3fd4] hover:bg-[#1a3fd4]/5 disabled:opacity-60"
        >
          {pendente ? "Enviando..." : capaAtual ? "Trocar imagem" : "Adicionar capa"}
        </button>
        {capaAtual && (
          <button
            type="button"
            onClick={remover}
            disabled={pendente}
            className="text-xs font-semibold text-red-500 hover:text-red-700 disabled:opacity-60"
          >
            Remover
          </button>
        )}
        {erro && <p className="text-xs text-red-600">{erro}</p>}
      </div>
    </div>
  );
}
