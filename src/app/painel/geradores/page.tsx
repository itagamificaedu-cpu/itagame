import Link from "next/link";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";

type ItemGerador = { slug: string; icone: string; titulo: string; texto: string };

const CATEGORIAS: { titulo: string; itens: ItemGerador[] }[] = [
  {
    titulo: "Fundamental I",
    itens: [
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
    ],
  },
  {
    titulo: "Matemática — 8º e 9º ano",
    itens: [
      { slug: "potencia", icone: "🔢", titulo: "Potência", texto: "Cálculos e propriedades operatórias (EF08MA01)" },
      { slug: "raiz-quadrada", icone: "√", titulo: "Raiz Quadrada", texto: "Raízes exatas e estimativa (EF08MA02)" },
      { slug: "equacao-1-grau", icone: "⚖️", titulo: "Equação do 1º Grau", texto: "Uma incógnita, ax + b = c (EF07MA18)" },
      { slug: "sistema-equacoes", icone: "🧮", titulo: "Sistema de Equações", texto: "Duas incógnitas, x e y (EF08MA07/08)" },
      { slug: "equacao-2-grau", icone: "📐", titulo: "Equação do 2º Grau", texto: "Raízes inteiras garantidas (EF09MA09)" },
    ],
  },
  {
    titulo: "Simulados",
    itens: [
      {
        slug: "simulado-spaece",
        icone: "📝",
        titulo: "Simulado SPAECE/SAEB",
        texto: "Questões de múltipla escolha do 9º ano, por descritor",
      },
    ],
  },
];

export default async function PaginaGeradores() {
  await exigirAssinaturaAtiva();

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/painel" className="text-sm font-semibold text-[#1a3fd4]">
          ← Voltar ao painel
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">Geradores de atividades</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Escolha as opções e a folha é montada na hora, pronta para imprimir ou responder na tela.
        </p>

        {CATEGORIAS.map((categoria) => (
          <div key={categoria.titulo} className="mt-10">
            <h2 className="text-sm font-extrabold tracking-wide text-neutral-500 uppercase">{categoria.titulo}</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {categoria.itens.map((item) => (
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
        ))}
      </div>
    </main>
  );
}
