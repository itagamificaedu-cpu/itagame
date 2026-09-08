import { embaralhar } from "./aleatorio";
import { EIXOS_BNCC_COMPUTACAO, eixoBnccPorChave, type EixoBnccComputacao } from "@/lib/bnccComputacao";

export type QuestaoBnccComputacao = {
  eixo: EixoBnccComputacao;
  subconceito: string;
  enunciado: string;
  alternativas: string[];
  /** índice (0-3) da alternativa correta */
  respostaCorreta: number;
};

/**
 * Banco de questões de múltipla escolha da BNCC Computação, organizadas
 * pelos 3 eixos oficiais (Pensamento Computacional, Mundo Digital, Cultura
 * Digital — Parecer CNE/CEB nº 2/2022) e pelos subconceitos de cada eixo
 * (ver `src/lib/bnccComputacao.ts`, fonte única desses textos).
 *
 * As primeiras questões de cada eixo reaproveitam os quizzes já revisados
 * das trilhas-modelo da aba BNCC Computação (`modelosBnccComputacao.ts`),
 * garantindo consistência entre a trilha gamificada e este simulado.
 */
export const BANCO_BNCC_COMPUTACAO: QuestaoBnccComputacao[] = [
  // ---------------------------------------------------------------------
  // Pensamento Computacional — Abstração, Análise, Automação
  // ---------------------------------------------------------------------
  {
    eixo: "pensamento_computacional",
    subconceito: "Abstração",
    enunciado: "O que é 'abstração' no pensamento computacional?",
    alternativas: [
      "Ignorar os detalhes desnecessários para focar no que realmente importa",
      "Copiar exatamente um problema sem mudar nada",
      "Desenhar um gráfico bonito",
      "Memorizar um algoritmo decorado",
    ],
    respostaCorreta: 0,
  },
  {
    eixo: "pensamento_computacional",
    subconceito: "Abstração",
    enunciado: "Dividir um problema grande em partes menores e mais simples de resolver é chamado de:",
    alternativas: ["Decomposição", "Automação", "Compactação", "Distribuição"],
    respostaCorreta: 0,
  },
  {
    eixo: "pensamento_computacional",
    subconceito: "Análise",
    enunciado: "Reconhecer que situações diferentes seguem a mesma lógica (o mesmo 'padrão') ajuda a:",
    alternativas: [
      "Reaproveitar soluções que já funcionaram antes",
      "Aumentar a dificuldade do problema de propósito",
      "Esconder informações importantes",
      "Tornar o problema mais lento de resolver",
    ],
    respostaCorreta: 0,
  },
  {
    eixo: "pensamento_computacional",
    subconceito: "Análise",
    enunciado:
      "Analisar um programa que não funcionou como esperado, pra descobrir e corrigir o erro, é chamado de:",
    alternativas: ["Depuração", "Automação", "Backup", "Streaming"],
    respostaCorreta: 0,
  },
  {
    eixo: "pensamento_computacional",
    subconceito: "Automação",
    enunciado: "Uma sequência de passos bem definidos, em ordem, para resolver um problema é chamada de:",
    alternativas: ["Algoritmo", "Servidor", "Navegador", "Rede"],
    respostaCorreta: 0,
  },
  {
    eixo: "pensamento_computacional",
    subconceito: "Automação",
    enunciado: "Programar um dispositivo pra fazer uma tarefa repetitiva sozinho, sem uma pessoa repetir o comando toda vez, é um exemplo de:",
    alternativas: ["Automação", "Impressão", "Backup", "Login"],
    respostaCorreta: 0,
  },

  // ---------------------------------------------------------------------
  // Mundo Digital — Codificação, Processamento, Distribuição
  // ---------------------------------------------------------------------
  {
    eixo: "mundo_digital",
    subconceito: "Codificação",
    enunciado: "Computadores processam informação usando apenas dois símbolos. Esse sistema se chama:",
    alternativas: ["Sistema binário", "Sistema romano", "Sistema decimal", "Sistema hexagonal"],
    respostaCorreta: 0,
  },
  {
    eixo: "mundo_digital",
    subconceito: "Codificação",
    enunciado: "Transformar uma informação (texto, som, imagem) em código que o computador entende é chamado de:",
    alternativas: ["Codificação", "Impressão", "Formatação de texto", "Backup"],
    respostaCorreta: 0,
  },
  {
    eixo: "mundo_digital",
    subconceito: "Processamento",
    enunciado: "A parte do computador responsável por executar instruções e fazer os cálculos é o:",
    alternativas: ["Processador (CPU)", "Mouse", "Teclado", "Cabo de rede"],
    respostaCorreta: 0,
  },
  {
    eixo: "mundo_digital",
    subconceito: "Processamento",
    enunciado:
      "A memória que guarda os dados enquanto o computador está ligado, e perde tudo quando ele desliga, é a:",
    alternativas: ["Memória RAM", "HD/SSD", "Impressora", "Monitor"],
    respostaCorreta: 0,
  },
  {
    eixo: "mundo_digital",
    subconceito: "Distribuição",
    enunciado: "Quando um dado viaja de um dispositivo até outro pela internet, isso é chamado de:",
    alternativas: [
      "Distribuição (transmissão) de dados",
      "Impressão de dados",
      "Backup local",
      "Formatação de disco",
    ],
    respostaCorreta: 0,
  },
  {
    eixo: "mundo_digital",
    subconceito: "Distribuição",
    enunciado:
      "Quando uma mensagem é dividida em pequenos 'pacotes' que viajam separados pela rede até se juntar de novo no destino, isso faz parte de:",
    alternativas: ["Distribuição de dados em rede", "Codificação binária", "Processamento de imagem", "Backup"],
    respostaCorreta: 0,
  },

  // ---------------------------------------------------------------------
  // Cultura Digital — Cidadania Digital, Letramento Digital, Tecnologia e Sociedade
  // ---------------------------------------------------------------------
  {
    eixo: "cultura_digital",
    subconceito: "Cidadania Digital",
    enunciado: "Compartilhar a senha da sua conta com um colega é uma atitude:",
    alternativas: [
      "Arriscada — a senha é só sua",
      "Recomendada entre amigos",
      "Obrigatória em jogos online",
      "Sem nenhum risco",
    ],
    respostaCorreta: 0,
  },
  {
    eixo: "cultura_digital",
    subconceito: "Cidadania Digital",
    enunciado: "Ver um colega sendo ofendido em um grupo online e avisar um adulto de confiança é um exemplo de:",
    alternativas: ["Cidadania digital responsável", "Fofoca", "Invasão de privacidade", "Perda de tempo"],
    respostaCorreta: 0,
  },
  {
    eixo: "cultura_digital",
    subconceito: "Letramento Digital",
    enunciado: "Antes de compartilhar uma notícia chocante, uma boa prática de letramento digital é:",
    alternativas: [
      "Verificar a fonte antes de compartilhar",
      "Compartilhar rápido pra todo mundo saber",
      "Ignorar sempre notícias importantes",
      "Mudar o título pra chamar mais atenção",
    ],
    respostaCorreta: 0,
  },
  {
    eixo: "cultura_digital",
    subconceito: "Letramento Digital",
    enunciado: "O conjunto de rastros que deixamos ao usar a internet (fotos, comentários, buscas) é chamado de:",
    alternativas: ["Pegada digital", "Antivírus", "Nuvem de dados", "Firewall"],
    respostaCorreta: 0,
  },
  {
    eixo: "cultura_digital",
    subconceito: "Tecnologia e Sociedade",
    enunciado:
      "O algoritmo de uma rede social que decide o que aparece primeiro no seu feed é um exemplo de como a tecnologia influencia:",
    alternativas: [
      "A forma como a sociedade se informa e se comporta",
      "Apenas a bateria do celular",
      "Somente o preço da internet",
      "Nada, é só entretenimento",
    ],
    respostaCorreta: 0,
  },
  {
    eixo: "cultura_digital",
    subconceito: "Tecnologia e Sociedade",
    enunciado: "Usar a tecnologia de forma crítica significa:",
    alternativas: [
      "Questionar como e por que ela é usada, não só aceitar tudo sem pensar",
      "Nunca usar tecnologia nenhuma",
      "Aceitar qualquer informação que aparece na tela",
      "Trocar de celular a cada mês",
    ],
    respostaCorreta: 0,
  },
];

export { EIXOS_BNCC_COMPUTACAO, eixoBnccPorChave };

/** Sorteia `quantidade` questões do banco, filtrando por eixo quando informado. Embaralha também as alternativas. */
export function sortearQuestoesBncc(
  quantidade: number,
  eixo: EixoBnccComputacao | "todos"
): QuestaoBnccComputacao[] {
  const banco = eixo === "todos" ? BANCO_BNCC_COMPUTACAO : BANCO_BNCC_COMPUTACAO.filter((q) => q.eixo === eixo);
  const escolhidas = embaralhar(banco).slice(0, Math.min(quantidade, banco.length));

  // embaralha a ordem das alternativas de cada questão, ajustando o índice correto
  return escolhidas.map((q) => {
    const correta = q.alternativas[q.respostaCorreta];
    const alternativasEmbaralhadas = embaralhar(q.alternativas);
    return {
      ...q,
      alternativas: alternativasEmbaralhadas,
      respostaCorreta: alternativasEmbaralhadas.indexOf(correta),
    };
  });
}
