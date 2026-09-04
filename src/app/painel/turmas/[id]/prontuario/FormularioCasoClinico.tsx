"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { criarCasoClinico } from "@/app/actions/prontuario";

export default function FormularioCasoClinico({ turmaId }: { turmaId: string }) {
  const [titulo, setTitulo] = useState("");
  const [enunciado, setEnunciado] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  async function salvar() {
    setErro(null);
    setSalvando(true);
    const resultado = await criarCasoClinico({ turmaId, titulo, enunciado });
    setSalvando(false);

    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }
    setTitulo("");
    setEnunciado("");
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-neutral-700">Título do caso</label>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex: Admissão e Sinais Vitais (Registro de Rotina)"
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-neutral-700">Cenário clínico (o que o aluno vai ler antes de registrar)</label>
        <textarea
          value={enunciado}
          onChange={(e) => setEnunciado(e.target.value)}
          rows={5}
          placeholder="Descreva o paciente, os sinais vitais, a situação e o desafio de registro..."
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
        />
      </div>
      {erro && <p className="text-sm text-red-600">{erro}</p>}
      <button
        type="button"
        onClick={salvar}
        disabled={salvando}
        className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {salvando ? "Salvando..." : "+ Adicionar caso clínico"}
      </button>
    </div>
  );
}
