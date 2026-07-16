"use client";

import { useState } from "react";

const tipos = ["Quiz", "Verdadeiro ou Falso", "Caça-palavras"];
const series = ["4º ano", "6º ano", "9º ano"];
const disciplinas = ["Matemática", "Português", "Ciências"];

export function Simulador() {
  const [tipo, setTipo] = useState(tipos[0]);
  const [serie, setSerie] = useState(series[1]);
  const [disciplina, setDisciplina] = useState(disciplinas[0]);
  const [tema, setTema] = useState("Frações");
  const [gerando, setGerando] = useState(false);
  const [pronto, setPronto] = useState(false);

  function gerarPreview() {
    setGerando(true);
    setPronto(false);
    setTimeout(() => {
      setGerando(false);
      setPronto(true);
    }, 1200);
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
        {gerando ? "Gerando..." : "Gerar prévia"}
      </button>

      {pronto && (
        <div className="mt-4 rounded-lg bg-[#00c264]/10 p-4 text-sm text-neutral-700">
          <p className="font-semibold text-neutral-900">
            {tipo} de {disciplina} · {serie} · {tema}
          </p>
          <p className="mt-1 text-neutral-600">
            Prévia ilustrativa — a atividade real é gerada com IA no seu painel.
          </p>
        </div>
      )}
    </div>
  );
}
