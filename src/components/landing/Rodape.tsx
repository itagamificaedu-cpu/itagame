export function Rodape() {
  return (
    <footer className="bg-neutral-900 px-6 py-10 pb-24 text-sm text-neutral-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-extrabold text-white">ItaGame</p>
          <p className="mt-1">Um produto ITA Tecnologia Educacional.</p>
        </div>

        <nav className="flex flex-wrap gap-6">
          <a href="#funcionalidades" className="hover:text-white">
            Funcionalidades
          </a>
          <a href="#como-funciona" className="hover:text-white">
            Como funciona
          </a>
          <a href="#planos" className="hover:text-white">
            Planos
          </a>
          <a
            href="https://instagram.com/ceitecgameedu"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            @ceitecgameedu
          </a>
        </nav>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-neutral-800 pt-6 text-xs text-neutral-500">
        <p>
          Termos de uso · Política de privacidade · © {new Date().getFullYear()} ItaGame — ITA
          Tecnologia Educacional.
        </p>
      </div>
    </footer>
  );
}
