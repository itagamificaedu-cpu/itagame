// Mostra a alternativa com a letra na frente ("A) ...", "B) ..."), como na
// prova impressa. Só muda o que aparece na tela: a resposta enviada e o
// gabarito continuam sendo o texto original. Se o texto já vier com a letra
// (ex.: "A) 140" ou só "A)"), não repete.
export function rotuloAlternativa(texto: string, indice: number): string {
  if (/^\(?[A-Da-d]\)(\s|$)/.test(texto)) return texto;
  return `${String.fromCharCode(65 + indice)}) ${texto}`;
}
