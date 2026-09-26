import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CURSO_FORMACAO_IA, codigoCurto } from "@/lib/formacaoIA";

export default async function VerificarCertificadoFormacaoIA({
  searchParams,
}: {
  searchParams: Promise<{ codigo?: string }>;
}) {
  const { codigo: codigoBusca } = await searchParams;
  const busca = codigoBusca?.trim().toUpperCase() ?? "";

  let matricula = null;
  if (busca) {
    const candidatas = await prisma.matriculaFormacaoIA.findMany({ where: { certificadoGerado: true } });
    matricula = candidatas.find((m) => m.codigoMatricula.toUpperCase().startsWith(busca)) ?? null;
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-extrabold text-neutral-900">Verificar Certificado</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Digite o código de 8 caracteres que aparece no certificado.
        </p>

        <form method="get" className="mt-5 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <input
            type="text"
            name="codigo"
            defaultValue={busca}
            placeholder="Ex: A1B2C3D4"
            maxLength={8}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-center font-mono text-lg uppercase tracking-widest focus:border-[#1a3fd4] focus:outline-none"
          />
          <button
            type="submit"
            className="mt-3 w-full rounded-xl bg-[#1a3fd4] px-6 py-3 text-sm font-extrabold text-white"
          >
            🔍 Verificar autenticidade
          </button>
        </form>

        {busca && (
          <div className="mt-6">
            {matricula ? (
              <div className="rounded-2xl border border-[#00c264]/30 bg-[#00c264]/5 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00c264]/10 text-2xl">
                    ✅
                  </span>
                  <div>
                    <p className="text-lg font-extrabold text-[#00854a]">Certificado válido</p>
                    <p className="text-xs text-neutral-500">Emitido pela ITA Tecnologia Educacional</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs uppercase text-neutral-400">Nome</p>
                    <p className="font-semibold text-neutral-900">{matricula.nomeCompleto}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-neutral-400">Curso</p>
                    <p className="font-semibold text-neutral-900">{CURSO_FORMACAO_IA.nome}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-neutral-400">Carga horária</p>
                    <p className="font-semibold text-neutral-900">{CURSO_FORMACAO_IA.cargaHorariaTotal}h</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-neutral-400">Código</p>
                    <p className="font-mono font-bold text-[#1a3fd4]">{codigoCurto(matricula.codigoMatricula)}</p>
                  </div>
                </div>
                <Link
                  href={`/formacao-ia/certificado/${matricula.codigoMatricula}`}
                  className="mt-4 block rounded-xl bg-[#1a3fd4] px-4 py-2.5 text-center text-sm font-bold text-white"
                >
                  👁️ Ver certificado
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="text-2xl">❌</p>
                <p className="mt-2 font-extrabold text-red-600">Certificado não encontrado</p>
                <p className="mt-1 text-sm text-neutral-500">
                  Nenhum certificado válido encontrado com o código <strong>{busca}</strong>.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
