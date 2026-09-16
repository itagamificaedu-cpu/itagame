import Link from "next/link";
import {
  buscarAssinaturaAtual,
  iniciarCheckoutAddonBncc,
  iniciarCheckoutAssinaturaProComBncc,
  iniciarCheckoutKitVitalicioBncc,
} from "@/app/actions/assinatura";
import { PRECO_PRO_ANUAL, PRECO_ADDON_BNCC, PRECO_KIT_VITALICIO_BNCC } from "@/lib/mercadoPago";
import { ETAPAS_BNCC } from "@/lib/modelosBnccComputacao";

// Página de oferta do add-on BNCC Computação. Layout reconstruído a partir
// do canvas de design "Kit BNCC Computação ItaGamificaEdu" (Claude Design),
// mantendo toda a lógica real de checkout/assinatura que já existia — só o
// visual mudou (hero, vitrine do gerador, benefícios por etapa).
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

const RESUMO_ETAPA: Record<string, string> = {
  educacao_infantil: "Padrões, sequências e o primeiro contato com comandos, de forma lúdica.",
  anos_iniciais: "Lógica, organização e os primeiros algoritmos aplicados ao dia a dia.",
  anos_finais: "Dados, redes, cultura digital e projetos de pensamento crítico.",
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
    <main className="min-h-screen bg-white">
      <div className="border-b border-neutral-100 px-6 py-4">
        <Link href="/painel" className="text-sm font-semibold text-[#1a3fd4]">
          ← Voltar ao painel
        </Link>
      </div>

      {/* BLOCO 1: HERO SPLIT */}
      <div className="flex flex-col lg:flex-row lg:min-h-[560px]">
        <div className="flex flex-1 items-center px-6 py-14 sm:px-10 lg:py-0">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-[#00a352]">
              Planeje, gere e aplique
            </p>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-neutral-900 sm:text-[40px]">
              A Resolução CNE/CEB chegou. Sua aula de Computação pode sair pronta hoje.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-neutral-600">
              Trilhas gamificadas com IA, geradores prontos pra imprimir e um mapa de planejamento —
              organizados pelos 3 eixos oficiais da BNCC Computação, da Educação Infantil aos Anos
              Finais.
            </p>
            <a
              href="#planos"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#00c264] px-8 py-4 text-base font-bold text-white transition hover:bg-[#00a854]"
            >
              Quero meu acesso — R$ {precoTotal}/ano
            </a>
            <p className="mt-3 text-sm text-neutral-400">
              Acesso imediato · da Educação Infantil aos Anos Finais
            </p>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#eef1ff] px-6 py-16 sm:min-h-[420px]">
          <div className="relative w-full max-w-md">
            {/* tablet mockup */}
            <div className="absolute left-[6%] top-0 w-[210px] rounded-2xl bg-neutral-900 p-2.5 shadow-2xl shadow-[#1a3fd4]/20 sm:w-[240px]">
              <div className="rounded-xl bg-white p-4">
                <div className="mb-3 flex items-center gap-1.5">
                  <span className="h-3.5 w-3.5 rounded-[5px] bg-[#1a3fd4]" />
                  <span className="text-[10px] font-bold text-neutral-900">Geradores de atividades</span>
                </div>
                <p className="mb-2.5 text-[11px] font-bold text-neutral-900">
                  Crie atividades personalizadas em segundos
                </p>
                <div className="flex flex-col gap-1.5">
                  <div className="h-2 w-full rounded bg-[#eef1ff]" />
                  <div className="h-2 w-[85%] rounded bg-[#eef1ff]" />
                  <div className="h-2 w-[92%] rounded bg-[#eef1ff]" />
                </div>
                <div className="mt-3 rounded-md bg-[#00c264] py-2 text-center text-[10px] font-bold text-white">
                  Gerar atividade
                </div>
              </div>
            </div>

            {/* fanned activity cards */}
            <div className="absolute right-[2%] top-[10%] w-[104px] -rotate-[9deg] rounded-xl border border-[#e7e9f7] bg-white p-3 shadow-lg shadow-[#1a3fd4]/10">
              <div className="mb-2 h-12 rounded-lg bg-[#eef1ff]" />
              <p className="text-[9px] font-bold text-neutral-900">Qual é o comando?</p>
            </div>
            <div className="absolute right-0 top-[34%] w-[104px] rotate-[4deg] rounded-xl border border-[#e7e9f7] bg-white p-3 shadow-lg shadow-[#1a3fd4]/10">
              <div className="mb-2 h-12 rounded-lg bg-[#f0fbf4]" />
              <p className="text-[9px] font-bold text-neutral-900">Sequência de setas</p>
            </div>
            <div className="absolute right-[14%] top-[52%] w-[104px] -rotate-[2deg] rounded-xl border border-[#e7e9f7] bg-white p-3 shadow-lg shadow-[#1a3fd4]/10">
              <div className="mb-2 h-12 rounded-lg bg-[#eef1ff]" />
              <p className="text-[9px] font-bold text-neutral-900">Labirinto lógico</p>
            </div>

            {/* booklet cover */}
            <div className="absolute bottom-0 left-[14%] flex h-[190px] w-[148px] rotate-[3deg] flex-col justify-between rounded-[10px] bg-gradient-to-br from-[#1a3fd4] to-[#12309e] p-5 shadow-xl shadow-[#12309e]/25">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00c264" strokeWidth={2}>
                <rect x="4" y="4" width="16" height="16" rx="3" />
                <path d="M8 9h8M8 13h5" />
              </svg>
              <p className="text-[12px] font-extrabold leading-tight text-white">
                ATIVIDADES DE PENSAMENTO COMPUTACIONAL
              </p>
            </div>

            {/* invisible spacer to size the relative container on mobile */}
            <div className="h-[360px] w-full" />
          </div>
        </div>
      </div>

      {status && MENSAGEM_STATUS[status] && (
        <div className="mx-auto max-w-3xl px-6 pt-8">
          <div className={`rounded-xl border p-4 text-sm font-medium ${MENSAGEM_STATUS[status].cor}`}>
            {MENSAGEM_STATUS[status].texto}
          </div>
        </div>
      )}

      {/* BLOCO 2: BENEFÍCIOS POR ETAPA */}
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="grid gap-7 sm:grid-cols-3">
          {ETAPAS_BNCC.map((etapa, indice) => {
            const icones = [
              <>
                <rect key="r" x={3} y={4} width={18} height={14} rx={2} />
                <path d="M3 9h18" />
                <circle cx={7.5} cy={6.5} r={0.6} fill="#1a3fd4" />
                <circle cx={9.5} cy={6.5} r={0.6} fill="#1a3fd4" />
              </>,
              <path key="p" d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
              <>
                <rect key="r2" x={3} y={3} width={18} height={18} rx={2} />
                <path d="M3 9h18M9 9v12" />
              </>,
            ][indice];
            const titulos = [
              "Tudo em um só acesso",
              "Aula pronta em poucos cliques",
              "No tamanho certo para imprimir",
            ][indice];
            const textos = [
              "Trilhas, geradores e mapa de planejamento organizados num único painel — sem planilha espalhada ou pasta perdida.",
              "Escolha etapa e eixo, gere a atividade com IA e já saia com o material pronto pra aplicar.",
              "Geradores formatados pra impressão direta, sem ajuste de margem ou quebra de página.",
            ][indice];
            return (
              <div key={etapa.chave}>
                <div className="mb-5 flex h-40 items-center justify-center rounded-2xl bg-[#f6f7fd]">
                  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#1a3fd4" strokeWidth={1.6}>
                    {icones}
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-extrabold text-neutral-900">{titulos}</h3>
                <p className="mb-5 text-sm leading-relaxed text-neutral-600">{textos}</p>
                <div className="rounded-[10px] bg-[#12309e] px-4 py-4">
                  <p className="mb-1 text-sm font-extrabold text-white">
                    {etapa.nome} <span className="font-medium text-[#c9d2f5]">({etapa.faixa})</span>
                  </p>
                  <p className="text-xs leading-relaxed text-[#c9d2f5]">{RESUMO_ETAPA[etapa.chave]}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BLOCO 3: PLANOS (checkout real) */}
      <div id="planos" className="bg-neutral-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-xl">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#1a3fd4]/10 px-3 py-1 text-xs font-bold text-[#1a3fd4]">
            🎯 BNCC Computação
          </span>
          <h2 className="mt-3 text-2xl font-bold text-neutral-900">
            Todo o material de BNCC Computação, pronto pra usar
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Trilhas gamificadas com IA já geradas pros 3 eixos oficiais do Parecer CNE/CEB nº 2/2022 —
            Pensamento Computacional, Mundo Digital e Cultura Digital. A implementação virou
            obrigatória em todo o país e o PNLD 2027 já traz livro próprio da disciplina — comece
            antes da sua rede.
          </p>

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

          {/* Alternativa sem assinatura: pagamento único, não mexe no Pro. */}
          <div className="relative mt-6">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-neutral-200" />
            <span className="relative mx-auto block w-fit bg-neutral-50 px-3 text-xs font-bold uppercase tracking-wide text-neutral-400">
              ou pague uma vez só
            </span>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-[#1a3fd4]/30 bg-white">
            <div className="p-6">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#1a3fd4]/10 px-3 py-1 text-xs font-bold text-[#1a3fd4]">
                🎯 Kit Vitalício BNCC Computação
              </span>
              <p className="mt-3 text-2xl font-extrabold text-neutral-900">
                R$ {PRECO_KIT_VITALICIO_BNCC.toFixed(2).replace(".", ",")}
                <span className="text-sm font-medium text-neutral-400"> pagamento único</span>
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                Curso de Formação (80h) + certificado, apostila completa e geradores de simulado, sem
                limite, pra sempre — sem mensalidade. Sala Ao Vivo com a turma continua exigindo o Pro.
              </p>
              <form action={iniciarCheckoutKitVitalicioBncc} className="mt-4">
                <button
                  type="submit"
                  className="w-full rounded-lg border-2 border-[#1a3fd4] py-3 text-sm font-bold text-[#1a3fd4] hover:bg-[#1a3fd4]/5"
                >
                  Quero o acesso vitalício
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
