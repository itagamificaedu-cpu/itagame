"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { lancarAvaliacaoFormacaoIA } from "@/app/actions/formacaoIA";
import { codigoCurto } from "@/lib/formacaoIA";
import type { MatriculaFormacaoIA } from "@prisma/client";

export function LinhaMatriculaFormacaoIA({ matricula }: { matricula: MatriculaFormacaoIA }) {
  const router = useRouter();
  const [frequenciaPct, setFrequenciaPct] = useState(matricula.frequenciaPct?.toString() ?? "");
  const [notaFinal, setNotaFinal] = useState(matricula.notaFinal?.toString() ?? "");
  const [projetoFinalTitulo, setProjetoFinalTitulo] = useState(matricula.projetoFinalTitulo ?? "");
  const [observacoesStaff, setObservacoesStaff] = useState(matricula.observacoesStaff ?? "");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function salvar() {
    setErro(null);
    setSalvando(true);
    const resultado = await lancarAvaliacaoFormacaoIA({
      id: matricula.id,
      frequenciaPct: frequenciaPct ? Number(frequenciaPct) : null,
      notaFinal: notaFinal ? Number(notaFinal) : null,
      projetoFinalTitulo,
      observacoesStaff,
    });
    setSalvando(false);
    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }
    router.refresh();
  }

  return (
    <tr className="border-b border-neutral-100 align-top last:border-0">
      <td className="px-4 py-3">
        <p className="font-semibold text-neutral-900">{matricula.nomeCompleto}</p>
        <p className="text-xs text-neutral-500">{matricula.email}</p>
        <p className="mt-1 font-mono text-xs text-neutral-400">{codigoCurto(matricula.codigoMatricula)}</p>
      </td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-bold ${
            matricula.status === "pago"
              ? "bg-[#1a3fd4]/10 text-[#1a3fd4]"
              : matricula.status === "certificado_emitido"
                ? "bg-[#00c264]/10 text-[#00854a]"
                : matricula.status === "cancelado"
                  ? "bg-red-100 text-red-600"
                  : "bg-neutral-100 text-neutral-500"
          }`}
        >
          {matricula.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          min={0}
          max={100}
          value={frequenciaPct}
          onChange={(e) => setFrequenciaPct(e.target.value)}
          placeholder="%"
          className="w-16 rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          min={0}
          max={10}
          step={0.1}
          value={notaFinal}
          onChange={(e) => setNotaFinal(e.target.value)}
          placeholder="0-10"
          className="w-16 rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
        />
      </td>
      <td className="px-4 py-3">
        <input
          value={projetoFinalTitulo}
          onChange={(e) => setProjetoFinalTitulo(e.target.value)}
          placeholder="Título/link do projeto"
          className="w-40 rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
        />
      </td>
      <td className="px-4 py-3">
        <input
          value={observacoesStaff}
          onChange={(e) => setObservacoesStaff(e.target.value)}
          placeholder="Observações"
          className="w-40 rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
        />
      </td>
      <td className="px-4 py-3">
        <button
          onClick={salvar}
          disabled={salvando}
          className="rounded-lg bg-[#1a3fd4] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"
        >
          {salvando ? "..." : "Salvar"}
        </button>
        {erro && <p className="mt-1 text-xs text-red-600">{erro}</p>}
      </td>
    </tr>
  );
}
