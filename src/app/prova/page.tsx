"use client";

import { Suspense, useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { buscarProvaParaEntrada, entrarComoAlunoNaProva, type InfoProvaEntrada } from "@/app/actions/provas";

function Entrada() {
  const params = useSearchParams();
  const [codigo, setCodigo] = useState(params.get("codigo") ?? "");
  const [info, setInfo] = useState<Extract<InfoProvaEntrada, { ok: true }> | null>(null);
  const [alunoId, setAlunoId] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();

  function buscar(c: string) {
    setErro(null);
    iniciar(async () => {
      const r = await buscarProvaParaEntrada(c);
      if (!r.ok) setErro(r.erro);
      else setInfo(r);
    });
  }

  useEffect(() => {
    const c = params.get("codigo");
    if (c && c.length === 6) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- vem do QR code, busca assim que abre
      buscar(c);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function entrar() {
    if (!alunoId) return;
    setErro(null);
    iniciar(async () => {
      const r = await entrarComoAlunoNaProva(codigo.trim(), alunoId, pin);
      if (r && !r.ok) setErro(r.erro);
    });
  }

  const aluno = info?.alunos.find((a) => a.id === alunoId);

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold text-[#1e8f4e]">ItaGameficaEdu</p>
        <h1 className="mt-2 text-2xl font-extrabold text-neutral-900">⏱️ Prova SPAECE</h1>

        {!info ? (
          <>
            <p className="mt-1 text-sm text-neutral-500">Digite o código que está na lousa.</p>
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              className="mt-5 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-3 text-center text-3xl font-extrabold tracking-[0.3em]"
            />
            {erro && <p className="mt-3 text-sm font-semibold text-red-600">{erro}</p>}
            <button
              type="button"
              onClick={() => buscar(codigo.trim())}
              disabled={pendente || codigo.trim().length !== 6}
              className="mt-4 w-full rounded-xl bg-[#1e8f4e] py-3 text-base font-extrabold text-white disabled:opacity-50"
            >
              {pendente ? "Procurando..." : "Continuar"}
            </button>
          </>
        ) : !alunoId ? (
          <>
            <p className="mt-1 text-sm text-neutral-500">
              {info.titulo} · {info.turma}. Escolha o seu nome:
            </p>
            <ul className="mt-4 max-h-80 space-y-2 overflow-y-auto">
              {info.alunos.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => setAlunoId(a.id)}
                    className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-left text-sm font-semibold text-neutral-800 hover:border-[#1e8f4e] hover:bg-[#1e8f4e]/5"
                  >
                    {a.nome}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-neutral-500">Oi, {aluno?.nome}! Digite o seu PIN de 4 dígitos.</p>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="••••"
              className="mt-5 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-3 text-center text-3xl font-extrabold tracking-[0.3em]"
            />
            {erro && <p className="mt-3 text-sm font-semibold text-red-600">{erro}</p>}
            <button
              type="button"
              onClick={entrar}
              disabled={pendente || pin.length !== 4}
              className="mt-4 w-full rounded-xl bg-[#1e8f4e] py-3 text-base font-extrabold text-white disabled:opacity-50"
            >
              {pendente ? "Entrando..." : "Entrar na prova"}
            </button>
            <button type="button" onClick={() => { setAlunoId(null); setPin(""); setErro(null); }} className="mt-3 w-full text-xs font-semibold text-neutral-400">
              ← Não sou eu
            </button>
          </>
        )}
      </div>
    </main>
  );
}

export default function PaginaEntrarProva() {
  return (
    <Suspense>
      <Entrada />
    </Suspense>
  );
}
