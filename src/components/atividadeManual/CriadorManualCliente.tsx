"use client";

import { useState } from "react";
import {
  criarAtividadeManual,
  type TipoAtividadeManual,
} from "@/app/actions/atividadeManual";

type QuestaoForm = {
  enunciado: string;
  alternativas: [string, string, string, string];
  corretaIndice: number | null;
  respostaVF: "verdadeiro" | "falso" | null;
  respostaTexto: string;
};

const LETRAS = ["A", "B", "C", "D"] as const;

function questaoVazia(): QuestaoForm {
  return {
    enunciado: "",
    alternativas: ["", "", "", ""],
    corretaIndice: null,
    respostaVF: null,
    respostaTexto: "",
  };
}

export function CriadorManualCliente() {
  const [tipo, setTipo] = useState<TipoAtividadeManual>("quiz");
  const [disciplina, setDisciplina] = useState("");
  const [serie, setSerie] = useState("");
  const [tema, setTema] = useState("");
  const [questoes, setQuestoes] = useState<QuestaoForm[]>([questaoVazia()]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function atualizarQuestao(indice: number, alteracoes: Partial<QuestaoForm>) {
    setQuestoes((atual) =>
      atual.map((questao, i) => (i === indice ? { ...questao, ...alteracoes } : questao))
    );
  }

  function atualizarAlternativa(indiceQuestao: number, indiceAlt: number, valor: string) {
    setQuestoes((atual) =>
      atual.map((questao, i) => {
        if (i !== indiceQuestao) return questao;
        const alternativas = [...questao.alternativas] as QuestaoForm["alternativas"];
        alternativas[indiceAlt] = valor;
        return { ...questao, alternativas };
      })
    );
  }

  function adicionarPergunta() {
    setQuestoes((atual) => [...atual, questaoVazia()]);
  }

  function removerPergunta(indice: number) {
    setQuestoes((atual) => (atual.length > 1 ? atual.filter((_, i) => i !== indice) : atual));
  }

  async function salvar() {
    setEnviando(true);
    setErro(null);

    const payload = questoes.map((questao) => {
      if (tipo === "quiz") {
        const alternativas = questao.alternativas.filter((a) => a.trim());
        const respostaCorreta =
          questao.corretaIndice !== null ? questao.alternativas[questao.corretaIndice] ?? "" : "";
        return { enunciado: questao.enunciado, alternativas, respostaCorreta };
      }
      if (tipo === "verdadeiro_falso") {
        return { enunciado: questao.enunciado, alternativas: [], respostaCorreta: questao.respostaVF ?? "" };
      }
      return { enunciado: questao.enunciado, alternativas: [], respostaCorreta: questao.respostaTexto };
    });

    const resultado = await criarAtividadeManual({ tipo, disciplina, serie, tema, questoes: payload });

    setEnviando(false);
    if (!resultado.ok) {
      setErro(resultado.erro);
    }
    // sucesso: a própria action redireciona para a página da atividade
  }

  return (
    <div className="mt-8 space-y-5 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
      <div>
        <label htmlFor="tipo-manual" className="text-sm font-medium text-neutral-700">
          Tipo de atividade
        </label>
        <select
          id="tipo-manual"
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoAtividadeManual)}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
        >
          <option value="quiz">Quiz (múltipla escolha)</option>
          <option value="verdadeiro_falso">Verdadeiro ou falso</option>
          <option value="completar_frase">Completar frase</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="disciplina-manual" className="text-sm font-medium text-neutral-700">
            Disciplina
          </label>
          <input
            id="disciplina-manual"
            value={disciplina}
            onChange={(e) => setDisciplina(e.target.value)}
            placeholder="Ex: Matemática"
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
          />
        </div>
        <div>
          <label htmlFor="serie-manual" className="text-sm font-medium text-neutral-700">
            Série/ano
          </label>
          <input
            id="serie-manual"
            value={serie}
            onChange={(e) => setSerie(e.target.value)}
            placeholder="Ex: 6º ano"
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
          />
        </div>
      </div>

      <div>
        <label htmlFor="tema-manual" className="text-sm font-medium text-neutral-700">
          Título da atividade
        </label>
        <input
          id="tema-manual"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          placeholder="Ex: Matemática — Frações"
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
        />
      </div>

      <div className="space-y-4">
        <p className="text-sm font-bold text-neutral-500">PERGUNTAS ({questoes.length})</p>

        {questoes.map((questao, indiceQuestao) => (
          <div key={indiceQuestao} className="rounded-xl border border-neutral-200 p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-bold text-neutral-700">Pergunta {indiceQuestao + 1}</p>
              {questoes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removerPergunta(indiceQuestao)}
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

            {tipo === "quiz" && (
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
            )}

            {tipo === "verdadeiro_falso" && (
              <div className="mt-3 flex gap-3">
                {(["verdadeiro", "falso"] as const).map((opcao) => (
                  <button
                    key={opcao}
                    type="button"
                    onClick={() => atualizarQuestao(indiceQuestao, { respostaVF: opcao })}
                    className={`flex-1 rounded-lg border-2 py-2 text-sm font-bold ${
                      questao.respostaVF === opcao
                        ? "border-[#00c264] bg-[#00c264]/10 text-[#00854a]"
                        : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                    }`}
                  >
                    {opcao === "verdadeiro" ? "Verdadeiro" : "Falso"}
                  </button>
                ))}
              </div>
            )}

            {tipo === "completar_frase" && (
              <input
                value={questao.respostaTexto}
                onChange={(e) => atualizarQuestao(indiceQuestao, { respostaTexto: e.target.value })}
                placeholder="Resposta certa"
                className="mt-3 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
              />
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={adicionarPergunta}
          className="w-full rounded-lg border-2 border-dashed border-neutral-300 py-2.5 text-sm font-semibold text-neutral-500 hover:border-[#1a3fd4] hover:text-[#1a3fd4]"
        >
          + Adicionar pergunta
        </button>
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <button
        type="button"
        onClick={salvar}
        disabled={enviando}
        className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {enviando ? "Salvando..." : "💾 Salvar atividade"}
      </button>
    </div>
  );
}
