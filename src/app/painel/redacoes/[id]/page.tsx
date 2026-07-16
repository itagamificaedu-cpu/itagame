import Link from "next/link";
import { notFound } from "next/navigation";
import { verificarSessao } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";

type NotaCriterio = { criterio: string; nota: number; comentario: string };

function corPorNota(nota: number) {
  if (nota >= 8) return { texto: "text-[#00854a]", barra: "bg-[#00c264]" };
  if (nota >= 6) return { texto: "text-[#8a5a00]", barra: "bg-[#ffb020]" };
  return { texto: "text-[#a8283f]", barra: "bg-[#ff5470]" };
}

export default async function PaginaDetalheCorrecao({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sessao = await verificarSessao();

  const correcao = await prisma.correcaoRedacao.findUnique({ where: { id } });
  if (!correcao || correcao.professorId !== sessao.userId) {
    notFound();
  }

  const criterios = correcao.notasPorCriterio as NotaCriterio[];
  const corGeral = corPorNota(correcao.notaGeral);

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/painel/redacoes" className="text-sm font-semibold text-[#1a3fd4]">
          ← Correções de redação
        </Link>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{correcao.tema}</h1>
            <p className="mt-1 text-sm text-neutral-500">
              {correcao.criadaEm.toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div className={`shrink-0 text-4xl font-extrabold ${corGeral.texto}`}>
            {correcao.notaGeral.toFixed(1)}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
          <p className="font-bold text-neutral-900">Feedback geral</p>
          <p className="mt-2 text-sm text-neutral-600">{correcao.feedbackGeral}</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {criterios.map((item) => {
            const cor = corPorNota(item.nota);
            return (
              <div key={item.criterio} className="rounded-2xl border border-neutral-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-neutral-900">{item.criterio}</p>
                  <p className={`font-extrabold ${cor.texto}`}>{item.nota.toFixed(1)}</p>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className={`h-full rounded-full ${cor.barra}`}
                    style={{ width: `${(item.nota / 10) * 100}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-neutral-600">{item.comentario}</p>
              </div>
            );
          })}
        </div>

        <details className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
          <summary className="cursor-pointer font-bold text-neutral-900">
            Ver texto enviado
          </summary>
          <p className="mt-3 whitespace-pre-line text-sm text-neutral-600">
            {correcao.textoEnviado}
          </p>
        </details>
      </div>
    </main>
  );
}
