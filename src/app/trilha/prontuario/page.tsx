import Link from "next/link";
import { verificarSessaoAluno } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";

// Lista de casos clínicos do Simulador de Prontuário Eletrônico, pro aluno.
export default async function PaginaProntuarioAluno() {
  const aluno = await verificarSessaoAluno();

  const casos = await prisma.casoClinicoProntuario.findMany({
    where: { turmaId: aluno.turmaId },
    orderBy: { ordem: "asc" },
    include: { registros: { where: { alunoId: aluno.id } } },
  });

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/trilha" className="text-sm font-semibold text-[#1a3fd4]">
          ← Minhas trilhas
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-neutral-900">🩺 Simulador de Prontuário Eletrônico</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Leia o cenário de cada caso clínico e registre os dados do paciente numa ficha
          estruturada — sinais vitais, anotação de enfermagem e assinatura, igual num prontuário
          eletrônico de verdade.
        </p>

        {casos.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
            <p className="text-3xl">🩺</p>
            <p className="mt-2 font-semibold text-neutral-700">Nenhum caso clínico disponível ainda</p>
            <p className="mt-1 text-sm text-neutral-500">Assim que o professor cadastrar um, ele aparece aqui.</p>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {casos.map((caso) => {
              const status = caso.registros[0]?.status ?? null;
              return (
                <li key={caso.id}>
                  <Link
                    href={`/trilha/prontuario/${caso.id}`}
                    className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-[#1a3fd4] hover:bg-[#1a3fd4]/5"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1a3fd4]/10 text-xl">
                      🩺
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-neutral-900">{caso.titulo}</p>
                      <p className="mt-0.5 line-clamp-1 text-sm text-neutral-500">{caso.enunciado}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                        status === "finalizado"
                          ? "bg-[#00c264]/15 text-[#00854a]"
                          : status === "pendente"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {status === "finalizado" ? "Finalizado ✅" : status === "pendente" ? "Continuar" : "Começar"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
