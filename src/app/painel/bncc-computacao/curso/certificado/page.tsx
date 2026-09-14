import Link from "next/link";
import { exigirAcessoBnccComputacao } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { CertificadoImprimivel } from "@/components/curso-bncc-computacao/CertificadoImprimivel";

export default async function PaginaCertificadoCurso() {
  const sessao = await exigirAcessoBnccComputacao();

  const progresso = await prisma.progressoCursoBnccComputacao.findUnique({
    where: { professorId: sessao.userId },
  });

  if (!progresso?.codigoCertificado || !progresso.concluidoEm) {
    return (
      <main className="min-h-screen bg-neutral-50 px-6 py-10">
        <div className="mx-auto max-w-xl text-center">
          <Link href="/painel/bncc-computacao/curso" className="text-sm font-semibold text-[#1a3fd4]">
            ← Curso de Formação
          </Link>
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
            <p className="text-3xl">🔒</p>
            <p className="mt-3 font-bold text-neutral-800">Certificado ainda não liberado</p>
            <p className="mt-1 text-sm text-neutral-500">
              Conclua as 40 aulas dos 4 módulos do curso na página anterior pra emitir seu certificado.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const dataEmissao = progresso.concluidoEm.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-2xl">
        <Link href="/painel/bncc-computacao/curso" className="text-sm font-semibold text-[#1a3fd4] print:hidden">
          ← Curso de Formação
        </Link>
        <div className="mt-4">
          <CertificadoImprimivel codigo={progresso.codigoCertificado} dataEmissao={dataEmissao} />
        </div>
      </div>
    </main>
  );
}
