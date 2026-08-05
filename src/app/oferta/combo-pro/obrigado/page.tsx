import Link from "next/link";
import { buscarAssinaturaAtual } from "@/app/actions/assinatura";

export default async function ObrigadoComboPro({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const assinatura = await buscarAssinaturaAtual();

  const proAtivo =
    assinatura?.plano === "pro" &&
    assinatura.status === "ativa" &&
    assinatura.validade &&
    assinatura.validade > new Date();

  if (!proAtivo) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <span className="text-4xl">⏳</span>
          <h1 className="mt-4 text-xl font-bold text-neutral-900">
            {status === "pendente" ? "Pagamento em análise" : "Confirmando seu pagamento..."}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Assim que o Mercado Pago aprovar, seu acesso Pro e os bônus liberam automaticamente
            aqui nesta mesma página. Pode levar alguns segundos.
          </p>
          <Link
            href="/oferta/combo-pro/obrigado"
            className="mt-6 inline-block rounded-lg bg-[#1a3fd4] px-6 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
          >
            Verificar novamente
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-[#00c264]/30 bg-[#00c264]/10 p-6 text-center">
          <span className="text-4xl">🎉</span>
          <h1 className="mt-2 text-2xl font-extrabold text-neutral-900">
            Pagamento aprovado! Seu ItaGameficaEdu Pro está ativo.
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Obrigado por confiar no ItaGameficaEdu. Seus bônus estão liberados abaixo.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <p className="text-xs font-bold tracking-wide text-[#1a3fd4] uppercase">Bônus 1</p>
            <h2 className="mt-1 text-lg font-bold text-neutral-900">📘 Manual do ItaGameficaEdu — Guia do Professor</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Passo a passo completo de todas as funções da plataforma, em PDF.
            </p>
            <a
              href="/bonus/Manual_ItaGame.pdf"
              download
              className="mt-4 inline-block rounded-lg bg-[#1a3fd4] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
            >
              Baixar Manual (PDF)
            </a>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <p className="text-xs font-bold tracking-wide text-[#1a3fd4] uppercase">Bônus 2</p>
            <h2 className="mt-1 text-lg font-bold text-neutral-900">🎁 Kit de atividades prontas</h2>
            <p className="mt-1 text-sm text-neutral-500">
              5 atividades já geradas por IA, de disciplinas diferentes, prontas para aplicar hoje mesmo.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <a href="/bonus/kit-atividades/matematica.pdf" download className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">
                📐 Matemática
              </a>
              <a href="/bonus/kit-atividades/portugues.pdf" download className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">
                📖 Português
              </a>
              <a href="/bonus/kit-atividades/historia.pdf" download className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">
                🏛️ História
              </a>
              <a href="/bonus/kit-atividades/ciencias.pdf" download className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">
                🔬 Ciências
              </a>
              <a href="/bonus/kit-atividades/geografia.pdf" download className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">
                🌎 Geografia
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center">
            <p className="text-sm text-neutral-500">Pronto! Agora é só acessar seu painel.</p>
            <Link
              href="/painel"
              className="mt-3 inline-block rounded-lg bg-neutral-900 px-6 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
            >
              Ir para o painel →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
