"use client";

import { useState } from "react";
import { BotaoImprimirCurso } from "./BotaoImprimirCurso";
import { COMPOSICAO_CARGA_HORARIA_AULA, TOTAL_HORAS_CURSO, TOTAL_SEMANAS_CURSO } from "@/lib/cursoBnccComputacao";

export function CertificadoImprimivel({ codigo, dataEmissao }: { codigo: string; dataEmissao: string }) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3 print:hidden">
        <label className="sm:col-span-2">
          <span className="text-xs font-bold text-neutral-600">Nome completo (pro certificado)</span>
          <input
            value={nome}
            onChange={(evento) => setNome(evento.target.value)}
            placeholder="Seu nome completo"
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </label>
        <label>
          <span className="text-xs font-bold text-neutral-600">CPF</span>
          <input
            value={cpf}
            onChange={(evento) => setCpf(evento.target.value)}
            placeholder="000.000.000-00"
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="mt-4 print:hidden">
        <BotaoImprimirCurso texto="🖨️ Imprimir certificado / salvar em PDF" />
      </div>

      <div className="mt-6 rounded-2xl border-4 border-[#1a3fd4] bg-white p-8 print:mt-0 print:rounded-none print:border-2">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-[#1a3fd4]">
          Programa de Capacitação em Educação Digital e Tecnologia
        </p>
        <h1 className="mt-2 text-center text-2xl font-extrabold text-neutral-900">Certificado de Conclusão</h1>
        <p className="mt-1 text-center text-sm text-neutral-500">Formação Continuada em BNCC Computação</p>

        <p className="mt-8 text-center text-sm leading-relaxed text-neutral-700">
          Certificamos que{" "}
          <span className="font-bold text-neutral-900">{nome || "_______________________________________"}</span>,
          portador(a) do CPF nº{" "}
          <span className="font-bold text-neutral-900">{cpf || "______.______.______-____"}</span>, concluiu com
          êxito o curso de formação <span className="font-semibold">BNCC Computação na Prática: Estrutura
          Curricular e Atividades Práticas</span>, com carga horária total de{" "}
          <span className="font-bold">{TOTAL_HORAS_CURSO} horas</span>.
        </p>

        <div className="mt-6 rounded-xl border border-[#ffb020]/40 bg-[#ffb020]/10 p-4">
          <p className="text-center text-xs font-bold text-[#8a5a00]">CONTEÚDO PROGRAMÁTICO ({TOTAL_HORAS_CURSO} HORAS)</p>
          <div className="mt-2 grid gap-2 text-xs text-neutral-700 sm:grid-cols-2">
            <p>
              <span className="font-bold">Módulo 1 — Pensamento Computacional:</span> decomposição, reconhecimento de
              padrões, algoritmos e lógica desplugada.
            </p>
            <p>
              <span className="font-bold">Módulo 2 — Mundo Digital:</span> hardware, software, representação de dados,
              binário e matrizes.
            </p>
            <p>
              <span className="font-bold">Módulo 3 — Cultura Digital:</span> segurança na rede, ética virtual, combate
              a fake news e cidadania.
            </p>
            <p>
              <span className="font-bold">Módulo 4 — Projeto Integrador Final:</span> prototipagem de artefato digital
              aplicando os 3 eixos.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-center text-xs font-bold text-neutral-600">
            COMPOSIÇÃO DA CARGA HORÁRIA · {TOTAL_SEMANAS_CURSO} aulas × {TOTAL_HORAS_CURSO / TOTAL_SEMANAS_CURSO}h
          </p>
          <ul className="mt-2 space-y-1 text-xs text-neutral-600">
            {COMPOSICAO_CARGA_HORARIA_AULA.map((item) => (
              <li key={item.etapa} className="flex justify-between gap-3">
                <span>{item.etapa}</span>
                <span className="shrink-0 font-semibold text-neutral-500">{item.minutos} min</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-400">
          Emitido em {dataEmissao} · Código de Validação: <span className="font-bold text-neutral-600">{codigo}</span>
        </p>

        <div className="mt-8 grid gap-6 text-center text-xs text-neutral-500 sm:grid-cols-2">
          <div className="border-t border-neutral-300 pt-2">
            <p className="font-bold text-neutral-700">Coordenação Pedagógica</p>
            <p>Programa de Formação BNCC Computação</p>
          </div>
          <div className="border-t border-neutral-300 pt-2">
            <p className="font-bold text-neutral-700">ItaGamificaEdu</p>
            <p>Plataforma de Formação em Tecnologia Educacional</p>
          </div>
        </div>
      </div>
    </div>
  );
}
