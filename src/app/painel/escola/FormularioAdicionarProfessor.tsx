"use client";

import { useActionState, useRef, useEffect } from "react";
import { adicionarProfessorEscola } from "@/app/actions/escola";

export default function FormularioAdicionarProfessor() {
  const [estado, action, pendente] = useActionState(adicionarProfessorEscola, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!estado?.erros && !estado?.mensagem) {
      formRef.current?.reset();
    }
  }, [estado]);

  return (
    <form ref={formRef} action={action} className="flex items-start gap-2">
      <div className="flex-1">
        <input
          name="email"
          type="email"
          placeholder="E-mail do professor já cadastrado"
          required
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
        />
        {estado?.erros?.email && <p className="mt-1 text-xs text-red-600">{estado.erros.email[0]}</p>}
        {estado?.mensagem && <p className="mt-1 text-xs text-red-600">{estado.mensagem}</p>}
      </div>
      <button
        type="submit"
        disabled={pendente}
        className="whitespace-nowrap rounded-lg bg-[#1a3fd4] px-4 py-2 text-sm font-bold text-white hover:brightness-110 disabled:opacity-60"
      >
        {pendente ? "Adicionando..." : "+ Adicionar"}
      </button>
    </form>
  );
}
