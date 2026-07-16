import Link from "next/link";

const selos = ["Nenhum aplicativo pra baixar", "Pontuação atualiza na hora", "Alinhado à BNCC"];

const ranking = [
  { nome: "Beatriz", pontos: 92 },
  { nome: "Lucas", pontos: 78 },
  { nome: "Sofia", pontos: 65 },
];

export function SecaoPrincipal() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-[#eef1ff] to-white px-6 pb-20 pt-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-[#1a3fd4]/30 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1a3fd4]">
            Atividades geradas por IA em poucos minutos
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-neutral-900 sm:text-5xl">
            Sua aula sai da explicação e entra no modo disputa.{" "}
            <span className="text-[#00a352]">
              Qualquer matéria vira um desafio ao vivo entre os alunos.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-neutral-600">
            A inteligência artificial cria o desafio a partir do assunto que você
            escolher — matemática, português, ciências, história ou qualquer outra
            disciplina. Os estudantes entram pelo próprio celular, acompanham a
            pontuação subindo ao vivo e participam digitando apenas um código, sem
            baixar nenhum aplicativo.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/cadastro"
              className="rounded-lg bg-[#00c264] px-6 py-3 text-base font-bold text-white transition hover:brightness-110"
            >
              Criar minha atividade agora
            </Link>
            <a
              href="#como-funciona"
              className="rounded-lg border border-neutral-300 px-6 py-3 text-base font-semibold text-neutral-700 hover:bg-neutral-100"
            >
              Ver como funciona
            </a>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {selos.map((selo) => (
              <span
                key={selo}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 shadow-sm ring-1 ring-neutral-200"
              >
                <span className="text-[#00c264]">✓</span> {selo}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto mt-14 flex max-w-3xl justify-center">
          <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 bg-neutral-900 p-3 shadow-2xl">
            <div className="flex items-center gap-1.5 pb-2 pl-1">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
            </div>
            <div className="rounded-lg bg-white p-5">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span className="text-sm font-semibold text-neutral-500">
                  Gerando atividade com IA
                </span>
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#00c264]" />
              </div>
              <p className="mt-3 text-sm text-neutral-700">
                Tema: <span className="font-semibold">Frações — 6º ano</span>
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                <div className="h-full w-4/5 animate-pulse rounded-full bg-[#1a3fd4]" />
              </div>
              <p className="mt-6 text-sm font-semibold text-neutral-500">
                Ranking ao vivo — Sala #4821
              </p>
              <ul className="mt-3 space-y-2">
                {ranking.map((item) => (
                  <li key={item.nome} className="flex items-center gap-3">
                    <span className="w-16 shrink-0 truncate text-xs text-neutral-600">
                      {item.nome}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-[#00c264]"
                        style={{ width: `${item.pontos}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs font-bold text-neutral-700">
                      {item.pontos}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="absolute -bottom-8 -right-2 hidden w-40 rounded-[1.75rem] border-4 border-neutral-900 bg-neutral-900 p-1.5 shadow-2xl sm:block">
            <div className="rounded-[1.25rem] bg-white p-3">
              <p className="text-center text-[10px] font-bold text-neutral-400">SALA #4821</p>
              <p className="mt-1 text-center text-xs font-bold text-neutral-900">
                Quanto é 3/4 + 1/4?
              </p>
              <div className="mt-3 grid grid-cols-2 gap-1.5">
                <span className="rounded-md bg-[#1a3fd4] py-2 text-center text-[10px] font-bold text-white">
                  1
                </span>
                <span className="rounded-md bg-[#00c264] py-2 text-center text-[10px] font-bold text-white">
                  2
                </span>
                <span className="rounded-md bg-amber-500 py-2 text-center text-[10px] font-bold text-white">
                  3/2
                </span>
                <span className="rounded-md bg-rose-500 py-2 text-center text-[10px] font-bold text-white">
                  0
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
