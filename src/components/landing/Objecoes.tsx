const objecoes = [
  {
    duvida: "Tenho dificuldade com tecnologia.",
    resposta:
      "Você escolhe o tipo de atividade, informa o tema e conduz tudo pelo painel. Se você consegue usar um grupo de WhatsApp, consegue usar o ItaGameficaEdu.",
  },
  {
    duvida: "Minha turma não tem celular pra todo mundo.",
    resposta:
      "Dá pra jogar em dupla ou trio no mesmo aparelho, ou conduzir só pelo telão enquanto os alunos respondem em voz alta — o ranking funciona do mesmo jeito.",
  },
  {
    duvida: "Não tenho tempo de preparar nada para hoje.",
    resposta:
      "É pra isso que o ItaGameficaEdu existe. Você escolhe o tipo, a IA monta o conteúdo com gabarito em segundos e você já aplica — sem gastar a madrugada preparando material.",
  },
];

export function Objecoes() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-3xl font-extrabold text-neutral-900">
          Se bater alguma dessas dúvidas...
        </h2>
        <p className="mt-2 text-neutral-600">
          A gente já ouviu de outros professores. Veja o que muda na prática.
        </p>

        <div className="mt-8 space-y-6">
          {objecoes.map((item) => (
            <div key={item.duvida}>
              <div className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
                <span className="text-[#1a3fd4]">💬</span>
                <p className="font-semibold italic text-neutral-800">
                  &ldquo;{item.duvida}&rdquo;
                </p>
              </div>
              <div className="ml-4 mt-2 rounded-r-xl border-l-4 border-[#00c264] bg-[#00c264]/5 p-4">
                <p className="text-sm text-neutral-700">{item.resposta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
