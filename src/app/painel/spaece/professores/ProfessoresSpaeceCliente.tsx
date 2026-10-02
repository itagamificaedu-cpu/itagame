"use client";

import { useState, useTransition } from "react";
import { convidarColaborador, reenviarConvite, removerColaborador, type ResultadoConvite } from "@/app/actions/colaboradores";
import { VERDE_SPAECE } from "@/lib/spaece";

type Colaborador = { id: string; nome: string; email: string; ultimoAcesso: string | null };

export function ProfessoresSpaeceCliente({ colaboradores }: { colaboradores: Colaborador[] }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [resultado, setResultado] = useState<(ResultadoConvite & { para?: string }) | null>(null);
  const [confirmarRemocao, setConfirmarRemocao] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [pendente, iniciar] = useTransition();

  function convidar(e: React.FormEvent) {
    e.preventDefault();
    iniciar(async () => {
      const r = await convidarColaborador({ nome, email });
      setResultado({ ...r, para: nome });
      setCopiado(false);
      if (r.ok) {
        setNome("");
        setEmail("");
      }
    });
  }

  function reenviar(c: Colaborador) {
    iniciar(async () => {
      setResultado({ ...(await reenviarConvite(c.id)), para: c.nome });
      setCopiado(false);
    });
  }

  function remover(id: string) {
    iniciar(async () => {
      await removerColaborador(id);
      setConfirmarRemocao(null);
    });
  }

  async function copiar(link: string) {
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <>
      <form onSubmit={convidar} className="mt-6 grid gap-3 rounded-2xl border border-neutral-200 bg-white p-5 sm:grid-cols-[1fr_1fr_auto]">
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do professor"
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none"
          required
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="E-mail do professor"
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none"
          required
        />
        <button
          type="submit"
          disabled={pendente}
          className="rounded-lg px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
          style={{ backgroundColor: VERDE_SPAECE }}
        >
          {pendente ? "Enviando..." : "Convidar"}
        </button>
      </form>

      {resultado && !resultado.ok && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{resultado.erro}</p>
      )}
      {resultado?.ok && (
        <div className="mt-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
          <p className="font-bold">
            {resultado.emailEnviado
              ? `Convite enviado por e-mail para ${resultado.para}.`
              : `Não consegui enviar o e-mail para ${resultado.para}. Mande o link abaixo pelo WhatsApp.`}
          </p>
          <p className="mt-1">Se o e-mail não chegar, mande este link pra ele criar a senha (vale 7 dias):</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <code className="min-w-0 flex-1 break-all rounded bg-white px-2 py-1 text-xs">{resultado.link}</code>
            <button type="button" onClick={() => copiar(resultado.link)} className="rounded border border-green-300 bg-white px-3 py-1 text-xs font-bold">
              {copiado ? "Copiado!" : "Copiar"}
            </button>
          </div>
        </div>
      )}

      <ul className="mt-6 space-y-2">
        {colaboradores.length === 0 && (
          <li className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
            Nenhum professor convidado ainda.
          </li>
        )}
        {colaboradores.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="min-w-0">
              <p className="font-bold text-neutral-900">{c.nome}</p>
              <p className="text-xs text-neutral-500">
                {c.email} · {c.ultimoAcesso ? `último acesso ${c.ultimoAcesso}` : "ainda não entrou"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => reenviar(c)}
                disabled={pendente}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                Reenviar convite
              </button>
              {confirmarRemocao === c.id ? (
                <button
                  type="button"
                  onClick={() => remover(c.id)}
                  disabled={pendente}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white"
                >
                  Confirmar remoção
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmarRemocao(c.id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Remover acesso
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
