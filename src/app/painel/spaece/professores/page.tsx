import Link from "next/link";
import { notFound } from "next/navigation";
import { verificarSessao } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { VERDE_SPAECE } from "@/lib/spaece";
import { ProfessoresSpaeceCliente } from "./ProfessoresSpaeceCliente";

// Login compartilhado dos professores de Matemática na aba SPAECE 9º ano —
// só o dono da conta vê (o login compartilhado também passa pelo proxy em
// /painel/spaece/*, por isso a checagem aqui).
export default async function PaginaProfessoresSpaece() {
  const sessao = await verificarSessao();
  if (sessao.papel !== "ita_owner" || sessao.colaborador) {
    notFound();
  }

  const conta = await prisma.usuario.findFirst({
    where: { contaPrincipalId: sessao.userId, acessoRestrito: "spaece_9ano" },
    select: { email: true, ultimoAcessoEm: true },
  });

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-xl">
        <Link href="/painel/spaece" className="text-sm font-semibold" style={{ color: VERDE_SPAECE }}>
          ← Voltar ao SPAECE 9º ano
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold text-neutral-900">Login dos Professores de Matemática</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Um login e uma senha para os professores de Matemática usarem juntos, cada um no seu aparelho. Quem entra
          com ele vê somente a aba SPAECE 9º ano, com as mesmas turmas, trilhas, simulados e relatório que você.
        </p>

        <ProfessoresSpaeceCliente
          loginAtual={conta?.email ?? null}
          ultimoAcesso={
            conta?.ultimoAcessoEm
              ? conta.ultimoAcessoEm.toLocaleString("pt-BR", { timeZone: "America/Fortaleza", dateStyle: "short", timeStyle: "short" })
              : null
          }
        />
      </div>
    </main>
  );
}
