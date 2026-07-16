import { cookies } from "next/headers";
import { descriptografar } from "@/lib/sessao";
import { obterSessaoParticipante } from "@/lib/salaSessao";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Questao = { enunciado: string; alternativas: string[] };

export async function GET(_req: Request, { params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;

  const salaInicial = await prisma.salaAoVivo.findUnique({
    where: { codigo },
    include: { atividade: true },
  });
  if (!salaInicial) {
    return new Response("Sala não encontrada", { status: 404 });
  }

  const cookieSessao = (await cookies()).get("itagame_sessao")?.value;
  const sessaoProfessor = await descriptografar(cookieSessao);
  const sessaoParticipante = await obterSessaoParticipante(codigo);

  const ehDono = sessaoProfessor?.userId === salaInicial.atividade.professorId;
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
        const sala = await prisma.salaAoVivo.findUnique({
          where: { codigo },
          include: {
            atividade: true,
            participantes: { orderBy: { pontuacao: "desc" } },
          },
        });

        if (!sala) {
          controller.enqueue(encoder.encode(`event: erro\ndata: {}\n\n`));
          break;
        }

        const conteudo = sala.atividade.conteudoGerado as { titulo: string; questoes: Questao[] };
        const perguntaAtualConteudo =
          sala.perguntaAtual >= 0 && sala.perguntaAtual < conteudo.questoes.length
            ? conteudo.questoes[sala.perguntaAtual]
            : null;

        const meuParticipante = sessaoParticipante
          ? sala.participantes.find((p) => p.id === sessaoParticipante.participanteId)
          : null;

        let euJaRespondiPerguntaAtual = false;
        if (meuParticipante && sala.perguntaAtual >= 0) {
          const resposta = await prisma.respostaParticipante.findUnique({
            where: {
              participanteId_indiceQuestao: {
                participanteId: meuParticipante.id,
                indiceQuestao: sala.perguntaAtual,
              },
            },
          });
          euJaRespondiPerguntaAtual = Boolean(resposta);
        }

        const respostasAtual =
          sala.perguntaAtual >= 0
            ? await prisma.respostaParticipante.count({
                where: {
                  indiceQuestao: sala.perguntaAtual,
                  participante: { salaId: sala.id },
                },
              })
            : 0;

        const payload = {
          status: sala.status,
          perguntaAtual: sala.perguntaAtual,
          totalQuestoes: conteudo.questoes.length,
          titulo: conteudo.titulo,
          perguntaAtualConteudo,
          participantes: sala.participantes.map((p) => ({
            id: p.id,
            apelido: p.apelido,
            pontuacao: p.pontuacao,
          })),
          meuId: meuParticipante?.id ?? null,
          minhaPontuacao: meuParticipante?.pontuacao ?? null,
          euJaRespondiPerguntaAtual,
          respostasAtual,
        };

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));

        if (sala.status === "encerrada") {
          ativo = false;
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 1200));
        } catch (erro) {
          console.error("Erro no stream da sala", codigo, erro);
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
