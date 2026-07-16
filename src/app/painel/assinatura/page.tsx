import Link from "next/link";
import { buscarAssinaturaAtual, iniciarCheckoutAssinaturaPro } from "@/app/actions/assinatura";
import { PRECO_PRO_ANUAL } from "@/lib/mercadoPago";

const MENSAGEM_STATUS: Record<string, { texto: string; cor: string }> = {
  sucesso: {
    texto: "Pagamento aprovado! Pode levar alguns segundos para o plano Pro ativar aqui.",
    cor: "bg-[#00c264]/10 text-[#00854a] border-[#00c264]/30",
  },
  pendente: {
    texto: "Pagamento em análise. Assim que for aprovado, o plano Pro ativa automaticamente.",
    cor: "bg-[#ffb020]/10 text-[#8a5a00] border-[#ffb020]/30",
  },
  falha: {
    texto: "O pagamento não foi concluído. Você pode tentar novamente quando quiser.",
    cor: "bg-[#ff5470]/10 text-[#a8283f] border-[#ff5470]/30",
  },
};

export default async function PaginaAssinatura({
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

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/painel" className="text-sm font-semibold text-[#1a3fd4]">
          ← Voltar ao painel
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-neutral-900">Sua assinatura</h1>

        {status && MENSAGEM_STATUS[status] && (
          <div className={`mt-4 rounded-xl border p-4 text-sm font-medium ${MENSAGEM_STATUS[status].cor}`}>
            {MENSAGEM_STATUS[status].texto}
          </div>
        )}

        {proAtivo ? (
          <div className="mt-6 rounded-2xl border border-[#1a3fd4]/20 bg-white p-8">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#1a3fd4]/10 px-3 py-1 text-xs font-bold text-[#1a3fd4]">
              👑 Plano Pro ativo
            </span>
            <p className="mt-4 text-sm text-neutral-600">
              Válido até{" "}
              <strong className="text-neutral-900">
                {assinatura!.validade!.toLocaleDateString("pt-BR")}
              </strong>
              . Perto do vencimento você poderá renovar por aqui.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="bg-gradient-to-br from-[#1a3fd4] to-[#0e2694] p-8 text-white">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                👑 ItaGame Pro
              </span>
              <p className="mt-4 text-3xl font-extrabold">
                R$ {PRECO_PRO_ANUAL.toFixed(2).replace(".", ",")}
                <span className="text-base font-medium text-white/70"> /ano</span>
              </p>
              <p className="mt-2 text-sm text-white/80">
                Gerador de atividades com IA sem limite e salas ao vivo ilimitadas.
              </p>
            </div>

            <div className="p-8">
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>✓ Atividades geradas por IA sem limite</li>
                <li>✓ Salas ao vivo ilimitadas</li>
                <li>✓ Suporte prioritário</li>
              </ul>

              <form action={iniciarCheckoutAssinaturaPro}>
                <button
                  type="submit"
                  className="mt-6 w-full rounded-lg bg-[#1a3fd4] py-3 text-sm font-bold text-white transition hover:brightness-110"
                >
                  Assinar Pro com Mercado Pago
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
