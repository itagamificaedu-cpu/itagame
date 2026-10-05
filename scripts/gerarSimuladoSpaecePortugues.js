// Gera com IA o "Simulado de Língua Portuguesa 9º ano" do SPAECE: 26 questões
// distribuídas pelos 17 descritores oficiais da Matriz de Referência (mesma
// lista de src/lib/spaece.ts), no estilo de item da prova (texto de apoio +
// pergunta objetiva com 4 alternativas).
//
// Distribuição (26 questões), por eixo:
//   Procedimentos de Leitura (15): D01 x2, D02 x3, D03 x2, D04 x2, D05 x2, D06 x2, D07 x2
//   Implicações do Suporte, Gênero e Enunciador (4): D09, D10, D11 x2
//   Relação entre Textos (1): D13
//   Coerência e Coesão (2): D14, D17
//   Recursos Expressivos e Efeitos de Sentido (3): D19, D20, D22
//   Variação Linguística (1): D23
//
// O gabarito fica espalhado de forma equilibrada entre A, B, C e D. O tema leva
// "(SPAECE)" pra o resultado cair no relatório do SPAECE.
//
// Uso: node scripts/gerarSimuladoSpaecePortugues.js   (precisa de ANTHROPIC_API_KEY)

const Anthropic = require("@anthropic-ai/sdk");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL) });
const cliente = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODELO = "claude-sonnet-5"; // mesmo modelo do restante do app (aceita tool_choice forçado)

const EMAIL_PROFESSOR = "itagamificaedu@gmail.com";
const TEMA = "Simulado Língua Portuguesa 9º ano (SPAECE) — 26 questões, D01 a D23";

const DESCRITORES = {
  D01: "Localizar informação explícita.",
  D02: "Inferir informação em texto verbal.",
  D03: "Inferir o sentido de palavra ou expressão.",
  D04: "Interpretar textos não verbais e textos que articulam elementos verbais e não verbais.",
  D05: "Identificar o tema ou assunto de um texto.",
  D06: "Distinguir fato de opinião relativa ao fato.",
  D07: "Diferenciar a informação principal das secundárias em um texto.",
  D09: "Reconhecer gênero discursivo.",
  D10: "Identificar o propósito comunicativo em diferentes gêneros.",
  D11: "Reconhecer os elementos que compõem uma narrativa e o conflito gerador.",
  D13: "Reconhecer diferentes formas de tratar uma informação na comparação de textos de um mesmo tema.",
  D14: "Reconhecer as relações entre partes de um texto, identificando os recursos coesivos que contribuem para sua continuidade.",
  D17: "Reconhecer o sentido das relações lógico-discursivas marcadas por conjunções, advérbios, etc.",
  D19: "Reconhecer o efeito de sentido decorrente da escolha de palavras, frases ou expressões.",
  D20: "Identificar o efeito de sentido decorrente do uso da pontuação e de outras notações.",
  D22: "Reconhecer efeitos de humor e ironia.",
  D23: "Identificar os níveis de linguagem e/ou as marcas linguísticas que evidenciam locutor e/ou interlocutor.",
};

// Cada grupo vira uma chamada à IA. Ordem final da prova = ordem dos grupos.
const GRUPOS = [
  { nome: "Procedimentos de Leitura (parte 1)", itens: ["D01", "D01", "D02", "D02", "D02", "D03", "D03", "D05"] },
  { nome: "Procedimentos de Leitura (parte 2)", itens: ["D04", "D04", "D05", "D06", "D06", "D07", "D07"] },
  { nome: "Gênero, propósito e narrativa", itens: ["D09", "D10", "D11", "D11"] },
  { nome: "Relação entre textos, coesão e coerência", itens: ["D13", "D14", "D17"] },
  { nome: "Recursos expressivos e variação linguística", itens: ["D19", "D20", "D22", "D23"] },
];

const FERRAMENTA = {
  name: "salvar_questoes",
  description: "Salva as questões do simulado de Língua Portuguesa.",
  input_schema: {
    type: "object",
    properties: {
      questoes: {
        type: "array",
        items: {
          type: "object",
          properties: {
            descritor: { type: "string", description: "Código do descritor trabalhado, ex.: D02" },
            textoBase: { type: "string", description: "Texto de apoio completo (ou os dois textos, para D13), já formatado com título quando fizer sentido." },
            pergunta: { type: "string", description: "O comando da questão, em uma ou duas frases." },
            correta: { type: "string", description: "Texto da alternativa correta." },
            erradas: { type: "array", items: { type: "string" }, description: "Exatamente 3 alternativas erradas, plausíveis, de tamanho parecido com a correta." },
            explicacao: { type: "string", description: "Por que a correta está certa e onde o aluno costuma errar." },
          },
          required: ["descritor", "textoBase", "pergunta", "correta", "erradas", "explicacao"],
        },
      },
    },
    required: ["questoes"],
  },
};

function instrucao(grupo) {
  const lista = grupo.itens.map((d, i) => `${i + 1}. ${d}: ${DESCRITORES[d]}`).join("\n");
  return `Você é elaborador de itens do SPAECE (Sistema Permanente de Avaliação da Educação Básica do Ceará) de Língua Portuguesa para o 9º ano do Ensino Fundamental, seguindo a Matriz de Referência oficial.

Crie ${grupo.itens.length} questões de múltipla escolha, NESTA ORDEM, uma para cada descritor da lista:
${lista}

Regras:
- Cada questão traz um texto de apoio ORIGINAL escrito por você (nunca copie trechos de obras ou notícias reais), com 70 a 180 palavras, adequado a alunos de 14 a 15 anos de Itapipoca, Ceará. Varie os gêneros entre as questões: notícia, reportagem, crônica, conto, poema, carta, anúncio, artigo de opinião, tirinha em texto, cartaz, verbete, entrevista, e-mail, post de rede social.
- A questão precisa medir EXATAMENTE a habilidade do descritor, sem exigir conhecimento fora do texto.
- Linguagem clara, sem pegadinha de gramática decorada. Ortografia e acentuação perfeitas.
- Para D04 (texto não verbal): como não há imagem, descreva o elemento visual dentro do texto de apoio entre colchetes, no formato "[Imagem: ...]" ou "[Gráfico: ...]" ou "[Cartaz: ...]", com detalhes suficientes para responder, articulado com algum texto verbal curto.
- Para D13 (comparar textos): o textoBase traz "Texto I" e "Texto II" sobre o mesmo tema, tratando a informação de formas diferentes.
- Para D11: a pergunta é sobre personagem, tempo, espaço, narrador, enredo ou conflito gerador de uma narrativa curta.
- Para D20: o sentido deve depender de um sinal de pontuação (aspas, reticências, exclamação, dois-pontos, travessão).
- Para D22: o texto precisa ter humor ou ironia de verdade, e a pergunta pede onde ele está.
- Para D23: o texto tem marcas de oralidade, gíria, regionalismo ou linguagem formal que revelam quem fala e com quem.
- As 4 alternativas: uma correta e 3 erradas plausíveis, de tamanho parecido, sem "todas as anteriores" nem "nenhuma das anteriores". Não repita alternativas.
- A pergunta NÃO repete o texto. Em "pergunta" escreva só o comando (ex.: "Nesse texto, a expressão ... significa").
- Responda usando a ferramenta salvar_questoes.`;
}

async function gerarGrupo(grupo) {
  const fluxo = cliente.messages.stream({
    model: MODELO,
    max_tokens: 16000,
    tools: [FERRAMENTA],
    tool_choice: { type: "tool", name: "salvar_questoes" },
    messages: [{ role: "user", content: instrucao(grupo) }],
  });
  const resposta = await fluxo.finalMessage();
  const bloco = resposta.content.find((b) => b.type === "tool_use");
  if (!bloco) throw new Error(`Sem resposta de ferramenta no grupo "${grupo.nome}".`);
  const questoes = bloco.input.questoes;
  if (!Array.isArray(questoes) || questoes.length !== grupo.itens.length) {
    throw new Error(`Grupo "${grupo.nome}": esperava ${grupo.itens.length} questões, veio ${questoes?.length}.`);
  }
  questoes.forEach((q, i) => {
    q.descritor = grupo.itens[i]; // garante o descritor planejado, mesmo se a IA errar o código
    if (!Array.isArray(q.erradas) || q.erradas.length !== 3) throw new Error(`Grupo "${grupo.nome}", item ${i + 1}: precisa de 3 alternativas erradas.`);
    const todas = [q.correta, ...q.erradas].map((t) => t.trim());
    if (new Set(todas).size !== 4) throw new Error(`Grupo "${grupo.nome}", item ${i + 1}: alternativas repetidas.`);
  });
  return questoes;
}

// A IA às vezes devolve um item fora do formato (ex.: 2 alternativas erradas
// em vez de 3). Nesse caso gera o grupo de novo, até 4 vezes.
async function gerarGrupoComTentativas(grupo) {
  let ultimoErro;
  for (let tentativa = 1; tentativa <= 4; tentativa++) {
    try {
      return await gerarGrupo(grupo);
    } catch (e) {
      ultimoErro = e;
      console.warn(`Tentativa ${tentativa} do grupo "${grupo.nome}" falhou: ${e.message}`);
    }
  }
  throw ultimoErro;
}

function embaralhar(lista) {
  const c = [...lista];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

async function main() {
  const professor = await prisma.usuario.findUnique({ where: { email: EMAIL_PROFESSOR } });
  if (!professor) throw new Error(`Professor ${EMAIL_PROFESSOR} não encontrado.`);

  const resultados = await Promise.all(GRUPOS.map(gerarGrupoComTentativas));
  const todas = resultados.flat();
  if (todas.length !== 26) throw new Error(`Esperava 26 questões, vieram ${todas.length}.`);

  // Posição da certa: 26 questões espalhadas entre A, B, C, D (7, 7, 6, 6), em ordem aleatória.
  const posicoes = embaralhar(Array.from({ length: 26 }, (_, i) => i % 4));

  const questoes = todas.map((q, i) => {
    const erradas = embaralhar(q.erradas.map((t) => t.trim()));
    const alternativas = [];
    let e = 0;
    for (let p = 0; p < 4; p++) alternativas.push(p === posicoes[i] ? q.correta.trim() : erradas[e++]);
    return {
      descritor: q.descritor,
      enunciado: `Questão ${i + 1} (${q.descritor}) — ${q.textoBase.trim()}\n\n${q.pergunta.trim()}`,
      alternativas,
      respostaCorreta: q.correta.trim(),
      explicacao: `${q.descritor}: ${DESCRITORES[q.descritor]} ${q.explicacao.trim()}`,
    };
  });

  const dados = {
    tipo: "quiz",
    disciplina: "Língua Portuguesa",
    serie: "9º ano",
    tema: TEMA,
    conteudoGerado: {
      titulo: "Simulado de Língua Portuguesa 9º ano, SPAECE (26 questões)",
      questoes: questoes.map((q) => ({ enunciado: q.enunciado, alternativas: q.alternativas })),
    },
    gabarito: questoes.map((q) => ({ enunciado: q.enunciado, respostaCorreta: q.respostaCorreta, explicacao: q.explicacao })),
    competenciasBncc: [...new Set(questoes.map((q) => q.descritor))].map((d) => `${d} — ${DESCRITORES[d]}`),
    professorId: professor.id,
  };

  const existente = await prisma.atividade.findFirst({ where: { professorId: professor.id, tema: TEMA } });
  const atividade = existente
    ? await prisma.atividade.update({ where: { id: existente.id }, data: dados })
    : await prisma.atividade.create({ data: dados });

  const contagem = [0, 0, 0, 0];
  questoes.forEach((q) => (contagem[q.alternativas.indexOf(q.respostaCorreta)] += 1));
  console.log(`${existente ? "Atualizado" : "Criado"}: ${atividade.id} (26 questões). Certas em A/B/C/D: ${contagem.join("/")}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
