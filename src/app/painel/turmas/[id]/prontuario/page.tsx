import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { excluirCasoClinico } from "@/app/actions/prontuario";
import FormularioCasoClinico from "./FormularioCasoClinico";

// Painel do professor pro Simulador de Prontuário Eletrônico — cadastra os
// casos clínicos da turma e acompanha, por caso, quais alunos já
// finalizaram o registro (mesmo "painel de monitoramento" que existia na
// planilha manual, agora ao vivo).
export default async function PaginaProntuarioProfessor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: turmaId } = await params;
  const sessao = await exigirAssinaturaAtiva();

  const turma = await prisma.turma.findUnique({
    where: { id: turmaId },
    include: {
      alunos: { orderBy: { nome: "asc" } },
      casosClinicos: {
        orderBy: { ordem: "asc" },
        include: { registros: true },
      },
    },
  });

  if (!turma || turma.professorId !== sessao.userId) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link href={`/painel/turmas/${turma.id}`} className="text-sm font-semibold text-[#1a3fd4]">
          ← {turma.nome}
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-neutral-900">🩺 Simulador de Prontuário Eletrônico</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Cadastre casos clínicos — o aluno lê o cenário e registra os dados numa ficha estruturada,
          igual a um prontuário eletrônico de verdade (sinais vitais + anotação de enfermagem).
        </p>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="font-bold text-neutral-900">Novo caso clínico</p>
          <div className="mt-3">
            <FormularioCasoClinico turmaId={turma.id} />
          </div>
        </div>

        {turma.casosClinicos.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
            <p className="text-3xl">🩺</p>
            <p className="mt-2 font-semibold text-neutral-700">Nenhum caso clínico cadastrado ainda</p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {turma.casosClinicos.map((caso) => {
              const finalizados = caso.registros.filter((r) => r.status === "finalizado").length;
              const totalAlunos = turma.alunos.length;
              const percentual = totalAlunos === 0 ? 0 : Math.round((finalizados / totalAlunos) * 100);

              return (
                <div key={caso.id} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-bold text-neutral-900">{caso.titulo}</p>
                      <p className="mt-1 text-sm whitespace-pre-line text-neutral-600">{caso.enunciado}</p>
                    </div>
                    <form action={excluirCasoClinico.bind(null, caso.id)}>
                      <button type="submit" className="shrink-0 text-xs font-semibold text-red-500 hover:text-red-700">
                        Excluir
                      </button>
                    </form>
                  </div>

                  <div className="mt-4 rounded-xl bg-neutral-50 p-4">
                    <div className="flex items-center justify-between text-sm font-bold text-neutral-700">
                      <span>
                        📋 {finalizados} de {totalAlunos} {totalAlunos === 1 ? "aluno finalizou" : "alunos finalizaram"}
                      </span>
                      <span>{percentual}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200">
                      <div
                        className="h-full rounded-full bg-[#00c264] transition-all"
                        style={{ width: `${percentual}%` }}
                      />
                    </div>

                    {totalAlunos > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {turma.alunos.map((aluno) => {
                          const registro = caso.registros.find((r) => r.alunoId === aluno.id);
                          const status = registro?.status ?? null;
                          return (
                            <li
                              key={aluno.id}
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                status === "finalizado"
                                  ? "bg-[#00c264]/15 text-[#00854a]"
                                  : status === "pendente"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-neutral-200 text-neutral-500"
                              }`}
                            >
                              {status === "finalizado" ? "✅" : status === "pendente" ? "✏️" : "—"} {aluno.nome}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
