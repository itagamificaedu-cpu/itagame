import Link from "next/link";
import {
  buscarAssinaturaAtual,
  iniciarCheckoutAddonBncc,
  iniciarCheckoutAssinaturaProComBncc,
} from "@/app/actions/assinatura";
import { PRECO_PRO_ANUAL, PRECO_ADDON_BNCC } from "@/lib/mercadoPago";

const MENSAGEM_STATUS: Record<string, { texto: string; cor: string }> = {
  sucesso: {
    texto: "Pagamento aprovado! Pode levar alguns segundos para o acesso à BNCC Computação liberar aqui.",
    cor: "bg-[#00c264]/10 text-[#00854a] border-[#00c264]/30",
  },
  pendente: {
    texto: "Pagamento em análise. Assim que for aprovado, o acesso libera automaticamente.",
    cor: "bg-[#ffb020]/10 text-[#8a5a00] border-[#ffb020]/30",
  },
  falha: {
    texto: "O pagamento não foi concluído. Você pode tentar novamente quando quiser.",
    cor: "bg-[#ff5470]/10 text-[#a8283f] border-[#ff5470]/30",
  },
};

export default async function PaginaOfertaBnccComputacao({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const assinatura = await buscarAssinaturaAtual();

  const proAtivo =
    assinatura?.plano === "pro" &&
    assinatura.status === "ativa" &&
    assinatura.validade !== null &&
    assinatura.validade !== undefined &&
    assinatura.validade > new Date();

  const precoTotal = (PRECO_PRO_ANUAL + PRECO_ADDON_BNCC).toFixed(2).replace(".", ",");

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-xl">
        <Link href="/painel" className="text-sm font-semibold text-[#1a3fd4]">
          ← Voltar ao painel
        </Link>

        <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-[#1a3fd4]/10 px-3 py-1 text-xs font-bold text-[#1a3fd4]">
          🎯 BNCC Computação
        </span>
        <h1 className="mt-3 text-2xl font-bold text-neutral-900">
          Todo o material de BNCC Computação, pronto pra usar
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Trilhas gamificadas com IA já geradas pros 3 eixos oficiais do Parecer CNE/CEB nº 2/2022 — Pensamento
          Computacional, Mundo Digital e Cultura Digital. A implementação virou obrigatória em todo o país e o
          PNLD 2027 já traz livro próprio da disciplina — comece antes da sua rede.
        </p>

        {status && MENSAGEM_STATUS[status] && (
          <div className={`mt-4 rounded-xl border p-4 text-sm font-medium ${MENSAGEM_STATUS[status].cor}`}>
            {MENSAGEM_STATUS[status].texto}
          </div>
        )}

        {proAtivo ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="bg-gradient-to-br from-[#1a3fd4] to-[#0f2a99] p-6 text-white">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                Você já é Pro — só falta o add-on
              </span>
              <p className="mt-4 text-3xl font-extrabold">
                + R$ {PRECO_ADDON_BNCC.toFixed(2).replace(".", ",")}
                <span className="text-base font-medium text-white/70"> por 1 ano</span>
              </p>
              <p className="mt-2 text-sm text-white/80">Não mexe na validade do seu Pro, só acrescenta.</p>
            </div>
            <div className="p-6">
              <form action={iniciarCheckoutAddonBncc}>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#1a3fd4] py-3 text-sm font-bold text-white hover:brightness-110"
                >
                  Adicionar BNCC Computação
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="bg-gradient-to-br from-[#1a3fd4] to-[#0f2a99] p-6 text-white">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                👑 Pro anual + BNCC Computação
              </span>
              <p className="mt-4 text-3xl font-extrabold">
                R$ {precoTotal}
                <span className="text-base font-medium text-white/70"> /ano</span>
              </p>
              <p className="mt-2 text-sm text-white/80">
                O Pro completo (R$ {PRECO_PRO_ANUAL.toFixed(2).replace(".", ",")}) + BNCC Computação por só mais
                R$ {PRECO_ADDON_BNCC.toFixed(2).replace(".", ",")}.
              </p>
            </div>
            <div className="p-6">
              <form action={iniciarCheckoutAssinaturaProComBncc}>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#1a3fd4] py-3 text-sm font-bold text-white hover:brightness-110"
                >
                  Assinar Pro + BNCC Computação
                </button>
              </form>
              <p className="mt-4 text-center text-xs text-neutral-400">
                Quer só o Pro, sem BNCC Computação?{" "}
                <Link href="/painel/assinatura" className="font-semibold text-[#1a3fd4]">
                  Ver planos normais
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
