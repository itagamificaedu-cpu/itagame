"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { entregarMissao, responderQuizMissao, type QuestaoQuizMissao } from "@/app/actions/missoes";

type Props = {
  progressoId: string;
  status: "bloqueada" | "disponivel" | "em_andamento" | "concluida";
  checkpointTipo: "quiz_automatico" | "correcao_professor" | "avaliacao_pratica" | "banca";
  quizPerguntas: QuestaoQuizMissao[] | null;
  feedbackProfessor: string | null;
  entregaTextoAtual: string | null;
  xpRecompensa: number;
  xpGanho: number;
};

export function MissaoAlunoCliente({
  progressoId,
  status,
  checkpointTipo,
  quizPerguntas,
  feedbackProfessor,
  entregaTextoAtual,
  xpRecompensa,
  xpGanho,
}: Props) {
  const [texto, setTexto] = useState(entregaTextoAtual ?? "");
  const [respostas, setRespostas] = useState<string[]>(() => (quizPerguntas ?? []).map(() => ""));
  const [resultadoQuiz, setResultadoQuiz] = useState<
    { aprovado: boolean; acertos: number; total: number } | null
  >(null);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();
  const router = useRouter();

  if (status === "concluida") {
    return (
      <div className="rounded-2xl border border-[#00c264]/30 bg-[#00c264]/10 p-6 text-center">
        <p className="text-3xl">✅</p>
        <p className="mt-2 font-bold text-[#00854a]">Missão concluída!</p>
        <p className="mt-1 text-sm text-[#00854a]">Você ganhou {xpGanho} XP.</p>
      </div>
    );
  }

  if (status === "em_andamento" && checkpointTipo !== "quiz_automatico") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <p className="font-bold text-amber-900">⏳ Aguardando correção do professor</p>
        <p className="mt-2 whitespace-pre-wrap rounded-lg bg-white p-3 text-sm text-neutral-700">
          {entregaTextoAtual}
        </p>
      </div>
    );
  }

  if (checkpointTipo === "quiz_automatico") {
    async function enviarQuiz() {
      setErro(null);
      iniciarTransicao(async () => {
        const resultado = await responderQuizMissao(progressoId, respostas);
        if (!resultado.ok) {
          setErro(resultado.erro);
          return;
        }
        setResultadoQuiz(resultado);
        if (resultado.aprovado) {
          router.refresh();
        }
      });
    }

    return (
      <div className="space-y-4">
        {feedbackProfessor && !resultadoQuiz && (
          <p className="rounded-lg bg-neutral-100 px-4 py-3 text-sm text-neutral-600">
            {feedbackProfessor}
          </p>
        )}
        {(quizPerguntas ?? []).map((pergunta, indice) => (
          <div key={indice} className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="font-semibold text-neutral-900">
              {indice + 1}. {pergunta.enunciado}
            </p>
            <div className="mt-3 space-y-2">
              {pergunta.alternativas.map((alt) => (
                <button
                  key={alt}
                  type="button"
                  onClick={() =>
                    setRespostas((atual) => atual.map((r, i) => (i === indice ? alt : r)))
                  }
                  className={`w-full rounded-lg border-2 px-4 py-2 text-left text-sm font-medium ${
                    respostas[indice] === alt
                      ? "border-[#1a3fd4] bg-[#1a3fd4]/10 text-[#1a3fd4]"
                      : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                  }`}
                >
                  {alt}
                </button>
              ))}
            </div>
          </div>
        ))}

        {resultadoQuiz && !resultadoQuiz.aprovado && (
          <p className="text-sm font-semibold text-red-600">
            Você acertou {resultadoQuiz.acertos}/{resultadoQuiz.total}. Tente de novo!
          </p>
        )}
        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="button"
          onClick={enviarQuiz}
          disabled={pendente || respostas.some((r) => !r)}
          className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {pendente ? "Enviando..." : "Responder"}
        </button>
      </div>
    );
  }

  // Missão de correção manual (prática/projeto/leitura/banca) — texto ou link.
  async function enviarEntrega() {
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await entregarMissao(progressoId, texto);
      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      {feedbackProfessor && (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Seu professor pediu ajustes: {feedbackProfessor}
        </p>
      )}
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={5}
        placeholder="Escreva sua entrega ou cole o link aqui..."
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
      />
      {erro && <p className="text-sm text-red-600">{erro}</p>}
      <button
        type="button"
        onClick={enviarEntrega}
        disabled={pendente || !texto.trim()}
        className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {pendente ? "Enviando..." : `Enviar entrega (+${xpRecompensa} XP se aprovada)`}
      </button>
    </div>
  );
}
