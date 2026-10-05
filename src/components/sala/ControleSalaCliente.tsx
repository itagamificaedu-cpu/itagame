"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { avancarPergunta, encerrarSala } from "@/app/actions/salas";
import { QrCodeEntrada } from "@/components/comum/QrCodeEntrada";

type Participante = { id: string; apelido: string; pontuacao: number; eliminado: boolean };

type EstadoSala = {
  status: "aberta" | "em_andamento" | "encerrada";
  tipoAtividade: string;
  perguntaAtual: number;
  totalQuestoes: number;
  titulo: string;
  perguntaAtualConteudo: { enunciado: string; alternativas: string[]; imagem?: string } | null;
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
            Peça para os alunos acessarem <strong>itagame.itatecnologiaeducacional.tech/entrar</strong>{" "}
            ou escanear o QR code abaixo.
          </p>
          {typeof window !== "undefined" && (
            <div className="mt-4 flex justify-center">
              <QrCodeEntrada url={`${window.location.origin}/entrar?codigo=${codigo}`} />
            </div>
          )}
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
            <p className="mt-2 whitespace-pre-line text-lg font-bold text-neutral-900">
              {dados.perguntaAtualConteudo.enunciado}
            </p>
            {dados.perguntaAtualConteudo.imagem && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={dados.perguntaAtualConteudo.imagem}
                alt="Figura da questão"
                className="mt-4 block max-h-[60vh] w-auto max-w-full rounded-lg border border-neutral-200"
              />
            )}
            <p className="mt-4 text-sm text-neutral-500">
              {dados.respostasAtual} de {dados.participantes.length} já responderam
            </p>

            {dados.tipoAtividade === "quem_erra_cai" && <ArenaQuemErraCai participantes={dados.participantes} />}

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

// Projeção pro telão: cada aluno é um círculo numa "plataforma" fina —
// verde e de pé enquanto acerta, cinza e caído assim que erra uma vez.
// Visual verde minimalista, sem mascote nem neon — só o essencial pra dar
// tensão.
function ArenaQuemErraCai({ participantes }: { participantes: Participante[] }) {
  const sobreviventes = participantes.filter((p) => !p.eliminado).length;
  return (
    <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
      <p className="text-xs font-bold tracking-wide text-neutral-400 uppercase">
        {sobreviventes} de {participantes.length} de pé
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        {participantes.map((p) => (
          <div key={p.id} className="flex w-16 flex-col items-center gap-1.5">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-extrabold text-white transition-all duration-500 ${
                p.eliminado ? "translate-y-3 bg-neutral-300 opacity-50" : "bg-[#00c264]"
              }`}
            >
              {p.apelido.slice(0, 2).toUpperCase()}
            </div>
            <div className={`h-0.5 w-10 rounded-full ${p.eliminado ? "bg-neutral-200" : "bg-[#00c264]/40"}`} />
            <p className="w-full truncate text-center text-[11px] text-neutral-500">{p.apelido}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
