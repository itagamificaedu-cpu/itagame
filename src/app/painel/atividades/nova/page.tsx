"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { gerarAtividade } from "@/app/actions/atividades";
import { CriadorManualCliente } from "@/components/atividadeManual/CriadorManualCliente";

const ROTULO_QUANTIDADE: Record<string, string> = {
  quiz: "Quantidade de questões",
  verdadeiro_falso: "Quantidade de questões",
  completar_frase: "Quantidade de frases",
  caca_palavras: "Quantidade de palavras",
  associar_colunas: "Quantidade de pares",
  apresentacao: "Quantidade de slides",
  cabo_de_guerra: "Quantidade de perguntas",
};

export default function PaginaNovaAtividade() {
  const [estado, action, pendente] = useActionState(gerarAtividade, undefined);
  const [tipo, setTipo] = useState("quiz");
  const [modo, setModo] = useState<"ia" | "manual">("ia");

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/painel" className="text-sm font-semibold text-[#1a3fd4]">
          ← Voltar ao painel
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-neutral-900">Nova atividade</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {modo === "ia"
            ? "Descreva o tema e a IA monta as questões prontas para aplicar em sala."
            : "Escreva suas próprias perguntas, uma a uma, e marque a resposta certa."}
        </p>

        <div className="mt-6 flex gap-2 rounded-xl border border-neutral-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setModo("ia")}
            className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
              modo === "ia" ? "bg-[#1a3fd4] text-white" : "text-neutral-500 hover:bg-neutral-50"
            }`}
          >
            ✨ Gerar com IA
          </button>
          <button
            type="button"
            onClick={() => setModo("manual")}
            className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
              modo === "manual" ? "bg-[#1a3fd4] text-white" : "text-neutral-500 hover:bg-neutral-50"
            }`}
          >
            ✍️ Criar manualmente
          </button>
        </div>

        {modo === "manual" ? (
          <CriadorManualCliente />
        ) : (
        <form action={action} className="mt-8 space-y-5 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div>
            <label htmlFor="tipo" className="text-sm font-medium text-neutral-700">
              Tipo de atividade
            </label>
            <select
              id="tipo"
              name="tipo"
              value={tipo}
              onChange={(evento) => setTipo(evento.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
            >
              <option value="quiz">Quiz (múltipla escolha)</option>
              <option value="verdadeiro_falso">Verdadeiro ou falso</option>
              <option value="completar_frase">Completar frase</option>
              <option value="caca_palavras">Caça-palavras</option>
              <option value="associar_colunas">Associar colunas</option>
              <option value="apresentacao">Apresentação</option>
              <option value="cabo_de_guerra">🪢 Cabo de Guerra (times)</option>
            </select>
            {estado?.erros?.tipo && <p className="mt-1 text-xs text-red-600">{estado.erros.tipo[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="disciplina" className="text-sm font-medium text-neutral-700">
                Disciplina
              </label>
              <input
                id="disciplina"
                name="disciplina"
                type="text"
                placeholder="Ex: Matemática"
                required
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
              />
              {estado?.erros?.disciplina && (
                <p className="mt-1 text-xs text-red-600">{estado.erros.disciplina[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="serie" className="text-sm font-medium text-neutral-700">
                Série/ano
              </label>
              <input
                id="serie"
                name="serie"
                type="text"
                placeholder="Ex: 6º ano"
                required
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
              />
              {estado?.erros?.serie && <p className="mt-1 text-xs text-red-600">{estado.erros.serie[0]}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="tema" className="text-sm font-medium text-neutral-700">
              Tema da atividade
            </label>
            <input
              id="tema"
              name="tema"
              type="text"
              placeholder="Ex: Frações equivalentes"
              required
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
            />
            {estado?.erros?.tema && <p className="mt-1 text-xs text-red-600">{estado.erros.tema[0]}</p>}
          </div>

          <div>
            <label htmlFor="quantidadeQuestoes" className="text-sm font-medium text-neutral-700">
              {ROTULO_QUANTIDADE[tipo]}
            </label>
            <input
              id="quantidadeQuestoes"
              name="quantidadeQuestoes"
              type="number"
              min={3}
              max={15}
              defaultValue={5}
              required
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
            />
            {estado?.erros?.quantidadeQuestoes && (
              <p className="mt-1 text-xs text-red-600">{estado.erros.quantidadeQuestoes[0]}</p>
            )}
          </div>

          {estado?.mensagem && <p className="text-sm text-red-600">{estado.mensagem}</p>}

          <button
            type="submit"
            disabled={pendente}
            className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {pendente ? "Gerando atividade..." : "Gerar atividade"}
          </button>
        </form>
        )}
      </div>
    </main>
  );
}
