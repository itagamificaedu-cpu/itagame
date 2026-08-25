import { verificarSessao } from "@/lib/acessoDados";
import { iniciarSalaJogoExterno } from "@/app/actions/jogosExternos";
import { JOGOS_EXTERNOS } from "@/lib/catalogoJogosExternos";

export default async function PaginaJogosExternos() {
  await verificarSessao();

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-neutral-900">Jogos</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Gere um código de sala e peça pros alunos entrarem no jogo com ele.
        </p>

        <div className="mt-6 space-y-3">
          {JOGOS_EXTERNOS.map((jogo) => (
            <form key={jogo.slug} action={iniciarSalaJogoExterno.bind(null, jogo.slug)}>
              <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-5">
                <span className="font-semibold text-neutral-800">{jogo.nome}</span>
                <button
                  type="submit"
                  className="rounded-full bg-[#1a3fd4] px-4 py-2 text-sm font-semibold text-white"
                >
                  Gerar código
                </button>
              </div>
            </form>
          ))}
        </div>
      </div>
    </main>
  );
}
