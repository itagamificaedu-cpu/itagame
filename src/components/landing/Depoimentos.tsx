// Depoimentos de exemplo — substituir por depoimentos reais após o lançamento.
const depoimentos = [
  {
    iniciais: "MC",
    nome: "Exemplo — Professora de Matemática",
    papel: "Ensino Fundamental II",
    texto:
      "Testei com uma turma de 6º ano e em cinco minutos já tinha um quiz de frações pronto, com gabarito e tudo alinhado ao que eu ia ensinar.",
  },
  {
    iniciais: "RC",
    nome: "Exemplo — Coordenador pedagógico",
    papel: "Coordenação",
    texto:
      "O que mais me chamou atenção foi a correção de redação com feedback por critério — economiza um trabalho enorme na revisão.",
  },
  {
    iniciais: "PH",
    nome: "Exemplo — Professor de História",
    papel: "Ensino Médio",
    texto:
      "A sala ao vivo resolveu o problema de aplicar revisão sem depender de impressão. A turma entra pelo celular e já começa a jogar.",
  },
];

export function Depoimentos() {
  return (
    <section id="depoimentos" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-extrabold text-neutral-900">
          O que professores dizem ao testar o ItaGame
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-500">
          Depoimentos de exemplo — serão substituídos por relatos reais após o lançamento.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {depoimentos.map((item) => (
            <blockquote
              key={item.nome}
              className="rounded-2xl border border-neutral-200 bg-white p-6"
            >
              <div className="flex text-amber-400">
                {"★★★★★".split("").map((estrela, indice) => (
                  <span key={indice}>{estrela}</span>
                ))}
              </div>
              <p className="mt-3 text-sm text-neutral-700">&ldquo;{item.texto}&rdquo;</p>
              <footer className="mt-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a3fd4]/10 text-sm font-bold text-[#1a3fd4]">
                  {item.iniciais}
                </span>
                <div>
                  <p className="text-sm font-bold text-neutral-900">{item.nome}</p>
                  <p className="text-xs text-neutral-500">{item.papel}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
