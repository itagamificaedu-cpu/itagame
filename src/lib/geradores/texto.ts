export function normalizarPalavra(palavra: string): string {
  const semAcentos = Array.from(palavra.normalize("NFD"))
    .filter((caractere) => {
      const codigo = caractere.codePointAt(0) ?? 0;
      return !(codigo >= 0x0300 && codigo <= 0x036f);
    })
    .join("");
  return semAcentos.replace(/[^A-Za-z]/g, "").toUpperCase();
}
