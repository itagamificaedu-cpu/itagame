// Cria (ou atualiza) o "Simulado SISPAI 2025.2 — 9º ano" de Matemática na
// conta do professor, com as 26 questões do Bloco 2 (questões 27 a 52) do
// Caderno do Estudante do SISPAI 2025.2 — public/materiais/SISPAI2.2.
//
// O caderno não vem com gabarito: cada resposta abaixo foi resolvida e
// conferida uma a uma (ver "explicacao"). As figuras da prova foram
// recortadas do PDF e ficam em public/materiais/sispai-2025-2-9ano/qNN.png.
// As alternativas ficam na MESMA ordem da prova (A, B, C, D), igual ao
// caderno que o aluno recebe.
//
// O tema leva "(SPAECE)" de propósito: assim o resultado da turma jogando
// na Sala Ao Vivo já aparece em /painel/spaece/resultados-matematica.
//
// Uso: node scripts/criarSimuladoSispai9Ano.js

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

const EMAIL_PROFESSOR = "itagamificaedu@gmail.com";
const TEMA = "SISPAI 2025.2 — 9º ano (SPAECE) — Simulado";
const FIGURAS = "/materiais/sispai-2025-2-9ano";
const ABCD = ["(A)", "(B)", "(C)", "(D)"];

const QUESTOES = [
  {
    numero: 27,
    enunciado: "Observe o sólido geométrico representado na figura. Uma planificação desse sólido geométrico está apresentada em qual alternativa?",
    imagem: "q27.png",
    alternativas: ABCD,
    respostaCorreta: "(B)",
    explicacao: "O sólido é um bloco retangular de base quadrada: 4 faces laterais retangulares e 2 bases quadradas, uma de cada lado da faixa. Só a (B) tem as 6 faces nessa posição.",
  },
  {
    numero: 28,
    enunciado: "A figura representa uma peça de madeira em que um dos lados mede 20 cm e cada um dos ângulos assinalados mede 50°. Nessa peça, quanto mede o lado indicado pela letra x?",
    imagem: "q28.png",
    alternativas: ["20 cm", "30 cm", "50 cm", "70 cm"],
    respostaCorreta: "20 cm",
    explicacao: "Os dois ângulos da base são iguais (50°), então o triângulo é isósceles e os lados opostos a eles também são iguais: x = 20 cm.",
  },
  {
    numero: 29,
    enunciado: "Lara subiu pela Rua F e entrou na Avenida Principal. Ao entrar na Avenida Principal, Lara caminhou até a terceira entrada à sua esquerda, chegando ao local desejado. Em qual local Lara entrou?",
    imagem: "q29.png",
    alternativas: ["Casa 1", "Casa 4", "Escola", "Farmácia"],
    respostaCorreta: "Farmácia",
    explicacao: "Andando pela avenida para a direita do mapa, a esquerda de Lara é o lado de cima: Padaria (1ª), Casa 1 (2ª) e Farmácia (3ª).",
  },
  {
    numero: 30,
    enunciado: "Durante a reforma de uma cobertura, a empreiteira instalou uma rampa de madeira para depositar o entulho direto na caçamba, conforme o desenho. Qual é a medida x do comprimento de madeira utilizada para a construção dessa rampa?",
    imagem: "q30.png",
    alternativas: ["10 m", "14 m", "50 m", "100 m"],
    respostaCorreta: "10 m",
    explicacao: "Teorema de Pitágoras: x² = 8² + 6² = 64 + 36 = 100, logo x = 10 m.",
  },
  {
    numero: 31,
    enunciado: "Na circunferência da figura, o segmento GH representa o diâmetro e o segmento EF representa o raio. Qual é a relação entre as medidas dos segmentos EF e GH?",
    imagem: "q31.png",
    alternativas: [
      "med (EF) é o dobro da med (GH)",
      "med (EF) é a terça parte da med (GH)",
      "med (EF) é igual à med (GH)",
      "med (EF) é a metade da med (GH)",
    ],
    respostaCorreta: "med (EF) é a metade da med (GH)",
    explicacao: "O raio sempre mede a metade do diâmetro.",
  },
  {
    numero: 32,
    enunciado: "Heloísa mediu sua altura e descobriu que tem 1,64 metros. Qual é essa altura em centímetros?",
    alternativas: ["0,164 cm", "16,4 cm", "164 cm", "1640 cm"],
    respostaCorreta: "164 cm",
    explicacao: "1 m = 100 cm, então 1,64 × 100 = 164 cm.",
  },
  {
    numero: 33,
    enunciado: "Observe as figuras I e II na malha quadriculada. Ao reduzir as medidas da Figura I pela metade, obtém-se a Figura II. Nessas condições, a medida do perímetro da Figura II corresponde",
    imagem: "q33.png",
    alternativas: [
      "à metade da medida do perímetro da Figura I",
      "à mesma medida do perímetro da Figura I",
      "ao dobro da medida do perímetro da Figura I",
      "ao quádruplo da medida do perímetro da Figura I",
    ],
    respostaCorreta: "à metade da medida do perímetro da Figura I",
    explicacao: "Figura I: 6 × 4, perímetro 20. Figura II: 3 × 2, perímetro 10. Lados pela metade, perímetro pela metade.",
  },
  {
    numero: 34,
    enunciado: "Marta gasta 150 mililitros de leite de coco para fazer uma receita de um doce. Ela precisa fazer 10 receitas. Quantos litros de leite de coco Marta precisa utilizar para fazer essas 10 receitas?",
    alternativas: ["0,15", "1,5", "150", "1 500"],
    respostaCorreta: "1,5",
    explicacao: "150 mL × 10 = 1 500 mL = 1,5 L.",
  },
  {
    numero: 35,
    enunciado: "Aurora está construindo uma piscina com o fundo no formato e nas dimensões da malha quadriculada (cada quadradinho tem 1 m de lado). De quantos metros quadrados de revestimento, no mínimo, Aurora irá precisar para cobrir todo o fundo dessa piscina?",
    imagem: "q35.png",
    alternativas: ["24 m²", "26 m²", "28 m²", "30 m²"],
    respostaCorreta: "26 m²",
    explicacao: "Retângulo 4 × 5 = 20 m² mais o trapézio da direita (bases 5 e 1, altura 2): (5 + 1) × 2 ÷ 2 = 6 m². Total: 26 m².",
  },
  {
    numero: 36,
    enunciado: "Gabriele confeccionou um cubo e preencheu totalmente o seu interior com um líquido brilhante. A medida interna da aresta desse cubo está na figura. Quantos centímetros cúbicos de líquido, no mínimo, Gabriele utilizou para encher esse cubo?",
    imagem: "q36.png",
    alternativas: ["30 cm³", "110 cm³", "400 cm³", "1 000 cm³"],
    respostaCorreta: "1 000 cm³",
    explicacao: "Volume do cubo = aresta³ = 10 × 10 × 10 = 1 000 cm³.",
  },
  {
    numero: 37,
    enunciado: "Patrícia vende, em média, 50 quilogramas de comida por dia em seu restaurante. Em média, quantos gramas de comida são vendidos nesse restaurante diariamente?",
    alternativas: ["50 g", "500 g", "5 000 g", "50 000 g"],
    respostaCorreta: "50 000 g",
    explicacao: "1 kg = 1 000 g, então 50 × 1 000 = 50 000 g.",
  },
  {
    numero: 38,
    enunciado: "Observe a reta numérica, que está dividida em partes iguais. Qual é o número que o ponto P representa nessa reta?",
    imagem: "q38.png",
    alternativas: ["– 30", "– 17", "– 6", "– 3"],
    respostaCorreta: "– 6",
    explicacao: "De –18 até 42 são 60 unidades em 5 partes iguais: cada parte vale 12. P está uma parte depois de –18: –18 + 12 = –6.",
  },
  {
    numero: 39,
    enunciado: "Observe o ponto N destacado na reta numérica, que está dividida em partes iguais. O ponto N indica a localização de qual número nessa reta?",
    imagem: "q39.png",
    alternativas: ["1/2", "6/2", "7/2", "9/2"],
    respostaCorreta: "7/2",
    explicacao: "De 3/2 até 5/2 há 2 partes, então cada parte vale 1/2. N está 2 partes depois de 5/2: 5/2 + 2/2 = 7/2.",
  },
  {
    numero: 40,
    enunciado: "Marina encomendou 705 salgadinhos e recebeu a encomenda em 15 caixas, todas com a mesma quantidade. Quantos salgadinhos havia em cada caixa?",
    alternativas: ["5", "15", "47", "720"],
    respostaCorreta: "47",
    explicacao: "705 ÷ 15 = 47.",
  },
  {
    numero: 41,
    enunciado: "Observe os números decimais: 7,102 — 7,12 — 6,095 — 6,59. Entre esses números decimais, qual é o menor?",
    alternativas: ["7,102", "7,12", "6,095", "6,59"],
    respostaCorreta: "6,095",
    explicacao: "Os menores inteiros são os 6. Comparando 6,095 e 6,59: na casa dos décimos, 0 < 5, então 6,095 é o menor.",
  },
  {
    numero: 42,
    enunciado: "Qual é o resultado da operação 1/8 + 5/6?",
    alternativas: ["1/4", "1/8", "3/7", "23/24"],
    respostaCorreta: "23/24",
    explicacao: "MMC(8, 6) = 24: 1/8 = 3/24 e 5/6 = 20/24. Soma: 23/24.",
  },
  {
    numero: 43,
    enunciado: "Em uma feira, cada livro de medicina é vendido por 200 reais. No último dia, esses livros serão vendidos com um desconto de 70% sobre esse valor. Qual será o valor de venda desses livros no último dia da feira?",
    alternativas: ["60 reais", "70 reais", "130 reais", "140 reais"],
    respostaCorreta: "60 reais",
    explicacao: "70% de 200 = 140 de desconto. 200 – 140 = 60 reais.",
  },
  {
    numero: 44,
    enunciado: "Um arquiteto cobra um valor fixo de 500 reais, mais 8 reais por metro quadrado de construção. Por um projeto, ele recebeu 1 460 reais. A equação que permite calcular quantos metros quadrados tem esse projeto é",
    alternativas: ["1 460 = 8x", "1 460 = 8x + 500", "1 460 = 500x", "1 460 = 508x + 500"],
    respostaCorreta: "1 460 = 8x + 500",
    explicacao: "Total = parte variável (8 por m², ou 8x) + parte fixa (500).",
  },
  {
    numero: 45,
    enunciado: "Em um campeonato eletrônico de futebol, a pontuação final é calculada pela expressão 3E + 5V – 2D, em que E é a quantidade de empates, V de vitórias e D de derrotas. Mônica obteve 6 empates, 1 vitória e 3 derrotas. Qual foi a pontuação final de Mônica?",
    alternativas: ["10 pontos", "17 pontos", "27 pontos", "29 pontos"],
    respostaCorreta: "17 pontos",
    explicacao: "3 × 6 + 5 × 1 – 2 × 3 = 18 + 5 – 6 = 17.",
  },
  {
    numero: 46,
    enunciado: "Qual é o valor numérico da expressão x² + 3y quando x = 3 e y = 1?",
    alternativas: ["– 10", "– 6", "9", "12"],
    respostaCorreta: "12",
    explicacao: "3² + 3 × 1 = 9 + 3 = 12.",
  },
  {
    numero: 47,
    enunciado: "Uma loja estimou vender a mesma quantidade de pares de um novo sapato em cada uma das duas primeiras semanas. Na primeira semana vendeu o dobro do estimado e, na segunda, o quadrado do estimado, totalizando 24 pares nas duas semanas. Qual foi a quantidade de pares que a loja estimou vender em cada semana?",
    alternativas: ["4", "5", "6", "8"],
    respostaCorreta: "4",
    explicacao: "2x + x² = 24. Testando x = 4: 8 + 16 = 24.",
  },
  {
    numero: 48,
    enunciado: "Camila tem uma pizzaria e paga seus entregadores por semana. Observe os dois gráficos: taxa de entrega por região e pedidos por região na última semana. Quanto Camila vai pagar pelas entregas dessa semana feitas na região sul?",
    imagem: "q48.png",
    alternativas: ["30 reais", "90 reais", "125 reais", "690 reais"],
    respostaCorreta: "90 reais",
    explicacao: "Região sul: taxa de 10 reais × 9 pedidos = 90 reais.",
  },
  {
    numero: 49,
    enunciado: "A tabela mostra a distribuição da população brasileira por regiões (censo 2010). Qual dos gráficos de setores melhor representa os dados dessa tabela?",
    imagem: "q49.png",
    alternativas: ABCD,
    respostaCorreta: "(A)",
    explicacao: "Sudeste é o maior setor (quase metade), Nordeste o segundo, e Norte e Centro-Oeste os menores. Só o gráfico (A) mantém essa ordem.",
  },
  {
    numero: 50,
    enunciado: "José obteve dos jurados as pontuações 76, 74, 82, 74 e 90 em uma apresentação. Qual é a pontuação média obtida por José nessa apresentação?",
    alternativas: ["74", "76", "79,2", "80,5"],
    respostaCorreta: "79,2",
    explicacao: "(76 + 74 + 82 + 74 + 90) ÷ 5 = 396 ÷ 5 = 79,2.",
  },
  {
    numero: 51,
    enunciado: "Os alunos pesquisaram o tempo médio de vida de alguns animais (tabela). Qual é o gráfico que melhor representa os dados dessa tabela?",
    imagem: "q51.png",
    alternativas: ABCD,
    respostaCorreta: "(A)",
    explicacao: "Cavalo 30, Chimpanzé 20, Galinha 7 e Gato 13: só o gráfico (A) tem as colunas nessas alturas.",
  },
  {
    numero: 52,
    enunciado: "Uma academia ofereceu aulas de dança e ioga em três turnos. A tabela mostra o número de inscritos em cada turno. Qual foi o total de alunos inscritos no turno da noite?",
    imagem: "q52.png",
    alternativas: ["22", "34", "47", "87"],
    respostaCorreta: "34",
    explicacao: "Noite: 22 (dança) + 12 (ioga) = 34.",
  },
];

async function main() {
  // Conferência antes de gravar: toda resposta precisa estar nas alternativas.
  for (const q of QUESTOES) {
    if (!q.alternativas.includes(q.respostaCorreta) || new Set(q.alternativas).size !== q.alternativas.length) {
      throw new Error(`Questão ${q.numero}: gabarito fora das alternativas ou alternativa repetida.`);
    }
  }

  const professor = await prisma.usuario.findUnique({ where: { email: EMAIL_PROFESSOR } });
  if (!professor) throw new Error(`Professor ${EMAIL_PROFESSOR} não encontrado.`);

  const dados = {
    tipo: "quiz",
    disciplina: "Matemática",
    serie: "9º ano",
    tema: TEMA,
    conteudoGerado: {
      titulo: "Simulado SISPAI 2025.2 — Matemática 9º ano",
      questoes: QUESTOES.map((q) => ({
        enunciado: `Questão ${q.numero} — ${q.enunciado}`,
        alternativas: q.alternativas,
        ...(q.imagem ? { imagem: `${FIGURAS}/${q.imagem}` } : {}),
      })),
    },
    gabarito: QUESTOES.map((q) => ({
      enunciado: `Questão ${q.numero} — ${q.enunciado}`,
      respostaCorreta: q.respostaCorreta,
      explicacao: q.explicacao,
    })),
    competenciasBncc: [],
    professorId: professor.id,
  };

  // Seguro rodar de novo: atualiza o simulado existente em vez de duplicar
  // (e não apaga as salas já jogadas com ele).
  const existente = await prisma.atividade.findFirst({ where: { professorId: professor.id, tema: TEMA } });
  const atividade = existente
    ? await prisma.atividade.update({ where: { id: existente.id }, data: dados })
    : await prisma.atividade.create({ data: dados });

  console.log(`${existente ? "Atualizado" : "Criado"}: ${atividade.id} (${QUESTOES.length} questões)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
