"use client";

import { useState } from "react";
import Link from "next/link";
import { FormularioInteresse } from "@/components/landing/FormularioInteresse";

export function ChamadaFinal() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  return (
    <section className="bg-[#1a3fd4] px-6 py-16 text-center">
      <h2 className="text-3xl font-extrabold text-white">
        Sua próxima aula pode estar pronta em dois minutos
      </h2>
      <p className="mt-3 text-white/80">
        Crie sua conta e gere sua primeira atividade agora.
      </p>
      <Link
        href="/cadastro"
        className="mt-8 inline-block rounded-lg bg-[#00c264] px-8 py-3 text-base font-bold text-white transition hover:brightness-110"
      >
        Criar minha conta
      </Link>

      {/* Alternativa pra quem prefere ser atendido antes de criar conta
          sozinho (ex: coordenador avaliando pra escola toda) — vira um lead
          automático no Funil de Vendas, sem precisar login. */}
      {mostrarFormulario ? (
        <FormularioInteresse />
      ) : (
        <button
          type="button"
          onClick={() => setMostrarFormulario(true)}
          className="mt-4 block w-full text-sm font-semibold text-white/70 underline-offset-4 hover:text-white hover:underline"
        >
          Prefere que a gente te ajude? Fala com a gente
        </button>
      )}
    </section>
  );
}
