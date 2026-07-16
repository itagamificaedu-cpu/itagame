"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verificarSessao } from "@/lib/acessoDados";
import { corrigirRedacaoComIa } from "@/lib/ia";
import { EsquemaCorrecaoRedacao, EstadoCorrecaoRedacao } from "@/lib/definicoes";

export async function corrigirRedacao(
  _estado: EstadoCorrecaoRedacao,
  formData: FormData
): Promise<EstadoCorrecaoRedacao> {
  const sessao = await verificarSessao();

  const camposValidados = EsquemaCorrecaoRedacao.safeParse({
    tema: formData.get("tema"),
    texto: formData.get("texto"),
  });

  if (!camposValidados.success) {
    return { erros: camposValidados.error.flatten().fieldErrors };
  }

  const { tema, texto } = camposValidados.data;

  let correcaoGerada;
  try {
    correcaoGerada = await corrigirRedacaoComIa({ tema, texto });
  } catch {
    return { mensagem: "Não consegui corrigir a redação agora. Tente novamente em instantes." };
  }

  const correcao = await prisma.correcaoRedacao.create({
    data: {
      tema,
      textoEnviado: texto,
      notaGeral: correcaoGerada.notaGeral,
      feedbackGeral: correcaoGerada.feedbackGeral,
      notasPorCriterio: correcaoGerada.notasPorCriterio,
      professorId: sessao.userId,
    },
  });

  revalidatePath("/painel/redacoes");
  redirect(`/painel/redacoes/${correcao.id}`);
}
