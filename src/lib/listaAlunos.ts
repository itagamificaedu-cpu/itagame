// Lê uma lista de alunos colada direto do Word/Excel/WhatsApp (um nome por
// linha, com ou sem número na frente) e devolve só os nomes limpos.
// Roda no servidor e no navegador (a prévia da tela usa a mesma função).

const LINHA_DE_TITULO = /^(turma|hor[aá]rio|sala|nome|aluno|alunos|n[º°o]\.?|n\s*º|lista|s[ée]rie|ano)\b/i;

function semAcento(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function chaveDeNome(nome: string) {
  return semAcento(nome).toLowerCase().replace(/\s+/g, " ").trim();
}

export function extrairNomesDaLista(texto: string): string[] {
  const nomes: string[] = [];

  for (const linhaBruta of texto.split(/\r?\n/)) {
    // Linha de tabela do Word vem como "01<TAB>NOME": pega a primeira célula
    // que tenha letra e ignora as que são só número.
    const celulas = linhaBruta.split("\t").map((c) => c.trim()).filter(Boolean);
    let nome = celulas.find((c) => /\p{L}/u.test(c)) ?? "";

    // Tira numeração na frente: "01 ", "1.", "2 -", "3)"
    nome = nome.replace(/^\d+\s*[.\-–)]*\s*/, "").replace(/\s+/g, " ").trim();

    if (!nome || !/\p{L}/u.test(nome)) continue;
    if (LINHA_DE_TITULO.test(nome)) continue;

    nomes.push(nome.slice(0, 200));
  }

  // Tira repetidos dentro da própria lista colada.
  const vistos = new Set<string>();
  return nomes.filter((nome) => {
    const chave = chaveDeNome(nome);
    if (vistos.has(chave)) return false;
    vistos.add(chave);
    return true;
  });
}
