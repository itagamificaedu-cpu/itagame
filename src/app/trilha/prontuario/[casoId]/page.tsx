import Link from "next/link";
import { notFound } from "next/navigation";
import { verificarSessaoAluno } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { obterOuCriarRegistro } from "@/app/actions/prontuario";
import RegistroProntuarioCliente from "./RegistroProntuarioCliente";

export default async function PaginaCasoClinico({
  params,
}: {
  params: Promise<{ casoId: string }>;
}) {
  const aluno = await verificarSessaoAluno();
  const { casoId } = await params;

  const caso = await prisma.casoClinicoProntuario.findUnique({ where: { id: casoId } });
  if (!caso || caso.turmaId !== aluno.turmaId) {
    notFound();
  }

  const registro = await obterOuCriarRegistro(casoId);

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/trilha/prontuario" className="text-sm font-semibold text-[#1a3fd4]">
          ← Simulador de Prontuário
        </Link>

        <h1 className="mt-4 text-xl font-bold text-neutral-900">{caso.titulo}</h1>
        <div className="mt-3 rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-bold tracking-wide text-neutral-400 uppercase">Cenário clínico</p>
          <p className="mt-2 text-sm whitespace-pre-line text-neutral-700">{caso.enunciado}</p>
        </div>

        <RegistroProntuarioCliente
          registroInicial={{
            id: registro.id,
            status: registro.status,
            dataRegistro: registro.dataRegistro ?? "",
            horaRegistro: registro.horaRegistro ?? "",
            paciente: registro.paciente ?? "",
            leito: registro.leito ?? "",
            pressaoArterial: registro.pressaoArterial ?? "",
            frequenciaCardiaca: registro.frequenciaCardiaca ?? "",
            frequenciaRespiratoria: registro.frequenciaRespiratoria ?? "",
            temperatura: registro.temperatura ?? "",
            saturacaoOxigenio: registro.saturacaoOxigenio ?? "",
            anotacaoEnfermagem: registro.anotacaoEnfermagem ?? "",
            assinaturaTecnico: registro.assinaturaTecnico ?? "",
          }}
        />
      </div>
    </main>
  );
}
