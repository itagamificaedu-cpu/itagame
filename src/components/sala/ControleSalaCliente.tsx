"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { avancarPergunta, encerrarSala } from "@/app/actions/salas";

type Participante = { id: string; apelido: string; pontuacao: number };

type EstadoSala = {
  status: "aberta" | "em_andamento" | "encerrada";
  perguntaAtual: number;
  totalQuestoes: number;
  titulo: string;
  perguntaAtualConteudo: { enunciado: string; alternativas: string[] } | null;
  participantes: Participante[];
  respostasAtual: number;
};

export function ControleSalaCliente({ codigo }: { codigo: string }) {
  const [dados, setDados] = useState<EstadoSala | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  useEffect(() => {
    const origem = new EventSource(`/api/salas/${codigo}/eventos`);
    origem.onmessage = (evento) => setDados(JSON.parse(evento.data));
    return () => origem.close();
  }, [codigo]);

  if (!dados) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50">
        Carregando sala...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/painel/atividades" className="text-sm font-semibold text-[#1a3fd4]">
          ← Minhas atividades
        </Link>

        <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-8 text-center">
          <p className="text-sm text-neutral-500">{dados.titulo}</p>
          <p className="mt-2 text-sm font-semibold text-neutral-500">Código da sala</p>
          <p className="text-5xl font-extrabold tracking-widest text-[#1a3fd4]">{codigo}</p>
          <p className="mt-2 text-sm text-neutral-500">
            Peça para os alunos acessarem <strong>itagame.itatecnologiaeducacional.tech/entrar</strong>
          </p>
        </div>

        {dados.status === "aberta" && (
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-8">
            <p className="font-semibold text-neutral-900">
              {dados.participantes.length} aluno(s) na sala
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {dados.participantes.map((p) => (
                <li key={p.id} className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">
                  {p.apelido}
                </li>
              ))}
            </ul>

            <button
              onClick={() => iniciarTransicao(() => avancarPergunta(codigo))}
              disabled={pendente || dados.participantes.length === 0}
              className="mt-6 w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white hover:brightness-110 disabled:opacity-50"
            >
              Iniciar jogo
            </button>
          </div>
        )}

        {dados.status === "em_andamento" && dados.perguntaAtualConteudo && (
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-8">
            <p className="text-sm text-neutral-500">
              Pergunta {dados.perguntaAtual + 1} de {dados.totalQuestoes}
            </p>
            <p className="mt-2 text-lg font-bold text-neutral-900">
              {dados.perguntaAtualConteudo.enunciado}
            </p>
            <p className="mt-4 text-sm text-neutral-500">
              {dados.respostasAtual} de {dados.participantes.length} já responderam
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => iniciarTransicao(() => avancarPergunta(codigo))}
                disabled={pendente}
                className="flex-1 rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white hover:brightness-110 disabled:opacity-60"
              >
                {dados.perguntaAtual + 1 >= dados.totalQuestoes ? "Ver resultado final" : "Próxima pergunta"}
              </button>
              <button
                onClick={() => iniciarTransicao(() => encerrarSala(codigo))}
                disabled={pendente}
                className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
              >
                Encerrar
              </button>
            </div>
          </div>
        )}

        {dados.status === "encerrada" && (
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-8">
            <p className="font-semibold text-neutral-900">Ranking final</p>
            <ol className="mt-4 space-y-2">
              {dados.participantes.slice(0, 10).map((p, indice) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-2 text-sm"
                >
                  <span className="font-medium text-neutral-800">
                    {indice + 1}. {p.apelido}
                  </span>
                  <span className="text-neutral-500">{p.pontuacao} pts</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </main>
  );
}
