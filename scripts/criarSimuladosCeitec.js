// Cria (ou atualiza) os dois simulados semanais do CEITEC (Matemática, 9º ano)
// na conta do professor: "CEITEC Simulado Semanal 1" (26 questões, descritores
// D1 a D15) e "Mini Simulado Semanal 1" (13 questões). Os textos e as
// alternativas seguem os PDFs entregues pelo Genezio, na mesma ordem; as
// figuras foram recortadas dos próprios PDFs (public/materiais/ceitec-simulados).
//
// Gabarito do CEITEC: as alternativas marcadas em vermelho no PDF.
// Gabarito do Mini: o PDF não traz, então cada resposta foi resolvida e
// conferida uma a uma (ver "explicacao").
//
// O tema leva "(SPAECE)" de propósito: assim o resultado da turma jogando na
// Sala Ao Vivo já aparece em /painel/spaece/resultados-matematica.
//
// Uso: node scripts/criarSimuladosCeitec.js

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

const EMAIL_PROFESSOR = "itagamificaedu@gmail.com";
const FIGURAS = "/materiais/ceitec-simulados";

// Toda alternativa aparece com a letra na frente ("A) ...", "B) ..."), como na
// prova impressa. Alternativas que são só a figura ("(A)") viram "A)".
function comLetras(alternativas) {
  return alternativas.map((texto, i) => {
    const letra = String.fromCharCode(65 + i);
    return /^\([A-D]\)$/.test(texto) ? `${letra})` : `${letra}) ${texto}`;
  });
}

const CEITEC = [
  {
    n: 1, d: "D1", img: "ceitec_q01.png",
    enunciado: "Pedro é aluno da Escola Municipal Olga Teixeira, ele mora próximo à escola e vai as aulas de bicicleta. A figura abaixo indica o trajeto que Pedro faz todos os dias da sua casa até a escola. Observando a figura podemos dizer que o trajeto feito por Pedro ao sair de casa para escola foi:",
    alt: ["Seguir em frente virar a 2ª esquerda, depois 1ª direita e 1ª esquerda.", "Seguir em frente virar a 1ª esquerda, depois 2ª direita e 1ª esquerda.", "Seguir em frente virar a 2ª direita, depois 1ª esquerda e 1ª direita.", "Seguir em frente virar a 2ª esquerda, depois 2ª direita e 2ª esquerda."],
    certa: 0,
    exp: "Seguindo o traço da figura, da casa até a escola, o caminho faz a 2ª rua à esquerda, depois a 1ª à direita e a 1ª à esquerda.",
  },
  {
    n: 2, d: "D2", img: "ceitec_q02.png",
    enunciado: "Alguém construiu uma caixa, com fundo e tampa, a partir de pedaços de papelão que são, cada um deles, polígonos com lados de mesma medida. Veja como ficou essa caixa aberta e cheia de bolinhas de algodão. Na construção dessa caixa foram utilizados:",
    alt: ["dois pentágonos e seis quadrados", "dois hexágonos e seis quadrados", "dois pentágonos e cinco quadrados", "dois hexágonos e cinco retângulos"],
    certa: 1,
    exp: "O fundo e a tampa são hexágonos regulares (2 hexágonos). Um hexágono tem 6 lados, então a lateral tem 6 faces quadradas.",
  },
  {
    n: 3, d: "D3", img: "ceitec_q03.png",
    enunciado: "Observe as figuras. Quanto aos lados das figuras acima podemos afirmar que os triângulos são respectivamente",
    alt: ["escaleno, equilátero, isósceles", "retângulo, equilátero, isósceles", "acutângulo, equilátero, obtusângulo", "isósceles, escaleno, equilátero"],
    certa: 0,
    exp: "O 1º tem os três lados diferentes (a, b, c): escaleno. O 2º tem três ângulos de 60° e lados iguais: equilátero. O 3º tem dois lados iguais (a, a): isósceles.",
  },
  {
    n: 4, d: "D4", img: "ceitec_q04.png",
    enunciado: "Veja as figuras abaixo. A figura 4 tem a forma de um",
    alt: ["hexágono", "pentágono", "quadrado", "retângulo"],
    certa: 0,
    exp: "A figura 4 tem 6 lados: é um hexágono.",
  },
  {
    n: 5, d: "D5", img: "ceitec_q05.png",
    enunciado: "Na malha quadriculada abaixo, a figura 1 é uma ampliação da figura 2. A medida do perímetro da figura 1 é igual",
    alt: ["à metade da medida do perímetro da figura 2.", "à medida do perímetro da figura 2.", "ao dobro da medida do perímetro da figura 2.", "a quatro vezes a medida do perímetro da figura 2."],
    certa: 2,
    exp: "A figura 1 tem todos os lados com o dobro do tamanho dos da figura 2. Quando a ampliação é de razão 2, o perímetro também fica multiplicado por 2.",
  },
  {
    n: 6, d: "D6", img: "ceitec_q06.png",
    enunciado: "Os dois ângulos formados pelos ponteiros de um relógio às 8 horas medem:",
    alt: ["60° e 120°", "120° e 160°", "120° e 240°", "140° e 220°"],
    certa: 2,
    exp: "Cada hora no relógio vale 30°. Entre o 12 e o 8 há 8 horas, ou seja, 240°; do outro lado são 4 horas, ou 120°. Os dois ângulos somam 360°.",
  },
  {
    n: 7, d: "D7", img: "ceitec_q07.png",
    enunciado: "Observe a transformação homotética abaixo, sendo o triângulo PQR uma ampliação do triângulo HIJ. Qual é a razão de homotetia dessa ampliação?",
    alt: ["2", "3", "6", "10"],
    certa: 1,
    exp: "Compare lados correspondentes: IJ = 2 cm e QR = 6 cm. A razão é 6 ÷ 2 = 3 (também 12 ÷ 4 = 3).",
  },
  {
    n: 8, d: "D8", img: "ceitec_q08.png",
    enunciado: "A figura abaixo mostra um triângulo retângulo. Após analisar o triângulo pode-se concluir que os valores dos ângulos x e y são, respectivamente:",
    alt: ["30° e 60°", "60° e 30°", "45° e 45°", "120° e 60°"],
    certa: 3,
    exp: "No triângulo retângulo, y = 180° − 90° − 30° = 60°. O ângulo x é o suplemento de y: x = 180° − 60° = 120°.",
  },
  {
    n: 9, d: "D9", img: "ceitec_q09.png",
    enunciado: "No plano cartesiano, abaixo, estão assinalados os pontos P e Q. Quais são as coordenadas dos pontos P e Q nesse plano cartesiano?",
    alt: ["P(1, 1) e Q(1, 1)", "P(1, 0) e Q(0, 1)", "P(0, 1) e Q(0, 1)", "P(0, 1) e Q(1, 0)"],
    certa: 3,
    exp: "P está sobre o eixo Y, na altura 1: P(0, 1). Q está sobre o eixo X, na posição 1: Q(1, 0).",
  },
  {
    n: 10, d: "D9", img: "ceitec_q10.png",
    enunciado: "Na figura abaixo temos o triângulo ABC. Quais as coordenadas dos vértices A, B e C, respectivamente, do triângulo representado no gráfico?",
    alt: ["(2, –2), (4, 1) e (1, 2)", "(–2, 2), (1, 4) e (2, 1)", "(1, 4), (2, 1) e (–2, 2)", "(4, 1), (1, 2) e (2, –2)"],
    certa: 1,
    exp: "Lendo o gráfico: A está em x = −2 e y = 2; B em x = 1 e y = 4; C em x = 2 e y = 1. Primeiro vem o x, depois o y.",
  },
  {
    n: 11, d: "D10", img: "ceitec_q11.png",
    enunciado: "A figura a seguir é o desenho de um triângulo retângulo feito numa folha de cartolina. Qual a medida, em cm, do lado AB?",
    alt: ["15", "17", "25", "31"],
    certa: 2,
    exp: "AB é a hipotenusa. Pelo teorema de Pitágoras: AB² = 7² + 24² = 49 + 576 = 625, então AB = 25 cm.",
  },
  {
    n: 12, d: "D10", img: "ceitec_q12.png",
    enunciado: "O barco de senhor Osmar está a 12 km da lancha de sua amiga Ana e a exatos 20 km da ilha onde, ambos, irão desembarcar. Observando a figura podemos afirmar que a lancha de Ana está a",
    alt: ["10 km da ilha.", "12 km da ilha.", "14 km da ilha.", "16 km da ilha."],
    certa: 3,
    exp: "A distância procurada é um cateto: 20² = 12² + x², então x² = 400 − 144 = 256 e x = 16 km.",
  },
  {
    n: 13, d: "D11",
    enunciado: "Uma praça circular possui um raio de 10 metros. Para realizar a ornamentação de Natal, a prefeitura precisa cercar a borda dessa praça com uma fita de LED. Utilizando (π = 3,14), qual é o comprimento total de fita necessário para dar uma volta completa na praça?",
    alt: ["31,4 metros", "62,8 metros", "314 metros", "6,28 metros"],
    certa: 1,
    exp: "Comprimento da circunferência: C = 2 · π · r = 2 · 3,14 · 10 = 62,8 metros.",
  },
  {
    n: 14, d: "D11",
    enunciado: "Um jardineiro deseja gramar um canteiro circular que possui um diâmetro de 6 metros. Sabendo que o custo da grama é por metro quadrado e usando (π = 3,14), qual é a área total desse canteiro que receberá a grama?",
    alt: ["113,04 m²", "37,68 m²", "28,26 m²", "18,84 m²"],
    certa: 2,
    exp: "O raio é a metade do diâmetro: 3 m. Área = π · r² = 3,14 · 3² = 3,14 · 9 = 28,26 m².",
  },
  {
    n: 15, d: "D11",
    enunciado: "Qual é o comprimento de uma circunferência que possui 6 cm de raio?",
    alt: ["3π", "6π", "12π", "36π"],
    certa: 2,
    exp: "C = 2 · π · r = 2 · π · 6 = 12π cm.",
  },
  {
    n: 16, d: "D12",
    enunciado: "José vai colocar uma cerca de arame em seu terreno retangular de 12 m de largura por 30 m de comprimento. A quantidade mínima de arame que ele vai precisar é de",
    alt: ["360 m", "84 m", "42 m", "18 m"],
    certa: 1,
    exp: "A cerca dá a volta no terreno, então é o perímetro: 2 · (12 + 30) = 84 m.",
  },
  {
    n: 17, d: "D12", img: "ceitec_q17.png",
    enunciado: "O perímetro da figura abaixo, sabendo que A e B são quadrados, é:",
    alt: ["26 m", "29 m", "32 m", "34 m"],
    certa: 0,
    exp: "A tem área 9 m², então o lado mede 3 m. B tem área 25 m², então o lado mede 5 m. Contornando a figura: 5 + 5 + (5 + 3) + (3 + 2) + 3 = 26 m (o lado esquerdo de B que sobra mede 5 − 3 = 2 m).",
  },
  {
    n: 18, d: "D13", img: "ceitec_q18.png",
    enunciado: "O jardim da Renata tem formato da figura abaixo. Usando como unidade de área o quadradinho da malha, conclui-se que a área da região sombreada é:",
    alt: ["13", "14", "15", "16,5"],
    certa: 2,
    exp: "Contando os quadradinhos inteiros e juntando as partes que se completam (a parte arredondada de cima compensa o recorte circular do lado), a região sombreada ocupa 15 quadradinhos.",
  },
  {
    n: 19, d: "D13", img: "ceitec_q19.png",
    enunciado: "A figura cinza abaixo representa uma peça metálica em forma de trapézio. Quanto mede a área dessa peça?",
    alt: ["7 m²", "9 m²", "12 m²", "14 m²"],
    certa: 1,
    exp: "Base menor = 2 m, base maior = 1 + 2 + 1 = 4 m e altura = 3 m. Área = (4 + 2) · 3 ÷ 2 = 9 m².",
  },
  {
    n: 20, d: "D13",
    enunciado: "Milton precisa calcular a área do campo de futebol para saber o quanto de grama precisará comprar. Se o campo tem 110 m de comprimento e 85 de largura, a sua área é igual a",
    alt: ["9350 m²", "195 m²", "185 m²", "8350 m²"],
    certa: 0,
    exp: "Área do retângulo = 110 · 85 = 9 350 m².",
  },
  {
    n: 21, d: "D14", img: "ceitec_q21.png",
    enunciado: "Uma mangueira despeja água numa piscina no formato de um paralelepípedo, que mede 2 metros de comprimento, 0,8 m de altura e 2,5 m de largura, de acordo com a figura abaixo. O volume desta piscina, em m³, é:",
    alt: ["5,0", "6,0", "5,5", "4,0"],
    certa: 3,
    exp: "Volume = comprimento · largura · altura = 2 · 2,5 · 0,8 = 4,0 m³.",
  },
  {
    n: 22, d: "D14", img: "ceitec_q22.png",
    enunciado: "Na figura abaixo tem-se uma caixa sem tampa que foi preenchida com cubos cujos lados medem 1 cm. Qual é o volume dessa caixa?",
    alt: ["60 cm³", "50 cm³", "40 cm³", "30 cm³"],
    certa: 0,
    exp: "Cada cubo vale 1 cm³. A caixa tem 5 cubos de comprimento, 4 de altura e 3 de profundidade: 5 · 4 · 3 = 60 cm³.",
  },
  {
    n: 23, d: "D14", img: "ceitec_q23.png",
    enunciado: "A figura abaixo representa um conjunto de cubos, todos iguais, cujos volumes correspondem a 1 m³. Quanto vale, em m³, o volume do conjunto, incluindo os cubos não visíveis?",
    alt: ["6", "8", "10", "12"],
    certa: 2,
    exp: "Cada cubo vale 1 m³. Somando os cubos de cada camada, inclusive os que ficam escondidos atrás, o conjunto tem 10 cubos, ou seja, 10 m³.",
  },
  {
    n: 24, d: "D15",
    enunciado: "O Banco Economia funciona diariamente 24 horas. Pedro quer saber quantos minutos esse banco funciona por dia. O Banco Economia funciona",
    alt: ["144 minutos por dia.", "240 minutos por dia.", "1 240 minutos por dia.", "1 440 minutos por dia."],
    certa: 3,
    exp: "1 hora tem 60 minutos: 24 · 60 = 1 440 minutos.",
  },
  {
    n: 25, d: "D15",
    enunciado: "Para se obter 1/4 de litro de um certo produto de limpeza, foram colocados em um recipiente 54 mL de álcool, 125 mL de sabão líquido e água. A quantidade de água adicionada foi",
    alt: ["71 mL.", "85 mL.", "90 mL.", "97 mL."],
    certa: 0,
    exp: "1/4 de litro = 250 mL. Já tem 54 + 125 = 179 mL, então a água foi 250 − 179 = 71 mL.",
  },
  {
    n: 26, d: "D15",
    enunciado: "Um marceneiro comprou 8 pacotes de pregos. Se cada pacote continha uma dúzia de pregos, quantos pregos esse marceneiro comprou?",
    alt: ["20", "36", "48", "96"],
    certa: 3,
    exp: "Uma dúzia são 12 pregos: 8 · 12 = 96 pregos.",
  },
];

const MINI = [
  {
    n: 1, d: "D26",
    enunciado: "Jonas é confeiteiro e produz doces para festas sob encomenda. Ele cobra R$ 2,50 por unidade de doce, além de uma taxa fixa de R$ 40,00 pela entrega. Certo dia, Jonas recebeu um pagamento de R$ 390,00 por uma encomenda de doces e pelo serviço de entrega. Quantos doces, no total, Jonas produziu nessa encomenda?",
    alt: ["140.", "156.", "172.", "350."],
    certa: 0,
    exp: "Tirando a taxa de entrega: 390 − 40 = 350 reais só dos doces. Cada doce custa 2,50, então 350 ÷ 2,50 = 140 doces.",
  },
  {
    n: 2, d: "D25",
    enunciado: "Em um fim de tarde, a temperatura no bairro em que Camila mora era de 2 °C. Ao anoitecer, essa temperatura caiu para –5 °C. Quantos graus célsius a temperatura caiu do fim da tarde ao anoitecer no bairro em que Camila mora?",
    alt: ["–7 °C.", "–3 °C.", "3 °C.", "7 °C."],
    certa: 3,
    exp: "A queda é a diferença entre as temperaturas: 2 − (−5) = 2 + 5 = 7 °C. Descer de 2 °C até 0 °C são 2 graus, e de 0 °C até −5 °C são mais 5.",
  },
  {
    n: 3, d: "D26",
    enunciado: "Renata produz e vende bombons caseiros. Em um determinado dia, ela separou uma quantidade de bombons para vender. Dessa quantidade, 2/5 foram vendidos na parte da manhã e 1/3 foi vendido na parte da tarde. Qual é a fração que representa a quantidade total de bombons vendidos por Renata desse dia?",
    alt: ["11/15", "3/8", "3/15", "6/5"],
    certa: 0,
    exp: "Somar frações com denominadores diferentes: 2/5 + 1/3 = 6/15 + 5/15 = 11/15.",
  },
  {
    n: 4, d: "D28",
    enunciado: "O preço do ingresso de um show musical era 140 reais. O preço desse ingresso aumentou em 15% sobre o valor inicial. De quantos reais foi o aumento no preço do ingresso desse show musical?",
    alt: ["15 reais.", "21 reais.", "161 reais.", "210 reais."],
    certa: 1,
    exp: "O aumento é 15% de 140: 0,15 · 140 = 21 reais. (O novo preço seria 161, mas a pergunta é só do aumento.)",
  },
  {
    n: 5, d: "D15",
    enunciado: "Ana ganhou uma muda de flor e plantou em seu jardim. Ela observou que em poucos dias essa muda cresceu 2 centímetros. Quantos milímetros, ao todo, essa muda cresceu nesse período?",
    alt: ["20 mm.", "200 mm.", "2 000 mm.", "20 000 mm."],
    certa: 0,
    exp: "1 cm = 10 mm, então 2 cm = 20 mm.",
  },
  {
    n: 6, d: "D77",
    enunciado: "Tiago leu um livro em cinco dias. No primeiro dia, ele leu 70 páginas, no segundo, 30, no terceiro, 61, no quarto, 30 e, no quinto dia, ele leu as 89 páginas restantes. Quantas páginas desse livro Tiago leu, em média, por dia?",
    alt: ["30 páginas.", "56 páginas.", "59 páginas.", "61 páginas."],
    certa: 1,
    exp: "Total: 70 + 30 + 61 + 30 + 89 = 280 páginas. Média por dia: 280 ÷ 5 = 56 páginas.",
  },
  {
    n: 7, d: "D36", img: "mini_q07.png",
    enunciado: "Laura organizou o estoque dos diferentes tipos de brinquedos vendidos na loja onde ela trabalha. Observe, na tabela abaixo, os tipos de brinquedos com suas respectivas quantidades identificadas por Laura nesse estoque. Os brinquedos mais vendidos nessa loja são carrinhos e bonecas. De acordo com essa tabela, quantos carrinhos e bonecas, ao todo, foram identificados por Laura no estoque dessa loja?",
    alt: ["250.", "205.", "150.", "100."],
    certa: 0,
    exp: "Pela tabela, há 150 bonecas e 100 carrinhos: 150 + 100 = 250.",
  },
  {
    n: 8, d: "D23", img: "mini_q08.png",
    enunciado: "Considere as frações apresentadas no quadro abaixo. Qual dessas frações é equivalente à fração 4/6?",
    alt: ["I.", "II.", "III.", "IV."],
    certa: 2,
    exp: "4/6 simplificada fica 2/3. A fração 12/18 também vale 2/3 (dividindo em cima e embaixo por 6). Então a equivalente é a III.",
  },
  {
    n: 9, d: "D17", img: "mini_q09.png",
    enunciado: "Observe a reta numérica abaixo. Ela está dividida em segmentos de mesma medida. Nessa reta, o ponto S representa o número",
    alt: ["12,7.", "12,9.", "13,2.", "13,4."],
    certa: 2,
    exp: "De 12,6 a 13,5 há 3 segmentos iguais: (13,5 − 12,6) ÷ 3 = 0,3 cada. O ponto S fica 2 segmentos depois do 12,6: 12,6 + 0,6 = 13,2.",
  },
  {
    n: 10, d: "D29",
    enunciado: "Uma maratonista gasta 36 minutos para percorrer 6 quilômetros em seus treinos diários. Em um determinado dia, ela precisou diminuir seu tempo de treino. Mantendo o ritmo anterior, ela treinou por 18 minutos. Quantos quilômetros essa maratonista percorreu nesse dia de treino?",
    alt: ["3 km.", "6 km.", "12 km.", "24 km."],
    certa: 0,
    exp: "18 minutos é a metade de 36 minutos. Mantendo o ritmo, ela percorre metade da distância: 6 ÷ 2 = 3 km.",
  },
  {
    n: 11, d: "D01", img: "mini_q11.png",
    enunciado: "Observe, na malha quadriculada abaixo, algumas figuras representadas em um sistema de linhas e colunas. Qual figura ocupa a posição R3 nesse sistema de linhas e colunas?",
    alt: ["Círculo cinza.", "Círculo com anéis (alvo).", "Círculo com listras.", "Círculo branco."],
    certa: 2,
    exp: "R3 é a coluna R com a linha 3. Nesse cruzamento está o círculo com listras horizontais.",
  },
  {
    n: 12, d: "D15",
    enunciado: "Patrícia é proprietária de um restaurante e vende, em média, 50 quilogramas de comida por dia. Em média, quantos gramas de comida são vendidos nesse restaurante diariamente?",
    alt: ["50 g.", "500 g.", "5 000 g.", "50 000 g."],
    certa: 3,
    exp: "1 kg = 1 000 g, então 50 kg = 50 · 1 000 = 50 000 g.",
  },
  {
    n: 13, d: "D12", img: "mini_q13.png",
    enunciado: "As molduras das janelas de uma escola serão trocadas. As novas molduras, feitas com ripas de madeira, serão instaladas no perímetro de cada abertura retangular, onde a janela será posicionada. Observe, na figura abaixo, as medidas dessas aberturas retangulares onde serão instaladas as ripas. Quantos centímetros de ripa, no mínimo, serão usados para fazer cada uma das molduras?",
    alt: ["150 cm.", "220 cm.", "440 cm.", "880 cm."],
    certa: 2,
    exp: "A ripa contorna a abertura, então é o perímetro do retângulo de 150 cm por 70 cm: 2 · (150 + 70) = 440 cm.",
  },
];

const SIMULADOS = [
  {
    tema: "CEITEC Simulado Semanal 1 (SPAECE) — Descritores D1 a D15",
    titulo: "CEITEC Simulado Semanal 1 — Matemática 9º ano",
    questoes: CEITEC,
  },
  {
    tema: "Mini Simulado Semanal 1 (SPAECE)",
    titulo: "Mini Simulado Semanal 1 — Matemática 9º ano",
    questoes: MINI,
  },
];

async function main() {
  const professor = await prisma.usuario.findUnique({ where: { email: EMAIL_PROFESSOR } });
  if (!professor) throw new Error(`Professor ${EMAIL_PROFESSOR} não encontrado.`);

  for (const sim of SIMULADOS) {
    // Conferência antes de gravar.
    for (const q of sim.questoes) {
      if (q.alt.length !== 4 || new Set(q.alt).size !== 4 || !q.alt[q.certa]) {
        throw new Error(`${sim.titulo}, questão ${q.n}: alternativas inválidas.`);
      }
    }

    const enunciadoDe = (q) => `Questão ${q.n} (${q.d}) — ${q.enunciado}`;
    const dados = {
      tipo: "quiz",
      disciplina: "Matemática",
      serie: "9º ano",
      tema: sim.tema,
      conteudoGerado: {
        titulo: sim.titulo,
        questoes: sim.questoes.map((q) => ({
          enunciado: enunciadoDe(q),
          alternativas: comLetras(q.alt),
          ...(q.img ? { imagem: `${FIGURAS}/${q.img}` } : {}),
        })),
      },
      gabarito: sim.questoes.map((q) => ({
        enunciado: enunciadoDe(q),
        respostaCorreta: comLetras(q.alt)[q.certa],
        explicacao: q.exp,
      })),
      competenciasBncc: [],
      professorId: professor.id,
    };

    // Seguro rodar de novo: atualiza em vez de duplicar.
    const existente = await prisma.atividade.findFirst({ where: { professorId: professor.id, tema: sim.tema } });
    const atividade = existente
      ? await prisma.atividade.update({ where: { id: existente.id }, data: dados })
      : await prisma.atividade.create({ data: dados });
    console.log(`${existente ? "Atualizado" : "Criado"}: ${sim.titulo} (${atividade.id}, ${sim.questoes.length} questões)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
