import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { descriptografar } from "@/lib/sessao";
import { obterSessaoAluno } from "@/lib/alunoSessao";
import { prisma } from "@/lib/prisma";

export const verificarSessao = cache(async () => {
  const cookie = (await cookies()).get("itagame_sessao")?.value;
  const sessao = await descriptografar(cookie);

  if (!sessao?.userId) {
    redirect("/login");
  }

  return { autenticado: true, userId: sessao.userId, papel: sessao.papel };
});

// Exige sessão válida E assinatura Pro ativa. Usar em toda página/ação que
// seja uma funcionalidade de verdade da plataforma (gerar atividade, sala ao
// vivo, redação, turmas, geradores, cabo de guerra etc.) — sem isso, uma
// conta gratuita (criada de graça, sem pagar) conseguia usar tudo igual a
// uma conta Pro. `ita_owner` (a conta do dono da plataforma) não paga a si
// mesmo, então passa direto. NUNCA usar em src/app/actions/assinatura.ts
// (checkout e status da assinatura) nem em /painel/assinatura — essas
// telas têm que continuar acessíveis pra quem ainda não pagou, senão
// ninguém consegue nem chegar na tela de pagar.
export const exigirAssinaturaAtiva = cache(async () => {
  const sessao = await verificarSessao();

  if (sessao.papel === "ita_owner") {
    return sessao;
  }

  const assinatura = await prisma.assinatura.findUnique({ where: { professorId: sessao.userId } });
  const proAtivo =
    assinatura?.plano === "pro" &&
    assinatura.status === "ativa" &&
    assinatura.validade !== null &&
    assinatura.validade > new Date();

  if (!proAtivo) {
    redirect("/painel/assinatura");
  }

  return sessao;
});

// Sessão do ALUNO nas Trilhas (aluno.ts / alunoSessao.ts) — sem e-mail, entra
// com código da turma + nome + PIN. Redireciona pra tela de entrada se não
// houver sessão, ou se o Aluno tiver sido removido da turma nesse meio tempo.
export const verificarSessaoAluno = cache(async () => {
  const sessao = await obterSessaoAluno();
  if (!sessao?.alunoId) {
    redirect("/entrar-trilha");
  }

  const aluno = await prisma.aluno.findUnique({
    where: { id: sessao.alunoId },
    include: { turma: true },
  });

  if (!aluno || aluno.turmaId !== sessao.turmaId) {
    redirect("/entrar-trilha");
  }

  return aluno;
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
