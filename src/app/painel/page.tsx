import { getUsuarioAtual } from "@/lib/acessoDados";
import { sair } from "@/app/actions/autenticacao";

export default async function PaginaPainel() {
  const usuario = await getUsuarioAtual();

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              Olá, {usuario?.nome ?? "professor"}
            </h1>
            <p className="text-sm text-neutral-500">{usuario?.email}</p>
          </div>
          <form action={sair}>
            <button
              type="submit"
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
            >
              Sair
            </button>
          </form>
        </div>

        <div className="mt-10 rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
          <p className="font-semibold text-neutral-700">
            Painel do professor em construção
          </p>
          <p className="mt-1 text-sm">
            Próximos passos: gerador de atividades com IA, sala ao vivo e turmas.
          </p>
        </div>
      </div>
    </main>
  );
}
