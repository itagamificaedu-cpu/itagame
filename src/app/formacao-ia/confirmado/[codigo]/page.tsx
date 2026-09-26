import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { codigoCurto, telefoneFormatado } from "@/lib/formacaoIA";

export default async function ConfirmadoFormacaoIA({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  const matricula = await prisma.matriculaFormacaoIA.findUnique({ where: { codigoMatricula: codigo } });
  if (!matricula) notFound();

  if (matricula.status === "pago" || matricula.status === "certificado_emitido") {
    return (
      <main className="min-h-screen bg-neutral-50 px-6 py-10">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#00c264]/10 text-4xl">
            ✅
          </div>
          <h1 className="mt-5 text-2xl font-extrabold text-neutral-900">Inscrição confirmada!</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Pagamento recebido. {matricula.nomeCompleto.split(" ")[0]} está matriculado(a) na Formação em IA!
          </p>

          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 text-left shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-400">Código da matrícula</p>
                <p className="font-mono text-xl font-extrabold text-[#1a3fd4]">
                  {codigoCurto(matricula.codigoMatricula)}
                </p>
              </div>
              <span className="rounded-full bg-[#00c264]/10 px-3 py-1 text-xs font-bold text-[#00854a]">
                ✅ Pago
              </span>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <p>
                <span className="font-bold text-neutral-900">1.</span> E-mail de confirmação enviado para{" "}
                {matricula.email}.
              </p>
              <p>
                <span className="font-bold text-neutral-900">2.</span> Nossa equipe envia em{" "}
                {telefoneFormatado(matricula.telefone)} o acesso à trilha online e os detalhes da imersão
                presencial.
              </p>
              <p>
                <span className="font-bold text-neutral-900">3.</span> Etapa presencial em dezembro —
                presença mínima de 75% é obrigatória.
              </p>
              <p>
                <span className="font-bold text-neutral-900">4.</span> Após a coordenação lançar frequência e
                nota final, o certificado aparece nesta página.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            {matricula.certificadoGerado ? (
              <Link
                href={`/formacao-ia/certificado/${codigo}`}
                className="flex-1 rounded-xl bg-[#1a3fd4] px-6 py-3 text-sm font-extrabold text-white"
              >
                🏆 Ver certificado
              </Link>
            ) : (
              <a
                href={`https://wa.me/5588988411890?text=Ol%C3%A1!%20Minha%20matr%C3%ADcula%20na%20Forma%C3%A7%C3%A3o%20em%20IA%20foi%20confirmada!%20C%C3%B3digo%3A%20${codigoCurto(matricula.codigoMatricula)}`}
                target="_blank"
                className="flex-1 rounded-xl bg-[#25D366] px-6 py-3 text-center text-sm font-bold text-white"
              >
                📱 Falar pelo WhatsApp
              </a>
            )}
          </div>
        </div>
      </main>
    );
  }

  if (matricula.status === "aguardando_pagamento") {
    return (
      <main className="min-h-screen bg-neutral-50 px-6 py-10 text-center">
        <div className="mx-auto max-w-lg">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#1a3fd4]/10 text-4xl">
            ⏳
          </div>
          <h1 className="mt-5 text-2xl font-extrabold text-neutral-900">Aguardando pagamento</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Seu pagamento ainda está sendo processado. PIX confirma na hora; boleto pode levar até 2 dias
            úteis.
          </p>
          <p className="mt-4 font-mono text-lg text-[#1a3fd4]">{codigoCurto(matricula.codigoMatricula)}</p>
          <Link
            href={`/formacao-ia/pagamento/${codigo}`}
            className="mt-6 inline-block rounded-xl bg-[#1a3fd4] px-6 py-3 text-sm font-extrabold text-white"
          >
            ↩ Voltar ao pagamento
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10 text-center">
      <h1 className="text-2xl font-extrabold text-neutral-900">Inscrição cancelada</h1>
      <p className="mt-2 text-sm text-neutral-500">Esta inscrição foi cancelada ou expirou.</p>
      <Link
        href="/formacao-ia/inscricao"
        className="mt-6 inline-block rounded-xl bg-[#1a3fd4] px-6 py-3 text-sm font-extrabold text-white"
      >
        🔄 Fazer nova inscrição
      </Link>
    </main>
  );
}
