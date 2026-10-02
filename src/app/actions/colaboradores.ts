"use server";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { verificarSessao } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { enviarEmail } from "@/lib/email";

// Professores colaboradores da aba SPAECE 9º ano: cada um tem login próprio,
// mas trabalha com as turmas/trilhas/simulados da conta principal e só
// enxerga essa aba (ver Usuario.acessoRestrito e src/proxy.ts). Só o dono
// da plataforma convida — colaborador não convida ninguém.

const AREA_SPAECE = "spaece_9ano";
// Convite vale mais que o "esqueci minha senha" (1h): o professor pode
// demorar uns dias pra abrir o e-mail.
const VALIDADE_CONVITE_DIAS = 7;

async function exigirDono() {
  const sessao = await verificarSessao();
  if (sessao.papel !== "ita_owner" || sessao.colaborador) {
    throw new Error("Só o dono da conta gerencia professores colaboradores.");
  }
  return sessao;
}

// Gera o link de "criar senha" (mesma tela do esqueci minha senha) e manda
// por e-mail. Devolve o link também, pro dono poder mandar pelo WhatsApp se
// o e-mail não chegar.
async function enviarConvite(usuario: { id: string; nome: string; email: string }) {
  const token = crypto.randomBytes(32).toString("hex");
  await prisma.usuario.update({
    where: { id: usuario.id },
    data: {
      tokenRedefinicaoSenhaHash: await bcrypt.hash(token, 10),
      tokenRedefinicaoExpiraEm: new Date(Date.now() + VALIDADE_CONVITE_DIAS * 24 * 60 * 60 * 1000),
    },
  });

  const link = `${process.env.NEXT_PUBLIC_APP_URL}/redefinir-senha?id=${usuario.id}&token=${token}`;

  let emailEnviado = true;
  try {
    await enviarEmail(
      usuario.email,
      "Seu acesso ao SPAECE 9º ano — ItaGameficaEdu",
      `
        <p>Olá, ${usuario.nome}!</p>
        <p>Você foi convidado(a) para usar a aba <strong>SPAECE 9º ano</strong> do ItaGameficaEdu, com as trilhas, simulados e o relatório de desempenho das turmas de 9º ano do CEITEC.</p>
        <p><a href="${link}">Clique aqui para criar sua senha</a></p>
        <p>Depois é só entrar com este e-mail e a senha que você criou. O link vale por ${VALIDADE_CONVITE_DIAS} dias.</p>
      `
    );
  } catch {
    emailEnviado = false;
    console.error("Falha ao enviar convite de colaborador para", usuario.email);
  }

  return { link, emailEnviado };
}

export type ResultadoConvite = { ok: true; link: string; emailEnviado: boolean } | { ok: false; erro: string };

export async function convidarColaborador(input: { nome: string; email: string }): Promise<ResultadoConvite> {
  const sessao = await exigirDono();

  const nome = input.nome.trim();
  const email = input.email.trim().toLowerCase();
  if (nome.length < 3) return { ok: false, erro: "Informe o nome do professor." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, erro: "E-mail inválido." };

  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) return { ok: false, erro: "Já existe uma conta com esse e-mail na plataforma." };

  // Senha aleatória que ninguém conhece — o professor cria a dele pelo link.
  const usuario = await prisma.usuario.create({
    data: {
      nome,
      email,
      senhaHash: await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10),
      papel: "professor",
      contaPrincipalId: sessao.userId,
      acessoRestrito: AREA_SPAECE,
    },
  });

  const convite = await enviarConvite(usuario);
  revalidatePath("/painel/spaece/professores");
  return { ok: true, ...convite };
}

export async function reenviarConvite(colaboradorId: string): Promise<ResultadoConvite> {
  const sessao = await exigirDono();
  const usuario = await prisma.usuario.findUnique({ where: { id: colaboradorId } });
  if (!usuario || usuario.contaPrincipalId !== sessao.userId) {
    return { ok: false, erro: "Professor não encontrado." };
  }
  const convite = await enviarConvite(usuario);
  return { ok: true, ...convite };
}

export async function removerColaborador(colaboradorId: string): Promise<{ ok: boolean; erro?: string }> {
  const sessao = await exigirDono();
  const usuario = await prisma.usuario.findUnique({ where: { id: colaboradorId } });
  if (!usuario || usuario.contaPrincipalId !== sessao.userId) {
    return { ok: false, erro: "Professor não encontrado." };
  }
  // Tudo que ele fez ficou gravado na conta principal, então apagar a conta
  // dele não perde nenhum dado — e derruba o login na hora.
  await prisma.usuario.delete({ where: { id: colaboradorId } });
  revalidatePath("/painel/spaece/professores");
  return { ok: true };
}
