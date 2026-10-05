"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { entregarProva, salvarRespostaProva } from "@/app/actions/provas";
import { formatarRelogio, ritmoRecomendado } from "@/lib/provaTempo";
import { rotuloAlternativa } from "@/lib/alternativas";

type Bloco = { nome: string; questoes: { enunciado: string; alternativas: string[]; imagem?: string }[]; total?: number };
type Dados = {
  titulo: string;
  status: "aguardando" | "em_andamento" | "pausada" | "encerrada";
  agora: number;
  restanteSeg: number;
  duracaoSeg: number;
  entregue: boolean;
  blocos: Bloco[];
  respostas: Record<string, string>;
};

const VERDE = "#1e8f4e";

export function ProvaAlunoCliente({ codigo }: { codigo: string }) {
  const [dados, setDados] = useState<Dados | null>(null);
  const [recebidoEm, setRecebidoEm] = useState(0);
  const [agora, setAgora] = useState(() => Date.now());
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [pos, setPos] = useState({ b: 0, q: 0 });
  const [revisar, setRevisar] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(`prova_revisar_${codigo}`) ?? "{}");
    } catch {
      return {};
    }
  });
  const [pendentes, setPendentes] = useState(0);
  const [aviso, setAviso] = useState<string | null>(null);
  const [confirmando, setConfirmando] = useState(false);
  const [entregando, setEntregando] = useState(false);
  const [semSessao, setSemSessao] = useState(false);
  const [cartaoAberto, setCartaoAberto] = useState(false);
  const pendentesRef = useRef<Record<string, string | null>>({});
  const avisados = useRef<Set<number>>(new Set());

  // ---- leitura do estado (relógio e questões vêm sempre do servidor) ----
  const carregar = useCallback(async () => {
    try {
      const r = await fetch(`/api/provas/${codigo}/aluno`, { cache: "no-store" });
      if (r.status === 401) {
        setSemSessao(true);
        return;
      }
      if (!r.ok) return;
      const d = (await r.json()) as Dados;
      setRecebidoEm(Date.now());
      setDados(d);
      // o que ainda está subindo para o servidor vale mais que o que ele devolveu
      const mescla: Record<string, string> = { ...d.respostas };
      for (const [chave, valor] of Object.entries(pendentesRef.current)) {
        if (valor === null) delete mescla[chave];
        else mescla[chave] = valor;
      }
      setRespostas(mescla);
    } catch {
      // sem rede: a tela continua com o relógio local e tenta de novo
    }
  }, [codigo]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- primeira leitura ao abrir a tela
    carregar();
    const busca = setInterval(carregar, 4000);
    const relogio = setInterval(() => setAgora(Date.now()), 500);
    const aoVoltar = () => document.visibilityState === "visible" && carregar();
    document.addEventListener("visibilitychange", aoVoltar);
    return () => {
      clearInterval(busca);
      clearInterval(relogio);
      document.removeEventListener("visibilitychange", aoVoltar);
    };
  }, [carregar, codigo]);

  const status = dados?.status;
  const restante = dados
    ? dados.status === "em_andamento"
      ? dados.restanteSeg - (agora - recebidoEm) / 1000
      : dados.restanteSeg
    : 0;

  // tela sempre acesa durante a prova (quando o tablet permite)
  useEffect(() => {
    if (status !== "em_andamento") return;
    let trava: { release: () => Promise<void> } | null = null;
    (navigator as unknown as { wakeLock?: { request: (t: string) => Promise<{ release: () => Promise<void> }> } }).wakeLock
      ?.request("screen")
      .then((t) => (trava = t))
      .catch(() => {});
    const antes = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", antes);
    return () => {
      window.removeEventListener("beforeunload", antes);
      trava?.release().catch(() => {});
    };
  }, [status]);

  // quando o tempo zera, busca o estado a cada 1,5 s até o servidor encerrar
  const acabou = status === "em_andamento" && restante <= 0;
  useEffect(() => {
    if (!acabou) return;
    const t = setInterval(carregar, 1500);
    return () => clearInterval(t);
  }, [acabou, carregar]);

  // avisos de tempo
  useEffect(() => {
    if (status !== "em_andamento") return;
    for (const limite of [1800, 600, 300, 60]) {
      if (restante <= limite && restante > limite - 30 && !avisados.current.has(limite)) {
        avisados.current.add(limite);
        setAviso(limite >= 120 ? `Faltam ${limite / 60} minutos. Confira as questões em branco.` : "Falta 1 minuto! Marque o que ainda está em branco.");
        setTimeout(() => setAviso(null), 9000);
      }
    }
  }, [restante, status]);

  const totais = useMemo(() => dados?.blocos.map((b) => b.questoes.length) ?? [], [dados]);
  const decorrido = dados ? dados.duracaoSeg - restante : 0;
  const ritmo = useMemo(
    () => ritmoRecomendado(totais, dados?.duracaoSeg ?? 1, Math.max(0, decorrido)),
    [totais, dados?.duracaoSeg, decorrido]
  );

  // ---- marcar resposta ----
  async function enviar(b: number, q: number, alternativa: string | null) {
    const chave = `${b}:${q}`;
    pendentesRef.current[chave] = alternativa;
    setPendentes(Object.keys(pendentesRef.current).length);
    for (let tentativa = 0; tentativa < 6; tentativa++) {
      try {
        const r = await salvarRespostaProva(codigo, b, q, alternativa);
        if (r.ok || r.fim) {
          if (pendentesRef.current[chave] === alternativa) delete pendentesRef.current[chave];
          setPendentes(Object.keys(pendentesRef.current).length);
          if (!r.ok) carregar();
          return;
        }
        if (!r.ok && /Sessão perdida/.test(r.erro)) {
          setSemSessao(true);
          return;
        }
      } catch {}
      await new Promise((res) => setTimeout(res, 2000 * (tentativa + 1)));
    }
  }

  function marcar(b: number, q: number, alternativa: string) {
    const chave = `${b}:${q}`;
    const nova = respostas[chave] === alternativa ? null : alternativa;
    setRespostas((atual) => {
      const copia = { ...atual };
      if (nova === null) delete copia[chave];
      else copia[chave] = nova;
      return copia;
    });
    enviar(b, q, nova);
  }

  function alternarRevisar(b: number, q: number) {
    const chave = `${b}:${q}`;
    setRevisar((atual) => {
      const novo = { ...atual, [chave]: !atual[chave] };
      try {
        localStorage.setItem(`prova_revisar_${codigo}`, JSON.stringify(novo));
      } catch {}
      return novo;
    });
  }

  async function entregar() {
    setEntregando(true);
    // espera as marcações pendentes subirem antes de entregar
    for (let i = 0; i < 10 && Object.keys(pendentesRef.current).length > 0; i++) await new Promise((r) => setTimeout(r, 500));
    await entregarProva(codigo);
    setConfirmando(false);
    setEntregando(false);
    carregar();
  }

  // ---------------- telas ----------------
  if (semSessao) {
    return (
      <Centro>
        <p className="text-lg font-bold text-neutral-900">Sua sessão acabou.</p>
        <a href={`/prova?codigo=${codigo}`} className="mt-4 inline-block rounded-xl px-6 py-3 font-bold text-white" style={{ backgroundColor: VERDE }}>
          Entrar de novo
        </a>
      </Centro>
    );
  }
  if (!dados) return <Centro><p className="text-neutral-500">Carregando...</p></Centro>;

  if (dados.status === "aguardando") {
    const total = dados.blocos.reduce((s, b) => s + (b.total ?? b.questoes.length), 0);
    return (
      <Centro>
        <p className="text-sm font-bold" style={{ color: VERDE }}>{dados.titulo}</p>
        <p className="mt-3 text-3xl font-extrabold text-neutral-900">Você está dentro!</p>
        <p className="mt-3 text-neutral-600">
          Aguarde o professor iniciar. A prova tem <strong>{total} questões</strong> em <strong>{formatarRelogio(dados.duracaoSeg)}</strong>.
          Você escolhe a ordem em que responde e pode voltar nas questões enquanto houver tempo.
        </p>
        <p className="mt-4 text-sm text-neutral-400">Não feche esta tela.</p>
      </Centro>
    );
  }

  if (dados.status === "encerrada" || dados.entregue) {
    const marcadas = Object.keys(respostas).length;
    const total = totais.reduce((a, b) => a + b, 0);
    return (
      <Centro>
        <p className="text-5xl">✅</p>
        <p className="mt-3 text-3xl font-extrabold text-neutral-900">Prova entregue</p>
        <p className="mt-3 text-neutral-600">
          Você marcou {marcadas} de {total} questões. O resultado vai aparecer com o seu professor.
        </p>
      </Centro>
    );
  }

  const bloco = dados.blocos[pos.b];
  const questao = bloco.questoes[pos.q];
  const chaveAtual = `${pos.b}:${pos.q}`;
  const respondidasNoBloco = bloco.questoes.filter((_, q) => respostas[`${pos.b}:${q}`] !== undefined).length;
  const esperadas = ritmo.blocos[pos.b].questoesEsperadas;
  const diferenca = esperadas - respondidasNoBloco;
  const corRitmo = diferenca <= 0 ? "text-green-700" : diferenca <= 3 ? "text-amber-700" : "text-red-700";
  const emConferencia = decorrido >= ritmo.inicioConferenciaSeg;
  const emBranco = totais.map((n, b) => Array.from({ length: n }, (_, q) => q).filter((q) => respostas[`${b}:${q}`] === undefined).length);
  const corRelogio = restante <= 300 ? "text-red-600" : restante <= 900 ? "text-amber-600" : "text-neutral-900";

  function irPara(b: number, q: number) {
    setPos({ b, q });
    setCartaoAberto(false);
    window.scrollTo({ top: 0 });
  }
  function proxima() {
    if (pos.q < bloco.questoes.length - 1) irPara(pos.b, pos.q + 1);
    else if (pos.b < dados!.blocos.length - 1) irPara(pos.b + 1, 0);
  }
  function anterior() {
    if (pos.q > 0) irPara(pos.b, pos.q - 1);
    else if (pos.b > 0) irPara(pos.b - 1, dados!.blocos[pos.b - 1].questoes.length - 1);
  }

  const cartao = (
    <div className="space-y-4">
      {dados.blocos.map((bl, b) => (
        <div key={b}>
          <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
            {bl.nome} · {bl.questoes.length - emBranco[b]}/{bl.questoes.length}
          </p>
          <div className="mt-2 grid grid-cols-7 gap-1.5 sm:grid-cols-9 lg:grid-cols-6">
            {bl.questoes.map((_, q) => {
              const chave = `${b}:${q}`;
              const feita = respostas[chave] !== undefined;
              const atual = pos.b === b && pos.q === q;
              return (
                <button
                  key={q}
                  type="button"
                  onClick={() => irPara(b, q)}
                  className={`relative h-10 rounded-lg border text-sm font-bold ${
                    feita ? "border-[#1e8f4e] bg-[#1e8f4e] text-white" : "border-neutral-300 bg-white text-neutral-700"
                  } ${atual ? "ring-2 ring-offset-1 ring-neutral-900" : ""}`}
                >
                  {q + 1}
                  {revisar[chave] && <span className="absolute -right-1 -top-1 text-xs">🚩</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 pb-28 select-none">
      {/* barra fixa: relógio sempre à vista */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-bold" style={{ color: VERDE }}>{dados.titulo}</p>
            <p className="text-xs text-neutral-500">
              {pendentes > 0 ? "Salvando..." : "✓ Respostas salvas"}
            </p>
          </div>
          <p className={`font-mono text-3xl font-extrabold tabular-nums sm:text-4xl ${corRelogio} ${restante <= 60 ? "animate-pulse" : ""}`}>
            {formatarRelogio(restante)}
          </p>
          <button type="button" onClick={() => setConfirmando(true)} className="rounded-xl px-4 py-2 text-sm font-extrabold text-white" style={{ backgroundColor: VERDE }}>
            Entregar
          </button>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-2">
          <div className="flex gap-2">
            {dados.blocos.map((bl, b) => (
              <button
                key={b}
                type="button"
                onClick={() => irPara(b, 0)}
                className={`rounded-lg px-3 py-1.5 text-sm font-bold ${pos.b === b ? "text-white" : "bg-neutral-100 text-neutral-600"}`}
                style={pos.b === b ? { backgroundColor: VERDE } : undefined}
              >
                {bl.nome}
              </button>
            ))}
          </div>
          <p className={`mt-1.5 text-xs font-semibold ${emConferencia ? "text-amber-700" : corRitmo}`}>
            {emConferencia
              ? "Hora da conferência: revise as questões em branco e as marcadas com 🚩."
              : `Ritmo ideal neste bloco: questão ${Math.min(bloco.questoes.length, Math.max(1, esperadas))}. Você marcou ${respondidasNoBloco}.`}
          </p>
        </div>
      </header>

      {dados.status === "pausada" && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-6 text-center">
          <div className="rounded-2xl bg-white p-8">
            <p className="text-4xl">⏸</p>
            <p className="mt-2 text-2xl font-extrabold text-neutral-900">Prova pausada</p>
            <p className="mt-2 text-neutral-600">O relógio está parado. Aguarde o professor.</p>
          </div>
        </div>
      )}

      {aviso && <div className="fixed left-1/2 top-24 z-40 w-[92%] max-w-lg -translate-x-1/2 rounded-xl bg-amber-500 px-4 py-3 text-center text-sm font-bold text-white shadow-lg">{aviso}</div>}

      <div className="mx-auto mt-4 grid max-w-6xl gap-4 px-4 lg:grid-cols-[1fr_300px]">
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-neutral-500">
              {bloco.nome} · Questão {pos.q + 1} de {bloco.questoes.length}
            </p>
            <button
              type="button"
              onClick={() => alternarRevisar(pos.b, pos.q)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${revisar[chaveAtual] ? "border-amber-400 bg-amber-50 text-amber-700" : "border-neutral-300 text-neutral-500"}`}
            >
              🚩 {revisar[chaveAtual] ? "Marcada para revisar" : "Marcar para revisar"}
            </button>
          </div>

          <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-neutral-900">{questao.enunciado}</p>
          {questao.imagem && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={questao.imagem} alt={`Figura da questão ${pos.q + 1}`} className="mt-4 block max-h-96 w-auto max-w-full rounded-lg border border-neutral-200" />
          )}

          <div className="mt-5 space-y-3">
            {questao.alternativas.map((alt, i) => {
              const escolhida = respostas[chaveAtual] === alt;
              return (
                <button
                  key={alt}
                  type="button"
                  onClick={() => marcar(pos.b, pos.q, alt)}
                  className={`w-full rounded-2xl border-2 px-5 py-4 text-left text-base leading-snug transition active:scale-[0.99] ${
                    escolhida ? "border-[#1e8f4e] bg-[#1e8f4e]/10 font-bold text-[#0f5c31]" : "border-neutral-200 text-neutral-800 hover:border-neutral-400"
                  }`}
                >
                  {rotuloAlternativa(alt, i)}
                </button>
              );
            })}
          </div>
          {respostas[chaveAtual] !== undefined && (
            <button type="button" onClick={() => marcar(pos.b, pos.q, respostas[chaveAtual])} className="mt-3 text-xs font-semibold text-neutral-400 underline">
              Limpar resposta desta questão
            </button>
          )}
        </section>

        <aside className="hidden h-fit rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm lg:block">
          <p className="mb-3 font-bold text-neutral-900">Cartão-resposta</p>
          {cartao}
          <p className="mt-4 text-xs text-neutral-500">Verde: marcada. Branca: em branco. 🚩: para revisar.</p>
        </aside>
      </div>

      {/* navegação fixa embaixo */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <button type="button" onClick={anterior} className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-bold text-neutral-700">
            ← Anterior
          </button>
          <button type="button" onClick={() => setCartaoAberto(true)} className="rounded-xl border border-neutral-300 px-4 py-3 text-sm font-bold text-neutral-700 lg:hidden">
            Cartão ({emBranco.reduce((a, b) => a + b, 0)} em branco)
          </button>
          <button type="button" onClick={proxima} className="rounded-xl px-5 py-3 text-sm font-bold text-white" style={{ backgroundColor: VERDE }}>
            Próxima →
          </button>
        </div>
      </nav>

      {cartaoAberto && (
        <div className="fixed inset-0 z-40 flex items-end bg-black/50 lg:hidden" onClick={() => setCartaoAberto(false)}>
          <div className="max-h-[80vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <p className="mb-3 font-bold text-neutral-900">Cartão-resposta</p>
            {cartao}
            <button type="button" onClick={() => setCartaoAberto(false)} className="mt-4 w-full rounded-xl border border-neutral-300 py-3 text-sm font-bold text-neutral-700">
              Fechar
            </button>
          </div>
        </div>
      )}

      {confirmando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <p className="text-xl font-extrabold text-neutral-900">Entregar a prova?</p>
            <ul className="mt-3 space-y-1 text-sm text-neutral-700">
              {dados.blocos.map((bl, b) => (
                <li key={b}>
                  {bl.nome}: <strong>{emBranco[b]}</strong> em branco de {bl.questoes.length}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-neutral-500">Depois de entregar, você não consegue mais mudar as respostas. Ainda restam {formatarRelogio(restante)}.</p>
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setConfirmando(false)} disabled={entregando} className="flex-1 rounded-xl border border-neutral-300 py-3 font-bold text-neutral-700">
                Voltar à prova
              </button>
              <button type="button" onClick={entregar} disabled={entregando} className="flex-1 rounded-xl py-3 font-extrabold text-white disabled:opacity-60" style={{ backgroundColor: VERDE }}>
                {entregando ? "Entregando..." : "Entregar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Centro({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <div className="max-w-md text-center">{children}</div>
    </main>
  );
}
