"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { atualizarStatusLead, atualizarNotasLead, excluirLead } from "@/app/actions/leads";
import type { StatusLead } from "@prisma/client";

const OPCOES_STATUS: { valor: StatusLead; rotulo: string }[] = [
  { valor: "novo", rotulo: "Novo" },
  { valor: "contatado", rotulo: "Contatado" },
  { valor: "demonstracao", rotulo: "Demonstração" },
  { valor: "negociacao", rotulo: "Negociação" },
  { valor: "fechado", rotulo: "Fechado 🎉" },
  { valor: "perdido", rotulo: "Perdido" },
];

type Lead = {
  id: string;
  nome: string;
  contato: string;
  origem: string | null;
  status: StatusLead;
  notas: string | null;
  valorPotencialMensal: number | null;
  proximoContatoEm: string | null;
};

export default function LeadCardCliente({ lead }: { lead: Lead }) {
  const [editando, setEditando] = useState(false);
  const [notas, setNotas] = useState(lead.notas ?? "");
  const [proximoContato, setProximoContato] = useState(lead.proximoContatoEm?.slice(0, 10) ?? "");
  const [salvando, setSalvando] = useState(false);
  const router = useRouter();

  const atrasado = lead.proximoContatoEm && new Date(lead.proximoContatoEm) < new Date(new Date().toDateString());

  async function mudarStatus(status: StatusLead) {
    await atualizarStatusLead(lead.id, status);
    router.refresh();
  }

  async function salvarNotas() {
    setSalvando(true);
    await atualizarNotasLead(lead.id, notas, proximoContato);
    setSalvando(false);
    setEditando(false);
    router.refresh();
  }

  async function excluir() {
    if (!confirm(`Excluir "${lead.nome}" do funil?`)) return;
    await excluirLead(lead.id);
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold text-neutral-900">{lead.nome}</p>
          <p className="truncate text-xs text-neutral-500">{lead.contato}</p>
        </div>
        <button onClick={excluir} className="shrink-0 text-xs text-neutral-400 hover:text-red-600">
          ✕
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
        {lead.origem && <span className="rounded-full bg-neutral-100 px-2 py-0.5">{lead.origem}</span>}
        {lead.valorPotencialMensal && (
          <span className="rounded-full bg-[#00c264]/10 px-2 py-0.5 font-semibold text-[#00854a]">
            R$ {lead.valorPotencialMensal}/mês
          </span>
        )}
        {lead.proximoContatoEm && (
          <span
            className={`rounded-full px-2 py-0.5 font-semibold ${
              atrasado ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            📅 {new Date(lead.proximoContatoEm).toLocaleDateString("pt-BR")}
          </span>
        )}
      </div>

      {lead.notas && !editando && <p className="mt-2 text-sm whitespace-pre-line text-neutral-600">{lead.notas}</p>}

      {editando ? (
        <div className="mt-2 space-y-2">
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={2}
            placeholder="Anotações da conversa..."
            className="w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-sm focus:border-[#1a3fd4] focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <label className="text-xs text-neutral-500">Próximo contato:</label>
            <input
              type="date"
              value={proximoContato}
              onChange={(e) => setProximoContato(e.target.value)}
              className="rounded-lg border border-neutral-300 px-2 py-1 text-xs"
            />
            <button
              onClick={salvarNotas}
              disabled={salvando}
              className="ml-auto rounded-lg bg-[#1a3fd4] px-3 py-1 text-xs font-bold text-white hover:brightness-110"
            >
              Salvar
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setEditando(true)} className="mt-2 text-xs font-semibold text-[#1a3fd4]">
          ✏️ Anotar / agendar contato
        </button>
      )}

      <select
        value={lead.status}
        onChange={(e) => mudarStatus(e.target.value as StatusLead)}
        className="mt-3 w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-xs font-bold text-neutral-700"
      >
        {OPCOES_STATUS.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.rotulo}
          </option>
        ))}
      </select>
    </div>
  );
}
