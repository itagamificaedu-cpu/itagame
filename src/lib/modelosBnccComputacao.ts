import type { EixoBnccComputacao } from "@/lib/bnccComputacao";

// Trilhas MODELO da aba BNCC Computação — conteúdo pronto, escrito à mão
// (sem chamar IA), pra o professor adicionar na turma em 1 clique, sem
// esperar a geração. Pensadas pro Ensino Fundamental II (6º ao 9º ano),
// mas o professor pode ajustar/editar as missões depois de adicionadas
// (a trilha nasce como rascunho, igual às geradas com IA).
//
// Formato compatível com o que criarTrilhaAPartirDeModelo (actions/trilhas.ts)
// espera pra criar Trilha + Missão em sequência.

export type QuestaoModelo = {
  enunciado: string;
  alternativas: string[];
  respostaCorreta: string;
};

export type MissaoModelo = {
  titulo: string;
  descricao: string;
  tipoAtividade: "video" | "quiz" | "pratica" | "projeto" | "leitura" | "desafio";
  xp: number;
  checkpointTipo: "quiz_automatico" | "correcao_professor";
  quizPerguntas?: QuestaoModelo[];
};

export type ModeloTrilhaBncc = {
  id: string;
  eixo: EixoBnccComputacao;
  nome: string;
  descricao: string;
  nivelSugerido: string;
  missoes: MissaoModelo[];
};

export const MODELOS_BNCC_COMPUTACAO: ModeloTrilhaBncc[] = [
  {
    id: "desafio-dos-algoritmos",
    eixo: "pensamento_computacional",
    nome: "Desafio dos Algoritmos",
    descricao:
      "Aprenda a quebrar problemas em passos simples e criar sequências lógicas, como um verdadeiro programador — sem precisar de computador.",
    nivelSugerido: "Ensino Fundamental II (6º ao 9º ano)",
    missoes: [
      {
        titulo: "O que é um algoritmo?",
        descricao:
          "Leia a explicação e liste 3 exemplos de algoritmos do seu dia a dia (uma receita, escovar os dentes, o caminho de casa até a escola).",
        tipoAtividade: "leitura",
        xp: 10,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Receita Maluca",
        descricao:
          "Em dupla: escreva o passo a passo (algoritmo) de uma tarefa simples, tipo fazer um sanduíche. Troque com o colega e peça pra ele seguir exatamente o que está escrito, nem um passo a mais. Anote o que deu errado — foi por causa de um passo ambíguo?",
        tipoAtividade: "pratica",
        xp: 20,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Quiz: Pensamento Computacional",
        descricao: "Mostre o que aprendeu sobre abstração, decomposição, padrões e algoritmos.",
        tipoAtividade: "quiz",
        xp: 15,
        checkpointTipo: "quiz_automatico",
        quizPerguntas: [
          {
            enunciado: "O que é 'abstração' no pensamento computacional?",
            alternativas: [
              "Ignorar os detalhes desnecessários para focar no que realmente importa",
              "Copiar exatamente um problema sem mudar nada",
              "Desenhar um gráfico bonito",
              "Memorizar um algoritmo decorado",
            ],
            respostaCorreta: "Ignorar os detalhes desnecessários para focar no que realmente importa",
          },
          {
            enunciado: "Dividir um problema grande em partes menores e mais simples de resolver é chamado de:",
            alternativas: ["Decomposição", "Automação", "Compactação", "Distribuição"],
            respostaCorreta: "Decomposição",
          },
          {
            enunciado: "Reconhecer que situações diferentes seguem a mesma lógica (o mesmo 'padrão') ajuda a:",
            alternativas: [
              "Reaproveitar soluções que já funcionaram antes",
              "Aumentar a dificuldade do problema de propósito",
              "Esconder informações importantes",
              "Tornar o problema mais lento de resolver",
            ],
            respostaCorreta: "Reaproveitar soluções que já funcionaram antes",
          },
          {
            enunciado: "Uma sequência de passos bem definidos, em ordem, para resolver um problema é chamada de:",
            alternativas: ["Algoritmo", "Servidor", "Navegador", "Rede"],
            respostaCorreta: "Algoritmo",
          },
        ],
      },
      {
        titulo: "Caça ao Padrão",
        descricao:
          "Observe as sequências (numéricas ou de desenhos) que o professor mostrar e descubra qual é o próximo elemento, explicando a regra que você encontrou.",
        tipoAtividade: "desafio",
        xp: 20,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Meu Primeiro Fluxograma",
        descricao:
          "Desenhe um fluxograma simples (com setas e caixinhas de decisão) para resolver um problema do seu dia a dia — por exemplo, decidir o que vestir de acordo com o clima.",
        tipoAtividade: "projeto",
        xp: 30,
        checkpointTipo: "correcao_professor",
      },
    ],
  },
  {
    id: "por-dentro-da-maquina",
    eixo: "mundo_digital",
    nome: "Missão: Por Dentro da Máquina",
    descricao:
      "Descubra como a informação vira código binário, como o computador processa dados e como eles viajam pela internet até chegar até você.",
    nivelSugerido: "Ensino Fundamental II (6º ao 9º ano)",
    missoes: [
      {
        titulo: "Tudo Vira Número",
        descricao:
          "Leia a explicação sobre como o computador só entende 0 e 1 (código binário) e veja como uma letra ou uma cor viram uma sequência de números.",
        tipoAtividade: "leitura",
        xp: 10,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Vire um Tradutor Binário",
        descricao:
          "Usando a tabela de conversão fornecida pelo professor, transforme seu nome (ou uma palavra curta) em código binário.",
        tipoAtividade: "pratica",
        xp: 20,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Quiz: Mundo Digital",
        descricao: "Mostre o que aprendeu sobre codificação, processamento e distribuição de dados.",
        tipoAtividade: "quiz",
        xp: 15,
        checkpointTipo: "quiz_automatico",
        quizPerguntas: [
          {
            enunciado: "Computadores processam informação usando apenas dois símbolos. Esse sistema se chama:",
            alternativas: ["Sistema binário", "Sistema romano", "Sistema decimal", "Sistema hexagonal"],
            respostaCorreta: "Sistema binário",
          },
          {
            enunciado: "Transformar uma informação (texto, som, imagem) em código que o computador entende é chamado de:",
            alternativas: ["Codificação", "Impressão", "Formatação de texto", "Backup"],
            respostaCorreta: "Codificação",
          },
          {
            enunciado: "A parte do computador responsável por executar instruções e fazer os cálculos é o:",
            alternativas: ["Processador (CPU)", "Mouse", "Teclado", "Cabo de rede"],
            respostaCorreta: "Processador (CPU)",
          },
          {
            enunciado: "Quando um dado viaja de um dispositivo até outro pela internet, isso é chamado de:",
            alternativas: [
              "Distribuição (transmissão) de dados",
              "Impressão de dados",
              "Backup local",
              "Formatação de disco",
            ],
            respostaCorreta: "Distribuição (transmissão) de dados",
          },
        ],
      },
      {
        titulo: "Rastreando um Clique",
        descricao:
          "Descreva (com desenho ou texto) o caminho que uma mensagem de celular percorre desde o seu aparelho até chegar ao celular de um amigo.",
        tipoAtividade: "desafio",
        xp: 20,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Projeto: Meu Dispositivo por Dentro",
        descricao:
          "Pesquise e apresente (em cartaz ou slide) as partes principais de um computador ou celular e a função de cada uma: processador, memória, armazenamento.",
        tipoAtividade: "projeto",
        xp: 30,
        checkpointTipo: "correcao_professor",
      },
    ],
  },
  {
    id: "cidadao-digital",
    eixo: "cultura_digital",
    nome: "Cidadão Digital: Missão Segurança e Respeito",
    descricao:
      "Use a internet e as redes sociais de forma crítica, segura e respeitosa — identificando fake news, protegendo sua privacidade e sabendo agir diante do ciberbullying.",
    nivelSugerido: "Ensino Fundamental II (6º ao 9º ano)",
    missoes: [
      {
        titulo: "Minha Pegada Digital",
        descricao:
          "Leia sobre o que fica registrado quando usamos a internet (fotos, mensagens, buscas) e escreva por que isso importa pra sua privacidade.",
        tipoAtividade: "leitura",
        xp: 10,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Fake ou Real?",
        descricao:
          "Analise as manchetes/prints de exemplo que o professor trouxer e decida quais parecem fake news, justificando com pistas (fonte, data, exagero no título).",
        tipoAtividade: "desafio",
        xp: 20,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Quiz: Cultura Digital",
        descricao: "Mostre o que aprendeu sobre cidadania digital, privacidade e uso responsável da internet.",
        tipoAtividade: "quiz",
        xp: 15,
        checkpointTipo: "quiz_automatico",
        quizPerguntas: [
          {
            enunciado: "Compartilhar a senha da sua conta com um colega é uma atitude:",
            alternativas: [
              "Arriscada — a senha é só sua",
              "Recomendada entre amigos",
              "Obrigatória em jogos online",
              "Sem nenhum risco",
            ],
            respostaCorreta: "Arriscada — a senha é só sua",
          },
          {
            enunciado: "Antes de compartilhar uma notícia chocante, uma boa prática de cidadania digital é:",
            alternativas: [
              "Verificar a fonte antes de compartilhar",
              "Compartilhar rápido pra todo mundo saber",
              "Ignorar sempre notícias importantes",
              "Mudar o título pra chamar mais atenção",
            ],
            respostaCorreta: "Verificar a fonte antes de compartilhar",
          },
          {
            enunciado: "Ver um colega sendo ofendido em um grupo online e avisar um adulto de confiança é um exemplo de:",
            alternativas: ["Cidadania digital responsável", "Fofoca", "Invasão de privacidade", "Perda de tempo"],
            respostaCorreta: "Cidadania digital responsável",
          },
          {
            enunciado: "O conjunto de rastros que deixamos ao usar a internet (fotos, comentários, buscas) é chamado de:",
            alternativas: ["Pegada digital", "Antivírus", "Nuvem de dados", "Firewall"],
            respostaCorreta: "Pegada digital",
          },
        ],
      },
      {
        titulo: "Se Fosse Comigo...",
        descricao:
          "Escreva o que você faria se recebesse uma mensagem ofensiva ou visse um colega sendo atacado em um grupo online.",
        tipoAtividade: "pratica",
        xp: 20,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Campanha do Bem",
        descricao:
          "Em grupo, crie um cartaz, vídeo curto ou post com uma dica de uso seguro e respeitoso da internet, pra divulgar na escola.",
        tipoAtividade: "projeto",
        xp: 30,
        checkpointTipo: "correcao_professor",
      },
    ],
  },
];

export function modeloBnccPorId(id: string | null | undefined) {
  return MODELOS_BNCC_COMPUTACAO.find((modelo) => modelo.id === id);
}
