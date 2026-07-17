import { cookies } from "next/headers";
import { descriptografar } from "@/lib/sessao";
import { obterSessaoParticipanteCaboGuerra } from "@/lib/caboGuerraSessao";
import { prisma } from "@/lib/prisma";
import { avancarSeNecessario } from "@/lib/caboGuerraTick";
import { nivelDaRodada, TEMPO_RODADA, TOTAL_RODADAS } from "@/lib/caboGuerraPerguntas";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;

  const salaInicial = await prisma.salaCaboGuerra.findUnique({ where: { codigo } });
  if (!salaInicial) {
    return new Response("Sala não encontrada", { status: 404 });
  }

  const cookieSessao = (await cookies()).get("itagame_sessao")?.value;
  const sessaoProfessor = await descriptografar(cookieSessao);
  const sessaoParticipante = await obterSessaoParticipanteCaboGuerra(codigo);

  const ehDono = sessaoProfessor?.userId === salaInicial.professorId;
  if (!ehDono && !sessaoParticipante) {
    return new Response("Não autorizado", { status: 401 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(`: conectado\n\n`));
      let ativo = true;

      while (ativo) {
        try {
          await avancarSeNecessario(codigo);

          const sala = await prisma.salaCaboGuerra.findUnique({
            where: { codigo },
            include: { participantes: { orderBy: { entrouEm: "asc" } } },
          });

          if (!sala) {
            controller.enqueue(encoder.encode(`event: erro\ndata: {}\n\n`));
            break;
          }

          const meuParticipante = sessaoParticipante
            ? sala.participantes.find((p) => p.id === sessaoParticipante.participanteId)
            : null;

          const tempoRestante =
            sala.perguntaComecouEm && sala.rodadaGanhaPor === null
              ? Math.max(
                  0,
                  TEMPO_RODADA - Math.floor((Date.now() - sala.perguntaComecouEm.getTime()) / 1000)
                )
              : 0;

          let vencedorFinal: number | null = null;
          if (sala.status === "encerrada") {
            if (sala.pontosEquipe1 > sala.pontosEquipe2) vencedorFinal = 1;
            else if (sala.pontosEquipe2 > sala.pontosEquipe1) vencedorFinal = 2;
            else vencedorFinal = 0;
          }

          const modoPersonalizado = sala.perguntas !== null;

          const payload = {
            status: sala.status,
            nomeEquipe1: sala.nomeEquipe1,
            nomeEquipe2: sala.nomeEquipe2,
            rodadaAtual: sala.rodadaAtual,
            totalRodadas: modoPersonalizado ? sala.totalRodadas : TOTAL_RODADAS,
            modoPersonalizado,
            nivel: nivelDaRodada(sala.rodadaAtual),
            pontosEquipe1: sala.pontosEquipe1,
            pontosEquipe2: sala.pontosEquipe2,
            perguntaTexto: sala.perguntaTexto,
            perguntaAlternativas: sala.perguntaAlternativas as string[] | null,
            tempoRestante,
            rodadaGanhaPor: sala.rodadaGanhaPor,
            equipe1: sala.participantes
              .filter((p) => p.equipe === 1)
              .map((p) => ({ id: p.id, apelido: p.apelido, pontuacao: p.pontuacao })),
            equipe2: sala.participantes
              .filter((p) => p.equipe === 2)
              .map((p) => ({ id: p.id, apelido: p.apelido, pontuacao: p.pontuacao })),
            meuId: meuParticipante?.id ?? null,
            minhaEquipe: meuParticipante?.equipe ?? null,
            vencedorFinal,
          };

          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));

          if (sala.status === "encerrada") {
            ativo = false;
            break;
          }

          await new Promise((resolve) => setTimeout(resolve, 900));
        } catch (erro) {
          console.error("Erro no stream do cabo de guerra online", codigo, erro);
          controller.enqueue(encoder.encode(`event: erro\ndata: ${JSON.stringify(String(erro))}\n\n`));
          break;
        }
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
