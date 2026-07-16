const publicos = [
  "Professores da rede pública",
  "Professores da rede privada",
  "Ensino Fundamental",
  "Ensino Médio",
  "Coordenação pedagógica",
  "Reforço e revisão",
];

export function Publico() {
  return (
    <section className="border-y border-neutral-100 bg-neutral-50 px-6 py-14">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-extrabold text-neutral-900">
          Pensado pra rotina real de quem já tem a agenda lotada
        </h2>
        <p className="mt-2 text-neutral-600">
          A mesma plataforma atende diferentes realidades de escola e turma.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {publicos.map((item) => (
            <span
              key={item}
              className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
