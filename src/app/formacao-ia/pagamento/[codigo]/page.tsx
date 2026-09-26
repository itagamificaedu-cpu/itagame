import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { iniciarCheckoutFormacaoIA } from "@/app/actions/formacaoIA";
import { codigoCurto } from "@/lib/formacaoIA";

function reais(valor: number) {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

export default async function PagamentoFormacaoIA({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;

  const matricula = await prisma.matriculaFormacaoIA.findUnique({ where: { codigoMatricula: codigo } });
  if (!matricula) notFound();

  if (matricula.status === "pago" || matricula.status === "certificado_emitido") {
    redirect(`/formacao-ia/confirmado/${codigo}`);
  }

  let linkPagamento: string | null = null;
  let erro: string | null = null;
  try {
    linkPagamento = await iniciarCheckoutFormacaoIA(codigo);
  } catch (e) {
    erro = e instanceof Error ? e.message : "Erro desconhecido";
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-lg">
        <span className="inline-block rounded-full bg-[#1a3fd4]/10 px-3 py-1 text-xs font-bold text-[#1a3fd4]">
          Etapa 2 de 2 · Pagamento
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-neutral-900">
          Quase lá, {matricula.nomeCompleto.split(" ")[0]}!
        </h1>
        <p className="mt-1 text-sm text-neutral-500">Finalize o pagamento para garantir sua vaga.</p>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-neutral-100 pb-2">
              <span className="text-neutral-500">Professor(a)</span>
              <span className="font-semibold text-neutral-900">{matricula.nomeCompleto}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-100 pb-2">
              <span className="text-neutral-500">E-mail</span>
              <span className="font-semibold text-neutral-900">{matricula.email}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="font-bold text-neutral-900">Total</span>
              <span className="text-xl font-extrabold text-[#1a3fd4]">{reais(Number(matricula.valorPago))}</span>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
            🔒 Código: <span className="font-mono font-semibold text-[#1a3fd4]">{codigoCurto(matricula.codigoMatricula)}</span>
          </div>

          {linkPagamento ? (
            <a
              href={linkPagamento}
              className="mt-6 block rounded-xl bg-[#1a3fd4] px-6 py-3.5 text-center text-base font-extrabold text-white transition hover:brightness-110"
            >
              🔐 Pagar agora — {reais(Number(matricula.valorPago))}
            </a>
          ) : (
            <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
              ⚠️ Não foi possível gerar o link automático{erro ? `: ${erro}` : ""}. Entre em contato pelo
              WhatsApp.
              <a
                href={`https://wa.me/5588988411890?text=Ol%C3%A1%2C%20quero%20pagar%20minha%20inscri%C3%A7%C3%A3o%20na%20Forma%C3%A7%C3%A3o%20em%20IA.%20C%C3%B3digo%3A%20${codigoCurto(matricula.codigoMatricula)}`}
                target="_blank"
                className="mt-3 block rounded-xl bg-[#25D366] px-6 py-3 text-center text-sm font-bold text-white"
              >
                📱 Pagar via WhatsApp
              </a>
            </div>
          )}
          <p className="mt-3 text-center text-xs text-neutral-400">
            Você será redirecionado ao ambiente seguro do Mercado Pago.
          </p>
        </div>
      </div>
    </main>
  );
}
