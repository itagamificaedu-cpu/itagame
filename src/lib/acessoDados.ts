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

  const usuario = await prisma.usuario.findUnique({
    where: { id: sessao.userId },
    select: { sessaoAtual: true },
  });

  // A conta foi acessada em outro aparelho depois desse login — o carimbo
  // de sessão gravado no cookie não bate mais com o do banco. Derruba esse
  // acesso (só um aparelho logado por vez). Não dá pra apagar o cookie
  // aqui (cookies() só aceita escrita em Server Action/Route Handler, não
  // em Server Component) — sem problema, o cookie velho fica inofensivo:
  // essa mesma checagem barra ele de novo até a pessoa logar de verdade.
  if (!usuario || usuario.sessaoAtual !== sessao.sessaoId) {
    redirect("/login?erro=outro-acesso");
  }

  prisma.usuario
    .update({ where: { id: sessao.userId }, data: { ultimoAcessoEm: new Date() } })
    .catch(() => {});

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

// Exige sessão + Pro ativo (igual exigirAssinaturaAtiva) E o add-on separado
// de BNCC Computação em dia. Usar nas páginas de professor que geram ou
// listam conteúdo de BNCC Computação (o hub, gerar-ia com eixo BNCC, usar
// modelo pronto) — quem só tem o Pro normal cai na tela de oferta do add-on
// em vez de ver o conteúdo.
export const exigirAcessoBnccComputacao = cache(async () => {
  const sessao = await exigirAssinaturaAtiva();

  if (sessao.papel === "ita_owner") {
    return sessao;
  }

  const assinatura = await prisma.assinatura.findUnique({ where: { professorId: sessao.userId } });
  const temAcesso = assinatura?.bnccComputacaoAte != null && assinatura.bnccComputacaoAte > new Date();

  if (!temAcesso) {
    redirect("/painel/bncc-computacao/oferta");
  }

  return sessao;
});

// Versão que só INFORMA se tem acesso, sem redirecionar — usada em lugares
// como o botão do painel principal, que precisa decidir se mostra o cadeado
// ou não, sem travar o carregamento da página inteira.
export const temAcessoBnccComputacao = cache(async () => {
  const sessao = await verificarSessao();
  if (sessao.papel === "ita_owner") return true;

  const assinatura = await prisma.assinatura.findUnique({ where: { professorId: sessao.userId } });
  return assinatura?.bnccComputacaoAte != null && assinatura.bnccComputacaoAte > new Date();
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
