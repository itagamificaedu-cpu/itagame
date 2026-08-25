import { prisma } from "@/lib/prisma";
import { verificarTokenParticipanteJogoExterno } from "@/lib/jogoExternoSessao";
import { cabecalhosCorsJogoExterno, respostaPreflight } from "@/lib/corsJogoExterno";

export const dynamic = "force-dynamic";

// Recebe o resultado final da partida (disparado pelo script que observa o
// localStorage do jogo). Só grava se o token bater com a sala do código da URL e o
// participante ainda não tiver enviado resultado — evita reenvio duplicado/adulterado.
export async function POST(req: Request, { params }: { params: Promise<{ codigo: string }> }) {
  const cors = cabecalhosCorsJogoExterno(req.headers.get("origin"));
  const { codigo } = await params;

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const sessao = await verificarTokenParticipanteJogoExterno(token);
  if (!sessao) {
    return Response.json({ erro: "Token inválido ou expirado." }, { status: 401, headers: cors });
  }

  let corpo: { pontuacao?: number; tempoSegundos?: number; respostas?: unknown; capturaTela?: string };
  try {
    corpo = await req.json();
  } catch {
    return Response.json({ erro: "Corpo inválido." }, { status: 400, headers: cors });
  }

  const pontuacao = Number(corpo.pontuacao);
  if (!Number.isFinite(pontuacao)) {
    return Response.json({ erro: "Pontuação inválida." }, { status: 400, headers: cors });
  }

  // Captura de tela e opcional (o script sempre manda, mas nao trava o envio se faltar).
  // Limite de tamanho evita abuso — um JPEG do canvas em qualidade baixa fica bem
  // menor que isso; qualquer coisa maior e suspeita, so ignora.
  let capturaTela: string | undefined;
  if (typeof corpo.capturaTela === "string" && corpo.capturaTela.startsWith("data:image/")) {
    capturaTela = corpo.capturaTela.length <= 800_000 ? corpo.capturaTela : undefined;
  }

  const sala = await prisma.salaJogoExterno.findUnique({ where: { codigo } });
  if (!sala || sala.id !== sessao.salaId) {
    return Response.json({ erro: "Sala não corresponde ao token." }, { status: 403, headers: cors });
  }

  const participante = await prisma.participanteJogoExterno.findUnique({
    where: { id: sessao.participanteId },
  });
  if (!participante || participante.salaId !== sala.id) {
    return Response.json({ erro: "Participante não encontrado." }, { status: 404, headers: cors });
  }
  if (participante.finalizadoEm) {
    return Response.json({ erro: "Resultado já enviado." }, { status: 409, headers: cors });
  }

  await prisma.participanteJogoExterno.update({
    where: { id: participante.id },
    data: {
      pontuacao: Math.trunc(pontuacao),
      tempoSegundos: Number.isFinite(Number(corpo.tempoSegundos)) ? Math.trunc(Number(corpo.tempoSegundos)) : null,
      respostas: corpo.respostas === undefined ? undefined : (corpo.respostas as object),
      capturaTela,
      finalizadoEm: new Date(),
    },
  });

  return Response.json({ ok: true }, { headers: cors });
}

export async function OPTIONS(req: Request) {
  return respostaPreflight(req);
}
