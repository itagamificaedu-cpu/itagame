import Link from "next/link";
import { redirect } from "next/navigation";
import { PRECO_COMBO_PRO, OFERTA_COMBO_PRO_ATIVA } from "@/lib/mercadoPago";

const VALOR_PRO = 24.9;
const VALOR_MANUAL = 19.9;
const VALOR_KIT = 29.9;
const VALOR_TOTAL = VALOR_PRO + VALOR_MANUAL + VALOR_KIT;

function reais(valor: number) {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

const PROBLEMAS = [
  {
    titulo: "Criar tudo à mão",
    texto: "Horas montando uma atividade que o aluno resolve em poucos minutos.",
  },
  {
    titulo: "Material sempre igual",
    texto: "As mesmas apostilas prontas da internet, sem relação com a turma nem com a BNCC.",
  },
  {
    titulo: "Turma dispersa",
    texto: "Atividade no papel não prende atenção como um jogo ao vivo prende.",
  },
];

const MUDANCAS = [
  {
    titulo: "Atividade nova sempre que precisar",
    texto: "Escolhe disciplina, série e tema — a IA gera na hora, alinhada à BNCC.",
  },
  {
    titulo: "Você economiza horas por semana",
    texto: "De montar do zero a gerar em segundos, prova, quiz, caça-palavras e mais.",
  },
  {
    titulo: "Turma mais engajada",
    texto: "Salas ao vivo e Cabo de Guerra colocam a turma competindo em tempo real, com placar e cronômetro de verdade.",
  },
  {
    titulo: "Você com controle total",
    texto: "Ajusta disciplina, série, tema e tipo de atividade sem mexer em nada técnico.",
  },
];

const GERADORES = [
  "Quiz de múltipla escolha",
  "Verdadeiro ou falso",
  "Completar frase",
  "Caça-palavras",
  "Associar colunas",
  "Apresentação de slides",
  "Cabo de Guerra (qualquer disciplina)",
];

const PERGUNTAS = [
  {
    pergunta: "Como recebo o acesso depois de comprar?",
    resposta:
      "Na hora. Assim que o pagamento é aprovado pelo Mercado Pago, seu ItaGameficaEdu Pro é ativado automaticamente e você já cai na página com os links dos bônus para baixar.",
  },
  {
    pergunta: "Funciona no celular?",
    resposta:
      "Sim. O ItaGameficaEdu funciona direto no navegador, tanto no computador quanto no celular — não precisa instalar nada.",
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
  if (!OFERTA_COMBO_PRO_ATIVA) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="bg-gradient-to-br from-[#1a3fd4] to-[#0e2694] px-6 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold tracking-wide uppercase">
            ⏳ Oferta por tempo limitado
          </span>
          <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl">
            Atividades novas para sua turma em segundos — sem criar nada do zero
          </h1>
          <p className="mt-4 text-base text-white/85">
            Gere atividades com IA alinhadas à BNCC, crie salas ao vivo e jogos como o Cabo de
            Guerra para qualquer disciplina — e leve de brinde um manual completo e um kit de
            atividades prontas.
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
        <h2 className="text-center text-2xl font-extrabold text-neutral-900">
          O problema não é falta de vontade de ensinar
        </h2>
        <p className="mt-3 text-center text-sm text-neutral-500">
          Você quer dar atividades novas toda semana. Mas montar cada uma na mão leva tempo, e as
          apostilas prontas da internet são sempre as mesmas.
        </p>
        <div className="mt-6 space-y-3">
          {PROBLEMAS.map((item) => (
            <div key={item.titulo} className="flex gap-3 rounded-xl border border-neutral-200 bg-white p-4">
              <span className="text-lg text-red-500">❌</span>
              <div>
                <p className="text-sm font-bold text-neutral-900">{item.titulo}</p>
                <p className="text-sm text-neutral-500">{item.texto}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm font-semibold text-neutral-700">
          A saída é simples: gerar a atividade na hora, do jeito que a turma precisa, sem repetir
          sempre as mesmas folhas.
        </p>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-6">
        <h2 className="text-center text-2xl font-extrabold text-neutral-900">
          Conheça o ItaGameficaEdu Pro
        </h2>
        <p className="mt-3 text-center text-sm text-neutral-500">
          Um gerador de atividades com IA, alinhado à BNCC, direto no navegador — mais salas ao
          vivo e jogos que colocam a turma inteira competindo em tempo real.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {MUDANCAS.map((item) => (
            <div key={item.titulo} className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-sm font-bold text-neutral-900">{item.titulo}</p>
              <p className="mt-1 text-sm text-neutral-500">{item.texto}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
          <p className="text-center text-sm font-bold text-neutral-900">
            7 tipos de atividade geráveis por IA
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {GERADORES.map((item) => (
              <span
                key={item}
                className="rounded-full bg-[#1a3fd4]/10 px-3 py-1 text-xs font-semibold text-[#1a3fd4]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-14">
        <h2 className="text-center text-2xl font-extrabold text-neutral-900">
          🧠 Mas já existem atividades prontas na internet...
        </h2>
        <p className="mt-3 text-center text-sm text-neutral-500">
          Sim. Mas provavelmente são sempre as mesmas, sem relação com a sua turma e sem
          alinhamento com a BNCC. Aqui é diferente:
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
            <p className="text-lg">✅</p>
            <p className="text-sm font-bold text-neutral-900">Sempre nova</p>
            <p className="mt-1 text-xs text-neutral-500">Cada geração é diferente, no tema que você escolher.</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
            <p className="text-lg">✅</p>
            <p className="text-sm font-bold text-neutral-900">Você ajusta</p>
            <p className="mt-1 text-xs text-neutral-500">Disciplina, série, tema e tipo, do seu jeito.</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
            <p className="text-lg">✅</p>
            <p className="text-sm font-bold text-neutral-900">Sem instalar nada</p>
            <p className="mt-1 text-xs text-neutral-500">Funciona direto no navegador, no computador ou no celular.</p>
          </div>
        </div>
      </section>

      <section id="oferta" className="mx-auto max-w-2xl px-6 py-6">
        <h2 className="text-center text-2xl font-extrabold text-neutral-900">O que está incluso hoje</h2>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5">
            <div>
              <p className="font-bold text-neutral-900">👑 ItaGameficaEdu Pro — acesso por 1 ano</p>
              <p className="text-sm text-neutral-500">
                Geração ilimitada de atividades, salas ao vivo e Cabo de Guerra com placar e
                cronômetro em tempo real
              </p>
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
            ⚔️ Quero o ItaGameficaEdu Pro + bônus
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
        ItaGameficaEdu — uma plataforma ITA Tecnologia Educacional
      </footer>
    </main>
  );
}
