"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { verificarSessao } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";

// Login compartilhado dos professores de Matemática na aba SPAECE 9º ano:
// UMA conta (um e-mail + uma senha) que todos usam, inclusive ao mesmo
// tempo em aparelhos diferentes (ver criarSessao). Trabalha com as
// turmas/trilhas/simulados da conta principal e só enxerga essa aba (ver
// Usuario.acessoRestrito e src/proxy.ts). O dono define login e senha
// direto na tela — nenhuma senha passa por e-mail.

const AREA_SPAECE = "spaece_9ano";
const NOME_CONTA = "Professores de Matemática — SPAECE 9º ano";

async function exigirDono() {
  const sessao = await verificarSessao();
  if (sessao.papel !== "ita_owner" || sessao.colaborador) {
    throw new Error("Só o dono da conta gerencia o login dos professores.");
  }
  return sessao;
}

export type ResultadoLogin = { ok: true } | { ok: false; erro: string };

export async function salvarLoginCompartilhado(input: { email: string; senha: string }): Promise<ResultadoLogin> {
  const sessao = await exigirDono();

  const email = input.email.trim().toLowerCase();
  const senha = input.senha.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, erro: "O login precisa ter formato de e-mail (ex.: matematica@ceitec.com)." };
  }
  if (senha.length < 6) return { ok: false, erro: "A senha precisa ter pelo menos 6 caracteres." };

  const atual = await prisma.usuario.findFirst({
    where: { contaPrincipalId: sessao.userId, acessoRestrito: AREA_SPAECE },
  });

  const outraConta = await prisma.usuario.findUnique({ where: { email } });
  if (outraConta && outraConta.id !== atual?.id) {
    return { ok: false, erro: "Esse e-mail já é usado por outra conta. Escolha outro login." };
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  if (atual) {
    // Trocar login/senha derruba quem estiver logado com os dados antigos.
    await prisma.usuario.update({
      where: { id: atual.id },
      data: { email, senhaHash, sessaoAtual: null, tentativasLoginFalhas: 0, loginBloqueadoAte: null },
    });
  } else {
    await prisma.usuario.create({
      data: {
        nome: NOME_CONTA,
        email,
        senhaHash,
        papel: "professor",
        contaPrincipalId: sessao.userId,
        acessoRestrito: AREA_SPAECE,
      },
    });
  }

  revalidatePath("/painel/spaece/professores");
  return { ok: true };
}

export async function removerLoginCompartilhado(): Promise<ResultadoLogin> {
  const sessao = await exigirDono();
  // Tudo que os professores fizeram ficou gravado na conta principal, então
  // apagar este login não perde nenhum dado — e derruba o acesso na hora.
  await prisma.usuario.deleteMany({ where: { contaPrincipalId: sessao.userId, acessoRestrito: AREA_SPAECE } });
  revalidatePath("/painel/spaece/professores");
  return { ok: true };
}
