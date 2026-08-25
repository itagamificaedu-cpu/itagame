"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listarParticipantesJogoExterno, encerrarSalaJogoExterno } from "@/app/actions/jogosExternos";
import { urlJogoExterno } from "@/lib/catalogoJogosExternos";

type Participante = {
  id: string;
  apelido: string;
  pontuacao: number;
  tempoSegundos: number | null;
  finalizado: boolean;
};

export function PlacarJogoExternoCliente({ codigo, jogo }: { codigo: string; jogo: string }) {
  const [status, setStatus] = useState<"aberta" | "em_andamento" | "encerrada">("aberta");
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [copiado, setCopiado] = useState(false);
  const link = urlJogoExterno(jogo);

  function copiarLink() {
    if (!link) return;
    navigator.clipboard.writeText(link).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }

  useEffect(() => {
    let ativo = true;

    async function atualizar() {
      try {
        const dados = await listarParticipantesJogoExterno(codigo);
        if (ativo) {
          setStatus(dados.status);
          setParticipantes(dados.participantes);
        }
      } catch {
        // sala pode ter sido encerrada/removida nesse meio-tempo — ignora e tenta de novo
      }
    }

    atualizar();
    const intervalo = setInterval(atualizar, 3000);
    return () => {
      ativo = false;
      clearInterval(intervalo);
    };
  }, [codigo]);

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/painel/jogos" className="text-sm font-semibold text-[#1a3fd4]">
          ← Jogos
        </Link>

        <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-8 text-center">
          <p className="text-sm text-neutral-500">{jogo}</p>
          <p className="mt-2 text-sm font-semibold text-neutral-500">Código da sala</p>
          <p className="text-5xl font-extrabold tracking-widest text-[#1a3fd4]">{codigo}</p>
          <p className="mt-2 text-sm text-neutral-500">
            Peça pros alunos abrirem o jogo e digitarem esse código pra entrar.
          </p>

          {link && (
            <div className="mt-4 rounded-xl bg-neutral-50 p-3">
              <p className="text-xs font-semibold text-neutral-500">Link do jogo</p>
              <p className="mt-1 break-all text-sm text-neutral-700">{link}</p>
              <button
                type="button"
                onClick={copiarLink}
                className="mt-2 rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-semibold text-neutral-600"
              >
                {copiado ? "Copiado!" : "Copiar link"}
              </button>
            </div>
          )}

          {status === "encerrada" ? (
            <p className="mt-4 text-sm font-semibold text-neutral-500">Sala encerrada.</p>
          ) : (
            <form action={encerrarSalaJogoExterno.bind(null, codigo)} className="mt-4">
              <button
                type="submit"
                className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-600"
              >
                Encerrar sala
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
          <p className="text-sm font-semibold text-neutral-500">
            Placar ({participantes.length} {participantes.length === 1 ? "aluno" : "alunos"})
          </p>
          <ul className="mt-3 space-y-2">
            {participantes.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-2 text-sm"
              >
                <span className="font-medium text-neutral-800">{p.apelido}</span>
                <span className="text-neutral-500">
                  {p.finalizado ? `${p.pontuacao} pts` : "jogando..."}
                </span>
              </li>
            ))}
            {participantes.length === 0 && (
              <li className="text-sm text-neutral-400">Nenhum aluno entrou ainda.</li>
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
