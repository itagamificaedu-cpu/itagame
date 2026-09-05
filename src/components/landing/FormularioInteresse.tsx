"use client";

import { useState } from "react";
import { criarLeadPublico } from "@/app/actions/leads";

// Formulário público de "tenho interesse", pra quem visita o site mas ainda
// não quer criar conta sozinho (ex: coordenador de escola avaliando pra
// comprar pro time todo). Ao enviar, cria um lead automático no Funil de
// Vendas do dono da plataforma — sem precisar login nenhum.
export function FormularioInteresse() {
  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [nomeMeio, setNomeMeio] = useState(""); // honeypot — some campo pra bot
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function enviar() {
    setErro(null);
    if (!nome.trim() || !contato.trim()) {
      setErro("Preencha nome e um jeito de te chamar (WhatsApp ou e-mail).");
      return;
    }

    setEnviando(true);
    const resultado = await criarLeadPublico({ nome, contato, mensagem, nomeMeio });
    setEnviando(false);

    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="mx-auto mt-6 max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur">
        <p className="text-2xl">✅</p>
        <p className="mt-2 font-bold text-white">Recebemos seu contato!</p>
        <p className="mt-1 text-sm text-white/80">Em breve alguém fala com você.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 max-w-md space-y-3 rounded-2xl border border-white/20 bg-white/10 p-6 text-left backdrop-blur">
      {/* honeypot: invisível pra humano, bots costumam preencher tudo */}
      <input
        type="text"
        value={nomeMeio}
        onChange={(e) => setNomeMeio(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Seu nome / sua escola"
        className="w-full rounded-lg border border-white/30 bg-white/90 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00c264]"
      />
      <input
        value={contato}
        onChange={(e) => setContato(e.target.value)}
        placeholder="WhatsApp ou e-mail"
        className="w-full rounded-lg border border-white/30 bg-white/90 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00c264]"
      />
      <textarea
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        placeholder="Conta rapidinho o que você precisa (opcional)"
        rows={2}
        className="w-full rounded-lg border border-white/30 bg-white/90 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00c264]"
      />

      {erro && <p className="text-sm text-red-200">{erro}</p>}

      <button
        type="button"
        onClick={enviar}
        disabled={enviando}
        className="w-full rounded-lg bg-[#00c264] py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {enviando ? "Enviando..." : "Quero saber mais"}
      </button>
    </div>
  );
}
