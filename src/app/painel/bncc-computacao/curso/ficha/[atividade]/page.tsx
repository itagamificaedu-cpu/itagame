import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAcessoBnccComputacao } from "@/lib/acessoDados";
import { ATIVIDADES_GUIADAS_CURSO } from "@/lib/cursoBnccComputacao";
import { FichaAlunoImprimivel } from "@/components/curso-bncc-computacao/FichaAlunoImprimivel";

// Ficha imprimível pro aluno de UMA atividade guiada específica — acessada
// pelo botão "🖨️ Imprimir ficha do aluno" na aula expandida (painel do
// curso) e pelos links da apostila. O identificador na URL é o `nome` da
// atividade (mesma chave usada em atividadeGuiadaDaSemana).
export default async function PaginaFichaAlunoAtividade({
  params,
}: {
  params: Promise<{ atividade: string }>;
}) {
  await exigirAcessoBnccComputacao();
  const { atividade: nomeCodificado } = await params;
  const nome = decodeURIComponent(nomeCodificado);

  const atividade = ATIVIDADES_GUIADAS_CURSO.find((a) => a.nome === nome);
  if (!atividade) notFound();

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/painel/bncc-computacao/curso"
          className="text-sm font-semibold text-[#1a3fd4] print:hidden"
        >
          ← Curso de Formação
        </Link>
        <div className="mt-4">
          <FichaAlunoImprimivel atividade={atividade} />
        </div>
      </div>
    </main>
  );
}
