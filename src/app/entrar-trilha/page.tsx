"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  buscarAlunosDaTurma,
  entrarComoAluno,
  type ResultadoBuscaTurma,
} from "@/app/actions/trilhaAcesso";

export default function PaginaEntrarTrilha() {
  const [codigo, setCodigo] = useState("");
  const [turma, setTurma] = useState<Extract<ResultadoBuscaTurma, { ok: true }> | null>(null);
  const [alunoId, setAlunoId] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  function buscarTurma() {
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await buscarAlunosDaTurma(codigo);
      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }
      setTurma(resultado);
    });
  }

  function entrar() {
    if (!alunoId) return;
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await entrarComoAluno(alunoId, pin);
      // se der certo, a própria action redireciona pra /trilha
      if (resultado && !resultado.ok) {
        setErro(resultado.erro);
      }
    });
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-50 px-4">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#1a3fd4]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-[#00c264]/10 blur-3xl" />

      <div className="relative w-full max-w-sm rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <Link href="/" className="text-xl font-extrabold text-[#1a3fd4]">
          ItaGameficaEdu
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold text-neutral-900">Minhas trilhas 🧭</h1>

        {!turma ? (
          <>
            <p className="mt-1 text-sm text-neutral-500">
              Digite o código da sua turma (o professor te passou).
            </p>
            <div className="mt-6 space-y-4">
              <input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-3 text-center text-2xl font-extrabold tracking-[0.3em] text-neutral-900 placeholder-neutral-300 focus:border-[#1a3fd4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3fd4]/20"
              />
              {erro && <p className="text-sm font-medium text-[#ff5470]">{erro}</p>}
              <button
                type="button"
                onClick={buscarTurma}
                disabled={pendente || !codigo.trim()}
                className="w-full rounded-xl bg-[#1a3fd4] py-3 text-sm font-extrabold text-white transition hover:brightness-110 active:scale-[0.99] disabled:opacity-60"
              >
                {pendente ? "Procurando..." : "Continuar →"}
              </button>
            </div>
          </>
        ) : !alunoId ? (
          <>
            <p className="mt-1 text-sm text-neutral-500">Turma {turma.turmaNome} — escolha seu nome:</p>
            <ul className="mt-4 max-h-72 space-y-2 overflow-y-auto">
              {turma.alunos.map((aluno) => (
                <li key={aluno.id}>
                  <button
                    type="button"
                    onClick={() => setAlunoId(aluno.id)}
                    className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-left text-sm font-medium text-neutral-800 hover:border-[#1a3fd4] hover:bg-[#1a3fd4]/5"
                  >
                    {aluno.nome}
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setTurma(null)}
              className="mt-4 text-xs font-semibold text-neutral-400 hover:text-neutral-600"
            >
              ← Trocar de turma
            </button>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-neutral-500">
              Oi, {turma.alunos.find((a) => a.id === alunoId)?.nome}! Digite seu PIN de 4 dígitos.
            </p>
            <div className="mt-6 space-y-4">
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="••••"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-3 text-center text-2xl font-extrabold tracking-[0.3em] text-neutral-900 placeholder-neutral-300 focus:border-[#1a3fd4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3fd4]/20"
              />
              {erro && <p className="text-sm font-medium text-[#ff5470]">{erro}</p>}
              <button
                type="button"
                onClick={entrar}
                disabled={pendente || pin.length !== 4}
                className="w-full rounded-xl bg-[#1a3fd4] py-3 text-sm font-extrabold text-white transition hover:brightness-110 active:scale-[0.99] disabled:opacity-60"
              >
                {pendente ? "Entrando..." : "Entrar →"}
              </button>
              <button
                type="button"
                onClick={() => setAlunoId(null)}
                className="w-full text-xs font-semibold text-neutral-400 hover:text-neutral-600"
              >
                ← Não sou eu
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
