"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { criarSessao, excluirSessao } from "@/lib/sessao";
import { EsquemaCadastro, EsquemaLogin, EstadoFormulario } from "@/lib/definicoes";

// Bloqueio de força bruta: depois de várias senhas erradas seguidas, tranca
// a conta por um tempo em vez de deixar tentar pra sempre.
const LIMITE_TENTATIVAS_LOGIN = 5;
const BLOQUEIO_MINUTOS_LOGIN = 10;

function mensagemBloqueio(bloqueadoAte: Date): string {
  const minutos = Math.max(1, Math.ceil((bloqueadoAte.getTime() - Date.now()) / 60000));
  return `Muitas tentativas erradas. Tente de novo em ${minutos} minuto${minutos === 1 ? "" : "s"}.`;
}

function destinoSeguro(valor: FormDataEntryValue | null): string {
  if (typeof valor === "string" && valor.startsWith("/") && !valor.startsWith("//")) {
    return valor;
  }
  return "/painel";
}

export async function cadastrar(_estado: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  const camposValidados = EsquemaCadastro.safeParse({
    nome: formData.get("nome"),
    email: formData.get("email"),
    senha: formData.get("senha"),
  });

  if (!camposValidados.success) {
    return { erros: camposValidados.error.flatten().fieldErrors };
  }

  const { nome, email, senha } = camposValidados.data;
  const proximo = destinoSeguro(formData.get("proximo"));

  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) {
    return { mensagem: "Já existe uma conta com este e-mail." };
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = await prisma.usuario.create({
    data: { nome, email, senhaHash, papel: "professor" },
  });

  await criarSessao({ userId: usuario.id, papel: usuario.papel });
  redirect(proximo);
}

export async function entrar(_estado: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  const camposValidados = EsquemaLogin.safeParse({
    email: formData.get("email"),
    senha: formData.get("senha"),
  });

  if (!camposValidados.success) {
    return { erros: camposValidados.error.flatten().fieldErrors };
  }

  const { email, senha } = camposValidados.data;
  const proximo = destinoSeguro(formData.get("proximo"));

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) {
    return { mensagem: "E-mail ou senha incorretos." };
  }

  if (usuario.loginBloqueadoAte && usuario.loginBloqueadoAte > new Date()) {
    return { mensagem: mensagemBloqueio(usuario.loginBloqueadoAte) };
  }

  const senhaConfere = await bcrypt.compare(senha, usuario.senhaHash);
  if (!senhaConfere) {
    const tentativas = usuario.tentativasLoginFalhas + 1;
    const bloqueado = tentativas >= LIMITE_TENTATIVAS_LOGIN;
    const bloqueadoAte = new Date(Date.now() + BLOQUEIO_MINUTOS_LOGIN * 60000);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: bloqueado
        ? { tentativasLoginFalhas: 0, loginBloqueadoAte: bloqueadoAte }
        : { tentativasLoginFalhas: tentativas },
    });

    return { mensagem: bloqueado ? mensagemBloqueio(bloqueadoAte) : "E-mail ou senha incorretos." };
  }

  if (usuario.tentativasLoginFalhas > 0 || usuario.loginBloqueadoAte) {
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { tentativasLoginFalhas: 0, loginBloqueadoAte: null },
    });
  }

  await criarSessao({ userId: usuario.id, papel: usuario.papel });
  redirect(proximo);
}

export async function sair() {
  await excluirSessao();
  redirect("/login");
}
