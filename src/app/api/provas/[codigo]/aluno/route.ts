import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoProva } from "@/lib/provaSessao";
import { blocosDaProva, finalizarSeNecessario, respostasDoParticipante } from "@/lib/provas";
import { duracaoTotalSegundos, restanteSegundos } from "@/lib/provaTempo";

export const dynamic = "force-dynamic";

// Estado da prova para o aluno: relógio do servidor, questões (só depois que a
// prova começa, e nunca com o gabarito) e as respostas já marcadas.
export async function GET(_req: Request, { params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  const sessao = await obterSessaoProva(codigo);
  if (!sessao) return NextResponse.json({ erro: "sem_sessao" }, { status: 401 });

  const provaBruta = await prisma.provaCronometrada.findUnique({ where: { id: sessao.provaId } });
  if (!provaBruta) return NextResponse.json({ erro: "nao_encontrada" }, { status: 404 });
  const prova = await finalizarSeNecessario(provaBruta);

  const participante = await prisma.participanteProva.findUnique({ where: { id: sessao.participanteId } });
  if (!participante || participante.provaId !== prova.id) {
    return NextResponse.json({ erro: "sem_sessao" }, { status: 401 });
  }

  if (Date.now() - participante.ultimoSinalEm.getTime() > 20000) {
    prisma.participanteProva
      .update({ where: { id: participante.id }, data: { ultimoSinalEm: new Date() } })
      .catch(() => {});
  }

  const blocos = blocosDaProva(prova);
  const comecou = prova.status !== "aguardando";

  return NextResponse.json({
    titulo: prova.titulo,
    status: prova.status,
    agora: Date.now(),
    restanteSeg: restanteSegundos(prova),
    duracaoSeg: duracaoTotalSegundos(prova),
    entregue: Boolean(participante.entregueEm) || prova.status === "encerrada",
    blocos: comecou
      ? blocos.map((b) => ({ nome: b.nome, questoes: b.questoes }))
      : blocos.map((b) => ({ nome: b.nome, questoes: [], total: b.questoes.length })),
    respostas: respostasDoParticipante(participante.respostas),
  });
}
