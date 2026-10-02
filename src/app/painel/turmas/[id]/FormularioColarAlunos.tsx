"use client";

import { useMemo, useState, useTransition } from "react";
import { colarListaDeAlunos } from "@/app/actions/turmas";
import { extrairNomesDaLista } from "@/lib/listaAlunos";

// Cola a lista de nomes (copiada do Word/Excel) e cadastra todos de uma vez.
export default function FormularioColarAlunos({ turmaId }: { turmaId: string }) {
  const [texto, setTexto] = useState("");
  const [pendente, iniciarTransicao] = useTransition();
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  const nomes = useMemo(() => extrairNomesDaLista(texto), [texto]);

  function adicionar() {
    setMensagem(null);
    iniciarTransicao(async () => {
      const resultado = await colarListaDeAlunos(turmaId, texto);
      if (resultado.ok) {
        const extra = resultado.jaExistiam > 0 ? ` (${resultado.jaExistiam} já estavam na turma e foram ignorados)` : "";
        setMensagem({ tipo: "ok", texto: `${resultado.adicionados} aluno(s) adicionado(s)${extra}.` });
        setTexto("");
      } else {
        setMensagem({ tipo: "erro", texto: resultado.erro });
      }
    });
  }

  return (
    <div>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={6}
        placeholder="Cole aqui a lista de nomes, um por linha (pode vir com o número na frente)"
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none"
      />

      {nomes.length > 0 && (
        <div className="mt-2 rounded-lg bg-neutral-50 p-3">
          <p className="text-xs font-bold text-neutral-700">
            {nomes.length} nome{nomes.length === 1 ? "" : "s"} encontrado{nomes.length === 1 ? "" : "s"}:
          </p>
          <ol className="mt-1 max-h-40 list-decimal space-y-0.5 overflow-y-auto pl-5 text-xs text-neutral-600">
            {nomes.map((nome) => (
              <li key={nome}>{nome}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={adicionar}
          disabled={pendente || nomes.length === 0}
          className="rounded-lg bg-[#1a3fd4] px-4 py-2 text-xs font-bold text-white hover:brightness-110 disabled:opacity-40"
        >
          {pendente ? "Adicionando..." : `📋 Adicionar ${nomes.length || ""} aluno(s)`}
        </button>
        {mensagem && (
          <p className={`text-xs font-semibold ${mensagem.tipo === "ok" ? "text-[#00854a]" : "text-red-600"}`}>
            {mensagem.texto}
          </p>
        )}
      </div>
    </div>
  );
}
