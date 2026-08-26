"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { EsquemaAdicionarProfessorEscola, EstadoAdicionarProfessorEscola } from "@/lib/definicoes";

async function verificarCoordenador() {
  const sessao = await exigirAssinaturaAtiva();
  const usuario = await prisma.usuario.findUnique({ where: { id: sessao.userId } });

  if (!usuario || usuario.papel !== "escola_admin" || !usuario.escolaId) {
    throw new Error("Acesso restrito ao coordenador da escola.");
  }

  return usuario;
}

export async function adicionarProfessorEscola(
  _estado: EstadoAdicionarProfessorEscola,
  formData: FormData
): Promise<EstadoAdicionarProfessorEscola> {
  const coordenador = await verificarCoordenador();

  const camposValidados = EsquemaAdicionarProfessorEscola.safeParse({
    email: formData.get("email"),
  });

  if (!camposValidados.success) {
    return { erros: camposValidados.error.flatten().fieldErrors };
  }

  const professor = await prisma.usuario.findUnique({
    where: { email: camposValidados.data.email },
  });

  if (!professor || professor.papel !== "professor") {
    return { mensagem: "Não encontramos um professor cadastrado com este e-mail." };
  }

  if (professor.escolaId && professor.escolaId !== coordenador.escolaId) {
    return { mensagem: "Este professor já pertence a outra escola." };
  }

  await prisma.usuario.update({
    where: { id: professor.id },
    data: { escolaId: coordenador.escolaId },
  });

  revalidatePath("/painel/escola");
  return undefined;
}

export async function removerProfessorEscola(professorId: string) {
  const coordenador = await verificarCoordenador();

  await prisma.usuario.updateMany({
    where: { id: professorId, escolaId: coordenador.escolaId },
    data: { escolaId: null },
  });

  revalidatePath("/painel/escola");
}
