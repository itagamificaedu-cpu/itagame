import Link from "next/link";
import { notFound } from "next/navigation";
import { verificarSessao } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { iniciarSala } from "@/app/actions/salas";

type Questao = { enunciado: string; alternativas: string[] };
type ItemGabarito = { enunciado: string; respostaCorreta: string; explicacao: string | null };

export default async function PaginaDetalheAtividade({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sessao = await verificarSessao();

  const atividade = await prisma.atividade.findUnique({ where: { id } });
  if (!atividade || atividade.professorId !== sessao.userId) {
    notFound();
  }

  const conteudo = atividade.conteudoGerado as { titulo: string; questoes: Questao[] };
  const gabarito = atividade.gabarito as ItemGabarito[];

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/painel/atividades" className="text-sm font-semibold text-[#1a3fd4]">
          ← Minhas atividades
        </Link>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{conteudo.titulo}</h1>
            <p className="mt-1 text-sm text-neutral-500">
              {atividade.disciplina} · {atividade.serie} · {atividade.tema}
            </p>
          </div>
          <form action={iniciarSala.bind(null, atividade.id)}>
            <button
              type="submit"
              className="whitespace-nowrap rounded-lg bg-[#00c264] px-4 py-2 text-sm font-bold text-white hover:brightness-110"
            >
              Iniciar sala ao vivo
            </button>
          </form>
        </div>

        {atividade.competenciasBncc.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {atividade.competenciasBncc.map((competencia) => (
              <span
                key={competencia}
                className="rounded-full bg-[#1a3fd4]/10 px-3 py-1 text-xs font-semibold text-[#1a3fd4]"
              >
                {competencia}
              </span>
            ))}
          </div>
        )}

        <ol className="mt-8 space-y-5">
          {conteudo.questoes.map((questao, indice) => {
            const item = gabarito[indice];
            return (
              <li key={indice} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <p className="font-semibold text-neutral-900">
                  {indice + 1}. {questao.enunciado}
                </p>

                {questao.alternativas.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {questao.alternativas.map((alternativa) => (
                      <li
                        key={alternativa}
                        className={`rounded-lg border px-3 py-2 text-sm ${
                          alternativa === item?.respostaCorreta
                            ? "border-[#00c264] bg-[#00c264]/10 font-semibold text-[#00854a]"
                            : "border-neutral-200 text-neutral-600"
                        }`}
                      >
                        {alternativa}
                      </li>
                    ))}
                  </ul>
                )}

                {questao.alternativas.length === 0 && item?.respostaCorreta && (
                  <p className="mt-3 inline-block rounded-lg border border-[#00c264] bg-[#00c264]/10 px-3 py-2 text-sm font-semibold text-[#00854a]">
                    Resposta: {item.respostaCorreta === "verdadeiro" ? "Verdadeiro" : "Falso"}
                  </p>
                )}

                {item?.explicacao && (
                  <p className="mt-3 text-sm text-neutral-500">{item.explicacao}</p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
