const funcionalidades = [
  {
    icone: "🎯",
    titulo: "BNCC Computação pronta para 2026/2027",
    descricao:
      "Trilhas gamificadas geradas com IA para os 3 eixos oficiais do Parecer CNE/CEB nº 2/2022 (Pensamento Computacional, Mundo Digital e Cultura Digital) — a implementação virou obrigatória em todo o país e o PNLD 2027 já traz livro próprio da disciplina.",
  },
  {
    icone: "🎓",
    titulo: "Alinhado à BNCC",
    descricao:
      "Cada atividade já sai marcada com as competências da BNCC trabalhadas, sem pesquisa extra.",
  },
  {
    icone: "✍️",
    titulo: "Correção com feedback por critério",
    descricao:
      "Envie prova ou redação e receba nota e comentário por critério: gramática, coerência, argumentação e repertório.",
  },
  {
    icone: "📶",
    titulo: "Sala de jogo ao vivo",
    descricao:
      "Gere um código de acesso, projete na tela da sala e os alunos participam pelo próprio smartphone — sem necessidade de cadastro ou instalação.",
  },
  {
    icone: "📄",
    titulo: "Exportação pronta para imprimir",
    descricao:
      "Word, PDF ou PowerPoint com um clique, para quando a aula não vai ser no telão.",
  },
  {
    icone: "🏆",
    titulo: "XP, ranking e loja de recompensas",
    descricao:
      "Cada resposta certa rende XP. A turma sobe no ranking e troca pontos por prêmios que a escola configura.",
  },
];

export function GradeFuncionalidades() {
  return (
    <section id="funcionalidades" className="bg-neutral-50 px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-neutral-900">
            Tudo que você precisa para preparar e aplicar aula em um só lugar
          </h2>
        </div>

        <div className="mt-12 space-y-4">
          {funcionalidades.map((item, indice) => (
            <div
              key={item.titulo}
              className={`rounded-2xl border bg-white p-6 ${
                indice % 2 === 0 ? "border-[#00c264]" : "border-neutral-200"
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1a3fd4]/10 text-xl">
                  {item.icone}
                </span>
                <div>
                  <h3 className="font-bold text-neutral-900">{item.titulo}</h3>
                  <p className="mt-1 text-sm text-neutral-600">{item.descricao}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
