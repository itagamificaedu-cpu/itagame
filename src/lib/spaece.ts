// Estrutura oficial do SPAECE (Sistema Permanente de Avaliação da Educação
// Básica do Ceará) para o 9º ano do Ensino Fundamental — usada na aba
// "SPAECE 9º ano" (hub, geração com IA e selo nas trilhas).
//
// Fonte: Matriz de Referência oficial do SPAECE 2022, publicada pela
// SEDUC-CE via CAEd (avaliacaoemonitoramentoceara.caeddigital.net):
// - Língua Portuguesa | 9º ano do Ensino Fundamental
// - Matemática | 9º ano do Ensino Fundamental
// Cada eixo/tema abaixo é um dos oficiais da matriz, e cada descritor
// (código + habilidade) foi copiado literalmente do documento oficial —
// não são descritores inventados.
//
// Manter esse arquivo como fonte única desses textos — ia.ts e as páginas
// do painel/aluno importam daqui, em vez de duplicar a lista em cada lugar.

export type DisciplinaSpaece = "lingua_portuguesa" | "matematica";

export type EixoSpaece9Ano =
  | "lp_procedimentos_leitura"
  | "lp_implicacoes_suporte_genero"
  | "lp_relacao_textos"
  | "lp_coerencia_coesao"
  | "lp_recursos_expressivos"
  | "lp_variacao_linguistica"
  | "mt_numeros_funcoes"
  | "mt_geometria"
  | "mt_medidas"
  | "mt_tratamento_informacao";

export type DescritorSpaece = { codigo: string; habilidade: string };

export type EixoSpaeceInfo = {
  chave: EixoSpaece9Ano;
  disciplina: DisciplinaSpaece;
  nome: string;
  descritores: DescritorSpaece[];
};

// Verde oficial do Governo do Ceará/SEDUC (manual de identidade visual:
// C:90 M:25 Y:100 K:0, aprox. Pantone 363) — usado em toda a aba SPAECE.
export const VERDE_SPAECE = "#1e8f4e";
export const VERDE_SPAECE_ESCURO = "#0f5c31";

export const DISCIPLINAS_SPAECE: {
  chave: DisciplinaSpaece;
  nome: string;
  icone: string;
  eixos: EixoSpaeceInfo[];
}[] = [
  {
    chave: "lingua_portuguesa",
    nome: "Língua Portuguesa",
    icone: "📖",
    eixos: [
      {
        chave: "lp_procedimentos_leitura",
        disciplina: "lingua_portuguesa",
        nome: "Procedimentos de Leitura",
        descritores: [
          { codigo: "D01", habilidade: "Localizar informação explícita." },
          { codigo: "D02", habilidade: "Inferir informação em texto verbal." },
          { codigo: "D03", habilidade: "Inferir o sentido de palavra ou expressão." },
          {
            codigo: "D04",
            habilidade: "Interpretar textos não verbais e textos que articulam elementos verbais e não verbais.",
          },
          { codigo: "D05", habilidade: "Identificar o tema ou assunto de um texto." },
          { codigo: "D06", habilidade: "Distinguir fato de opinião relativa ao fato." },
          { codigo: "D07", habilidade: "Diferenciar a informação principal das secundárias em um texto." },
        ],
      },
      {
        chave: "lp_implicacoes_suporte_genero",
        disciplina: "lingua_portuguesa",
        nome: "Implicações do Suporte, do Gênero e/ou do Enunciador na Compreensão do Texto",
        descritores: [
          { codigo: "D09", habilidade: "Reconhecer gênero discursivo." },
          { codigo: "D10", habilidade: "Identificar o propósito comunicativo em diferentes gêneros." },
          {
            codigo: "D11",
            habilidade: "Reconhecer os elementos que compõem uma narrativa e o conflito gerador.",
          },
        ],
      },
      {
        chave: "lp_relacao_textos",
        disciplina: "lingua_portuguesa",
        nome: "Relação entre Textos",
        descritores: [
          {
            codigo: "D13",
            habilidade: "Reconhecer diferentes formas de tratar uma informação na comparação de textos de um mesmo tema.",
          },
        ],
      },
      {
        chave: "lp_coerencia_coesao",
        disciplina: "lingua_portuguesa",
        nome: "Coerência e Coesão no Processamento do Texto",
        descritores: [
          {
            codigo: "D14",
            habilidade:
              "Reconhecer as relações entre partes de um texto, identificando os recursos coesivos que contribuem para sua continuidade.",
          },
          {
            codigo: "D17",
            habilidade: "Reconhecer o sentido das relações lógico-discursivas marcadas por conjunções, advérbios, etc.",
          },
        ],
      },
      {
        chave: "lp_recursos_expressivos",
        disciplina: "lingua_portuguesa",
        nome: "Relações entre Recursos Expressivos e Efeitos de Sentido",
        descritores: [
          {
            codigo: "D19",
            habilidade: "Reconhecer o efeito de sentido decorrente da escolha de palavras, frases ou expressões.",
          },
          {
            codigo: "D20",
            habilidade: "Identificar o efeito de sentido decorrente do uso da pontuação e de outras notações.",
          },
          { codigo: "D22", habilidade: "Reconhecer efeitos de humor e ironia." },
        ],
      },
      {
        chave: "lp_variacao_linguistica",
        disciplina: "lingua_portuguesa",
        nome: "Variação Linguística",
        descritores: [
          {
            codigo: "D23",
            habilidade: "Identificar os níveis de linguagem e/ou as marcas linguísticas que evidenciam locutor e/ou interlocutor.",
          },
        ],
      },
    ],
  },
  {
    chave: "matematica",
    nome: "Matemática",
    icone: "📐",
    eixos: [
      {
        chave: "mt_numeros_funcoes",
        disciplina: "matematica",
        nome: "Interagindo com Números e Funções",
        descritores: [
          {
            codigo: "D07",
            habilidade: "Resolver situação problema utilizando mínimo múltiplo comum ou máximo divisor comum com números naturais.",
          },
          { codigo: "D08", habilidade: "Ordenar ou identificar a localização de números inteiros na reta numérica." },
          { codigo: "D10", habilidade: "Resolver problema com números inteiros envolvendo suas operações." },
          { codigo: "D11", habilidade: "Ordenar ou identificar a localização de números racionais na reta numérica." },
          { codigo: "D12", habilidade: "Resolver problema com números racionais envolvendo suas operações." },
          {
            codigo: "D13",
            habilidade: "Reconhecer diferentes representações de um mesmo número racional, em situação-problema.",
          },
          { codigo: "D17", habilidade: "Resolver situação problema utilizando porcentagem." },
          {
            codigo: "D18",
            habilidade:
              "Resolver situação problema envolvendo a variação proporcional entre grandezas direta ou inversamente proporcionais.",
          },
          { codigo: "D25", habilidade: "Resolver situação problema que envolva equações de 1º grau." },
          { codigo: "D27", habilidade: "Resolver situação problema envolvendo sistema de equações do 1º grau." },
        ],
      },
      {
        chave: "mt_geometria",
        disciplina: "matematica",
        nome: "Convivendo com a Geometria",
        descritores: [
          {
            codigo: "D48",
            habilidade:
              "Identificar e classificar figuras planas: quadrado, retângulo, triângulo e círculo, destacando algumas de suas características (número de lados e tipo de ângulos).",
          },
          {
            codigo: "D51",
            habilidade:
              "Resolver problemas usando as propriedades dos polígonos (soma dos ângulos internos, número de diagonais e cálculo do ângulo interno de polígonos regulares).",
          },
          { codigo: "D52", habilidade: "Identificar planificações de alguns poliedros e/ou corpos redondos." },
        ],
      },
      {
        chave: "mt_medidas",
        disciplina: "matematica",
        nome: "Vivenciando as Medidas",
        descritores: [
          { codigo: "D65", habilidade: "Calcular o perímetro de figuras planas, numa situação problema." },
          { codigo: "D67", habilidade: "Resolver problema envolvendo o cálculo de área de figuras planas." },
          { codigo: "D69", habilidade: "Resolver problemas envolvendo noções de volume." },
        ],
      },
      {
        chave: "mt_tratamento_informacao",
        disciplina: "matematica",
        nome: "Tratamento da Informação",
        descritores: [
          {
            codigo: "D75",
            habilidade: "Resolver problema envolvendo informações apresentadas em tabelas ou gráficos.",
          },
          { codigo: "D77", habilidade: "Resolver problemas usando a média aritmética." },
        ],
      },
    ],
  },
];

export function eixoSpaecePorChave(chave: string | null | undefined): EixoSpaeceInfo | undefined {
  for (const disciplina of DISCIPLINAS_SPAECE) {
    const encontrado = disciplina.eixos.find((eixo) => eixo.chave === chave);
    if (encontrado) return encontrado;
  }
  return undefined;
}

export function disciplinaSpaecePorChave(chave: DisciplinaSpaece) {
  return DISCIPLINAS_SPAECE.find((d) => d.chave === chave);
}
