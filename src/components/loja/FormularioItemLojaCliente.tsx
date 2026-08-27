"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { criarItemLoja } from "@/app/actions/loja";

export function FormularioItemLojaCliente({ turmaId }: { turmaId: string }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [custoXp, setCustoXp] = useState(100);
  const [icone, setIcone] = useState("🎁");
  const [estoque, setEstoque] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  async function salvar() {
    setEnviando(true);
    setErro(null);

    const resultado = await criarItemLoja({
      turmaId,
      nome,
      descricao,
      custoXp,
      icone,
      estoque: estoque.trim() ? Number(estoque) : null,
    });

    setEnviando(false);
    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }

    setNome("");
    setDescricao("");
    setCustoXp(100);
    setIcone("🎁");
    setEstoque("");
    router.refresh();
  }

  return (
    <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
      <p className="font-bold text-neutral-900">+ Adicionar item na loja</p>

      <div className="grid grid-cols-[auto_1fr] gap-3">
        <input
          value={icone}
          onChange={(e) => setIcone(e.target.value)}
          maxLength={2}
          className="w-14 rounded-lg border border-neutral-300 px-2 py-2 text-center text-lg focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
        />
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do prêmio"
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
        />
      </div>

      <textarea
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        rows={2}
        placeholder="Descrição (opcional)"
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-neutral-700">Custo em XP</label>
          <input
            type="number"
            min={1}
            value={custoXp}
            onChange={(e) => setCustoXp(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-neutral-700">Estoque (opcional)</label>
          <input
            type="number"
            min={0}
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
            placeholder="Ilimitado"
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
          />
        </div>
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <button
        type="button"
        onClick={salvar}
        disabled={enviando || !nome.trim()}
        className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {enviando ? "Salvando..." : "+ Adicionar item"}
      </button>
    </div>
  );
}
