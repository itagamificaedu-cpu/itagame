import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { descriptografar } from "@/lib/sessao";
import { idDonoDaSessao } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { blocosDaProva, corrigir, finalizarSeNecessario, respostasDoParticipante } from "@/lib/provas";
import { duracaoTotalSegundos, restanteSegundos } from "@/lib/provaTempo";

export const dynamic = "force-dynamic";

// Painel do professor: relógio, quem entrou, quantas questões cada aluno já
// marcou e, com a prova encerrada, o resultado de cada um.
export async function GET(_req: Request, { params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;

  const sessao = await descriptografar((await cookies()).get("itagame_sessao")?.value);
  const donoId = await idDonoDaSessao(sessao?.userId);

  const provaBruta = await prisma.provaCronometrada.findUnique({
    where: { codigo },
    include: {
      turma: { include: { alunos: { select: { id: true, nome: true }, orderBy: { nome: "asc" } } } },
      participantes: { include: { aluno: { select: { nome: true } } } },
    },
  });
  if (!provaBruta || !donoId || provaBruta.professorId !== donoId) {
    return NextResponse.json({ erro: "nao_autorizado" }, { status: 401 });
  }

  const finalizada = await finalizarSeNecessario(provaBruta);
  const prova = { ...provaBruta, ...finalizada };
  const blocos = blocosDaProva(prova);
  const encerrada = prova.status === "encerrada";
  const agora = Date.now();

  const participantes = prova.participantes
    .map((p) => {
      const porBloco = corrigir(blocos, respostasDoParticipante(p.respostas));
      return {
        alunoId: p.alunoId,
        nome: p.aluno.nome,
        respondidas: porBloco.map((b) => b.respondidas),
        entregue: Boolean(p.entregueEm) || encerrada,
        online: agora - p.ultimoSinalEm.getTime() < 45000,
        ...(encerrada ? { acertos: porBloco.map((b) => b.acertos) } : {}),
      };
    })
    .sort((a, b) => a.nome.localeCompare(b.nome));

  const entraram = new Set(prova.participantes.map((p) => p.alunoId));

  return NextResponse.json({
    titulo: prova.titulo,
    codigo: prova.codigo,
    turma: prova.turma.nome,
    status: prova.status,
    agora,
    restanteSeg: restanteSegundos(prova),
    duracaoSeg: duracaoTotalSegundos(prova),
    iniciadaEm: prova.iniciadaEm?.getTime() ?? null,
    blocos: blocos.map((b) => ({ nome: b.nome, total: b.questoes.length })),
    participantes,
    ausentes: prova.turma.alunos.filter((a) => !entraram.has(a.id)).map((a) => a.nome),
  });
}
