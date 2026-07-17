import "server-only";
import PptxGenJS from "pptxgenjs";
import type { DadosAtividadeExport } from "./dados";

const AZUL = "1A3FD4";
const VERDE = "00854A";
const CINZA = "666666";

const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function slideCapa(pptx: PptxGenJS, dados: DadosAtividadeExport) {
  const slide = pptx.addSlide();
  slide.background = { color: AZUL };
  slide.addText(dados.titulo, {
    x: 0.5,
    y: 2,
    w: 9,
    h: 1.5,
    fontSize: 32,
    bold: true,
    color: "FFFFFF",
    align: "center",
  });
  slide.addText(`${dados.disciplina} · ${dados.serie} · ${dados.tema}`, {
    x: 0.5,
    y: 3.5,
    w: 9,
    h: 0.6,
    fontSize: 16,
    color: "FFFFFF",
    align: "center",
  });
}

function slidesQuestoes(pptx: PptxGenJS, dados: DadosAtividadeExport) {
  dados.questoes.forEach((questao, indice) => {
    const item = dados.gabarito[indice];
    const slide = pptx.addSlide();

    slide.addText(`${indice + 1}. ${questao.enunciado}`, {
      x: 0.5,
      y: 0.4,
      w: 9,
      h: 1.2,
      fontSize: 22,
      bold: true,
      color: "1A1A1A",
    });

    if (questao.alternativas.length > 0) {
      const linhas = questao.alternativas.map((alternativa) => ({
        text: alternativa,
        options: {
          bullet: true,
          color: alternativa === item?.respostaCorreta ? VERDE : "333333",
          bold: alternativa === item?.respostaCorreta,
        },
      }));
      slide.addText(linhas, { x: 0.7, y: 1.8, w: 8.5, h: 3, fontSize: 18 });
    } else if (item?.respostaCorreta) {
      const texto =
        dados.tipo === "verdadeiro_falso"
          ? item.respostaCorreta === "verdadeiro"
            ? "Verdadeiro"
            : "Falso"
          : item.respostaCorreta;
      slide.addText(`Resposta: ${texto}`, {
        x: 0.7,
        y: 1.8,
        w: 8.5,
        h: 0.8,
        fontSize: 20,
        bold: true,
        color: VERDE,
      });
    }

    if (item?.explicacao) {
      slide.addText(item.explicacao, { x: 0.7, y: 4.5, w: 8.5, h: 1, fontSize: 14, italic: true, color: CINZA });
    }
  });
}

function slideAssociarColunas(pptx: PptxGenJS, dados: DadosAtividadeExport) {
  const slide = pptx.addSlide();
  slide.addText("Associe as colunas", { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 22, bold: true });

  const linhas = dados.questoes.map((questao, indice) => [
    { text: `${indice + 1}. ${questao.enunciado}`, options: { fontSize: 14 } },
    { text: `${LETRAS[indice]}. ${dados.colunaB?.[indice] ?? ""}`, options: { fontSize: 14 } },
  ]);

  slide.addTable(linhas, { x: 0.5, y: 1, w: 9, h: 4, border: { type: "solid", color: "CCCCCC", pt: 1 } });

  const gabaritoSlide = pptx.addSlide();
  gabaritoSlide.addText("Gabarito", { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 22, bold: true });
  gabaritoSlide.addText(
    dados.gabarito.map((item, indice) => ({
      text: `${indice + 1}. ${item.enunciado} → ${item.respostaCorreta}`,
      options: { breakLine: true, fontSize: 14 },
    })),
    { x: 0.5, y: 1, w: 9, h: 4 }
  );
}

function slideCacaPalavras(pptx: PptxGenJS, dados: DadosAtividadeExport) {
  const grade = dados.grade ?? [];
  const slide = pptx.addSlide();
  slide.addText("Caça-palavras", { x: 0.5, y: 0.2, w: 9, h: 0.5, fontSize: 20, bold: true });

  const linhas = grade.map((linha) =>
    linha.map((letra) => ({ text: letra, options: { fontSize: 9, fontFace: "Courier New" } }))
  );
  slide.addTable(linhas, { x: 0.5, y: 0.8, w: 9, h: 5, autoPage: false });

  const dicasSlide = pptx.addSlide();
  dicasSlide.addText("Dicas", { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 22, bold: true });
  dicasSlide.addText(
    dados.questoes.map((questao, indice) => ({
      text: `${indice + 1}. ${questao.enunciado}`,
      options: { breakLine: true, fontSize: 14 },
    })),
    { x: 0.5, y: 1, w: 9, h: 4.5 }
  );
}

function slidesApresentacao(pptx: PptxGenJS, dados: DadosAtividadeExport) {
  dados.questoes.forEach((slideConteudo, indice) => {
    const slide = pptx.addSlide();
    slide.addText(slideConteudo.enunciado, {
      x: 0.5,
      y: 0.4,
      w: 9,
      h: 1,
      fontSize: 26,
      bold: true,
      color: AZUL,
    });

    slide.addText(
      slideConteudo.alternativas.map((topico) => ({ text: topico, options: { bullet: true, breakLine: true } })),
      { x: 0.7, y: 1.6, w: 8.5, h: 3.5, fontSize: 18 }
    );

    const falaSugerida = dados.gabarito[indice]?.respostaCorreta;
    if (falaSugerida) {
      slide.addNotes(falaSugerida);
    }
  });
}

export async function gerarPptx(dados: DadosAtividadeExport): Promise<Buffer> {
  const pptx = new PptxGenJS();
  slideCapa(pptx, dados);

  if (dados.tipo === "associar_colunas") {
    slideAssociarColunas(pptx, dados);
  } else if (dados.tipo === "caca_palavras") {
    slideCacaPalavras(pptx, dados);
  } else if (dados.tipo === "apresentacao") {
    slidesApresentacao(pptx, dados);
  } else {
    slidesQuestoes(pptx, dados);
  }

  const resultado = await pptx.write({ outputType: "nodebuffer" });
  return resultado as Buffer;
}
