import "server-only";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { DadosAtividadeExport } from "./dados";

const MARGEM = 50;
const LARGURA_PAGINA = 595.28;
const ALTURA_PAGINA = 841.89;
const LARGURA_UTIL = LARGURA_PAGINA - MARGEM * 2;

const AZUL = rgb(0.102, 0.247, 0.831);
const VERDE = rgb(0, 0.522, 0.294);
const CINZA = rgb(0.4, 0.4, 0.4);
const PRETO = rgb(0.1, 0.1, 0.1);

const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const CARACTERES_WINANSI_EXTRA = new Set([
  "–",
  "—",
  "‘",
  "’",
  "“",
  "”",
  "…",
  "•",
]);

function sanitizarParaWinAnsi(texto: string): string {
  return Array.from(texto)
    .map((caractere) => {
      const codigo = caractere.codePointAt(0) ?? 0;
      if (codigo <= 0x017f || CARACTERES_WINANSI_EXTRA.has(caractere)) return caractere;
      return "?";
    })
    .join("");
}

class EscritorPdf {
  doc: PDFDocument;
  fonte: PDFFont;
  fonteNegrito: PDFFont;
  fonteMono: PDFFont;
  pagina!: PDFPage;
  y = 0;

  constructor(doc: PDFDocument, fonte: PDFFont, fonteNegrito: PDFFont, fonteMono: PDFFont) {
    this.doc = doc;
    this.fonte = fonte;
    this.fonteNegrito = fonteNegrito;
    this.fonteMono = fonteMono;
    this.novaPagina();
  }

  novaPagina() {
    this.pagina = this.doc.addPage([LARGURA_PAGINA, ALTURA_PAGINA]);
    this.y = ALTURA_PAGINA - MARGEM;
  }

  garantirEspaco(altura: number) {
    if (this.y - altura < MARGEM) {
      this.novaPagina();
    }
  }

  linha(
    texto: string,
    opcoes: { tamanho?: number; negrito?: boolean; cor?: ReturnType<typeof rgb>; recuo?: number; fonte?: PDFFont } = {}
  ) {
    const tamanho = opcoes.tamanho ?? 11;
    const fonte = opcoes.fonte ?? (opcoes.negrito ? this.fonteNegrito : this.fonte);
    const cor = opcoes.cor ?? PRETO;
    const recuo = opcoes.recuo ?? 0;
    const larguraDisponivel = LARGURA_UTIL - recuo;

    const palavras = sanitizarParaWinAnsi(texto).split(" ");
    let linhaAtual = "";

    const desenharLinhaAtual = () => {
      this.garantirEspaco(tamanho + 6);
      this.pagina.drawText(linhaAtual, { x: MARGEM + recuo, y: this.y, size: tamanho, font: fonte, color: cor });
      this.y -= tamanho + 6;
    };

    for (const palavra of palavras) {
      const tentativa = linhaAtual ? `${linhaAtual} ${palavra}` : palavra;
      if (fonte.widthOfTextAtSize(tentativa, tamanho) > larguraDisponivel && linhaAtual) {
        desenharLinhaAtual();
        linhaAtual = palavra;
      } else {
        linhaAtual = tentativa;
      }
    }
    if (linhaAtual) desenharLinhaAtual();
  }

  espaco(altura = 10) {
    this.y -= altura;
  }
}

function cabecalho(escritor: EscritorPdf, dados: DadosAtividadeExport) {
  escritor.linha(dados.titulo, { tamanho: 20, negrito: true, cor: AZUL });
  escritor.linha(`${dados.disciplina} · ${dados.serie} · ${dados.tema}`, { tamanho: 11, cor: CINZA });
  escritor.espaco(14);
}

function questoes(escritor: EscritorPdf, dados: DadosAtividadeExport) {
  dados.questoes.forEach((questao, indice) => {
    const item = dados.gabarito[indice];
    escritor.espaco(6);
    escritor.linha(`${indice + 1}. ${questao.enunciado}`, { negrito: true });

    if (questao.alternativas.length > 0) {
      questao.alternativas.forEach((alternativa) => {
        const correta = alternativa === item?.respostaCorreta;
        escritor.linha(`• ${alternativa}`, { recuo: 16, negrito: correta, cor: correta ? VERDE : PRETO });
      });
    } else if (item?.respostaCorreta) {
      const texto =
        dados.tipo === "verdadeiro_falso"
          ? item.respostaCorreta === "verdadeiro"
            ? "Verdadeiro"
            : "Falso"
          : item.respostaCorreta;
      escritor.linha(`Resposta: ${texto}`, { recuo: 16, negrito: true, cor: VERDE });
    }

    if (item?.explicacao) {
      escritor.linha(item.explicacao, { recuo: 16, tamanho: 10, cor: CINZA });
    }
  });
}

function associarColunas(escritor: EscritorPdf, dados: DadosAtividadeExport) {
  escritor.linha("Coluna A", { negrito: true, tamanho: 13 });
  dados.questoes.forEach((questao, indice) => {
    escritor.linha(`${indice + 1}. ${questao.enunciado}`, { recuo: 10 });
  });

  escritor.espaco(10);
  escritor.linha("Coluna B", { negrito: true, tamanho: 13 });
  (dados.colunaB ?? []).forEach((definicao, indice) => {
    escritor.linha(`${LETRAS[indice]}. ${definicao}`, { recuo: 10 });
  });

  escritor.espaco(14);
  escritor.linha("Gabarito", { negrito: true, tamanho: 13 });
  dados.gabarito.forEach((item, indice) => {
    escritor.linha(`${indice + 1}. ${item.enunciado} -> ${item.respostaCorreta}`, { recuo: 10, tamanho: 10, cor: CINZA });
  });
}

function cacaPalavras(escritor: EscritorPdf, dados: DadosAtividadeExport) {
  const grade = dados.grade ?? [];
  const tamanhoFonte = grade.length > 15 ? 7 : 9;

  grade.forEach((linhaGrade) => {
    escritor.linha(linhaGrade.join(" "), { fonte: escritor.fonteMono, tamanho: tamanhoFonte });
  });

  escritor.espaco(14);
  escritor.linha("Dicas", { negrito: true, tamanho: 13 });
  dados.questoes.forEach((questao, indice) => {
    escritor.linha(`${indice + 1}. ${questao.enunciado}`, { recuo: 10 });
  });

  escritor.espaco(14);
  escritor.linha("Gabarito", { negrito: true, tamanho: 13 });
  dados.gabarito.forEach((item) => {
    escritor.linha(`${item.enunciado} -> ${item.respostaCorreta}`, { recuo: 10, tamanho: 10, cor: CINZA });
  });
}

function apresentacao(escritor: EscritorPdf, dados: DadosAtividadeExport) {
  dados.questoes.forEach((slide, indice) => {
    escritor.espaco(10);
    escritor.linha(`Slide ${indice + 1}: ${slide.enunciado}`, { negrito: true, tamanho: 13, cor: AZUL });
    slide.alternativas.forEach((topico) => {
      escritor.linha(`• ${topico}`, { recuo: 16 });
    });

    const falaSugerida = dados.gabarito[indice]?.respostaCorreta;
    if (falaSugerida) {
      escritor.linha(`Fala sugerida: ${falaSugerida}`, { recuo: 16, tamanho: 10, cor: CINZA });
    }
  });
}

export async function gerarPdf(dados: DadosAtividadeExport): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const fonte = await doc.embedFont(StandardFonts.Helvetica);
  const fonteNegrito = await doc.embedFont(StandardFonts.HelveticaBold);
  const fonteMono = await doc.embedFont(StandardFonts.Courier);

  const escritor = new EscritorPdf(doc, fonte, fonteNegrito, fonteMono);
  cabecalho(escritor, dados);

  if (dados.tipo === "associar_colunas") {
    associarColunas(escritor, dados);
  } else if (dados.tipo === "caca_palavras") {
    cacaPalavras(escritor, dados);
  } else if (dados.tipo === "apresentacao") {
    apresentacao(escritor, dados);
  } else {
    questoes(escritor, dados);
  }

  return doc.save();
}
