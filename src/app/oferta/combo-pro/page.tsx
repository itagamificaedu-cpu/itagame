import Link from "next/link";
import { PRECO_COMBO_PRO } from "@/lib/mercadoPago";

const VALOR_PRO = 24.9;
const VALOR_MANUAL = 19.9;
const VALOR_KIT = 29.9;
const VALOR_TOTAL = VALOR_PRO + VALOR_MANUAL + VALOR_KIT;

function reais(valor: number) {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

const BENEFICIOS_PRO = [
  "Atividades geradas por IA sem limite — quiz, verdadeiro/falso, completar frase, caça-palavras, associar colunas, apresentação e Cabo de Guerra",
  "Salas ao vivo ilimitadas, estilo Kahoot, com ranking em tempo real",
  "Cabo de Guerra local e online ilimitado — inclusive para qualquer disciplina, não só Matemática",
  "Correção de redação com IA, com nota por critério (gramática, coerência, argumentação, repertório)",
  "Exportação de atividades em Word, PDF e PowerPoint",
  "Suporte prioritário direto com o criador da plataforma",
];

const PERGUNTAS = [
  {
    pergunta: "Como recebo o acesso depois de comprar?",
    resposta:
      "Na hora. Assim que o pagamento é aprovado pelo Mercado Pago, seu ItaGame Pro é ativado automaticamente e você já cai na página com os links dos bônus para baixar.",
  },
  {
    pergunta: "Funciona no celular?",
    resposta:
      "Sim. O ItaGame funciona direto no navegador, tanto no computador quanto no celular — não precisa instalar nada.",
  },
  {
    pergunta: "Por quanto tempo tenho acesso ao Pro?",
    resposta: "O acesso Pro vale por 1 ano a partir da ativação.",
  },
  {
    pergunta: "Preciso entender de tecnologia para usar?",
    resposta:
      "Não. A plataforma foi feita para professores, sem termos técnicos. Você escolhe a disciplina, a série e o tema, e a IA gera a atividade pronta em segundos.",
  },
  {
    pergunta: "E se eu não gostar?",
    resposta:
      "Você tem 7 dias de garantia incondicional. Se não fizer sentido para você, é só pedir o reembolso.",
  },
];

export default function OfertaComboPro() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="bg-gradient-to-br from-[#1a3fd4] to-[#0e2694] px-6 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold tracking-wide uppercase">
            ⏳ Oferta por tempo limitado
          </span>
          <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl">
            Sua sala de aula mais dinâmica em poucos minutos, com ItaGame Pro + bônus
          </h1>
          <p className="mt-4 text-base text-white/85">
            Gere atividades com IA, crie salas ao vivo e jogos como o Cabo de Guerra para qualquer
            disciplina — e leve de brinde um manual completo e um kit de atividades prontas.
          </p>
          <a
            href="#oferta"
            className="mt-7 inline-block rounded-xl bg-[#FFD600] px-8 py-3.5 text-base font-extrabold text-[#1a1a2e] transition hover:brightness-105"
          >
            Quero garantir minha vaga
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-14">
        <h2 className="text-center text-2xl font-extrabold text-neutral-900">O que você recebe no ItaGame Pro</h2>
        <ul className="mt-6 space-y-3">
          {BENEFICIOS_PRO.map((item) => (
            <li key={item} className="flex gap-3 rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
              <span className="text-[#00c264]">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="oferta" className="mx-auto max-w-2xl px-6 py-6">
        <h2 className="text-center text-2xl font-extrabold text-neutral-900">O que está incluso hoje</h2>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5">
            <div>
              <p className="font-bold text-neutral-900">👑 ItaGame Pro — acesso por 1 ano</p>
              <p className="text-sm text-neutral-500">Todas as funções liberadas, sem limite</p>
            </div>
            <p className="font-bold text-neutral-400 line-through">{reais(VALOR_PRO)}</p>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5">
            <div>
              <p className="font-bold text-neutral-900">📘 Bônus — Manual do Professor (PDF)</p>
              <p className="text-sm text-neutral-500">Passo a passo de toda a plataforma</p>
            </div>
            <p className="font-bold text-neutral-400 line-through">{reais(VALOR_MANUAL)}</p>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5">
            <div>
              <p className="font-bold text-neutral-900">🎁 Bônus — Kit de 5 atividades prontas</p>
              <p className="text-sm text-neutral-500">Disciplinas variadas, prontas para aplicar hoje</p>
            </div>
            <p className="font-bold text-neutral-400 line-through">{reais(VALOR_KIT)}</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border-2 border-[#1a3fd4] bg-white p-8 text-center">
          <p className="text-sm text-neutral-500">
            Valor total: <span className="line-through">{reais(VALOR_TOTAL)}</span>
          </p>
          <p className="mt-2 text-4xl font-extrabold text-[#1a3fd4]">
            {reais(PRECO_COMBO_PRO)}
            <span className="text-base font-medium text-neutral-500"> à vista</span>
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            ou parcelado no cartão — as opções aparecem na tela de pagamento do Mercado Pago
          </p>

          <Link
            href="/oferta/combo-pro/finalizar"
            className="mt-6 block w-full rounded-xl bg-gradient-to-br from-[#FFD600] to-[#FF8F00] py-4 text-base font-extrabold text-[#1a1a2e] transition hover:brightness-105"
          >
            ⚔️ Quero o ItaGame Pro + bônus
          </Link>
          <p className="mt-3 text-xs text-neutral-400">Pagamento seguro via Mercado Pago</p>
        </div>

        <div className="mt-6 rounded-xl border border-[#00c264]/30 bg-[#00c264]/10 p-5 text-center text-sm text-[#00854a]">
          🛡️ <strong>Garantia incondicional de 7 dias.</strong> Se não fizer sentido para você, devolvemos
          seu dinheiro, sem perguntas.
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-14">
        <h2 className="text-center text-2xl font-extrabold text-neutral-900">Perguntas frequentes</h2>
        <div className="mt-6 space-y-3">
          {PERGUNTAS.map((item) => (
            <details key={item.pergunta} className="rounded-xl border border-neutral-200 bg-white p-4">
              <summary className="cursor-pointer text-sm font-bold text-neutral-900">{item.pergunta}</summary>
              <p className="mt-2 text-sm text-neutral-600">{item.resposta}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t border-neutral-200 px-6 py-8 text-center text-xs text-neutral-400">
        ItaGame — uma plataforma ITA Tecnologia Educacional
      </footer>
    </main>
  );
}
