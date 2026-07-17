import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { nivelDaRodada, gerarPergunta, TEMPO_RODADA, PAUSA_MS, TOTAL_RODADAS } from "@/lib/caboGuerraPerguntas";

type PerguntaPersonalizada = { enunciado: string; alternativas: string[]; indiceCorreto: number };

/**
 * Chamada a cada poll do SSE (por qualquer cliente conectado). Usa updates
 * condicionais (WHERE casando o estado lido) como trava otimista — se duas
 * conexões chamarem isso ao mesmo tempo, só a primeira consegue de fato
 * avançar a rodada; a segunda não casa mais a condição e não faz nada.
 */
export async function avancarSeNecessario(codigo: string) {
  const sala = await prisma.salaCaboGuerra.findUnique({ where: { codigo } });
  if (!sala || sala.status !== "em_andamento") return;

  const agora = Date.now();

  if (sala.rodadaGanhaPor === null && sala.perguntaComecouEm) {
    const decorrido = agora - sala.perguntaComecouEm.getTime();
    if (decorrido >= TEMPO_RODADA * 1000) {
      await prisma.salaCaboGuerra.updateMany({
        where: { codigo, status: "em_andamento", rodadaGanhaPor: null },
        data: { rodadaGanhaPor: 0, rodadaTerminouEm: new Date() },
      });
      return;
    }
  }

  if (sala.rodadaGanhaPor !== null && sala.rodadaTerminouEm) {
    const decorridoFim = agora - sala.rodadaTerminouEm.getTime();
    const perguntasPersonalizadas = sala.perguntas as PerguntaPersonalizada[] | null;
    const totalRodadas = perguntasPersonalizadas ? perguntasPersonalizadas.length : TOTAL_RODADAS;

    if (decorridoFim >= PAUSA_MS) {
      if (sala.rodadaAtual >= totalRodadas) {
        await prisma.salaCaboGuerra.updateMany({
          where: { codigo, status: "em_andamento", rodadaTerminouEm: sala.rodadaTerminouEm },
          data: { status: "encerrada" },
        });
      } else {
        const novaRodada = sala.rodadaAtual + 1;
        const proximaPergunta = perguntasPersonalizadas
          ? {
              texto: perguntasPersonalizadas[novaRodada - 1].enunciado,
              resposta: perguntasPersonalizadas[novaRodada - 1].indiceCorreto,
              alternativas: perguntasPersonalizadas[novaRodada - 1]
                .alternativas as unknown as Prisma.InputJsonValue,
            }
          : { ...gerarPergunta(nivelDaRodada(novaRodada)), alternativas: Prisma.JsonNull };

        await prisma.salaCaboGuerra.updateMany({
          where: { codigo, status: "em_andamento", rodadaTerminouEm: sala.rodadaTerminouEm },
          data: {
            rodadaAtual: novaRodada,
            perguntaTexto: proximaPergunta.texto,
            perguntaResposta: proximaPergunta.resposta,
            perguntaAlternativas: proximaPergunta.alternativas,
            perguntaComecouEm: new Date(),
            rodadaGanhaPor: null,
            rodadaTerminouEm: null,
          },
        });
      }
    }
  }
}
