const atividades = [
  {
    emoji: "❓",
    nome: "Quiz Interativo",
    descricao: "Perguntas de múltipla escolha com pontuação instantânea e posição de cada aluno na disputa.",
    cor: "from-[#1a3fd4] to-[#3b5bf0]",
  },
  {
    emoji: "✅",
    nome: "Verdadeiro ou Falso",
    descricao: "Afirmações rápidas para fixar conteúdo em qualquer início ou fim de aula.",
    cor: "from-[#00a352] to-[#00c264]",
  },
  {
    emoji: "🧩",
    nome: "Caça-palavras",
    descricao: "Revisão em formato de descoberta, ótima para fixação de vocabulário.",
    cor: "from-[#7c3aed] to-[#a855f7]",
  },
  {
    emoji: "✏️",
    nome: "Completar a Frase",
    descricao: "A turma preenche as lacunas e confere o gabarito na hora.",
    cor: "from-[#ea580c] to-[#f97316]",
  },
  {
    emoji: "🔗",
    nome: "Associar Colunas",
    descricao: "Conecta conceito e definição — ótimo pra revisão antes de prova.",
    cor: "from-[#0891b2] to-[#22d3ee]",
  },
  {
    emoji: "🖥️",
    nome: "Apresentação de Slides",
    descricao: "Slides prontos com o conteúdo gerado, exportáveis em PowerPoint.",
    cor: "from-[#1a3fd4] to-[#00c264]",
  },
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
              className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div
                className={`flex h-28 items-center justify-center bg-gradient-to-br ${item.cor} text-5xl`}
              >
                {item.emoji}
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
