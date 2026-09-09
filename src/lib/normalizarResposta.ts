// Normaliza uma resposta digitada em texto livre (completar frase, associar
// colunas) pra comparar com o gabarito sem travar por acento, maiúscula/
// minúscula, espaço a mais ou pontuação — bem mais tolerante que o
// normalizarPalavra() dos geradores (que remove tudo que não é letra, então
// não serve pra frases/expressões com números ou espaços que importam).
export function normalizarResposta(texto: string): string {
  return Array.from(texto.trim().toLowerCase().normalize("NFD"))
    .filter((caractere) => {
      const codigo = caractere.codePointAt(0) ?? 0;
      return !(codigo >= 0x0300 && codigo <= 0x036f);
    })
    .join("")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
