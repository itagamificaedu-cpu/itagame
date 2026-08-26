"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adicionarMissao, type QuestaoQuizMissao } from "@/app/actions/missoes";

type QuestaoForm = {
  enunciado: string;
  alternativas: [string, string, string, string];
  corretaIndice: number | null;
};

const LETRAS = ["A", "B", "C", "D"] as const;

function questaoVazia(): QuestaoForm {
  return { enunciado: "", alternativas: ["", "", "", ""], corretaIndice: null };
}

const TIPOS_ATIVIDADE = [
  { valor: "video", rotulo: "🎬 Vídeo" },
  { valor: "quiz", rotulo: "❓ Quiz" },
  { valor: "pratica", rotulo: "🛠️ Prática" },
  { valor: "projeto", rotulo: "🚀 Projeto" },
  { valor: "leitura", rotulo: "📖 Leitura" },
  { valor: "desafio", rotulo: "🏆 Desafio" },
] as const;

export function AdicionarMissaoCliente({
  trilhaId,
  missoesExistentes,
}: {
  trilhaId: string;
  missoesExistentes: { id: string; titulo: string }[];
}) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipoAtividade, setTipoAtividade] =
    useState<(typeof TIPOS_ATIVIDADE)[number]["valor"]>("desafio");
  const [nivelDificuldade, setNivelDificuldade] = useState("");
  const [preRequisitoId, setPreRequisitoId] = useState("");
  const [xp, setXp] = useState(10);
  const [checkpointTipo, setCheckpointTipo] = useState<
    "quiz_automatico" | "correcao_professor"
  >("correcao_professor");
  const [notaMinima, setNotaMinima] = useState(60);
  const [questoes, setQuestoes] = useState<QuestaoForm[]>([questaoVazia()]);
  const [quiserBadge, setQuiserBadge] = useState(false);
  const [badgeNome, setBadgeNome] = useState("");
  const [badgeDescricao, setBadgeDescricao] = useState("");
  const [badgeIcone, setBadgeIcone] = useState("🏅");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const router = useRouter();

  function atualizarQuestao(indice: number, alteracoes: Partial<QuestaoForm>) {
    setQuestoes((atual) => atual.map((q, i) => (i === indice ? { ...q, ...alteracoes } : q)));
  }

  function atualizarAlternativa(indiceQuestao: number, indiceAlt: number, valor: string) {
    setQuestoes((atual) =>
      atual.map((q, i) => {
        if (i !== indiceQuestao) return q;
        const alternativas = [...q.alternativas] as QuestaoForm["alternativas"];
        alternativas[indiceAlt] = valor;
        return { ...q, alternativas };
      })
    );
  }

  function limpar() {
    setTitulo("");
    setDescricao("");
    setNivelDificuldade("");
    setPreRequisitoId("");
    setXp(10);
    setQuestoes([questaoVazia()]);
    setQuiserBadge(false);
    setBadgeNome("");
    setBadgeDescricao("");
    setBadgeIcone("🏅");
  }

  async function salvar() {
    setEnviando(true);
    setErro(null);
    setSucesso(false);

    let quizPerguntas: QuestaoQuizMissao[] | undefined;
    if (checkpointTipo === "quiz_automatico") {
      quizPerguntas = questoes.map((q) => ({
        enunciado: q.enunciado,
        alternativas: q.alternativas.filter((a) => a.trim()),
        respostaCorreta: q.corretaIndice !== null ? q.alternativas[q.corretaIndice] ?? "" : "",
      }));
    }

    const resultado = await adicionarMissao({
      trilhaId,
      titulo,
      descricao,
      tipoAtividade,
      nivelDificuldade: nivelDificuldade || undefined,
      preRequisitoId: preRequisitoId || null,
      xp,
      checkpointTipo,
      notaMinima: checkpointTipo === "quiz_automatico" ? notaMinima : undefined,
      quizPerguntas,
      badgeNovo: quiserBadge && badgeNome.trim() ? { nome: badgeNome, descricao: badgeDescricao, icone: badgeIcone } : null,
    });

    setEnviando(false);
    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }
    setSucesso(true);
    limpar();
    router.refresh();
  }

  return (
    <div className="space-y-5 rounded-2xl border border-neutral-200 bg-white p-6">
      <p className="font-bold text-neutral-900">+ Adicionar missão</p>

      <div>
        <label className="text-sm font-medium text-neutral-700">Título da missão</label>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex: Monte seu primeiro circuito"
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-700">Descrição</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={2}
          placeholder="O que o aluno precisa fazer nessa missão"
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-neutral-700">Tipo</label>
          <select
            value={tipoAtividade}
            onChange={(e) => setTipoAtividade(e.target.value as typeof tipoAtividade)}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
          >
            {TIPOS_ATIVIDADE.map((t) => (
              <option key={t.valor} value={t.valor}>
                {t.rotulo}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-neutral-700">XP da missão</label>
          <input
            type="number"
            min={1}
            value={xp}
            onChange={(e) => setXp(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-700">
          Pré-requisito (opcional — só vale em trilha linear)
        </label>
        <select
          value={preRequisitoId}
          onChange={(e) => setPreRequisitoId(e.target.value)}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
        >
          <option value="">Nenhum — libera direto na publicação</option>
          {missoesExistentes.map((m) => (
            <option key={m.id} value={m.id}>
              {m.titulo}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-sm font-medium text-neutral-700">Como a missão é avaliada</p>
        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={() => setCheckpointTipo("correcao_professor")}
            className={`flex-1 rounded-lg border-2 py-2 text-sm font-bold ${
              checkpointTipo === "correcao_professor"
                ? "border-[#1a3fd4] bg-[#1a3fd4]/10 text-[#1a3fd4]"
                : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
            }`}
          >
            👩‍🏫 Professor corrige
          </button>
          <button
            type="button"
            onClick={() => setCheckpointTipo("quiz_automatico")}
            className={`flex-1 rounded-lg border-2 py-2 text-sm font-bold ${
              checkpointTipo === "quiz_automatico"
                ? "border-[#1a3fd4] bg-[#1a3fd4]/10 text-[#1a3fd4]"
                : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
            }`}
          >
            ❓ Quiz automático
          </button>
        </div>
      </div>

      {checkpointTipo === "quiz_automatico" ? (
        <div className="space-y-4 rounded-xl border border-neutral-200 p-5">
          <div>
            <label className="text-sm font-medium text-neutral-700">
              Nota mínima pra aprovar (% de acertos)
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={notaMinima}
              onChange={(e) => setNotaMinima(Number(e.target.value))}
              className="mt-1 w-32 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
            />
          </div>

          <p className="text-sm font-bold text-neutral-500">PERGUNTAS ({questoes.length})</p>
          {questoes.map((questao, indiceQuestao) => (
            <div key={indiceQuestao} className="rounded-xl border border-neutral-200 p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-bold text-neutral-700">Pergunta {indiceQuestao + 1}</p>
                {questoes.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setQuestoes((atual) =>
                        atual.length > 1 ? atual.filter((_, i) => i !== indiceQuestao) : atual
                      )
                    }
                    className="text-xs font-semibold text-[#ff5470] hover:underline"
                  >
                    Remover
                  </button>
                )}
              </div>

              <textarea
                value={questao.enunciado}
                onChange={(e) => atualizarQuestao(indiceQuestao, { enunciado: e.target.value })}
                placeholder="Digite a pergunta aqui..."
                rows={2}
                className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
              />

              <div className="mt-3 space-y-2">
                <p className="text-xs font-semibold text-neutral-500 uppercase">
                  Alternativas — marque a correta
                </p>
                {LETRAS.map((letra, indiceAlt) => (
                  <div key={letra} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => atualizarQuestao(indiceQuestao, { corretaIndice: indiceAlt })}
                      title="Marcar como correta"
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                        questao.corretaIndice === indiceAlt
                          ? "border-[#00c264] bg-[#00c264] text-white"
                          : "border-neutral-300 text-neutral-400 hover:border-[#00c264]"
                      }`}
                    >
                      {letra}
                    </button>
                    <input
                      value={questao.alternativas[indiceAlt]}
                      onChange={(e) => atualizarAlternativa(indiceQuestao, indiceAlt, e.target.value)}
                      placeholder={
                        indiceAlt < 2 ? `Alternativa ${letra}` : `Alternativa ${letra} (opcional)`
                      }
                      className="flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setQuestoes((atual) => [...atual, questaoVazia()])}
            className="w-full rounded-lg border-2 border-dashed border-neutral-300 py-2.5 text-sm font-semibold text-neutral-500 hover:border-[#1a3fd4] hover:text-[#1a3fd4]"
          >
            + Adicionar pergunta
          </button>
        </div>
      ) : (
        <p className="rounded-lg bg-neutral-50 px-4 py-3 text-sm text-neutral-500">
          O aluno envia um texto/link e a missão fica pendente até você aprovar ou reprovar.
        </p>
      )}

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <input
            type="checkbox"
            checked={quiserBadge}
            onChange={(e) => setQuiserBadge(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300"
          />
          Dar um badge/emblema ao concluir essa missão
        </label>
        {quiserBadge && (
          <div className="mt-3 grid grid-cols-[auto_1fr_1fr] gap-3">
            <input
              value={badgeIcone}
              onChange={(e) => setBadgeIcone(e.target.value)}
              maxLength={2}
              className="w-14 rounded-lg border border-neutral-300 px-2 py-2 text-center text-lg focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
            />
            <input
              value={badgeNome}
              onChange={(e) => setBadgeNome(e.target.value)}
              placeholder="Nome do badge"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
            />
            <input
              value={badgeDescricao}
              onChange={(e) => setBadgeDescricao(e.target.value)}
              placeholder="Descrição curta"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
            />
          </div>
        )}
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}
      {sucesso && <p className="text-sm font-semibold text-[#00854a]">Missão adicionada! ✅</p>}

      <button
        type="button"
        onClick={salvar}
        disabled={enviando}
        className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {enviando ? "Salvando..." : "+ Adicionar missão"}
      </button>
    </div>
  );
}
