import Link from "next/link";

export function BarraCtaFixa() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col items-center justify-between gap-3 bg-neutral-900 px-6 py-3 text-center sm:flex-row sm:text-left">
      <p className="text-sm font-semibold text-white">
        ItaGame — pare de montar aula do zero. Deixe a IA cuidar disso.
      </p>
      <Link
        href="/cadastro"
        className="shrink-0 rounded-lg bg-[#00c264] px-5 py-2 text-sm font-bold text-white transition hover:brightness-110"
      >
        Criar minha conta
      </Link>
    </div>
  );
}
