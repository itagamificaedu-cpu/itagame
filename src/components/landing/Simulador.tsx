"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { gerarPreviaPublica } from "@/app/actions/previaPublica";
import type { AtividadeGerada } from "@/lib/ia";

const tipos = ["Quiz", "Verdadeiro ou Falso", "Caça-palavras"];
const series = ["4º ano", "6º ano", "9º ano"];
const disciplinas = ["Matemática", "Português", "Ciências"];

// Limite de 1 prévia por navegador/dispositivo — não por IP, pra não travar
// a escola inteira de uma vez quando vários professores saem pela mesma
// rede/Wi-Fi. Os geradores de atividade e a geração real de IA dentro do
// painel (online e para imprimir) continuam sem nenhum limite.
const CHAVE_PREVIA_USADA = "itagameficaedu_previa_usada";

export function Simulador() {
  const [tipo, setTipo] = useState(tipos[0]);
  const [serie, setSerie] = useState(series[1]);
  const [disciplina, setDisciplina] = useState(disciplinas[0]);
  const [tema, setTema] = useState("Frações");
  const [gerando, setGerando] = useState(false);
  const [atividade, setAtividade] = useState<AtividadeGerada | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [jaTestou, setJaTestou] = useState(false);

  useEffect(() => {
    // Leitura única do localStorage no carregamento — não dá pra saber isso
    // durante o SSR (evita divergência de hidratação renderizando o form
    // padrão primeiro e só então trocando pela tela de "já testou").
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setJaTestou(localStorage.getItem(CHAVE_PREVIA_USADA) === "1");
  }, []);

  async function gerarPreview() {
    setGerando(true);
    setAtividade(null);
    setErro(null);

    const resultado = await gerarPreviaPublica({ tipoRotulo: tipo, disciplina, serie, tema });

    setGerando(false);
    if (resultado.ok) {
      setAtividade(resultado.atividade);
      localStorage.setItem(CHAVE_PREVIA_USADA, "1");
      setJaTestou(true);
    } else {
      setErro(resultado.erro);
    }
  }

  if (jaTestou && !atividade) {
    return (
      <div>
        <p className="text-sm font-semibold text-neutral-500">Simulador — prévia</p>
        <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-5 text-center text-sm text-neutral-600">
          <p className="font-semibold text-neutral-900">Você já experimentou sua prévia grátis 🎉</p>
          <p className="mt-1">Crie sua conta para gerar quantas atividades quiser, sem limite.</p>
          <Link
            href="/cadastro"
            className="mt-4 block rounded-lg bg-[#1a3fd4] py-2.5 text-center text-sm font-bold text-white transition hover:brightness-110"
          >
            Criar minha conta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-semibold text-neutral-500">Simulador — prévia</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          {tipos.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select
          value={serie}
          onChange={(e) => setSerie(e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          {series.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={disciplina}
          onChange={(e) => setDisciplina(e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          {disciplinas.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <input
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          placeholder="Tema"
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <button
        onClick={gerarPreview}
        disabled={gerando}
        className="mt-4 w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {gerando ? "Gerando com IA..." : "Gerar prévia"}
      </button>

      {erro && (
        <div className="mt-4 rounded-lg bg-[#ff5470]/10 p-4 text-sm text-[#a8283f]">{erro}</div>
      )}

      {atividade && (
        <div className="mt-4 space-y-3 rounded-lg bg-[#00c264]/10 p-4 text-sm text-neutral-700">
          <p className="font-semibold text-neutral-900">{atividade.titulo}</p>

          <div className="space-y-2">
            {atividade.questoes.map((questao, indice) => (
              <div key={indice} className="rounded-lg border border-[#00c264]/30 bg-white p-3">
                <p className="font-medium text-neutral-800">{questao.enunciado}</p>
                {questao.alternativas && questao.alternativas.length > 0 ? (
                  <ul className="mt-1.5 space-y-1">
                    {questao.alternativas.map((alternativa) => (
                      <li
                        key={alternativa}
                        className={
                          alternativa === questao.respostaCorreta
                            ? "font-semibold text-[#00854a]"
                            : "text-neutral-500"
                        }
                      >
                        {alternativa === questao.respostaCorreta ? "✓ " : "· "}
                        {alternativa}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-[#00854a]">
                    <span className="font-semibold">Resposta:</span> {questao.respostaCorreta}
                  </p>
                )}
              </div>
            ))}
          </div>

          <p className="text-xs text-neutral-500">
            Gerado agora mesmo pela mesma IA do ItaGameficaEdu — essa prévia não fica salva.
          </p>
          <Link
            href="/cadastro"
            className="block rounded-lg bg-[#00c264] py-2 text-center text-sm font-bold text-white transition hover:brightness-110"
          >
            Criar conta pra salvar essa atividade
          </Link>
        </div>
      )}
    </div>
  );
}
