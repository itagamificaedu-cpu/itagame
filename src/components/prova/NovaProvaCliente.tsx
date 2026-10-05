"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { criarProva } from "@/app/actions/provas";
import { VERDE_SPAECE } from "@/lib/spaece";

type Simulado = { id: string; tema: string; disciplina: string; total: number };
type Turma = { id: string; nome: string };

function textoDeTempo(min: number) {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return h > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${m} min`;
}

export function NovaProvaCliente({ simulados, turmas }: { simulados: Simulado[]; turmas: Turma[] }) {
  const router = useRouter();
  const [titulo, setTitulo] = useState("Simulado SPAECE 9º ano");
  const [turmaId, setTurmaId] = useState(turmas[0]?.id ?? "");
  const [duracao, setDuracao] = useState(150);
  const [escolhidos, setEscolhidos] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();

  function alternar(id: string) {
    setEscolhidos((atual) => (atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id].slice(0, 3)));
  }

  const blocos = escolhidos.map((id) => simulados.find((s) => s.id === id)!).filter(Boolean);
  const totalQuestoes = blocos.reduce((soma, b) => soma + b.total, 0);
  const tempoResolver = duracao * 0.9;
  const porQuestaoSeg = totalQuestoes > 0 ? (tempoResolver * 60) / totalQuestoes : 0;

  function criar() {
    setErro(null);
    iniciar(async () => {
      const r = await criarProva({ titulo, turmaId, atividadeIds: escolhidos, duracaoMin: duracao });
      if (r.ok) router.push(`/painel/spaece/prova/${r.codigo}`);
      else setErro(r.erro);
    });
  }

  return (
    <div className="mt-6 space-y-5">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <p className="font-bold text-neutral-900">1. Escolha os simulados da prova, na ordem em que aparecem</p>
        <p className="mt-1 text-xs text-neutral-500">
          Para a prova completa do SPAECE, marque primeiro o de Língua Portuguesa e depois o de Matemática (26 + 26 questões).
        </p>
        <ul className="mt-3 space-y-2">
          {simulados.map((s) => {
            const posicao = escolhidos.indexOf(s.id);
            return (
              <li key={s.id}>
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm ${
                    posicao >= 0 ? "border-[#1e8f4e] bg-[#1e8f4e]/5" : "border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  <input type="checkbox" checked={posicao >= 0} onChange={() => alternar(s.id)} className="h-4 w-4" />
                  <span className="min-w-0 flex-1">
                    <span className="font-semibold text-neutral-800">{s.tema.replace(" (SPAECE)", "")}</span>
                    <span className="ml-2 text-xs text-neutral-500">
                      {s.disciplina} · {s.total} questões
                    </span>
                  </span>
                  {posicao >= 0 && (
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ backgroundColor: VERDE_SPAECE }}>
                      {posicao + 1}º bloco
                    </span>
                  )}
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <p className="font-bold text-neutral-900">2. Turma, nome e tempo</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="text-sm sm:col-span-3">
            <span className="text-neutral-600">Nome da prova</span>
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2" />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="text-neutral-600">Turma</span>
            <select value={turmaId} onChange={(e) => setTurmaId(e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2">
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-neutral-600">Duração (minutos)</span>
            <input
              type="number"
              min={10}
              max={300}
              value={duracao}
              onChange={(e) => setDuracao(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
            />
          </label>
        </div>
      </div>

      {totalQuestoes > 0 && (
        <div className="rounded-2xl border p-5 text-sm text-neutral-700" style={{ borderColor: `${VERDE_SPAECE}55`, backgroundColor: `${VERDE_SPAECE}0d` }}>
          <p className="font-bold text-neutral-900">Estratégia de tempo dessa prova</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              {totalQuestoes} questões em {textoDeTempo(duracao)}: cerca de <strong>{Math.floor(porQuestaoSeg / 60)}min{String(Math.round(porQuestaoSeg % 60)).padStart(2, "0")}s por questão</strong>.
            </li>
            <li>
              {textoDeTempo(duracao * 0.1)} ficam reservados para a conferência no final (o aluno vê o aviso).
            </li>
            {blocos.map((b, i) => (
              <li key={b.id}>
                {i + 1}º bloco, {b.disciplina}: {b.total} questões, ideal em {textoDeTempo((b.total * porQuestaoSeg) / 60)}.
              </li>
            ))}
            <li>O cartão-resposta é preenchido na própria tela, sem gastar tempo passando para folha.</li>
          </ul>
        </div>
      )}

      {erro && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{erro}</p>}

      <button
        type="button"
        onClick={criar}
        disabled={pendente || escolhidos.length === 0 || !turmaId}
        className="w-full rounded-xl py-3 text-base font-extrabold text-white disabled:opacity-50"
        style={{ backgroundColor: VERDE_SPAECE }}
      >
        {pendente ? "Criando..." : "⏱️ Criar prova cronometrada"}
      </button>
    </div>
  );
}
