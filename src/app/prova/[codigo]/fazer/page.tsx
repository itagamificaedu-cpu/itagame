import { redirect } from "next/navigation";
import { obterSessaoProva } from "@/lib/provaSessao";
import { ProvaAlunoCliente } from "@/components/prova/ProvaAlunoCliente";

export const dynamic = "force-dynamic";

export default async function PaginaFazerProva({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  const sessao = await obterSessaoProva(codigo);
  if (!sessao) redirect(`/prova?codigo=${codigo}`);

  return <ProvaAlunoCliente codigo={codigo} />;
}
