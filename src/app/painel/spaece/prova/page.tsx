import Link from "next/link";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { VERDE_SPAECE } from "@/lib/spaece";
import { NovaProvaCliente } from "@/components/prova/NovaProvaCliente";

const ROTULO_STATUS: Record<string, string> = {
  aguardando: "Aguardando início",
  em_andamento: "Em andamento",
  pausada: "Pausada",
  encerrada: "Encerrada",
};

// Cria uma prova cronometrada a partir dos simulados do SPAECE já prontos.
export default async function PaginaNovaProva() {
  const sessao = await exigirAssinaturaAtiva();

  const [atividades, turmas, provas] = await Promise.all([
    prisma.atividade.findMany({
      where: { professorId: sessao.userId, tipo: "quiz", tema: { contains: "(SPAECE)" } },
      orderBy: [{ disciplina: "asc" }, { criadaEm: "desc" }],
      select: { id: true, tema: true, disciplina: true, conteudoGerado: true },
    }),
    prisma.turma.findMany({
      where: { professorId: sessao.userId, ...(sessao.colaborador ? { acessoAlunosBloqueado: false } : {}) },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true },
    }),
    prisma.provaCronometrada.findMany({
      where: { professorId: sessao.userId, ...(sessao.colaborador ? { turma: { acessoAlunosBloqueado: false } } : {}) },
      orderBy: { criadaEm: "desc" },
      take: 8,
      select: { codigo: true, titulo: true, status: true, criadaEm: true, turma: { select: { nome: true } } },
    }),
  ]);

  // Só entram simulados com 10 questões ou mais: os de eixo (8 questões) não
  // servem pra prova completa e só poluem a lista.
  const simulados = atividades
    .map((a) => ({
      id: a.id,
      tema: a.tema,
      disciplina: a.disciplina,
      total: ((a.conteudoGerado as { questoes?: unknown[] })?.questoes ?? []).length,
    }))
    .filter((s) => s.total >= 10);

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link href="/painel/spaece" className="text-sm font-semibold" style={{ color: VERDE_SPAECE }}>
          ← Voltar ao SPAECE 9º ano
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold text-neutral-900">⏱️ Prova Cronometrada</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Simule a prova do SPAECE com o tempo real: um relógio só para a turma, cada aluno responde no tablet ou celular
          no próprio ritmo e a prova se entrega sozinha quando o tempo acaba.
        </p>

        <NovaProvaCliente simulados={simulados} turmas={turmas} />

        {provas.length > 0 && (
          <div className="mt-10">
            <h2 className="font-bold text-neutral-900">Provas já criadas</h2>
            <ul className="mt-3 space-y-2">
              {provas.map((p) => (
                <li key={p.codigo}>
                  <Link
                    href={`/painel/spaece/prova/${p.codigo}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm hover:bg-neutral-50"
                  >
                    <span className="min-w-0 truncate font-semibold text-neutral-800">
                      {p.titulo} <span className="font-normal text-neutral-500">· {p.turma.nome}</span>
                    </span>
                    <span className="shrink-0 text-xs text-neutral-500">
                      {ROTULO_STATUS[p.status]} · código {p.codigo}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
