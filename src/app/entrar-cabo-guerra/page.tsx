"use client";

import { Suspense, useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  buscarSalaCaboGuerraParaEntrada,
  entrarComoAlunoNaSalaCaboGuerra,
  entrarNaSalaCaboGuerra,
  type InfoSalaCaboGuerraEntrada,
} from "@/app/actions/caboGuerraOnline";

function CartaoEntrada() {
  const searchParams = useSearchParams();
  const [codigo, setCodigo] = useState(searchParams.get("codigo") ?? "");
  const [info, setInfo] = useState<Extract<InfoSalaCaboGuerraEntrada, { ok: true }> | null>(null);
  const [apelido, setApelido] = useState("");
  const [alunoId, setAlunoId] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [equipe, setEquipe] = useState<1 | 2>(1);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  function buscarSala(codigoBusca: string) {
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await buscarSalaCaboGuerraParaEntrada(codigoBusca);
      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }
      setInfo(resultado);
    });
  }

  // Se veio de um QR code com ?codigo=, já pula direto pra próxima etapa.
  useEffect(() => {
    const codigoUrl = searchParams.get("codigo");
    if (codigoUrl && codigoUrl.length === 6) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- vem de um QR code, precisa buscar assim que a página abre
      buscarSala(codigoUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function entrarComApelido() {
    if (!info) return;
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await entrarNaSalaCaboGuerra(
        codigo,
        apelido,
        info.modo === "equipes" ? equipe : undefined
      );
      if (resultado && !resultado.ok) {
        setErro(resultado.erro);
      }
    });
  }

  function entrarComAluno() {
    if (!info || !alunoId) return;
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await entrarComoAlunoNaSalaCaboGuerra(
        codigo,
        alunoId,
        pin,
        info.modo === "equipes" ? equipe : undefined
      );
      if (resultado && !resultado.ok) {
        setErro(resultado.erro);
      }
    });
  }

  const seletorEquipe = (
    <div>
      <span className="text-sm font-semibold text-neutral-700">Escolha seu time</span>
      <div className="mt-1 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setEquipe(1)}
          className={`rounded-xl border-2 py-3 text-sm font-extrabold transition ${
            equipe === 1
              ? "border-[#1565C0] bg-[#1565C0]/10 text-[#1565C0]"
              : "border-neutral-200 text-neutral-400 hover:border-neutral-300"
          }`}
        >
          🔵 {info?.nomeEquipe1}
        </button>
        <button
          type="button"
          onClick={() => setEquipe(2)}
          className={`rounded-xl border-2 py-3 text-sm font-extrabold transition ${
            equipe === 2
              ? "border-[#C62828] bg-[#C62828]/10 text-[#C62828]"
              : "border-neutral-200 text-neutral-400 hover:border-neutral-300"
          }`}
        >
          🔴 {info?.nomeEquipe2}
        </button>
      </div>
    </div>
  );

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-50 px-4">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#42A5F5]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-[#EF5350]/10 blur-3xl" />

      <div className="relative w-full max-w-sm rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <Link href="/" className="text-xl font-extrabold text-[#1a3fd4]">
          ItaGameficaEdu
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold text-neutral-900">🪢 Cabo de Guerra</h1>

        {!info ? (
          <>
            <p className="mt-1 text-sm text-neutral-500">Digite o código da sala que o professor mostrou.</p>
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
                onClick={() => buscarSala(codigo)}
                disabled={pendente || codigo.trim().length !== 6}
                className="w-full rounded-xl bg-[#1a3fd4] py-3 text-sm font-extrabold text-white transition hover:brightness-110 active:scale-[0.99] disabled:opacity-60"
              >
                {pendente ? "Procurando..." : "Continuar →"}
              </button>
            </div>
          </>
        ) : info.turma && !alunoId ? (
          <>
            <p className="mt-1 text-sm text-neutral-500">Turma {info.turma.nome} — escolha seu nome:</p>
            <ul className="mt-4 max-h-72 space-y-2 overflow-y-auto">
              {info.turma.alunos.map((aluno) => (
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
              onClick={() => setInfo(null)}
              className="mt-4 text-xs font-semibold text-neutral-400 hover:text-neutral-600"
            >
              ← Trocar código
            </button>
          </>
        ) : info.turma && alunoId ? (
          <>
            <p className="mt-1 text-sm text-neutral-500">
              Oi, {info.turma.alunos.find((a) => a.id === alunoId)?.nome}! Digite seu PIN de 4 dígitos.
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
              {info.modo === "equipes" && seletorEquipe}
              {erro && <p className="text-sm font-medium text-[#ff5470]">{erro}</p>}
              <button
                type="button"
                onClick={entrarComAluno}
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
        ) : (
          <>
            <p className="mt-1 text-sm text-neutral-500">
              Escolha um apelido{info.modo === "equipes" ? " e um time pra defender" : ""}.
            </p>
            <div className="mt-6 space-y-4">
              <input
                value={apelido}
                onChange={(e) => setApelido(e.target.value)}
                type="text"
                maxLength={20}
                placeholder="Como o professor vai te ver"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:border-[#1a3fd4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3fd4]/20"
              />
              {info.modo === "equipes" && seletorEquipe}
              {erro && <p className="text-sm font-medium text-[#ff5470]">{erro}</p>}
              <button
                type="button"
                onClick={entrarComApelido}
                disabled={pendente || apelido.trim().length < 2}
                className="w-full rounded-xl bg-[#1a3fd4] py-3 text-sm font-extrabold text-white transition hover:brightness-110 active:scale-[0.99] disabled:opacity-60"
              >
                {pendente ? "Entrando..." : "Entrar na sala →"}
              </button>
              <button
                type="button"
                onClick={() => setInfo(null)}
                className="w-full text-xs font-semibold text-neutral-400 hover:text-neutral-600"
              >
                ← Trocar código
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function PaginaEntrarCaboGuerra() {
  return (
    <Suspense fallback={null}>
      <CartaoEntrada />
    </Suspense>
  );
}
