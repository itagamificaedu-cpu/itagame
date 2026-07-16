import Link from "next/link";

const links = [
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#jogos", label: "Tipos de atividade" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#planos", label: "Planos" },
  { href: "#faq", label: "Dúvidas" },
];

export function Cabecalho() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-[#1a3fd4]">
          ItaGame
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-semibold text-neutral-700 hover:text-neutral-900 sm:block"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="rounded-lg bg-[#00c264] px-4 py-2 text-sm font-bold text-white transition hover:brightness-110"
          >
            Criar minha conta
          </Link>
        </div>
      </div>
    </header>
  );
}
