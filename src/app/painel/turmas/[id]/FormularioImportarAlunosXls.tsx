"use client";

import { useRef, useState, useTransition } from "react";
import { importarAlunosXls } from "@/app/actions/turmas";

export default function FormularioImportarAlunosXls({ turmaId }: { turmaId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendente, iniciarTransicao] = useTransition();
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  function enviar(formData: FormData) {
    setMensagem(null);
    iniciarTransicao(async () => {
      const resultado = await importarAlunosXls(turmaId, formData);
      if (resultado.ok) {
        setMensagem({ tipo: "ok", texto: `${resultado.quantidade} aluno(s) importado(s) com sucesso!` });
        if (inputRef.current) inputRef.current.value = "";
      } else {
        setMensagem({ tipo: "erro", texto: resultado.erro });
      }
    });
  }

  return (
    <form action={enviar} className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        ref={inputRef}
        type="file"
        name="arquivo"
        accept=".xlsx"
        required
        className="flex-1 text-xs text-neutral-500 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-neutral-700 hover:file:bg-neutral-200"
      />
      <button
        type="submit"
        disabled={pendente}
        className="whitespace-nowrap rounded-lg border border-[#1a3fd4] px-3 py-1.5 text-xs font-bold text-[#1a3fd4] hover:bg-[#1a3fd4]/5 disabled:opacity-40"
      >
        {pendente ? "Importando..." : "📥 Importar .xlsx"}
      </button>
      {mensagem && (
        <p className={`text-xs font-semibold ${mensagem.tipo === "ok" ? "text-[#00854a]" : "text-red-600"}`}>
          {mensagem.texto}
        </p>
      )}
    </form>
  );
}
