import Link from "next/link";
import { notFound } from "next/navigation";
import { verificarSessao } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { VERDE_SPAECE } from "@/lib/spaece";
import { ProfessoresSpaeceCliente } from "./ProfessoresSpaeceCliente";

// Gerência dos professores colaboradores da aba SPAECE 9º ano — só o dono
// da conta vê (colaborador também passa pelo proxy em /painel/spaece/*,
// por isso a checagem aqui).
export default async function PaginaProfessoresSpaece() {
  const sessao = await verificarSessao();
  if (sessao.papel !== "ita_owner" || sessao.colaborador) {
    notFound();
  }

  const colaboradores = await prisma.usuario.findMany({
    where: { contaPrincipalId: sessao.userId, acessoRestrito: "spaece_9ano" },
    orderBy: { criadoEm: "asc" },
    select: { id: true, nome: true, email: true, ultimoAcessoEm: true },
  });

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/painel/spaece" className="text-sm font-semibold" style={{ color: VERDE_SPAECE }}>
          ← Voltar ao SPAECE 9º ano
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold text-neutral-900">Professores de Matemática</h1>
        <p className="mt-1 max-w-xl text-sm text-neutral-600">
          Cada professor entra com o próprio e-mail e senha e vê somente a aba SPAECE 9º ano, com as mesmas turmas,
          trilhas, simulados e relatório que você. Ele não acessa as outras áreas da plataforma.
        </p>

        <ProfessoresSpaeceCliente
          colaboradores={colaboradores.map((c) => ({
            id: c.id,
            nome: c.nome,
            email: c.email,
            ultimoAcesso: c.ultimoAcessoEm
              ? c.ultimoAcessoEm.toLocaleString("pt-BR", { timeZone: "America/Fortaleza", dateStyle: "short", timeStyle: "short" })
              : null,
          }))}
        />
      </div>
    </main>
  );
}
