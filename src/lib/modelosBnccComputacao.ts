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

// Etapa da Educação Básica que o modelo foi escrito pra atender — cada eixo
// tem 1 modelo por etapa (3 etapas × 3 eixos = 9 modelos), pra cobrir da
// Educação Infantil ao Ensino Fundamental II, do jeito que o Parecer CNE/CEB
// nº 2/2022 pede (implementação em toda a Educação Básica, não só nos anos
// finais).
export type EtapaBncc = "educacao_infantil" | "anos_iniciais" | "anos_finais";

export const ETAPAS_BNCC: { chave: EtapaBncc; nome: string; faixa: string }[] = [
  { chave: "educacao_infantil", nome: "Educação Infantil", faixa: "4 a 6 anos" },
  { chave: "anos_iniciais", nome: "Anos Iniciais", faixa: "1º ao 5º ano" },
  { chave: "anos_finais", nome: "Anos Finais", faixa: "6º ao 9º ano" },
];

export type ModeloTrilhaBncc = {
  id: string;
  eixo: EixoBnccComputacao;
  etapa: EtapaBncc;
  nome: string;
  descricao: string;
  nivelSugerido: string;
  missoes: MissaoModelo[];
};

export const MODELOS_BNCC_COMPUTACAO: ModeloTrilhaBncc[] = [
  {
    id: "desafio-dos-algoritmos",
    eixo: "pensamento_computacional",
    etapa: "anos_finais",
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
    etapa: "anos_finais",
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
    etapa: "anos_finais",
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
  // -------------------------------------------------------------------
  // EDUCAÇÃO INFANTIL (4 a 6 anos) — tudo desplugado (sem tela, sem quiz
  // escrito) e com correção do professor por observação direta.
  // -------------------------------------------------------------------
  {
    id: "robo-obediente-infantil",
    eixo: "pensamento_computacional",
    etapa: "educacao_infantil",
    nome: "Robô Obediente",
    descricao:
      "Brincar de dar e seguir comandos simples, copiar padrões e organizar uma rotina em passos — o pensamento computacional sem precisar de nenhuma tela.",
    nivelSugerido: "Educação Infantil (4 a 6 anos)",
    missoes: [
      {
        titulo: "O que é um comando?",
        descricao:
          "Roda de conversa: o professor dá comandos simples com o corpo (\"levante a mão\", \"pule uma vez\", \"aponte pra porta\") e explica que isso é um 'comando' — uma instrução clara que alguém segue.",
        tipoAtividade: "leitura",
        xp: 10,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Eu Sou o Robô",
        descricao:
          "Em dupla: uma criança vira 'robô' (só faz exatamente o que ouve) e a outra dá comandos simples (\"anda 2 passos\", \"vira pra direita\", \"para\") pra levar o robô até um ponto marcado na sala. Depois trocam.",
        tipoAtividade: "pratica",
        xp: 20,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Copie o Padrão",
        descricao:
          "Com blocos lógicos, lápis de cor ou tampinhas, o professor monta uma sequência (ex: vermelho-azul-vermelho-azul) e a criança precisa continuar o padrão corretamente.",
        tipoAtividade: "desafio",
        xp: 15,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Quebra-Cabeça da Rotina",
        descricao:
          "Com cartões de imagem embaralhados (acordar, escovar os dentes, tomar café, ir pra escola), a criança coloca na ordem certa e explica por que essa é a ordem.",
        tipoAtividade: "pratica",
        xp: 20,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Meu Comando Favorito",
        descricao:
          "A criança desenha ou conta um comando engraçado que ensinaria pro robô fazer, e o professor (ou um colega) tenta seguir exatamente o que foi desenhado/dito.",
        tipoAtividade: "projeto",
        xp: 25,
        checkpointTipo: "correcao_professor",
      },
    ],
  },
  {
    id: "onde-mora-a-tecnologia-infantil",
    eixo: "mundo_digital",
    etapa: "educacao_infantil",
    nome: "Onde Mora a Tecnologia?",
    descricao:
      "Descobrir, de forma bem concreta, quais objetos ao redor têm tecnologia por dentro e para que servem — o primeiro contato com o mundo digital.",
    nivelSugerido: "Educação Infantil (4 a 6 anos)",
    missoes: [
      {
        titulo: "Caça aos Aparelhos",
        descricao:
          "Passeio pela sala/escola: a criança aponta objetos que 'têm tecnologia por dentro' (TV, celular, roteador, caixa de som) e objetos que não têm (livro, cadeira, lápis).",
        tipoAtividade: "desafio",
        xp: 15,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Tela ou Não é Tela?",
        descricao:
          "Com figuras recortadas de revista ou desenhadas, a criança separa em dois grupos: 'tem tela' e 'não tem tela'.",
        tipoAtividade: "pratica",
        xp: 15,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "De Onde Vem a Internet?",
        descricao:
          "Explicação bem simples, com desenho grande na lousa: a internet viaja escondida por fios e antenas até chegar no celular ou computador de casa.",
        tipoAtividade: "leitura",
        xp: 10,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Desenha Meu Aparelho",
        descricao:
          "A criança desenha um aparelho tecnológico que gosta (TV, videogame, tablet) e conta pra turma pra que ele serve.",
        tipoAtividade: "projeto",
        xp: 25,
        checkpointTipo: "correcao_professor",
      },
    ],
  },
  {
    id: "uso-a-tela-com-cuidado-infantil",
    eixo: "cultura_digital",
    etapa: "educacao_infantil",
    nome: "Uso a Tela com Cuidado",
    descricao:
      "Primeiras noções de cidadania digital: tempo equilibrado de tela, pedir ajuda a um adulto antes de mexer em algo novo e contar quando algo incomoda.",
    nivelSugerido: "Educação Infantil (4 a 6 anos)",
    missoes: [
      {
        titulo: "Hora da Tela",
        descricao:
          "Conversa em roda sobre por que é importante ter um tempo certo pra usar tablet/TV e fazer outras coisas também (brincar, desenhar, brincar lá fora).",
        tipoAtividade: "leitura",
        xp: 10,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Pergunto Antes de Clicar",
        descricao:
          "Com cartões de cena (\"apareceu um joguinho novo\", \"um vídeo estranho começou a tocar\"), a criança decide se deve chamar um adulto antes de continuar.",
        tipoAtividade: "pratica",
        xp: 20,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Isso Me Deixou Triste",
        descricao:
          "Em cenas de exemplo, identificar o que fazer quando algo na tela deixa a criança incomodada ou assustada: contar pra um adulto de confiança, sem guardar segredo.",
        tipoAtividade: "desafio",
        xp: 20,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Combinado de Uso da Tela",
        descricao:
          "Em grupo, a turma desenha e combina 3 regras simples pra usar tablet/TV com segurança, e pendura o cartaz na sala.",
        tipoAtividade: "projeto",
        xp: 25,
        checkpointTipo: "correcao_professor",
      },
    ],
  },

  // -------------------------------------------------------------------
  // ANOS INICIAIS (1º ao 5º ano) — já lê e escreve, então entra o quiz
  // automático (mais simples que o dos Anos Finais) junto com atividades
  // práticas e desplugadas.
  // -------------------------------------------------------------------
  {
    id: "detetive-dos-algoritmos-iniciais",
    eixo: "pensamento_computacional",
    etapa: "anos_iniciais",
    nome: "Detetive dos Algoritmos",
    descricao:
      "Escrever e seguir instruções passo a passo, montar um labirinto de comandos e organizar decisões do dia a dia num fluxograma simples.",
    nivelSugerido: "Anos Iniciais (1º ao 5º ano)",
    missoes: [
      {
        titulo: "O que é um algoritmo?",
        descricao:
          "Leia a explicação e liste, com suas palavras, 3 exemplos de algoritmo do seu dia a dia (uma receita, o caminho de casa até a escola, montar um brinquedo).",
        tipoAtividade: "leitura",
        xp: 10,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Comando Certo, Desenho Certo",
        descricao:
          "Em dupla: escreva, em poucas frases, o passo a passo pra desenhar uma forma simples (uma casinha, um sol). Troque com o colega e peça pra ele desenhar seguindo só o que está escrito — sem adivinhar.",
        tipoAtividade: "pratica",
        xp: 20,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Quiz: Pensamento Computacional",
        descricao: "Mostre o que aprendeu sobre algoritmos, sequência e padrões.",
        tipoAtividade: "quiz",
        xp: 15,
        checkpointTipo: "quiz_automatico",
        quizPerguntas: [
          {
            enunciado: "Uma sequência de passos, em ordem, pra resolver um problema é chamada de:",
            alternativas: ["Algoritmo", "Desenho", "Rede", "Senha"],
            respostaCorreta: "Algoritmo",
          },
          {
            enunciado: "Se um passo da receita ficar fora de ordem, o resultado pode:",
            alternativas: ["Sair errado", "Ficar exatamente igual", "Ficar mais rápido", "Não importa a ordem"],
            respostaCorreta: "Sair errado",
          },
          {
            enunciado: "Reconhecer que duas situações diferentes seguem a mesma 'regra' é observar um:",
            alternativas: ["Padrão", "Vírus", "Ícone", "Cabo"],
            respostaCorreta: "Padrão",
          },
        ],
      },
      {
        titulo: "Labirinto de Comandos",
        descricao:
          "Use o gerador de labirinto de BNCC Computação (aba Geradores) e escreva a sequência de setas (↑ ↓ ← →) que leva o robô do começo ao fim do labirinto, sem esbarrar nas paredes.",
        tipoAtividade: "desafio",
        xp: 25,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Meu Primeiro Fluxograma",
        descricao:
          "Desenhe um fluxograma simples (com setas e uma caixinha de decisão) pra resolver algo do seu dia, tipo decidir o que vestir de acordo com o tempo.",
        tipoAtividade: "projeto",
        xp: 30,
        checkpointTipo: "correcao_professor",
      },
    ],
  },
  {
    id: "como-o-computador-pensa-iniciais",
    eixo: "mundo_digital",
    etapa: "anos_iniciais",
    nome: "Como o Computador Pensa",
    descricao:
      "Primeiro contato com código binário, as partes principais de um computador e como uma mensagem viaja de um aparelho a outro.",
    nivelSugerido: "Anos Iniciais (1º ao 5º ano)",
    missoes: [
      {
        titulo: "Tudo Vira Número",
        descricao:
          "Leia a explicação sobre como o computador só entende dois símbolos (0 e 1) e veja um exemplo de como uma letra vira uma sequência desses números.",
        tipoAtividade: "leitura",
        xp: 10,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Vire um Tradutor Binário",
        descricao:
          "Usando a tabela de conversão que o professor entregar, transforme a primeira letra do seu nome em código binário.",
        tipoAtividade: "pratica",
        xp: 20,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Quiz: Mundo Digital",
        descricao: "Mostre o que aprendeu sobre as partes do computador e como os dados viajam.",
        tipoAtividade: "quiz",
        xp: 15,
        checkpointTipo: "quiz_automatico",
        quizPerguntas: [
          {
            enunciado: "O computador entende só dois símbolos, o 0 e o 1. Esse sistema se chama:",
            alternativas: ["Sistema binário", "Sistema romano", "Alfabeto", "Código Morse"],
            respostaCorreta: "Sistema binário",
          },
          {
            enunciado: "A parte do computador onde você digita as letras é o:",
            alternativas: ["Teclado", "Processador", "Cabo de rede", "HD"],
            respostaCorreta: "Teclado",
          },
          {
            enunciado: "Quando uma mensagem sai do seu celular e chega no celular de um amigo, ela viajou pela:",
            alternativas: ["Internet", "Bateria", "Câmera", "Tela"],
            respostaCorreta: "Internet",
          },
        ],
      },
      {
        titulo: "Partes do Computador",
        descricao:
          "Numa lista ou imagem de um computador, identifique e escreva pra que serve cada parte: mouse, teclado, tela, processador.",
        tipoAtividade: "desafio",
        xp: 20,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Cartaz: Por Dentro do Computador",
        descricao:
          "Em grupo, monte um cartaz mostrando as partes principais de um computador ou celular e o que cada uma faz.",
        tipoAtividade: "projeto",
        xp: 30,
        checkpointTipo: "correcao_professor",
      },
    ],
  },
  {
    id: "cidadao-digital-mirim-iniciais",
    eixo: "cultura_digital",
    etapa: "anos_iniciais",
    nome: "Cidadão Digital Mirim",
    descricao:
      "Aprender a criar senhas seguras, reconhecer notícias falsas simples e praticar boas maneiras ao usar a internet.",
    nivelSugerido: "Anos Iniciais (1º ao 5º ano)",
    missoes: [
      {
        titulo: "O que fica guardado?",
        descricao:
          "Leia sobre o que fica registrado quando usamos a internet (fotos, mensagens, jogos) e escreva por que é importante cuidar do que compartilhamos.",
        tipoAtividade: "leitura",
        xp: 10,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Senha Forte, Senha Fraca",
        descricao:
          "Analise uma lista de senhas de exemplo e marque quais são fracas (nome, \"1234\") e quais são fortes (letras, números e símbolos misturados), depois crie a sua.",
        tipoAtividade: "pratica",
        xp: 20,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Quiz: Cultura Digital",
        descricao: "Mostre o que aprendeu sobre segurança e boas maneiras na internet.",
        tipoAtividade: "quiz",
        xp: 15,
        checkpointTipo: "quiz_automatico",
        quizPerguntas: [
          {
            enunciado: "Uma senha forte deve ter:",
            alternativas: [
              "Letras, números e símbolos misturados",
              "Só o seu nome",
              "Só números fáceis como 1234",
              "A mesma senha de todo mundo",
            ],
            respostaCorreta: "Letras, números e símbolos misturados",
          },
          {
            enunciado: "Se um colega te ofender numa mensagem, o melhor a fazer é:",
            alternativas: [
              "Contar pra um adulto de confiança",
              "Responder xingando também",
              "Guardar segredo",
              "Ignorar e continuar na mesma conversa",
            ],
            respostaCorreta: "Contar pra um adulto de confiança",
          },
          {
            enunciado: "Antes de acreditar numa notícia chocante que aparece no celular, o certo é:",
            alternativas: [
              "Perguntar pra um adulto ou checar a fonte",
              "Compartilhar logo com todo mundo",
              "Mudar o título e postar de novo",
              "Ignorar sempre qualquer notícia",
            ],
            respostaCorreta: "Perguntar pra um adulto ou checar a fonte",
          },
        ],
      },
      {
        titulo: "Fake ou Real?",
        descricao:
          "Veja os exemplos de manchetes que o professor trouxer e decida quais parecem falsas, explicando o que chamou sua atenção (título exagerado, sem fonte).",
        tipoAtividade: "desafio",
        xp: 20,
        checkpointTipo: "correcao_professor",
      },
      {
        titulo: "Campanha do Bem",
        descricao:
          "Em grupo, crie um cartaz com uma dica de uso seguro e respeitoso da internet, pra divulgar na escola.",
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
