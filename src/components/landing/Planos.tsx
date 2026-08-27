import Link from "next/link";
import { PRECO_PRO_ANUAL, PRECO_PRO_MENSAL } from "@/lib/mercadoPago";

const recursosPro = [
  "Atividades ilimitadas",
  "Sala ao vivo sem limite de alunos",
  "Todos os tipos de atividade",
  "Correção de redação com IA",
  "Exportação em Word, PDF e PowerPoint",
  "Suporte prioritário",
];

export function Planos() {
  return (
    <section id="planos" className="px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-extrabold text-neutral-900">Assinatura ItaGameficaEdu</h2>
        <p className="mt-3 text-neutral-600">Acesso completo à plataforma — escolha mensal ou anual.</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 sm:text-left">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
              👑 ItaGameficaEdu Pro
            </span>
            <p className="mt-4 text-3xl font-extrabold text-white">
              R$ {PRECO_PRO_MENSAL.toFixed(2).replace(".", ",")}
              <span className="text-base font-medium text-neutral-400"> /mês</span>
            </p>
            <p className="text-xs text-neutral-400">renova todo mês, cancele quando quiser</p>
            <ul className="mt-6 space-y-2 text-sm text-neutral-300">
              {recursosPro.map((r) => (
                <li key={r}>
                  <span className="text-neutral-400">✓</span> {r}
                </li>
              ))}
            </ul>
            <Link
              href="/cadastro"
              className="mt-8 block rounded-lg bg-white/10 py-2.5 text-center text-sm font-bold text-white hover:bg-white/20"
            >
              Assinar plano mensal
            </Link>
          </div>

          <div className="rounded-2xl border border-[#00c264]/40 bg-neutral-900 p-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00c264]/15 px-3 py-1 text-xs font-bold text-[#00c264]">
              👑 ItaGameficaEdu Pro — melhor custo
            </span>
            <p className="mt-4 text-3xl font-extrabold text-white">
              R$ {PRECO_PRO_ANUAL.toFixed(2).replace(".", ",")}
              <span className="text-base font-medium text-neutral-400"> /ano</span>
            </p>
            <p className="text-xs text-neutral-400">pagamento único, renovação manual no vencimento</p>
            <ul className="mt-6 space-y-2 text-sm text-neutral-300">
              {recursosPro.map((r) => (
                <li key={r}>
                  <span className="text-[#00c264]">✓</span> {r}
                </li>
              ))}
            </ul>
            <Link
              href="/cadastro"
              className="mt-8 block rounded-lg bg-[#00c264] py-2.5 text-center text-sm font-bold text-white hover:brightness-110"
            >
              Assinar plano anual
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
