"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import {
  adicionarTempoProva,
  encerrarProvaAgora,
  iniciarProva,
  pausarProva,
  retomarProva,
} from "@/app/actions/provas";
import { QrCodeEntrada } from "@/components/comum/QrCodeEntrada";
import { formatarRelogio, ritmoRecomendado } from "@/lib/provaTempo";
import { VERDE_SPAECE, VERDE_SPAECE_ESCURO } from "@/lib/spaece";

type Participante = {
  alunoId: string;
  nome: string;
  respondidas: number[];
  entregue: boolean;
  online: boolean;
  acertos?: number[];
};

type Estado = {
  titulo: string;
  codigo: string;
  turma: string;
  status: "aguardando" | "em_andamento" | "pausada" | "encerrada";
  agora: number;
  restanteSeg: number;
  duracaoSeg: number;
  blocos: { nome: string; total: number }[];
  participantes: Participante[];
  ausentes: string[];
};

const ROTULO: Record<Estado["status"], string> = {
  aguardando: "Aguardando início",
  em_andamento: "Em andamento",
  pausada: "Pausada",
  encerrada: "Encerrada",
};

// Painel do professor: serve também para projetar na lousa (relógio grande).
export function ControleProvaCliente({ codigo }: { codigo: string }) {
  const [estado, setEstado] = useState<Estado | null>(null);
  const [recebidoEm, setRecebidoEm] = useState(0);
  const [agora, setAgora] = useState(() => Date.now());
  const [erro, setErro] = useState<string | null>(null);
  const [confirmarFim, setConfirmarFim] = useState(false);
  const [pendente, iniciar] = useTransition();
  const origem = typeof window === "undefined" ? "" : window.location.origin;
  const ultimo = useRef(0);

  const carregar = useCallback(async () => {
    try {
      const r = await fetch(`/api/provas/${codigo}/professor`, { cache: "no-store" });
      if (!r.ok) return;
      const dados = (await r.json()) as Estado;
      ultimo.current = Date.now();
      setRecebidoEm(Date.now());
      setEstado(dados);
    } catch {
      // sem rede por um instante: tenta de novo no próximo ciclo
    }
  }, [codigo]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- primeira leitura ao abrir a tela
    carregar();
    const busca = setInterval(carregar, 2500);
    const relogio = setInterval(() => setAgora(Date.now()), 500);
    return () => {
      clearInterval(busca);
      clearInterval(relogio);
    };
  }, [carregar]);

  function acao(fn: () => Promise<{ ok: boolean; erro?: string }>) {
    setErro(null);
    iniciar(async () => {
      const r = await fn();
      if (!r.ok) setErro(r.erro ?? "Não foi possível executar.");
      await carregar();
    });
  }

  if (!estado) return <p className="mt-10 text-center text-sm text-neutral-500">Carregando a prova...</p>;

  const correndo = estado.status === "em_andamento";
  const restante = correndo
    ? estado.restanteSeg - (agora - recebidoEm) / 1000
    : estado.restanteSeg;
  const decorrido = estado.duracaoSeg - restante;
  const urlAluno = `${origem}/prova?codigo=${estado.codigo}`;
  const ritmo = ritmoRecomendado(
    estado.blocos.map((b) => b.total),
    estado.duracaoSeg,
    Math.max(0, decorrido)
  );
  const emConferencia = decorrido >= ritmo.inicioConferenciaSeg;
  const corRelogio = restante <= 300 && correndo ? "text-red-600" : restante <= 600 && correndo ? "text-amber-600" : "text-neutral-900";
  const progresso = Math.min(100, Math.max(0, (decorrido / estado.duracaoSeg) * 100));

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-extrabold text-neutral-900">{estado.titulo}</h1>
          <p className="text-sm text-neutral-500">
            {estado.turma} · {estado.blocos.map((b) => `${b.nome} (${b.total})`).join(" + ")}
          </p>
        </div>
        <span className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: estado.status === "encerrada" ? "#6b7280" : VERDE_SPAECE }}>
          {ROTULO[estado.status]}
        </span>
      </div>

      {estado.status === "aguardando" && (
        <div className="mt-5 rounded-2xl border bg-white p-6 text-center shadow-sm" style={{ borderColor: `${VERDE_SPAECE}55` }}>
          <p className="text-sm font-semibold text-neutral-500">Código da prova</p>
          <p className="text-6xl font-extrabold tracking-widest" style={{ color: VERDE_SPAECE_ESCURO }}>
            {estado.codigo}
          </p>
          <p className="mt-2 text-sm text-neutral-600">
            Os alunos abrem <strong>itagame.itatecnologiaeducacional.tech/prova</strong>, digitam o código, escolhem o nome e
            digitam o PIN.
          </p>
          {origem && (
            <div className="mt-4 flex justify-center">
              <QrCodeEntrada url={urlAluno} tamanho={200} />
            </div>
          )}
          <p className="mt-4 text-sm text-neutral-600">
            Tempo da prova: <strong>{formatarRelogio(estado.duracaoSeg)}</strong>. O relógio só começa quando você clicar em Iniciar.
          </p>
          <button
            type="button"
            onClick={() => acao(() => iniciarProva(codigo))}
            disabled={pendente}
            className="mt-4 rounded-xl px-8 py-3 text-lg font-extrabold text-white disabled:opacity-60"
            style={{ backgroundColor: VERDE_SPAECE }}
          >
            ▶ Iniciar prova ({estado.participantes.length} no aguardo)
          </button>
        </div>
      )}

      {estado.status !== "aguardando" && (
        <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
          {estado.status === "encerrada" ? (
            <p className="text-3xl font-extrabold text-neutral-700">Prova encerrada</p>
          ) : (
            <p className={`font-mono text-7xl font-extrabold tabular-nums sm:text-8xl ${corRelogio}`}>
              {formatarRelogio(restante)}
            </p>
          )}
          {estado.status !== "encerrada" && (
            <>
              <div className="mx-auto mt-4 h-3 max-w-xl overflow-hidden rounded-full bg-neutral-200">
                <div className="h-full" style={{ width: `${progresso}%`, backgroundColor: VERDE_SPAECE }} />
              </div>
              <p className="mt-3 text-sm text-neutral-600">
                {emConferencia
                  ? "Hora da conferência: revisar as respostas e as questões em branco."
                  : ritmo.blocos
                      .map((r, i) => ({ r, i }))
                      .filter(({ r }) => decorrido >= r.inicioSeg && decorrido < r.fimSeg)
                      .map(({ r, i }) => `${estado.blocos[i].nome}: ritmo ideal, questão ${Math.max(1, r.questoesEsperadas)} de ${estado.blocos[i].total}`)
                      .join(" · ") || "Bom trabalho!"}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {estado.status === "em_andamento" ? (
                  <button type="button" onClick={() => acao(() => pausarProva(codigo))} disabled={pendente} className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-bold text-neutral-700 hover:bg-neutral-50">
                    ⏸ Pausar
                  </button>
                ) : (
                  <button type="button" onClick={() => acao(() => retomarProva(codigo))} disabled={pendente} className="rounded-lg px-4 py-2 text-sm font-bold text-white" style={{ backgroundColor: VERDE_SPAECE }}>
                    ▶ Retomar
                  </button>
                )}
                <button type="button" onClick={() => acao(() => adicionarTempoProva(codigo, 5))} disabled={pendente} className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-bold text-neutral-700 hover:bg-neutral-50">
                  +5 minutos
                </button>
                {confirmarFim ? (
                  <button type="button" onClick={() => acao(() => encerrarProvaAgora(codigo))} disabled={pendente} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white">
                    Confirmar: encerrar para todos
                  </button>
                ) : (
                  <button type="button" onClick={() => setConfirmarFim(true)} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                    Encerrar prova
                  </button>
                )}
              </div>
            </>
          )}
          {estado.status === "pausada" && <p className="mt-3 text-sm font-semibold text-amber-700">Prova pausada: os alunos veem o aviso e o relógio está parado.</p>}
        </div>
      )}

      {erro && <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{erro}</p>}

      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <p className="font-bold text-neutral-900">
          {estado.status === "encerrada" ? "Resultado da turma" : `Alunos na prova (${estado.participantes.length})`}
        </p>
        {estado.participantes.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-500">Ninguém entrou ainda.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
                  <th className="py-2 pr-3">Aluno</th>
                  {estado.blocos.map((b) => (
                    <th key={b.nome} className="py-2 pr-3 text-center">
                      {estado.status === "encerrada" ? `Acertos ${b.nome}` : `${b.nome} marcadas`}
                    </th>
                  ))}
                  <th className="py-2 text-center">{estado.status === "encerrada" ? "Total" : "Situação"}</th>
                </tr>
              </thead>
              <tbody>
                {(estado.status === "encerrada"
                  ? [...estado.participantes].sort(
                      (a, b) => (b.acertos?.reduce((x, y) => x + y, 0) ?? 0) - (a.acertos?.reduce((x, y) => x + y, 0) ?? 0)
                    )
                  : estado.participantes
                ).map((p) => {
                  const total = estado.blocos.reduce((s, b) => s + b.total, 0);
                  const certas = p.acertos?.reduce((x, y) => x + y, 0) ?? 0;
                  const atrasado =
                    estado.status === "em_andamento" &&
                    !p.entregue &&
                    p.respondidas.some((r, i) => r + 3 < ritmo.blocos[i].questoesEsperadas);
                  return (
                    <tr key={p.alunoId} className="border-b border-neutral-100">
                      <td className="py-2 pr-3 font-medium text-neutral-800">
                        {estado.status !== "encerrada" && (
                          <span className={`mr-2 inline-block h-2 w-2 rounded-full ${p.online ? "bg-green-500" : "bg-neutral-300"}`} title={p.online ? "conectado" : "sem sinal"} />
                        )}
                        {p.nome}
                      </td>
                      {estado.blocos.map((b, i) => (
                        <td key={b.nome} className="py-2 pr-3 text-center tabular-nums text-neutral-700">
                          {estado.status === "encerrada" ? `${p.acertos?.[i] ?? 0}/${b.total}` : `${p.respondidas[i]}/${b.total}`}
                        </td>
                      ))}
                      <td className="py-2 text-center text-xs font-semibold">
                        {estado.status === "encerrada" ? (
                          <span className="tabular-nums text-neutral-800">
                            {certas}/{total} ({Math.round((certas / total) * 100)}%)
                          </span>
                        ) : p.entregue ? (
                          <span className="text-green-700">Entregou</span>
                        ) : atrasado ? (
                          <span className="text-amber-700">Atrasado no ritmo</span>
                        ) : (
                          <span className="text-neutral-500">Fazendo</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {estado.ausentes.length > 0 && (
          <p className="mt-4 text-xs text-neutral-500">
            <strong>{estado.status === "encerrada" ? "Não fizeram" : "Ainda não entraram"} ({estado.ausentes.length}):</strong>{" "}
            {estado.ausentes.join(", ")}
          </p>
        )}
      </div>

      {estado.status === "encerrada" && (
        <p className="mt-4 text-center text-sm text-neutral-600">
          Os resultados já foram para o{" "}
          <Link href="/painel/spaece/resultados-matematica" className="font-bold underline" style={{ color: VERDE_SPAECE }}>
            relatório de desempenho
          </Link>
          .
        </p>
      )}
    </div>
  );
}
