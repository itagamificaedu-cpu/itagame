"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { salvarRegistroProntuario, type DadosRegistroProntuario } from "@/app/actions/prontuario";

type Registro = DadosRegistroProntuario & { id: string; status: "pendente" | "finalizado" };

function Campo({
  rotulo,
  valor,
  aoAlterar,
  placeholder,
  desabilitado,
}: {
  rotulo: string;
  valor: string;
  aoAlterar: (v: string) => void;
  placeholder?: string;
  desabilitado: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold tracking-wide text-neutral-500 uppercase">{rotulo}</span>
      <input
        value={valor}
        onChange={(e) => aoAlterar(e.target.value)}
        placeholder={placeholder}
        disabled={desabilitado}
        className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4] disabled:bg-neutral-100 disabled:text-neutral-500"
      />
    </label>
  );
}

export default function RegistroProntuarioCliente({ registroInicial }: { registroInicial: Registro }) {
  const [dados, setDados] = useState<DadosRegistroProntuario>(registroInicial);
  const [status, setStatus] = useState(registroInicial.status);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const router = useRouter();

  const finalizado = status === "finalizado";

  function alterar<K extends keyof DadosRegistroProntuario>(campo: K, valor: string) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
    setMensagem(null);
  }

  async function salvar(finalizar: boolean) {
    setErro(null);
    setMensagem(null);
    setSalvando(true);
    const resultado = await salvarRegistroProntuario(registroInicial.id, dados, finalizar);
    setSalvando(false);

    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }
    if (finalizar) {
      setStatus("finalizado");
      setMensagem("✅ Registro finalizado!");
    } else {
      setMensagem("Rascunho salvo.");
    }
    router.refresh();
  }

  return (
    <div className="mt-6 space-y-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      {finalizado && (
        <div className="rounded-lg bg-[#00c264]/10 px-4 py-2 text-sm font-bold text-[#00854a]">
          ✅ Registro finalizado — só o professor pode reabrir pra edição.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo rotulo="Data (AAAA-MM-DD)" valor={dados.dataRegistro} aoAlterar={(v) => alterar("dataRegistro", v)} placeholder="2026-09-06" desabilitado={finalizado} />
        <Campo rotulo="Hora (HH:MM)" valor={dados.horaRegistro} aoAlterar={(v) => alterar("horaRegistro", v)} placeholder="08:30" desabilitado={finalizado} />
        <Campo rotulo="Paciente" valor={dados.paciente} aoAlterar={(v) => alterar("paciente", v)} placeholder="J.M.S." desabilitado={finalizado} />
        <Campo rotulo="Leito" valor={dados.leito} aoAlterar={(v) => alterar("leito", v)} placeholder="202" desabilitado={finalizado} />
      </div>

      <div>
        <p className="text-xs font-bold tracking-wide text-neutral-500 uppercase">Sinais vitais</p>
        <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <Campo rotulo="P.A. (mmHg)" valor={dados.pressaoArterial} aoAlterar={(v) => alterar("pressaoArterial", v)} placeholder="120/80" desabilitado={finalizado} />
          <Campo rotulo="F.C. (bpm)" valor={dados.frequenciaCardiaca} aoAlterar={(v) => alterar("frequenciaCardiaca", v)} placeholder="72" desabilitado={finalizado} />
          <Campo rotulo="F.R. (irpm)" valor={dados.frequenciaRespiratoria} aoAlterar={(v) => alterar("frequenciaRespiratoria", v)} placeholder="18" desabilitado={finalizado} />
          <Campo rotulo="Temp. (°C)" valor={dados.temperatura} aoAlterar={(v) => alterar("temperatura", v)} placeholder="36,5" desabilitado={finalizado} />
          <Campo rotulo="SatO2 (%)" valor={dados.saturacaoOxigenio} aoAlterar={(v) => alterar("saturacaoOxigenio", v)} placeholder="98" desabilitado={finalizado} />
        </div>
      </div>

      <label className="block">
        <span className="text-xs font-bold tracking-wide text-neutral-500 uppercase">
          Anotação de enfermagem / evolução clínico-assistencial
        </span>
        <textarea
          value={dados.anotacaoEnfermagem}
          onChange={(e) => alterar("anotacaoEnfermagem", e.target.value)}
          rows={6}
          disabled={finalizado}
          placeholder="Redija a anotação usando terminologia técnica adequada..."
          className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4] disabled:bg-neutral-100 disabled:text-neutral-500"
        />
      </label>

      <Campo
        rotulo="Assinatura do técnico (seu nome / categoria técnica)"
        valor={dados.assinaturaTecnico}
        aoAlterar={(v) => alterar("assinaturaTecnico", v)}
        placeholder="Ex: João Silva — Técnico em Enfermagem"
        desabilitado={finalizado}
      />

      {erro && <p className="text-sm text-red-600">{erro}</p>}
      {mensagem && !erro && <p className="text-sm font-semibold text-[#00854a]">{mensagem}</p>}

      {!finalizado && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => salvar(false)}
            disabled={salvando}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-60"
          >
            {salvando ? "Salvando..." : "💾 Salvar rascunho"}
          </button>
          <button
            type="button"
            onClick={() => salvar(true)}
            disabled={salvando}
            className="rounded-lg bg-[#00c264] px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {salvando ? "Enviando..." : "✅ Finalizar registro"}
          </button>
        </div>
      )}
    </div>
  );
}
