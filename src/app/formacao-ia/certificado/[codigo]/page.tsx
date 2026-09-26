import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CURSO_FORMACAO_IA, aptoCertificado, codigoCurto } from "@/lib/formacaoIA";
import { BotaoImprimirCurso } from "@/components/curso-bncc-computacao/BotaoImprimirCurso";

export default async function CertificadoFormacaoIA({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  let matricula = await prisma.matriculaFormacaoIA.findUnique({ where: { codigoMatricula: codigo } });
  if (!matricula) notFound();

  if (matricula.status !== "pago" && matricula.status !== "certificado_emitido") {
    return (
      <main className="min-h-screen bg-neutral-50 px-6 py-16 text-center">
        <h1 className="text-xl font-extrabold text-neutral-900">Inscrição ainda não confirmada como paga</h1>
        <Link href={`/formacao-ia/confirmado/${codigo}`} className="mt-4 inline-block text-sm font-semibold text-[#1a3fd4]">
          ← Ver status da inscrição
        </Link>
      </main>
    );
  }

  if (!aptoCertificado(matricula)) {
    return (
      <main className="min-h-screen bg-neutral-50 px-6 py-16 text-center">
        <h1 className="text-xl font-extrabold text-neutral-900">Certificado ainda não liberado</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Frequência e/ou nota final ainda não foram lançadas pela coordenação.
        </p>
        <Link href={`/formacao-ia/confirmado/${codigo}`} className="mt-4 inline-block text-sm font-semibold text-[#1a3fd4]">
          ← Ver status da inscrição
        </Link>
      </main>
    );
  }

  if (!matricula.certificadoGerado) {
    matricula = await prisma.matriculaFormacaoIA.update({
      where: { id: matricula.id },
      data: { certificadoGerado: true, status: "certificado_emitido", dataCertificado: new Date() },
    });
  }

  const dataEmissao = (matricula.dataCertificado ?? new Date()).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900">🏆 Certificado de Conclusão</h1>
            <p className="text-sm text-neutral-500">
              {matricula.nomeCompleto} · Código {codigoCurto(matricula.codigoMatricula)}
            </p>
          </div>
          <BotaoImprimirCurso texto="🖨️ Salvar em PDF" />
        </div>

        <div className="mt-6 rounded-2xl border-4 border-[#1a3fd4] bg-white p-8 print:mt-0 print:rounded-none print:border-2">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-[#1a3fd4]">
            ITA Tecnologia Educacional
          </p>
          <h2 className="mt-2 text-center text-2xl font-extrabold text-neutral-900">Certificado de Conclusão</h2>
          <p className="mt-1 text-center text-sm text-neutral-500">{CURSO_FORMACAO_IA.nome}</p>

          <p className="mt-8 text-center text-sm leading-relaxed text-neutral-700">
            Certificamos que <span className="font-bold text-neutral-900">{matricula.nomeCompleto}</span>,
            portador(a) do CPF nº{" "}
            <span className="font-bold text-neutral-900">{matricula.cpf}</span>, concluiu com êxito a{" "}
            <span className="font-semibold">{CURSO_FORMACAO_IA.nome}</span>, edição {CURSO_FORMACAO_IA.edicao},
            com carga horária total de{" "}
            <span className="font-bold">{CURSO_FORMACAO_IA.cargaHorariaTotal} horas</span>.
          </p>

          <div className="mt-6 rounded-xl border border-[#ffb020]/40 bg-[#ffb020]/10 p-4">
            <p className="text-center text-xs font-bold text-[#8a5a00]">
              PROMPT ENGINEERING · PLANEJAMENTO PEDAGÓGICO · ÉTICA E LGPD · GAMIFICAÇÃO · AVALIAÇÃO FORMATIVA
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-neutral-400">
            Emitido em {dataEmissao} · Código de Validação:{" "}
            <span className="font-bold text-neutral-600">{codigoCurto(matricula.codigoMatricula)}</span>
          </p>

          <div className="mt-8 grid gap-6 text-center text-xs text-neutral-500 sm:grid-cols-2">
            <div className="border-t border-neutral-300 pt-2">
              <p className="font-bold text-neutral-700">Genezio de Lavor</p>
              <p>Coordenador — CEITEC · Itapipoca</p>
            </div>
            <div className="border-t border-neutral-300 pt-2">
              <p className="font-bold text-neutral-700">ITA Tecnologia Educacional</p>
              <p>Plataforma Certificadora</p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-neutral-400 print:hidden">
          Verifique a autenticidade em{" "}
          <Link href="/formacao-ia/verificar" className="font-semibold text-[#1a3fd4]">
            itagame.itatecnologiaeducacional.tech/formacao-ia/verificar
          </Link>
        </p>
      </div>
    </main>
  );
}
