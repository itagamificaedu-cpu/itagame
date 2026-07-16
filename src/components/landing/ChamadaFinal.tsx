import Link from "next/link";

export function ChamadaFinal() {
  return (
    <section className="bg-[#1a3fd4] px-6 py-16 text-center">
      <h2 className="text-3xl font-extrabold text-white">
        Sua próxima aula pode estar pronta em dois minutos
      </h2>
      <p className="mt-3 text-white/80">
        Crie sua conta e gere sua primeira atividade agora.
      </p>
      <Link
        href="/cadastro"
        className="mt-8 inline-block rounded-lg bg-[#00c264] px-8 py-3 text-base font-bold text-white transition hover:brightness-110"
      >
        Criar minha conta
      </Link>
    </section>
  );
}
