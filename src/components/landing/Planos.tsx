"use client";

// Preço ainda não definido — confirmar valor final com o usuário antes de conectar o Mercado Pago.
import { useState } from "react";
import Link from "next/link";

const recursosPro = [
  "Atividades ilimitadas",
  "Sala ao vivo sem limite de alunos",
  "Todos os tipos de atividade",
  "Correção de redação com IA",
  "Exportação em Word, PDF e PowerPoint",
  "Suporte prioritário",
];

export function Planos() {
  const [anual, setAnual] = useState(false);

  return (
    <section id="planos" className="px-6 py-20">
      <div className="mx-auto max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-neutral-900">Assinatura ItaGame</h2>
        <p className="mt-3 text-neutral-600">
          Um único plano com acesso completo à plataforma.
        </p>

        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-neutral-200 p-1">
          <button
            onClick={() => setAnual(false)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              !anual ? "bg-[#1a3fd4] text-white" : "text-neutral-600"
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setAnual(true)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              anual ? "bg-[#1a3fd4] text-white" : "text-neutral-600"
            }`}
          >
            Anual
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-[#00c264]/40 bg-neutral-900 p-8 text-left shadow-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00c264]/15 px-3 py-1 text-xs font-bold text-[#00c264]">
            👑 ItaGame Pro
          </span>
          <p className="mt-4 text-3xl font-extrabold text-white">
            R$ --{anual ? "/ano" : "/mês"}
          </p>
          <p className="text-xs text-neutral-400">valor a confirmar antes do lançamento</p>
          <ul className="mt-6 space-y-2 text-sm text-neutral-300">
            {recursosPro.map((r) => (
              <li key={r}>
                <span className="text-[#00c264]">✓</span> {r}
              </li>
            ))}
          </ul>
          <Link
            href="/cadastro"
            className="mt-8 block rounded-lg bg-[#00c264] py-2.5 text-center text-sm font-bold text-white hover:brightness-110"
          >
            Assinar ItaGame Pro
          </Link>
        </div>
      </div>
    </section>
  );
}
