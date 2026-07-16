const atividades = [
  {
    sigla: "QUIZ",
    nome: "Quiz Interativo",
    descricao:
      "Perguntas de múltipla escolha com pontuação instantânea e posição de cada aluno na disputa.",
    cor: "from-[#1a3fd4] via-[#3b5bf0] to-[#5b7dff]",
    decoracoes: ["❓", "⭐", "✦", "❓"],
  },
  {
    sigla: "V ou F",
    nome: "Verdadeiro ou Falso",
    descricao: "Afirmações rápidas para fixar conteúdo em qualquer início ou fim de aula.",
    cor: "from-[#00a352] via-[#00c264] to-[#3ee08a]",
    decoracoes: ["✔️", "✖️", "✨", "✔️"],
  },
  {
    sigla: "CAÇA-\nPALAVRAS",
    nome: "Caça-palavras",
    descricao: "Revisão em formato de descoberta, ótima para fixação de vocabulário.",
    cor: "from-[#7c3aed] via-[#9147f5] to-[#c084fc]",
    decoracoes: ["🔤", "⭐", "✦", "🔎"],
  },
  {
    sigla: "COMPLETE",
    nome: "Completar a Frase",
    descricao: "A turma preenche as lacunas e confere o gabarito na hora.",
    cor: "from-[#ea580c] via-[#f2751a] to-[#fb923c]",
    decoracoes: ["✏️", "✦", "⭐", "✏️"],
  },
  {
    sigla: "ASSOCIE",
    nome: "Associar Colunas",
    descricao: "Conecta conceito e definição — ótimo pra revisão antes de prova.",
    cor: "from-[#0891b2] via-[#19b3d6] to-[#22d3ee]",
    decoracoes: ["🔗", "✦", "⭐", "🔗"],
  },
  {
    sigla: "SLIDES",
    nome: "Apresentação de Slides",
    descricao: "Slides prontos com o conteúdo gerado, exportáveis em PowerPoint.",
    cor: "from-[#1a3fd4] via-[#0e9e6d] to-[#00c264]",
    decoracoes: ["🖥️", "✦", "⭐", "📽️"],
  },
];

const posicoesDecoracao = [
  "left-3 top-3 text-lg -rotate-12 opacity-70",
  "right-4 top-6 text-2xl rotate-12 opacity-60",
  "left-6 bottom-6 text-xl rotate-6 opacity-50",
  "right-6 bottom-3 text-lg -rotate-6 opacity-70",
];

export function CatalogoAtividades() {
  return (
    <section id="jogos" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-neutral-900">
            Seis tipos de atividade prontos para qualquer aula
          </h2>
          <p className="mt-3 text-neutral-600">
            Escolha o tipo, a IA gera o conteúdo e o gabarito — você só revisa e aplica.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {atividades.map((item) => (
            <div
              key={item.nome}
              className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br ${item.cor}`}
              >
                <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:16px_16px]" />

                {item.decoracoes.map((simbolo, indice) => (
                  <span
                    key={indice}
                    className={`absolute select-none drop-shadow ${posicoesDecoracao[indice]}`}
                  >
                    {simbolo}
                  </span>
                ))}

                <span
                  className="relative whitespace-pre-line text-center text-3xl leading-tight font-extrabold text-white [-webkit-text-stroke:1.5px_rgba(0,0,0,0.15)]"
                  style={{
                    textShadow:
                      "0 3px 0 rgba(0,0,0,0.18), 0 6px 12px rgba(0,0,0,0.25)",
                  }}
                >
                  {item.sigla}
                </span>

                <span className="absolute right-2.5 bottom-2.5 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-neutral-700 shadow-sm">
                  🤖 ItaGame
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-neutral-900">{item.nome}</h3>
                <p className="mt-1 text-sm text-neutral-600">{item.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
