// Catálogo dos jogos externos disponíveis (exports HTML5 hospedados fora do domínio
// do painel, ex: Construct 2). Fonte única — usado tanto pra listar as opções em
// /painel/jogos quanto pra montar o link que o professor compartilha com a turma.
export const JOGOS_EXTERNOS = [
  {
    slug: "ita3climas",
    nome: "Cidade dos 3 Climas",
    url: "https://itatecnologiaeducacional.tech/jogos/ita3climas/index.html",
  },
];

export function urlJogoExterno(slug: string) {
  return JOGOS_EXTERNOS.find((j) => j.slug === slug)?.url ?? null;
}
