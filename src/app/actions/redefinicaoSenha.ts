"use server";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { enviarEmail } from "@/lib/email";
import {
  EsquemaEsqueciSenha,
  EsquemaRedefinirSenha,
  EstadoEsqueciSenha,
  EstadoRedefinirSenha,
} from "@/lib/definicoes";

// "Esqueci minha senha": gera um token aleatório, guarda só o hash dele (como
// uma senha) com validade de 1 hora, e manda o token puro por e-mail dentro
// de um link. Quem clicar tem 1 hora pra criar uma senha nova.
const VALIDADE_TOKEN_MINUTOS = 60;

export async function solicitarRedefinicaoSenha(
  _estado: EstadoEsqueciSenha,
  formData: FormData
): Promise<EstadoEsqueciSenha> {
  const camposValidados = EsquemaEsqueciSenha.safeParse({ email: formData.get("email") });

  if (!camposValidados.success) {
    return { erros: camposValidados.error.flatten().fieldErrors };
  }

  const { email } = camposValidados.data;
  const usuario = await prisma.usuario.findUnique({ where: { email } });

  // Sempre a mesma resposta, exista ou não a conta — senão essa tela vira um
  // jeito de descobrir quais e-mails têm cadastro no sistema.
  if (usuario) {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = await bcrypt.hash(token, 10);
    const expiraEm = new Date(Date.now() + VALIDADE_TOKEN_MINUTOS * 60000);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { tokenRedefinicaoSenhaHash: tokenHash, tokenRedefinicaoExpiraEm: expiraEm },
    });

    const urlBase = process.env.NEXT_PUBLIC_APP_URL as string;
    const link = `${urlBase}/redefinir-senha?id=${usuario.id}&token=${token}`;

    try {
      await enviarEmail(
        usuario.email,
        "Redefinir sua senha — ItaGameficaEdu",
        `
          <p>Oi, ${usuario.nome}!</p>
          <p>Recebemos um pedido pra redefinir a senha da sua conta no ItaGameficaEdu.</p>
          <p><a href="${link}">Clique aqui pra criar uma senha nova</a></p>
          <p>Esse link vale por ${VALIDADE_TOKEN_MINUTOS} minutos. Se você não pediu isso, é só ignorar este e-mail — sua senha continua a mesma.</p>
        `
      );
    } catch {
      // Não revela pro usuário se o envio falhou — mesma mensagem genérica
      // de sempre. Fica só registrado no log do servidor.
      console.error("Falha ao enviar e-mail de redefinição de senha para", usuario.email);
    }
  }

  return {
    mensagem: "Se esse e-mail tiver cadastro, enviamos um link de redefinição. Confira sua caixa de entrada.",
  };
}

export async function redefinirSenha(
  _estado: EstadoRedefinirSenha,
  formData: FormData
): Promise<EstadoRedefinirSenha> {
  const camposValidados = EsquemaRedefinirSenha.safeParse({
    id: formData.get("id"),
    token: formData.get("token"),
    senha: formData.get("senha"),
  });

  if (!camposValidados.success) {
    return { erros: camposValidados.error.flatten().fieldErrors };
  }

  const { id, token, senha } = camposValidados.data;
  const mensagemLinkInvalido = "Esse link expirou ou já foi usado. Peça um novo em \"Esqueci minha senha\".";

  const usuario = await prisma.usuario.findUnique({ where: { id } });
  if (
    !usuario ||
    !usuario.tokenRedefinicaoSenhaHash ||
    !usuario.tokenRedefinicaoExpiraEm ||
    usuario.tokenRedefinicaoExpiraEm < new Date()
  ) {
    return { mensagem: mensagemLinkInvalido };
  }

  const tokenConfere = await bcrypt.compare(token, usuario.tokenRedefinicaoSenhaHash);
  if (!tokenConfere) {
    return { mensagem: mensagemLinkInvalido };
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  await prisma.usuario.update({
    where: { id },
    data: {
      senhaHash,
      tokenRedefinicaoSenhaHash: null,
      tokenRedefinicaoExpiraEm: null,
      // Quem clicou no link provou que é dono do e-mail — aproveita e
      // desbloqueia o login, caso estivesse travado por tentativas erradas.
      tentativasLoginFalhas: 0,
      loginBloqueadoAte: null,
    },
  });

  redirect("/login?redefinida=1");
}
