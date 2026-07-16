const destaques = [
  { valor: "< 2 min", legenda: "para gerar uma atividade completa com gabarito" },
  { valor: "6", legenda: "tipos de atividade prontos para aplicar" },
  { valor: "0 instalação", legenda: "o aluno entra pelo celular com um código" },
];

export function BarraDestaques() {
  return (
    <section className="border-y border-neutral-100 bg-white px-6 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 text-center sm:grid-cols-3">
        {destaques.map((item) => (
          <div key={item.legenda}>
            <p className="text-3xl font-extrabold text-[#1a3fd4]">{item.valor}</p>
            <p className="mt-1 text-sm text-neutral-500">{item.legenda}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
