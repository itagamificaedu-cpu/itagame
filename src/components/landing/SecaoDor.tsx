import Link from "next/link";

const tarefas = [
  {
    icone: "📝",
    titulo: "Montar atividade do zero",
    descricao: "Criar quiz ou jogo do zero vira mais uma cobrança na semana.",
    horas: 2,
  },
  {
    icone: "🔎",
    titulo: "Pesquisar conteúdo por série",
    descricao: "Achar algo no nível certo da turma toma tempo que você não tem.",
    horas: 1,
  },
  {
    icone: "🖨️",
    titulo: "Formatar para impressão",
    descricao: "Ajustar quando a aula não vai ser no telão, e sim no papel.",
    horas: 0.5,
  },
  {
    icone: "🎯",
    titulo: "Alinhar à BNCC e adaptar por turma",
    descricao: "Conferir competências e ajustar a dificuldade turma a turma.",
    horas: 1.5,
  },
];

const totalHoras = tarefas.reduce((soma, item) => soma + item.horas, 0);

export function SecaoDor() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-extrabold text-neutral-900">
          Toda semana, essas tarefas tomam um tempo que você não tem de sobra
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {tarefas.map((item) => (
            <div
              key={item.titulo}
              className="rounded-2xl border border-neutral-200 bg-white p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1a3fd4]/10 text-xl">
                {item.icone}
              </span>
              <h3 className="mt-3 font-bold text-neutral-900">{item.titulo}</h3>
              <p className="mt-1 text-sm text-neutral-600">{item.descricao}</p>
              <p className="mt-3 text-sm font-semibold text-[#1a3fd4]">
                ~{item.horas}h/semana
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl bg-neutral-900 px-6 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-white">
            <span className="font-extrabold">~{totalHoras}h por semana</span> — é o
            que essas tarefas somadas custam do seu tempo.
          </p>
          <Link
            href="/cadastro"
            className="shrink-0 rounded-lg bg-[#00c264] px-6 py-3 text-sm font-bold text-white transition hover:brightness-110"
          >
            Quero recuperar esse tempo
          </Link>
        </div>
      </div>
    </section>
  );
}
