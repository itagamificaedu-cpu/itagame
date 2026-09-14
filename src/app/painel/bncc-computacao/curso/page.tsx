import Link from "next/link";
import { exigirAcessoBnccComputacao } from "@/lib/acessoDados";
import { EIXOS_BNCC_COMPUTACAO } from "@/lib/bnccComputacao";
import {
  BLOCO_PROJETO_INTEGRADOR,
  SEMANAS_CURSO_BNCC,
  TOTAL_HORAS_CURSO,
  TOTAL_MODULOS_CURSO,
  TOTAL_SEMANAS_CURSO,
  atividadeGuiadaDaSemana,
  semanasDoBloco,
} from "@/lib/cursoBnccComputacao";
import { buscarOuCriarProgressoCurso } from "@/app/actions/cursoBnccComputacao";
import { PainelProgressoCurso } from "@/components/curso-bncc-computacao/PainelProgressoCurso";

// Hub do "Curso de Formação — BNCC Computação (80h)": produto de formação
// continuada pro professor, incluso pra quem já tem o add-on BNCC
// Computação em dia. Reorganiza os 40 aulas do material original em 4
// módulos (os 3 eixos oficiais + 1 módulo de fechamento prático, que não é
// um 4º eixo oficial da BNCC).
export default async function PaginaCursoBnccComputacao() {
  await exigirAcessoBnccComputacao();
  const progresso = await buscarOuCriarProgressoCurso();

  // Cada semana carrega, quando existir, a atividade guiada completa
  // (objetivo, materiais, passo a passo, código BNCC) — é isso que a UI
  // mostra ao expandir a semana, sem precisar abrir a apostila à parte.
  const comAtividadeGuiada = (semanas: typeof SEMANAS_CURSO_BNCC) =>
    semanas.map((s) => ({ ...s, atividadeGuiada: atividadeGuiadaDaSemana(s) }));

  const blocos = [
    ...EIXOS_BNCC_COMPUTACAO.map((eixo) => ({
      chave: eixo.chave,
      nome: eixo.nome,
      icone: eixo.icone,
      cor: eixo.cor,
      semanas: comAtividadeGuiada(semanasDoBloco(eixo.chave)),
    })),
    {
      chave: BLOCO_PROJETO_INTEGRADOR.chave,
      nome: BLOCO_PROJETO_INTEGRADOR.nome,
      icone: BLOCO_PROJETO_INTEGRADOR.icone,
      cor: BLOCO_PROJETO_INTEGRADOR.cor,
      semanas: comAtividadeGuiada(semanasDoBloco(BLOCO_PROJETO_INTEGRADOR.chave)),
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/painel/bncc-computacao" className="text-sm font-semibold text-[#1a3fd4]">
          ← BNCC Computação
        </Link>

        <div className="mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a3fd4] to-[#0e2694] p-8 text-white shadow-sm">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
            🎓 Formação continuada · incluso no seu acesso
          </p>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">Curso de Formação — BNCC Computação ({TOTAL_HORAS_CURSO}h)</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/85">
            {TOTAL_MODULOS_CURSO} módulos organizados nos 3 eixos oficiais da BNCC Computação (Pensamento
            Computacional, Mundo Digital e Cultura Digital) mais um Projeto Integrador de fechamento — {TOTAL_SEMANAS_CURSO}{" "}
            aulas ao todo. Ao concluir, você emite seu certificado de {TOTAL_HORAS_CURSO} horas.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/painel/bncc-computacao/curso/apostila"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur transition hover:bg-white/25"
            >
              📘 Ver apostila completa (imprimir / PDF)
            </Link>
            <a
              href="/materiais/bncc-computacao/apostila-ilustrada-complementar.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur transition hover:bg-white/25"
            >
              🎨 Baixar apostila ilustrada complementar (PDF)
            </a>
          </div>
        </div>

        <div className="mt-8">
          <PainelProgressoCurso
            blocos={blocos}
            totalSemanas={TOTAL_SEMANAS_CURSO}
            semanasConcluidasIniciais={progresso.semanasConcluidas}
            certificadoJaEmitido={progresso.codigoCertificado !== null}
          />
        </div>

        <p className="mt-6 text-center text-xs text-neutral-400">
          {SEMANAS_CURSO_BNCC.length} aulas distribuídas em {TOTAL_MODULOS_CURSO} módulos · carga horária total de{" "}
          {TOTAL_HORAS_CURSO} horas (formação + aplicação prática em sala + registro no Diário de Bordo)
        </p>
      </div>
    </main>
  );
}
