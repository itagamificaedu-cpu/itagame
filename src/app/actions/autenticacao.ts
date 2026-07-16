"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { criarSessao, excluirSessao } from "@/lib/sessao";
import { EsquemaCadastro, EsquemaLogin, EstadoFormulario } from "@/lib/definicoes";

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

  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) {
    return { mensagem: "Já existe uma conta com este e-mail." };
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = await prisma.usuario.create({
    data: { nome, email, senhaHash, papel: "professor" },
  });

  await criarSessao({ userId: usuario.id, papel: usuario.papel });
  redirect("/painel");
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

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) {
    return { mensagem: "E-mail ou senha incorretos." };
  }

  const senhaConfere = await bcrypt.compare(senha, usuario.senhaHash);
  if (!senhaConfere) {
    return { mensagem: "E-mail ou senha incorretos." };
  }

  await criarSessao({ userId: usuario.id, papel: usuario.papel });
  redirect("/painel");
}

export async function sair() {
  await excluirSessao();
  redirect("/login");
}
