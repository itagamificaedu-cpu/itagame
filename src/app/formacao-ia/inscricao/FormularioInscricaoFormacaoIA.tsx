"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { inscreverFormacaoIA } from "@/app/actions/formacaoIA";
import { TEMPO_DOCENCIA_LABEL } from "@/lib/formacaoIA";

const campoBase =
  "mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]";

export function FormularioInscricaoFormacaoIA() {
  const router = useRouter();
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [instituicaoEnsino, setInstituicaoEnsino] = useState("");
  const [areaDisciplina, setAreaDisciplina] = useState("");
  const [tempoDocencia, setTempoDocencia] = useState("");
  const [declaraAtuacaoDocente, setDeclaraAtuacaoDocente] = useState(false);
  const [autorizaImagem, setAutorizaImagem] = useState(false);
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [nomeMeio, setNomeMeio] = useState(""); // honeypot — invisível pra gente de verdade
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!tempoDocencia) {
      setErro("Selecione seu tempo de docência.");
      return;
    }

    setEnviando(true);
    const resultado = await inscreverFormacaoIA({
      nomeCompleto,
      cpf,
      email,
      telefone,
      instituicaoEnsino,
      areaDisciplina,
      tempoDocencia: tempoDocencia as "menos_1" | "de_1_a_3" | "de_4_a_10" | "mais_10",
      declaraAtuacaoDocente,
      autorizaImagem,
      aceitaTermos,
      nomeMeio,
    });
    setEnviando(false);

    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }
    router.push(`/formacao-ia/pagamento/${resultado.codigo}`);
  }

  return (
    <form onSubmit={enviar} className="space-y-4">
      <input
        type="text"
        value={nomeMeio}
        onChange={(e) => setNomeMeio(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <label className="block">
        <span className="text-xs font-bold text-neutral-600">Nome completo</span>
        <input
          value={nomeCompleto}
          onChange={(e) => setNomeCompleto(e.target.value)}
          required
          className={campoBase}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-bold text-neutral-600">CPF</span>
          <input
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="000.000.000-00"
            required
            className={campoBase}
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-neutral-600">Telefone / WhatsApp</span>
          <input
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(88) 90000-0000"
            required
            className={campoBase}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-bold text-neutral-600">E-mail</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={campoBase}
        />
      </label>

      <label className="block">
        <span className="text-xs font-bold text-neutral-600">Instituição onde leciona</span>
        <input
          value={instituicaoEnsino}
          onChange={(e) => setInstituicaoEnsino(e.target.value)}
          required
          className={campoBase}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-bold text-neutral-600">Área / disciplina que leciona</span>
          <input
            value={areaDisciplina}
            onChange={(e) => setAreaDisciplina(e.target.value)}
            required
            className={campoBase}
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-neutral-600">Tempo de docência</span>
          <select
            value={tempoDocencia}
            onChange={(e) => setTempoDocencia(e.target.value)}
            required
            className={campoBase}
          >
            <option value="">Selecione...</option>
            {Object.entries(TEMPO_DOCENCIA_LABEL).map(([valor, rotulo]) => (
              <option key={valor} value={valor}>
                {rotulo}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
        <label className="flex items-start gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={declaraAtuacaoDocente}
            onChange={(e) => setDeclaraAtuacaoDocente(e.target.checked)}
            className="mt-0.5"
          />
          Declaro que atuo na docência, independente de formação em licenciatura.
        </label>
        <label className="flex items-start gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={autorizaImagem}
            onChange={(e) => setAutorizaImagem(e.target.checked)}
            className="mt-0.5"
          />
          Autorizo o uso da minha imagem nas atividades presenciais do curso (opcional).
        </label>
        <label className="flex items-start gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={aceitaTermos}
            onChange={(e) => setAceitaTermos(e.target.checked)}
            className="mt-0.5"
          />
          Aceito os termos da inscrição e as regras de frequência mínima (75%) e nota mínima (6,0)
          para emissão do certificado.
        </label>
      </div>

      {erro && <p className="text-sm font-semibold text-red-600">{erro}</p>}

      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-xl bg-[#1a3fd4] px-6 py-3.5 text-base font-extrabold text-white transition hover:brightness-110 disabled:opacity-50"
      >
        {enviando ? "Enviando..." : "Continuar para o pagamento →"}
      </button>
    </form>
  );
}
