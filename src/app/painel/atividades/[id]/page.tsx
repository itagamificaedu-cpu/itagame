import Link from "next/link";
import { notFound } from "next/navigation";
import { verificarSessao } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { iniciarSala } from "@/app/actions/salas";

type Questao = { enunciado: string; alternativas: string[] };
type ItemGabarito = { enunciado: string; respostaCorreta: string; explicacao: string | null };

type ConteudoBase = { titulo: string; questoes: Questao[] };
type ConteudoAssociarColunas = ConteudoBase & { colunaB: string[] };
type ConteudoCacaPalavras = ConteudoBase & { tamanho: number; grade: string[][] };

const TIPOS_SEM_SALA_AO_VIVO = new Set([
  "completar_frase",
  "caca_palavras",
  "associar_colunas",
  "apresentacao",
]);

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

  const conteudo = atividade.conteudoGerado as ConteudoBase;
  const gabarito = atividade.gabarito as ItemGabarito[];
  const podeIniciarSala = !TIPOS_SEM_SALA_AO_VIVO.has(atividade.tipo);

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
          {podeIniciarSala && (
            <form action={iniciarSala.bind(null, atividade.id)}>
              <button
                type="submit"
                className="whitespace-nowrap rounded-lg bg-[#00c264] px-4 py-2 text-sm font-bold text-white hover:brightness-110"
              >
                Iniciar sala ao vivo
              </button>
            </form>
          )}
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

        <div className="mt-8">
          {atividade.tipo === "caca_palavras" && (
            <BlocoCacaPalavras conteudo={conteudo as ConteudoCacaPalavras} gabarito={gabarito} />
          )}
          {atividade.tipo === "associar_colunas" && (
            <BlocoAssociarColunas conteudo={conteudo as ConteudoAssociarColunas} gabarito={gabarito} />
          )}
          {atividade.tipo === "apresentacao" && (
            <BlocoApresentacao conteudo={conteudo} gabarito={gabarito} />
          )}
          {(atividade.tipo === "quiz" ||
            atividade.tipo === "verdadeiro_falso" ||
            atividade.tipo === "completar_frase") && (
            <BlocoQuestoes conteudo={conteudo} gabarito={gabarito} tipo={atividade.tipo} />
          )}
        </div>
      </div>
    </main>
  );
}

function BlocoQuestoes({
  conteudo,
  gabarito,
  tipo,
}: {
  conteudo: ConteudoBase;
  gabarito: ItemGabarito[];
  tipo: string;
}) {
  return (
    <ol className="space-y-5">
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
                Resposta:{" "}
                {tipo === "verdadeiro_falso"
                  ? item.respostaCorreta === "verdadeiro"
                    ? "Verdadeiro"
                    : "Falso"
                  : item.respostaCorreta}
              </p>
            )}

            {item?.explicacao && <p className="mt-3 text-sm text-neutral-500">{item.explicacao}</p>}
          </li>
        );
      })}
    </ol>
  );
}

function BlocoAssociarColunas({
  conteudo,
  gabarito,
}: {
  conteudo: ConteudoAssociarColunas;
  gabarito: ItemGabarito[];
}) {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-bold text-neutral-500">Coluna A</p>
          <ol className="space-y-2">
            {conteudo.questoes.map((questao, indice) => (
              <li key={indice} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm">
                <span className="font-semibold text-[#1a3fd4]">{indice + 1}.</span> {questao.enunciado}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold text-neutral-500">Coluna B</p>
          <ol className="space-y-2">
            {conteudo.colunaB.map((definicao, indice) => (
              <li key={indice} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm">
                <span className="font-semibold text-[#1a3fd4]">{letras[indice]}.</span> {definicao}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <details className="mt-6">
        <summary className="cursor-pointer text-sm font-bold text-neutral-700">Ver gabarito</summary>
        <ul className="mt-3 space-y-1 text-sm text-neutral-600">
          {gabarito.map((item, indice) => (
            <li key={indice}>
              {indice + 1}. {item.enunciado} → {item.respostaCorreta}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

function BlocoCacaPalavras({
  conteudo,
  gabarito,
}: {
  conteudo: ConteudoCacaPalavras;
  gabarito: ItemGabarito[];
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div
        className="mx-auto grid w-fit gap-0.5"
        style={{ gridTemplateColumns: `repeat(${conteudo.tamanho}, minmax(0, 1fr))` }}
      >
        {conteudo.grade.map((linha, indiceLinha) =>
          linha.map((letra, indiceColuna) => (
            <div
              key={`${indiceLinha}-${indiceColuna}`}
              className="flex h-6 w-6 items-center justify-center rounded-sm bg-neutral-50 text-xs font-bold text-neutral-700 sm:h-7 sm:w-7 sm:text-sm"
            >
              {letra}
            </div>
          ))
        )}
      </div>

      <p className="mt-6 text-sm font-bold text-neutral-500">Dicas</p>
      <ol className="mt-2 space-y-1 text-sm text-neutral-600">
        {conteudo.questoes.map((questao, indice) => (
          <li key={indice}>
            {indice + 1}. {questao.enunciado}
          </li>
        ))}
      </ol>

      <details className="mt-6">
        <summary className="cursor-pointer text-sm font-bold text-neutral-700">Ver gabarito</summary>
        <ul className="mt-3 space-y-1 text-sm text-neutral-600">
          {gabarito.map((item, indice) => (
            <li key={indice}>
              {item.enunciado} → {item.respostaCorreta}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

function BlocoApresentacao({ conteudo, gabarito }: { conteudo: ConteudoBase; gabarito: ItemGabarito[] }) {
  return (
    <ol className="space-y-5">
      {conteudo.questoes.map((slide, indice) => {
        const notas = gabarito[indice]?.respostaCorreta;
        return (
          <li
            key={indice}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
          >
            <div className="bg-gradient-to-br from-[#1a3fd4] to-[#0e2694] px-6 py-4">
              <p className="text-xs font-semibold text-white/70">Slide {indice + 1}</p>
              <p className="text-lg font-bold text-white">{slide.enunciado}</p>
            </div>
            <div className="p-6">
              <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700">
                {slide.alternativas.map((topico, indiceTopico) => (
                  <li key={indiceTopico}>{topico}</li>
                ))}
              </ul>
              {notas && (
                <p className="mt-4 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-500">
                  <span className="font-semibold text-neutral-700">Fala sugerida: </span>
                  {notas}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
