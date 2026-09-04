"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { criarLead } from "@/app/actions/leads";

export default function FormularioNovoLead() {
  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [origem, setOrigem] = useState("");
  const [valor, setValor] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  async function salvar() {
    setErro(null);
    setSalvando(true);
    const resultado = await criarLead({
      nome,
      contato,
      origem: origem || undefined,
      valorPotencialMensal: valor ? Number(valor) : undefined,
    });
    setSalvando(false);

    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }
    setNome("");
    setContato("");
    setOrigem("");
    setValor("");
    router.refresh();
  }

  return (
    <div className="grid gap-3 sm:grid-cols-4">
      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome / escola"
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
      />
      <input
        value={contato}
        onChange={(e) => setContato(e.target.value)}
        placeholder="WhatsApp, e-mail..."
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
      />
      <input
        value={origem}
        onChange={(e) => setOrigem(e.target.value)}
        placeholder="Origem (Instagram, indicação...)"
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
      />
      <div className="flex gap-2">
        <input
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          type="number"
          placeholder="R$/mês"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
        />
        <button
          type="button"
          onClick={salvar}
          disabled={salvando || !nome || !contato}
          className="shrink-0 rounded-lg bg-[#1a3fd4] px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {salvando ? "..." : "+ Add"}
        </button>
      </div>
      {erro && <p className="sm:col-span-4 text-sm text-red-600">{erro}</p>}
    </div>
  );
}
