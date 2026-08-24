import { prisma } from "@/lib/prisma";
import { criarTokenParticipanteJogoExterno } from "@/lib/jogoExternoSessao";
import { cabecalhosCorsJogoExterno, respostaPreflight } from "@/lib/corsJogoExterno";

export const dynamic = "force-dynamic";

// Aluno entra numa sala de jogo externo com apelido + código — sem login, igual ao
// Cabo de Guerra. Devolve um token assinado que o jogo guarda no localStorage e manda
// de volta em /resultado quando a partida terminar.
export async function POST(req: Request, { params }: { params: Promise<{ codigo: string }> }) {
  const cors = cabecalhosCorsJogoExterno(req.headers.get("origin"));
  const { codigo } = await params;

  let corpo: { apelido?: string };
  try {
    corpo = await req.json();
  } catch {
    return Response.json({ erro: "Corpo inválido." }, { status: 400, headers: cors });
  }

  const apelido = corpo.apelido?.trim().slice(0, 60);
  if (!apelido) {
    return Response.json({ erro: "Informe um apelido." }, { status: 400, headers: cors });
  }

  const sala = await prisma.salaJogoExterno.findUnique({ where: { codigo } });
  if (!sala || sala.status === "encerrada") {
    return Response.json({ erro: "Sala não encontrada ou encerrada." }, { status: 404, headers: cors });
  }

  // Reentrada com o mesmo apelido reaproveita o participante já existente (ex: aluno
  // atualizou a página no meio do jogo) em vez de duplicar linha.
  const participante = await prisma.participanteJogoExterno.upsert({
    where: { salaId_apelido: { salaId: sala.id, apelido } },
    update: {},
    create: { salaId: sala.id, apelido },
  });

  const token = await criarTokenParticipanteJogoExterno({
    participanteId: participante.id,
    salaId: sala.id,
  });

  return Response.json({ token, participanteId: participante.id }, { headers: cors });
}

export async function OPTIONS(req: Request) {
  return respostaPreflight(req);
}
