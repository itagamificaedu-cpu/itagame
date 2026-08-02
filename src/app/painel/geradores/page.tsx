import Link from "next/link";
import { verificarSessao } from "@/lib/acessoDados";

const GERADORES = [
  { slug: "matematica", icone: "🧮", titulo: "Matemática", texto: "Soma, subtração, multiplicação e divisão" },
  { slug: "matematica-emojis", icone: "😄", titulo: "Matemática com Emojis", texto: "Contas visuais com grupos de emoji" },
  { slug: "vocabulario", icone: "📖", titulo: "Folhas de Vocabulário", texto: "Associar, completar ou traçar palavras" },
  { slug: "caca-palavras", icone: "🔎", titulo: "Caça-Palavras", texto: "Grade com palavras escondidas" },
  { slug: "palavras-cruzadas", icone: "🧩", titulo: "Palavras Cruzadas", texto: "Cruzadinha com dicas" },
  { slug: "tracado-formas", icone: "✏️", titulo: "Traçado de Formas", texto: "Formas pontilhadas para traçar" },
  { slug: "labirintos", icone: "🌀", titulo: "Labirintos", texto: "Labirinto novo a cada geração" },
  { slug: "quiz-relogio", icone: "🕒", titulo: "Quiz do Relógio", texto: "Leitura de horas no relógio analógico" },
  { slug: "tracos-linha", icone: "〰️", titulo: "Traços de Linha", texto: "Linhas para coordenação motora fina" },
  { slug: "sequencias", icone: "🔢", titulo: "Sequências", texto: "Padrões numéricos e de figuras para completar" },
];

export default async function PaginaGeradores() {
  await verificarSessao();

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/painel" className="text-sm font-semibold text-[#1a3fd4]">
          ← Voltar ao painel
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">Geradores de atividades</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Escolha as opções e a folha é montada na hora, pronta para imprimir.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {GERADORES.map((item) => (
            <Link
              key={item.slug}
              href={`/painel/geradores/${item.slug}`}
              className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-[#1a3fd4] hover:bg-[#1a3fd4]/5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1a3fd4]/10 text-xl">
                {item.icone}
              </span>
              <div>
                <p className="font-bold text-neutral-900">{item.titulo}</p>
                <p className="mt-0.5 text-sm text-neutral-500">{item.texto}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
