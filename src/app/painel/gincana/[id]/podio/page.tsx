import { notFound } from "next/navigation";
import Link from "next/link";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { obterEstadoGincana } from "@/app/actions/gincana";

const CORES_PODIO = [
  { medalha: "🥇", altura: "h-56", cor: "bg-[#FFD600]", texto: "text-[#1a1a2e]" },
  { medalha: "🥈", altura: "h-40", cor: "bg-neutral-300", texto: "text-neutral-900" },
  { medalha: "🥉", altura: "h-28", cor: "bg-[#CD7F32]", texto: "text-white" },
];

export default async function PaginaPodioGincana({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await exigirAssinaturaAtiva();

  let estado;
  try {
    estado = await obterEstadoGincana(id);
  } catch {
    notFound();
  }

  const top3 = estado.ranking.slice(0, 3);
  // Ordem visual do pódio: 2º à esquerda, 1º no meio, 3º à direita.
  const ordemVisual = [top3[1], top3[0], top3[2]];

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#1a3fd4] to-[#0e2694] px-6 py-12 text-white">
      <div className="w-full max-w-3xl">
        <Link href={`/painel/gincana/${id}`} className="text-sm font-semibold text-white/70">
          ← Voltar pro painel da gincana
        </Link>

        <h1 className="mt-4 text-center text-3xl font-extrabold sm:text-4xl">🏆 {estado.nome}</h1>
        <p className="mt-1 text-center text-white/70">Gincana encerrada — resultado final</p>

        <div className="mt-12 flex items-end justify-center gap-4">
          {ordemVisual.map((time, indice) =>
            time ? (
              <div key={time.timeId} className="flex flex-col items-center">
                <p className="mb-2 text-4xl">{CORES_PODIO[indice === 1 ? 0 : indice === 0 ? 1 : 2].medalha}</p>
                <p className="mb-1 max-w-[8rem] truncate text-center font-bold">{time.turmaNome}</p>
                <p className="mb-2 text-2xl font-extrabold">{time.total} pts</p>
                <div
                  className={`w-28 rounded-t-xl ${CORES_PODIO[indice === 1 ? 0 : indice === 0 ? 1 : 2].altura} ${
                    CORES_PODIO[indice === 1 ? 0 : indice === 0 ? 1 : 2].cor
                  } ${CORES_PODIO[indice === 1 ? 0 : indice === 0 ? 1 : 2].texto} flex items-start justify-center pt-3 text-xl font-black`}
                >
                  {indice === 1 ? "1º" : indice === 0 ? "2º" : "3º"}
                </div>
              </div>
            ) : (
              <div key={`vazio-${indice}`} className="w-28" />
            )
          )}
        </div>

        {estado.ranking.length > 3 && (
          <div className="mt-12 rounded-2xl bg-white/10 p-5 backdrop-blur">
            <p className="mb-3 text-sm font-bold text-white/70">Demais colocações</p>
            <ul className="space-y-1.5">
              {estado.ranking.slice(3).map((time, indice) => (
                <li key={time.timeId} className="flex items-center justify-between text-sm">
                  <span>
                    {indice + 4}º — {time.turmaNome}
                  </span>
                  <span className="font-bold">{time.total} pts</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
