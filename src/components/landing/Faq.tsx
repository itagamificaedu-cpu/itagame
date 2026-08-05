"use client";

import { useState } from "react";

const perguntas = [
  {
    pergunta: "Quais tipos de atividade estão disponíveis?",
    resposta:
      "Quiz, Verdadeiro ou Falso, Caça-palavras, Completar a Frase, Associar Colunas e Apresentação de Slides.",
  },
  {
    pergunta: "O que está incluso na assinatura?",
    resposta:
      "Atividades ilimitadas, todos os tipos de jogo, sala ao vivo sem limite de alunos, correção de redação com IA e exportação em Word, PDF e PowerPoint.",
  },
  {
    pergunta: "Serve para escola pública?",
    resposta:
      "Sim. A plataforma funciona igual para professores da rede pública e privada, com ou sem coordenação por trás.",
  },
  {
    pergunta: "Preciso saber mexer com tecnologia?",
    resposta:
      "Não. Se você consegue usar um grupo de WhatsApp, consegue usar o ItaGameficaEdu — o aluno só precisa de um código para entrar.",
  },
  {
    pergunta: "Meus alunos precisam criar conta?",
    resposta:
      "Não. Só o professor tem conta. O aluno entra na sala ao vivo digitando o código, sem cadastro.",
  },
];

export function Faq() {
  const [aberta, setAberta] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-neutral-50 px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-3xl font-extrabold text-neutral-900">
          Perguntas frequentes
        </h2>

        <div className="mt-10 space-y-3">
          {perguntas.map((item, indice) => {
            const estaAberta = aberta === indice;
            return (
              <div
                key={item.pergunta}
                className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
              >
                <button
                  onClick={() => setAberta(estaAberta ? null : indice)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-semibold text-neutral-900">{item.pergunta}</span>
                  <span
                    className={`shrink-0 text-[#1a3fd4] transition-transform ${estaAberta ? "rotate-180" : ""}`}
                  >
                    ▾
                  </span>
                </button>
                {estaAberta && (
                  <p className="px-5 pb-4 text-sm text-neutral-600">{item.resposta}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
