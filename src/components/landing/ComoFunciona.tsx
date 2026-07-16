import { Simulador } from "./Simulador";

const passos = [
  {
    numero: 1,
    titulo: "Escolha tipo, série, disciplina e tema",
    descricao: "Diga o que precisa trabalhar — a IA cuida do resto.",
  },
  {
    numero: 2,
    titulo: "A IA gera a atividade com gabarito",
    descricao: "Confira o resultado, faça os ajustes que quiser e siga tranquilo para aplicação.",
  },
  {
    numero: 3,
    titulo: "Ative a sessão ao vivo",
    descricao: "Em um clique, o ambiente da turma fica disponível com um código único de acesso.",
  },
  {
    numero: 4,
    titulo: "A turma entra pelo celular",
    descricao: "Projete o código na tela da sala de aula — não exige cadastro nem download de aplicativo.",
  },
  {
    numero: 5,
    titulo: "Aplique ao vivo ou exporte",
    descricao: "Acompanhe o ranking em tempo real ou exporte em Word, PDF ou PowerPoint.",
  },
];

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-neutral-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-neutral-900">Como funciona</h2>
          <p className="mt-3 text-neutral-600">
            Do tema em branco até a atividade pronta, em cinco passos.
          </p>
        </div>

        <div className="relative mt-14">
          <div className="absolute left-4 top-0 hidden h-full w-px bg-[#1a3fd4]/20 sm:left-1/2 sm:block" />

          <ol className="space-y-10">
            {passos.map((passo, indice) => {
              const direitaNoDesktop = indice % 2 === 1;
              return (
                <li
                  key={passo.numero}
                  className="relative pl-10 sm:grid sm:grid-cols-2 sm:gap-10 sm:pl-0"
                >
                  <span className="absolute left-4 top-1 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-[#1a3fd4] text-sm font-bold text-white sm:left-1/2">
                    {passo.numero}
                  </span>

                  <div
                    className={`rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm ${
                      direitaNoDesktop ? "sm:col-start-2" : "sm:col-start-1 sm:text-right"
                    }`}
                  >
                    <h3 className="font-bold text-neutral-900">{passo.titulo}</h3>
                    <p className="mt-1 text-sm text-neutral-600">{passo.descricao}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mx-auto mt-16 max-w-xl">
          <div className="rounded-2xl border border-neutral-300 bg-neutral-900 p-3 shadow-xl">
            <div className="flex items-center gap-1.5 pb-2 pl-1">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
            </div>
            <div className="rounded-lg bg-neutral-50 p-4">
              <Simulador />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
