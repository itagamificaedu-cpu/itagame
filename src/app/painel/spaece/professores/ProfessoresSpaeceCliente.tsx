"use client";

import { useState, useTransition } from "react";
import { desconectarTodosOsAparelhos, removerLoginCompartilhado, salvarLoginCompartilhado } from "@/app/actions/colaboradores";
import { VERDE_SPAECE } from "@/lib/spaece";

export function ProfessoresSpaeceCliente({
  loginAtual,
  ultimoAcesso,
  aparelhos,
  limiteAparelhos,
}: {
  loginAtual: string | null;
  ultimoAcesso: string | null;
  aparelhos: number;
  limiteAparelhos: number;
}) {
  const [email, setEmail] = useState(loginAtual ?? "");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState<{ ok: boolean; texto: string } | null>(null);
  const [confirmarRemocao, setConfirmarRemocao] = useState(false);
  const [pendente, iniciar] = useTransition();

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    iniciar(async () => {
      const r = await salvarLoginCompartilhado({ email, senha });
      setMensagem(
        r.ok
          ? { ok: true, texto: "Pronto! Passe esse login e essa senha para os professores." }
          : { ok: false, texto: r.erro }
      );
      if (r.ok) setSenha("");
    });
  }

  function desconectar() {
    iniciar(async () => {
      await desconectarTodosOsAparelhos();
      setMensagem({ ok: true, texto: "Todos os aparelhos foram desconectados. Quem quiser usar precisa entrar de novo." });
    });
  }

  function remover() {
    iniciar(async () => {
      await removerLoginCompartilhado();
      setConfirmarRemocao(false);
      setEmail("");
      setMensagem({ ok: true, texto: "Login removido. Ninguém mais entra com ele." });
    });
  }

  return (
    <>
      {loginAtual && (
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 text-sm">
          <p className="text-neutral-500">Login atual</p>
          <p className="mt-0.5 text-lg font-bold text-neutral-900">{loginAtual}</p>
          <p className="mt-1 text-xs text-neutral-500">{ultimoAcesso ? `Último acesso: ${ultimoAcesso}` : "Ninguém entrou ainda."}</p>
          <p className="mt-2 text-sm text-neutral-700">
            Aparelhos conectados: <strong>{aparelhos}</strong> de {limiteAparelhos}
          </p>
          <p className="mt-0.5 text-xs text-neutral-500">
            Se alguém de fora entrar e passar do limite, o aparelho usado há mais tempo é desconectado sozinho.
          </p>
          {aparelhos > 0 && (
            <button
              type="button"
              onClick={desconectar}
              disabled={pendente}
              className="mt-2 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
            >
              Desconectar todos os aparelhos
            </button>
          )}
        </div>
      )}

      <form onSubmit={salvar} className="mt-4 space-y-3 rounded-2xl border border-neutral-200 bg-white p-5">
        <p className="font-bold text-neutral-900">{loginAtual ? "Trocar login ou senha" : "Criar o login"}</p>
        <label className="block text-sm">
          <span className="text-neutral-600">Login (formato de e-mail, não precisa existir)</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="matematica@ceitec.com"
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none"
            required
          />
        </label>
        <label className="block text-sm">
          <span className="text-neutral-600">Senha (mínimo 6 caracteres)</span>
          <input
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            type="text"
            autoComplete="off"
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none"
            required
          />
        </label>
        {loginAtual && <p className="text-xs text-neutral-500">Ao salvar, quem estiver logado sai e precisa entrar com os dados novos.</p>}
        <button
          type="submit"
          disabled={pendente}
          className="w-full rounded-lg py-2.5 text-sm font-bold text-white disabled:opacity-60"
          style={{ backgroundColor: VERDE_SPAECE }}
        >
          {pendente ? "Salvando..." : "Salvar"}
        </button>
      </form>

      {mensagem && (
        <p
          className={`mt-3 rounded-lg px-4 py-3 text-sm font-semibold ${
            mensagem.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"
          }`}
        >
          {mensagem.texto}
        </p>
      )}

      {loginAtual && (
        <div className="mt-6 text-right">
          {confirmarRemocao ? (
            <button type="button" onClick={remover} disabled={pendente} className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white">
              Confirmar: remover o login
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmarRemocao(true)}
              className="rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              Remover o login
            </button>
          )}
        </div>
      )}
    </>
  );
}
