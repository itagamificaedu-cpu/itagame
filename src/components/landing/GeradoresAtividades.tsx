const CATEGORIAS = [
  {
    titulo: "Fundamental I",
    itens: [
      { icone: "🧮", titulo: "Matemática" },
      { icone: "😄", titulo: "Matemática com Emojis" },
      { icone: "📖", titulo: "Folhas de Vocabulário" },
      { icone: "🔎", titulo: "Caça-Palavras" },
      { icone: "🧩", titulo: "Palavras Cruzadas" },
      { icone: "✏️", titulo: "Traçado de Formas" },
      { icone: "🌀", titulo: "Labirintos" },
      { icone: "🕒", titulo: "Quiz do Relógio" },
      { icone: "〰️", titulo: "Traços de Linha" },
      { icone: "🔢", titulo: "Sequências" },
    ],
  },
  {
    titulo: "Matemática — 8º e 9º ano",
    itens: [
      { icone: "🔢", titulo: "Potência" },
      { icone: "√", titulo: "Raiz Quadrada" },
      { icone: "⚖️", titulo: "Equação do 1º Grau" },
      { icone: "🧮", titulo: "Sistema de Equações" },
      { icone: "📐", titulo: "Equação do 2º Grau" },
    ],
  },
  {
    titulo: "Simulados",
    itens: [{ icone: "📝", titulo: "Simulado SPAECE/SAEB" }],
  },
];

export function GeradoresAtividades() {
  return (
    <section id="geradores" className="bg-neutral-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-[#1a3fd4]/10 px-3 py-1 text-xs font-bold tracking-wide text-[#1a3fd4] uppercase">
            Novo
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-neutral-900">
            16 geradores de atividades prontas para imprimir ou aplicar na tela
          </h2>
          <p className="mt-3 text-neutral-600">
            Do Fundamental I até simulados de 9º ano no modelo SPAECE/SAEB, alinhados à BNCC. Escolha a
            dificuldade e a quantidade — a folha é montada na hora, sem repetir questão.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {CATEGORIAS.map((categoria) => (
            <div key={categoria.titulo} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-extrabold tracking-wide text-neutral-500 uppercase">
                {categoria.titulo}
              </h3>
              <div className="mt-4 space-y-2">
                {categoria.itens.map((item) => (
                  <div key={item.titulo} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1a3fd4]/10 text-base">
                      {item.icone}
                    </span>
                    <p className="text-sm font-semibold text-neutral-800">{item.titulo}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-neutral-500">
          Simulado SPAECE/SAEB com questões contextualizadas por descritor (D18, D25, D27, D31, D33-D35) e
          habilidade da BNCC (EF07MA18, EF08MA01/02/07/08, EF09MA09).
        </p>
      </div>
    </section>
  );
}
