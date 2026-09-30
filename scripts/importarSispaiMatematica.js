// Importa os resultados do SISPAI (Sistema Permanente de Avaliação de
// Itapipoca) de Matemática, 9º ano, CEITEC 2026 — vindos de
// _docs/spaece/REFORÇO ESPAECE226/ — pra dentro do banco do ItaGame.
//
// Fonte dos dados: dados-sispai-matematica.json (gerado a partir do xlsx
// "SISPAI_II_x_I_Resultados_Individuais" e do PDF "Relação de Alunos e
// Habilidades ... MT SISPAI 1"). Roda uma vez; é seguro rodar de novo
// (apaga e recria os registros do professor antes de inserir).
//
// Uso: node scripts/importarSispaiMatematica.js

const { PrismaClient } = require("@prisma/client");
const dados = require("./dados-sispai-matematica.json");

const prisma = new PrismaClient();

const EMAIL_PROFESSOR = "itagamificaedu@gmail.com";

const HABILIDADES_TURMA_RODADA_1 = [
  {
    trilha: "Probabilidade e Estatística",
    codigoSaeb: "9E2.3",
    codigoBncc: "EF09MA23",
    descricaoHabilidade: "Explicar/descrever os passos para a realização de uma pesquisa estatística ou de um levantamento.",
    percentualAcertoGeral: 100,
  },
  {
    trilha: "Probabilidade e Estatística",
    codigoSaeb: "9E1.5",
    codigoBncc: "EF07MA35",
    descricaoHabilidade: "Calcular os valores de medidas de tendência central de uma pesquisa estatística (média, moda ou mediana).",
    percentualAcertoGeral: 100,
  },
  {
    trilha: "Números e Operações",
    codigoSaeb: "9N2.3",
    codigoBncc: "EF09MA05",
    descricaoHabilidade: "Resolver problemas que envolvam porcentagens, acréscimos, decréscimos e percentuais sucessivos.",
    percentualAcertoGeral: 100,
  },
  {
    trilha: "Álgebra",
    codigoSaeb: "9A2.3",
    codigoBncc: "EF08MA08",
    descricaoHabilidade: "Resolver problemas representados por sistema de equações de 1º grau com duas incógnitas.",
    percentualAcertoGeral: 100,
  },
  {
    trilha: "Álgebra",
    codigoSaeb: "9A2.4",
    codigoBncc: "EF09MA09",
    descricaoHabilidade: "Resolver problemas representados por equações polinomiais de 2º grau.",
    percentualAcertoGeral: 100,
  },
  {
    trilha: "Geometria",
    codigoSaeb: "9A1.5",
    codigoBncc: "EF09MA16",
    descricaoHabilidade: "Associar uma equação polinomial de 1º grau com duas variáveis a uma reta no plano cartesiano.",
    percentualAcertoGeral: 100,
  },
  {
    trilha: "Geometria",
    codigoSaeb: "9G2.2",
    codigoBncc: "EF09MA17",
    descricaoHabilidade: "Construir/desenhar figuras geométricas planas ou espaciais que satisfaçam condições dadas.",
    percentualAcertoGeral: 100,
  },
  {
    trilha: "Geometria",
    codigoSaeb: "9G2.3",
    codigoBncc: "EF09MA11",
    descricaoHabilidade: "Resolver problemas envolvendo ângulos formados por retas paralelas cortadas por transversal, ou ângulos de polígonos.",
    percentualAcertoGeral: 100,
  },
  {
    trilha: "Geometria",
    codigoSaeb: "9G2.8",
    codigoBncc: "EF09MA16",
    descricaoHabilidade: "Determinar o ponto médio de um segmento de reta ou a distância entre dois pontos no plano cartesiano.",
    percentualAcertoGeral: 100,
  },
  {
    trilha: "Probabilidade e Estatística",
    codigoSaeb: "9E1.4",
    codigoBncc: "EF09MA22",
    descricaoHabilidade: "Interpretar o significado das medidas de tendência central (média, moda, mediana) ou da amplitude.",
    percentualAcertoGeral: 50,
  },
  {
    trilha: "Números e Operações",
    codigoSaeb: "9N1.3",
    codigoBncc: "EF09MA01",
    descricaoHabilidade: "Identificar números racionais ou irracionais (reconhecer segmentos de comprimento não racional).",
    percentualAcertoGeral: 0,
  },
  {
    trilha: "Geometria",
    codigoSaeb: "9G2.4",
    codigoBncc: "EF09MA14",
    descricaoHabilidade: "Resolver problemas envolvendo relações métricas do triângulo retângulo, incluindo o teorema de Pitágoras.",
    percentualAcertoGeral: 0,
  },
  {
    trilha: "Grandezas e Medidas",
    codigoSaeb: "9M2.4",
    codigoBncc: "EF09MA19",
    descricaoHabilidade: "Resolver problemas que envolvam volume de prismas retos ou cilindros retos.",
    percentualAcertoGeral: 0,
  },
  {
    trilha: "Grandezas e Medidas",
    codigoSaeb: "9M2.4",
    codigoBncc: "EF07MA30",
    descricaoHabilidade: "Resolver problemas de cálculo de volume de blocos retangulares (metro cúbico, decímetro cúbico, centímetro cúbico).",
    percentualAcertoGeral: 0,
  },
  {
    trilha: "Grandezas e Medidas",
    codigoSaeb: "9M2.1",
    codigoBncc: "EF09MA18",
    descricaoHabilidade: "Resolver problemas envolvendo medidas de grandezas com conversão entre unidades mais usuais.",
    percentualAcertoGeral: 0,
  },
  {
    trilha: "Geometria",
    codigoSaeb: "9G2.3",
    codigoBncc: "EF08MA17",
    descricaoHabilidade: "Aplicar os conceitos de mediatriz e bissetriz como lugares geométricos na resolução de problemas.",
    percentualAcertoGeral: 0,
  },
  {
    trilha: "Geometria",
    codigoSaeb: "9G2.4",
    codigoBncc: "EF09MA13",
    descricaoHabilidade: "Demonstrar relações métricas do triângulo retângulo, entre elas o teorema de Pitágoras.",
    percentualAcertoGeral: 0,
  },
  {
    trilha: "Números e Operações",
    codigoSaeb: "9N1.3",
    codigoBncc: "EF09MA02",
    descricaoHabilidade: "Reconhecer um número irracional como número real de representação decimal infinita e não periódica.",
    percentualAcertoGeral: 0,
  },
  {
    trilha: "Geometria",
    codigoSaeb: "9G1.10",
    codigoBncc: "EF07MA23",
    descricaoHabilidade: "Identificar relações entre ângulos formados por retas paralelas cortadas por uma transversal.",
    percentualAcertoGeral: 0,
  },
  {
    trilha: "Álgebra",
    codigoSaeb: "9G2.6",
    codigoBncc: "EF09MA08",
    descricaoHabilidade: "Resolver problemas envolvendo relações de proporcionalidade direta e inversa entre grandezas.",
    percentualAcertoGeral: 0,
  },
  {
    trilha: "Álgebra",
    codigoSaeb: "9A1.8",
    codigoBncc: "EF09MA06",
    descricaoHabilidade: "Associar uma representação de função afim ou quadrática a outra (tabular, algébrica, gráfica).",
    percentualAcertoGeral: 0,
  },
  {
    trilha: "Números e Operações",
    codigoSaeb: "9N2.1",
    codigoBncc: "EF09MA04",
    descricaoHabilidade: "Resolver problemas com números reais (adição, subtração, multiplicação, divisão, potenciação, radiciação), inclusive notação científica.",
    percentualAcertoGeral: 0,
  },
  {
    trilha: "Números e Operações",
    codigoSaeb: "9N2.1",
    codigoBncc: "EF08MA01",
    descricaoHabilidade: "Efetuar cálculos com potências de expoentes inteiros e aplicar na representação de números em notação científica.",
    percentualAcertoGeral: 0,
  },
  {
    trilha: "Probabilidade e Estatística",
    codigoSaeb: "9E2.4",
    codigoBncc: "EF09MA20",
    descricaoHabilidade: "Resolver problemas envolvendo a probabilidade de ocorrência de um resultado em eventos aleatórios independentes ou dependentes.",
    percentualAcertoGeral: 0,
  },
];

// Rodada 2 (SISPAI II) — extraído direto do painel oficial da SME
// (avaliacaoseducitapipoca.pythonanywhere.com/cpanel/escolas/alunos-habilidades),
// mais preciso e com códigos de questão que os PDFs não tinham.
const HABILIDADES_TURMA_RODADA_2 = [
  { trilha: "Probabilidade e Estatística", codigoSaeb: "9E2.3", codigoBncc: "EF09MA23", descricaoHabilidade: "Explicar/descrever os passos para a realização de uma pesquisa estatística ou de um levantamento.", percentualAcertoGeral: 90.36 },
  { trilha: "Álgebra", codigoSaeb: "9A2.4", codigoBncc: "EF09MA09", descricaoHabilidade: "Resolver problemas que possam ser representados por equações polinomiais de 2º grau.", percentualAcertoGeral: 83.13 },
  { trilha: "Números e Operações", codigoSaeb: "9N2.3", codigoBncc: "EF09MA05", descricaoHabilidade: "Resolver problemas que envolvam porcentagens, incluindo acréscimos e decréscimos simples e percentuais sucessivos.", percentualAcertoGeral: 77.71 },
  { trilha: "Geometria", codigoSaeb: "9G2.4", codigoBncc: "EF09MA13", descricaoHabilidade: "Resolver problemas envolvendo relações métricas do triângulo retângulo, incluindo o teorema de Pitágoras.", percentualAcertoGeral: 77.11 },
  { trilha: "Grandezas e Medidas", codigoSaeb: "9M2.4", codigoBncc: "EF07MA30", descricaoHabilidade: "Resolver problemas envolvendo volume de prismas retos ou cilindros retos.", percentualAcertoGeral: 75.3 },
  { trilha: "Geometria", codigoSaeb: "9G2.8", codigoBncc: "EF09MA16", descricaoHabilidade: "Determinar o ponto médio de um segmento de reta ou a distância entre dois pontos no plano cartesiano.", percentualAcertoGeral: 71.69 },
  { trilha: "Números e Operações", codigoSaeb: "9N2.1", codigoBncc: "EF09MA04", descricaoHabilidade: "Resolver problemas de adição, subtração, multiplicação, divisão, potenciação ou radiciação envolvendo números reais, inclusive notação científica.", percentualAcertoGeral: 69.28 },
  { trilha: "Geometria", codigoSaeb: "9G2.2", codigoBncc: "EF09MA17", descricaoHabilidade: "Construir/desenhar figuras geométricas planas ou espaciais que satisfaçam condições dadas.", percentualAcertoGeral: 64.46 },
  { trilha: "Geometria", codigoSaeb: "9G2.3", codigoBncc: "EF08MA17", descricaoHabilidade: "Resolver problemas envolvendo ângulos formados por retas paralelas, ou ângulos internos/externos de polígonos.", percentualAcertoGeral: 64.46 },
  { trilha: "Álgebra", codigoSaeb: "9A2.3", codigoBncc: "EF08MA08", descricaoHabilidade: "Resolver problemas representados por sistema de equações de 1º grau com duas incógnitas.", percentualAcertoGeral: 63.86 },
  { trilha: "Números e Operações", codigoSaeb: "9N2.1", codigoBncc: "EF08MA01", descricaoHabilidade: "Efetuar cálculos com potências de expoentes inteiros e aplicar na representação em notação científica.", percentualAcertoGeral: 63.25 },
  { trilha: "Probabilidade e Estatística", codigoSaeb: "9E1.5", codigoBncc: "EF07MA35", descricaoHabilidade: "Calcular os valores de medidas de tendência central de uma pesquisa estatística (média, moda ou mediana).", percentualAcertoGeral: 56.63 },
  { trilha: "Geometria", codigoSaeb: "9G1.10", codigoBncc: "EF07MA23", descricaoHabilidade: "Identificar relações entre ângulos formados por retas paralelas cortadas por uma transversal.", percentualAcertoGeral: 53.01 },
  { trilha: "Álgebra", codigoSaeb: "9G2.6", codigoBncc: "EF09MA08", descricaoHabilidade: "Resolver problemas envolvendo relações de proporcionalidade direta e inversa entre grandezas.", percentualAcertoGeral: 50.6 },
  { trilha: "Grandezas e Medidas", codigoSaeb: "9M2.1", codigoBncc: "EF09MA18", descricaoHabilidade: "Resolver problemas envolvendo medidas de grandezas com conversão entre unidades mais usuais.", percentualAcertoGeral: 47.59 },
  { trilha: "Geometria", codigoSaeb: "9G2.4", codigoBncc: "EF09MA14", descricaoHabilidade: "Resolver problemas de aplicação do teorema de Pitágoras ou relações de proporcionalidade envolvendo retas paralelas.", percentualAcertoGeral: 46.39 },
  { trilha: "Probabilidade e Estatística", codigoSaeb: "9E1.4", codigoBncc: "EF09MA22", descricaoHabilidade: "Interpretar o significado das medidas de tendência central (média, moda, mediana) ou da amplitude.", percentualAcertoGeral: 42.47 },
  { trilha: "Números e Operações", codigoSaeb: "9N1.3", codigoBncc: "EF09MA01", descricaoHabilidade: "Identificar números racionais ou irracionais (reconhecer segmentos de comprimento não racional).", percentualAcertoGeral: 36.14 },
  { trilha: "Geometria", codigoSaeb: "9G2.3", codigoBncc: "EF09MA11", descricaoHabilidade: "Resolver problemas envolvendo arcos, ângulos centrais e ângulos inscritos na circunferência.", percentualAcertoGeral: 28.92 },
  { trilha: "Grandezas e Medidas", codigoSaeb: "9M2.4", codigoBncc: "EF09MA19", descricaoHabilidade: "Resolver problemas que envolvam volume de prismas retos ou cilindros retos.", percentualAcertoGeral: 22.29 },
  { trilha: "Probabilidade e Estatística", codigoSaeb: "9E2.4", codigoBncc: "EF09MA20", descricaoHabilidade: "Reconhecer, em experimentos aleatórios, eventos independentes e dependentes e calcular a probabilidade de sua ocorrência.", percentualAcertoGeral: 21.39 },
  { trilha: "Números e Operações", codigoSaeb: "9N1.3", codigoBncc: "EF09MA02", descricaoHabilidade: "Reconhecer um número irracional como número real de representação decimal infinita e não periódica.", percentualAcertoGeral: 21.08 },
  { trilha: "Geometria", codigoSaeb: "9A1.5", codigoBncc: "EF09MA16", descricaoHabilidade: "Associar uma equação polinomial de 1º grau com duas variáveis a uma reta no plano cartesiano.", percentualAcertoGeral: 21.08 },
  { trilha: "Álgebra", codigoSaeb: "9A1.8", codigoBncc: "EF09MA06", descricaoHabilidade: "Associar uma representação de função afim ou quadrática a outra (tabular, algébrica, gráfica).", percentualAcertoGeral: 16.87 },
];

async function main() {
  const professor = await prisma.usuario.findUnique({ where: { email: EMAIL_PROFESSOR } });
  if (!professor) {
    throw new Error(`Professor com e-mail ${EMAIL_PROFESSOR} não encontrado — ajuste EMAIL_PROFESSOR no script.`);
  }

  await prisma.resultadoSispaiMatematica.deleteMany({ where: { professorId: professor.id } });
  await prisma.habilidadeSispaiMatematica.deleteMany({ where: { professorId: professor.id } });

  const registrosResultado = [];

  // Fonte: painel oficial da SME Itapipoca (avaliacaoseducitapipoca.pythonanywhere.com),
  // tela "Alunos e Habilidades" — dados mais completos e precisos que os PDFs,
  // com TRI/nível/padrão calculados pela Secretaria para as duas rodadas.
  for (const linha of dados) {
    if (linha.rodada1) {
      registrosResultado.push({
        turma: linha.turma,
        nomeAluno: linha.nome,
        rodada: 1,
        percentualAcerto: linha.rodada1.acerto,
        triScore: linha.rodada1.tri,
        nivel: linha.rodada1.nivel,
        padrao: linha.rodada1.padrao,
        professorId: professor.id,
      });
    }
    if (linha.rodada2) {
      registrosResultado.push({
        turma: linha.turma,
        nomeAluno: linha.nome,
        rodada: 2,
        percentualAcerto: linha.rodada2.acerto,
        triScore: linha.rodada2.tri,
        nivel: linha.rodada2.nivel,
        padrao: linha.rodada2.padrao,
        professorId: professor.id,
      });
    }
  }

  await prisma.resultadoSispaiMatematica.createMany({ data: registrosResultado });

  await prisma.habilidadeSispaiMatematica.createMany({
    data: [
      ...HABILIDADES_TURMA_RODADA_1.map((h) => ({ ...h, rodada: 1, professorId: professor.id })),
      ...HABILIDADES_TURMA_RODADA_2.map((h) => ({ ...h, rodada: 2, professorId: professor.id })),
    ],
  });

  const totalHabilidades = HABILIDADES_TURMA_RODADA_1.length + HABILIDADES_TURMA_RODADA_2.length;
  console.log(`Importados ${registrosResultado.length} resultados de alunos e ${totalHabilidades} habilidades mapeadas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
