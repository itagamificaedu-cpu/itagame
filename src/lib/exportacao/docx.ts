import "server-only";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import type { DadosAtividadeExport } from "./dados";

const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function cabecalho(dados: DadosAtividadeExport): Paragraph[] {
  return [
    new Paragraph({ text: dados.titulo, heading: HeadingLevel.HEADING_1 }),
    new Paragraph({
      children: [
        new TextRun({
          text: `${dados.disciplina} · ${dados.serie} · ${dados.tema}`,
          italics: true,
          color: "666666",
        }),
      ],
    }),
    new Paragraph({ text: "" }),
  ];
}

function paragrafosQuestoes(dados: DadosAtividadeExport): Paragraph[] {
  const paragrafos: Paragraph[] = [];

  dados.questoes.forEach((questao, indice) => {
    const item = dados.gabarito[indice];

    paragrafos.push(
      new Paragraph({
        children: [new TextRun({ text: `${indice + 1}. ${questao.enunciado}`, bold: true })],
        spacing: { before: 200 },
      })
    );

    if (questao.alternativas.length > 0) {
      questao.alternativas.forEach((alternativa) => {
        const correta = alternativa === item?.respostaCorreta;
        paragrafos.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: alternativa,
                bold: correta,
                color: correta ? "00854A" : "000000",
              }),
            ],
          })
        );
      });
    } else if (item?.respostaCorreta) {
      const texto =
        dados.tipo === "verdadeiro_falso"
          ? item.respostaCorreta === "verdadeiro"
            ? "Verdadeiro"
            : "Falso"
          : item.respostaCorreta;
      paragrafos.push(
        new Paragraph({
          children: [new TextRun({ text: `Resposta: ${texto}`, bold: true, color: "00854A" })],
        })
      );
    }

    if (item?.explicacao) {
      paragrafos.push(
        new Paragraph({ children: [new TextRun({ text: item.explicacao, italics: true, color: "666666" })] })
      );
    }
  });

  return paragrafos;
}

function conteudoAssociarColunas(dados: DadosAtividadeExport): (Paragraph | Table)[] {
  const linhas = dados.questoes.map(
    (questao, indice) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [new Paragraph(`${indice + 1}. ${questao.enunciado}`)],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [new Paragraph(`${LETRAS[indice]}. ${dados.colunaB?.[indice] ?? ""}`)],
          }),
        ],
      })
  );

  const gabarito = [
    new Paragraph({ text: "Gabarito", heading: HeadingLevel.HEADING_2, spacing: { before: 300 } }),
    ...dados.gabarito.map(
      (item, indice) => new Paragraph(`${indice + 1}. ${item.enunciado} → ${item.respostaCorreta}`)
    ),
  ];

  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Coluna A", bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Coluna B", bold: true })] })] }),
          ],
        }),
        ...linhas,
      ],
    }),
    ...gabarito,
  ];
}

function conteudoCacaPalavras(dados: DadosAtividadeExport): (Paragraph | Table)[] {
  const grade = dados.grade ?? [];

  const linhasGrade = grade.map(
    (linha) =>
      new TableRow({
        children: linha.map(
          (letra) =>
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: letra, font: "Courier New" })] })],
            })
        ),
      })
  );

  const dicas = [
    new Paragraph({ text: "Dicas", heading: HeadingLevel.HEADING_2, spacing: { before: 300 } }),
    ...dados.questoes.map((questao, indice) => new Paragraph(`${indice + 1}. ${questao.enunciado}`)),
  ];

  const gabarito = [
    new Paragraph({ text: "Gabarito", heading: HeadingLevel.HEADING_2, spacing: { before: 300 } }),
    ...dados.gabarito.map((item) => new Paragraph(`${item.enunciado} → ${item.respostaCorreta}`)),
  ];

  return [new Table({ rows: linhasGrade }), ...dicas, ...gabarito];
}

function conteudoApresentacao(dados: DadosAtividadeExport): Paragraph[] {
  const paragrafos: Paragraph[] = [];

  dados.questoes.forEach((slide, indice) => {
    paragrafos.push(
      new Paragraph({
        text: `Slide ${indice + 1}: ${slide.enunciado}`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300 },
      })
    );

    slide.alternativas.forEach((topico) => {
      paragrafos.push(new Paragraph({ bullet: { level: 0 }, text: topico }));
    });

    const falaSugerida = dados.gabarito[indice]?.respostaCorreta;
    if (falaSugerida) {
      paragrafos.push(
        new Paragraph({
          children: [new TextRun({ text: `Fala sugerida: ${falaSugerida}`, italics: true, color: "666666" })],
          spacing: { before: 100 },
        })
      );
    }
  });

  return paragrafos;
}

export async function gerarDocx(dados: DadosAtividadeExport): Promise<Buffer> {
  let corpo: (Paragraph | Table)[];

  if (dados.tipo === "associar_colunas") {
    corpo = conteudoAssociarColunas(dados);
  } else if (dados.tipo === "caca_palavras") {
    corpo = conteudoCacaPalavras(dados);
  } else if (dados.tipo === "apresentacao") {
    corpo = conteudoApresentacao(dados);
  } else {
    corpo = paragrafosQuestoes(dados);
  }

  const documento = new Document({
    sections: [{ children: [...cabecalho(dados), ...corpo] }],
  });

  return Packer.toBuffer(documento);
}
