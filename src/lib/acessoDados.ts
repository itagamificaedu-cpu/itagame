import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { descriptografar } from "@/lib/sessao";
import { prisma } from "@/lib/prisma";

export const verificarSessao = cache(async () => {
  const cookie = (await cookies()).get("itagame_sessao")?.value;
  const sessao = await descriptografar(cookie);

  if (!sessao?.userId) {
    redirect("/login");
  }

  return { autenticado: true, userId: sessao.userId, papel: sessao.papel };
});

export const getUsuarioAtual = cache(async () => {
  const cookie = (await cookies()).get("itagame_sessao")?.value;
  const sessao = await descriptografar(cookie);
  if (!sessao?.userId) return null;

  return prisma.usuario.findUnique({
    where: { id: sessao.userId },
    select: { id: true, nome: true, email: true, papel: true, avatarUrl: true, escolaId: true },
  });
});
