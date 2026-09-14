import type { EixoBnccComputacao } from "@/lib/bnccComputacao";

// Conteúdo do "Curso de Formação — BNCC Computação (40h)", produto de
// formação continuada pro professor (não confundir com as trilhas
// gamificadas do aluno). Fonte: material próprio ItaGamificaEdu (apostila,
// grade semanal, coletânea de atividades desplugadas), reorganizado nos 3
// eixos OFICIAIS da BNCC Computação (Parecer CNE/CEB nº 2/2022) — o "Módulo
// 4: Programação e Cultura Maker" do material original não é um eixo
// oficial, então vira aqui o bloco de fechamento "Projeto Integrador"
// (aplicação prática dos 3 eixos), não um 4º eixo.

export type BlocoCurso = EixoBnccComputacao | "projeto_integrador";

export const BLOCO_PROJETO_INTEGRADOR = {
  chave: "projeto_integrador" as const,
  nome: "Projeto Integrador Final",
  icone: "🚀",
  cor: "#f59e0b",
  resumo: "Aplicação prática dos 3 eixos — prototipagem de um artefato digital (jogo ou história interativa).",
};

export type SemanaCurso = {
  semana: number;
  bloco: BlocoCurso;
  tema: string;
  atividade: string;
  modalidade: string;
  // Quando a semana tem uma atividade guiada completa (objetivo, materiais,
  // passo a passo, código BNCC — ver ATIVIDADES_GUIADAS_CURSO), esse campo
  // guarda o `nome` dela pra a página do curso mostrar o conteúdo inteiro
  // ao expandir a semana, sem precisar abrir a apostila à parte.
  atividadeGuiadaNome?: string;
};

// As 40 semanas (1 aula de 50min/semana). Semanas 1–30: um eixo oficial por
// bloco de 10 semanas (igual à grade original). Semanas 31–40: fechamento
// prático, reaproveitando o antigo "Módulo 4" como projeto de aplicação.
export const SEMANAS_CURSO_BNCC: SemanaCurso[] = [
  // Eixo 1 — Pensamento Computacional (semanas 1–10)
  { semana: 1, bloco: "pensamento_computacional", tema: "Introdução à Computação", atividade: "Roda de conversa e tempestade de ideias sobre tecnologia no cotidiano.", modalidade: "Conversação / Roda livre", atividadeGuiadaNome: "Tempestade de Ideias: Tecnologia no Meu Dia a Dia" },
  { semana: 2, bloco: "pensamento_computacional", tema: "Decomposição de Problemas", atividade: "Divisão de tarefas diárias em etapas menores e ordenadas.", modalidade: "Desplugada (Cartões de papel)", atividadeGuiadaNome: "Empilhamento de Copos e Decomposição" },
  { semana: 3, bloco: "pensamento_computacional", tema: "Reconhecimento de Padrões", atividade: "Identificação de sequências lógicas em cores, formas e figuras.", modalidade: "Desplugada (Folhas impressas)", atividadeGuiadaNome: "Caça ao Padrão Escondido" },
  { semana: 4, bloco: "pensamento_computacional", tema: "Conceito de Algoritmo", atividade: "Formulação de receitas e instruções ordenadas passo a passo.", modalidade: "Desplugada (Escrita e desenho)", atividadeGuiadaNome: "Receita de Algoritmo" },
  { semana: 5, bloco: "pensamento_computacional", tema: "Simbologia e Comandos", atividade: "Leitura de comandos de direção e orientação de rotas.", modalidade: "Desplugada (Cartões de setas)", atividadeGuiadaNome: "Leitura de Mapas e Comandos de Seta" },
  { semana: 6, bloco: "pensamento_computacional", tema: "O Robô Humano (Parte 1)", atividade: "Montagem da sequência de comandos corporais na matriz de chão.", modalidade: "Desplugada (Fita crepe e cones)", atividadeGuiadaNome: "O Robô Humano" },
  { semana: 7, bloco: "pensamento_computacional", tema: "O Robô Humano (Parte 2)", atividade: "Execução do percurso físico, desvio de obstáculos e testes.", modalidade: "Desplugada (Circuito motor)", atividadeGuiadaNome: "O Robô Humano" },
  { semana: 8, bloco: "pensamento_computacional", tema: "Identificação de Erros (Debugging)", atividade: "Análise e correção de algoritmos que contêm falhas lógicas.", modalidade: "Desplugada (Desafios em folha)", atividadeGuiadaNome: "Caça aos Bugs" },
  { semana: 9, bloco: "pensamento_computacional", tema: "Tomada de Decisão (Se... Então)", atividade: "Jogos condicionais para escolha de caminhos alternativos.", modalidade: "Desplugada (Cartões de decisão)", atividadeGuiadaNome: "Labirinto Condicional" },
  { semana: 10, bloco: "pensamento_computacional", tema: "Avaliação do Eixo 1", atividade: "Registros no Diário de Bordo e preenchimento da rubrica de Pensamento Computacional.", modalidade: "Avaliação Formativa", atividadeGuiadaNome: "Fechamento do Eixo 1: Diário de Bordo e Rubrica" },

  // Eixo 2 — Mundo Digital (semanas 11–20)
  { semana: 11, bloco: "mundo_digital", tema: "Hardware vs. Software", atividade: "Identificação dos componentes físicos e digitais das máquinas.", modalidade: "Desplugada (Ilustrações)", atividadeGuiadaNome: "Corpo por Fora, Corpo por Dentro" },
  { semana: 12, bloco: "mundo_digital", tema: "Classificação de Dados", atividade: "Organização e agrupamento de objetos por múltiplos critérios.", modalidade: "Desplugada (Tampinhas / Peças)", atividadeGuiadaNome: "Organizando a Caixa de Tesouros" },
  { semana: 13, bloco: "mundo_digital", tema: "Representação de Informações", atividade: "Como símbolos, letras e números são codificados.", modalidade: "Desplugada (Tabelas e códigos)", atividadeGuiadaNome: "Cofre de Códigos: Como a Informação Vira Símbolo" },
  { semana: 14, bloco: "mundo_digital", tema: "Coordenadas e Matrizes", atividade: "Localização de pontos em malhas quadriculadas (eixos X e Y).", modalidade: "Desplugada (Grades 8x8 e 10x10)", atividadeGuiadaNome: "Batalha das Coordenadas" },
  { semana: 15, bloco: "mundo_digital", tema: "Pixel Art com Números (Parte 1)", atividade: "Leitura de códigos numéricos e preenchimento da matriz gráfica.", modalidade: "Desplugada (Malha e lápis de cor)", atividadeGuiadaNome: "Pixel Art com Números" },
  { semana: 16, bloco: "mundo_digital", tema: "Pixel Art com Números (Parte 2)", atividade: "Criação de figuras originais e troca de códigos entre colegas.", modalidade: "Desplugada (Criação de matrizes)", atividadeGuiadaNome: "Pixel Art com Números" },
  { semana: 17, bloco: "mundo_digital", tema: "Introdução ao Código Binário", atividade: "Representação de números e estados (0 e 1 / ligado e desligado).", modalidade: "Desplugada (Cartões de pontos)", atividadeGuiadaNome: "Contagem Binária com Cartões" },
  { semana: 18, bloco: "mundo_digital", tema: "Redes e Comunicação", atividade: "Simulação do fluxo de envio e recepção de pacotes de dados.", modalidade: "Desplugada (Envelopes e papel pardo)", atividadeGuiadaNome: "Envio de Pacotes na Rede de Papel" },
  { semana: 19, bloco: "mundo_digital", tema: "Grafos e Sistemas de Rotas", atividade: "Interconexão de pontos e busca pelo caminho mais curto.", modalidade: "Desplugada (Desafios impressos)", atividadeGuiadaNome: "O Caminho Mais Curto" },
  { semana: 20, bloco: "mundo_digital", tema: "Avaliação do Eixo 2", atividade: "Análise das matrizes criadas e preenchimento da rubrica de Mundo Digital.", modalidade: "Avaliação Formativa", atividadeGuiadaNome: "Fechamento do Eixo 2: Galeria e Rubrica" },

  // Eixo 3 — Cultura Digital (semanas 21–30)
  { semana: 21, bloco: "cultura_digital", tema: "Evolução das Tecnologias", atividade: "Linha do tempo sobre o impacto dos artefatos na sociedade.", modalidade: "Desplugada (Imagens históricas)", atividadeGuiadaNome: "Linha do Tempo da Tecnologia" },
  { semana: 22, bloco: "cultura_digital", tema: "Pegada Digital e Privacidade", atividade: "Reflexão sobre as marcas e informações que deixamos na web.", modalidade: "Roda de Debate / Estudo de caso", atividadeGuiadaNome: "Minha Pegada Digital" },
  { semana: 23, bloco: "cultura_digital", tema: "Criação de Senhas Seguras", atividade: "Construção e teste de combinações fortes para proteção de dados.", modalidade: "Desplugada (Jogo das senhas)", atividadeGuiadaNome: "O Cofre das Senhas Fortes" },
  { semana: 24, bloco: "cultura_digital", tema: "Letramento Midiático", atividade: "Análise crítica sobre quem produz e compartilha conteúdos.", modalidade: "Leitura Guiada", atividadeGuiadaNome: "Quem Está Falando Comigo?" },
  { semana: 25, bloco: "cultura_digital", tema: "Detetives da Informação (Parte 1)", atividade: "Investigação de notícias reais e fictícias para checar fontes.", modalidade: "Leitura de Fichas", atividadeGuiadaNome: "Detetives da Informação" },
  { semana: 26, bloco: "cultura_digital", tema: "Detetives da Informação (Parte 2)", atividade: "Identificação de sinais de alerta de Fake News e boatos.", modalidade: "Análise em Grupo", atividadeGuiadaNome: "Detetives da Informação" },
  { semana: 27, bloco: "cultura_digital", tema: "Netiqueta e Convivência", atividade: "Prevenção ao cyberbullying e boas atitudes em ambientes virtuais.", modalidade: "Estudo de Casos", atividadeGuiadaNome: "Regras de Boa Convivência Online" },
  { semana: 28, bloco: "cultura_digital", tema: "Direitos Autorais e Imagem", atividade: "Uso ético de obras, textos, imagens e atribuição de autoria.", modalidade: "Debate e Exemplos", atividadeGuiadaNome: "Isso é Meu ou Foi Emprestado?" },
  { semana: 29, bloco: "cultura_digital", tema: "Guia de Boas Práticas da Turma", atividade: "Elaboração coletiva do cartaz de regras de convivência digital.", modalidade: "Cartolina e Papel Pardo", atividadeGuiadaNome: "Nosso Guia de Convivência Digital" },
  { semana: 30, bloco: "cultura_digital", tema: "Avaliação do Eixo 3", atividade: "Autoavaliação de atitudes digitais e preenchimento da rubrica de Cultura Digital.", modalidade: "Avaliação Formativa", atividadeGuiadaNome: "Fechamento do Eixo 3: Autoavaliação e Rubrica" },

  // Projeto Integrador Final (semanas 31–40) — aplica os 3 eixos juntos
  { semana: 31, bloco: "projeto_integrador", tema: "Lógica de Blocos de Programação", atividade: "Associação de comandos visuais a ações na tela ou no papel.", modalidade: "Plugada / Blocos Físicos", atividadeGuiadaNome: "Primeiros Passos com Blocos Lógicos" },
  { semana: 32, bloco: "projeto_integrador", tema: "Estruturas de Repetição (Loops)", atividade: "Otimização de rotinas repetitivas utilizando laços de repetição.", modalidade: "Prática de Blocos", atividadeGuiadaNome: "Repetir Sem Repetir o Código" },
  { semana: 33, bloco: "projeto_integrador", tema: "Variáveis e Eventos", atividade: "Controle de pontuação, tempo e respostas dos personagens.", modalidade: "Prática de Blocos", atividadeGuiadaNome: "Guardando Informação: Pontos, Tempo e Vidas" },
  { semana: 34, bloco: "projeto_integrador", tema: "Planejamento (Storyboarding)", atividade: "Esboço e roteiro da história interativa ou jogo a ser criado.", modalidade: "Desplugada (Desenho do roteiro)", atividadeGuiadaNome: "Storyboard do Meu Jogo ou História" },
  { semana: 35, bloco: "projeto_integrador", tema: "Artefato Digital (Parte 1)", atividade: "Montagem dos cenários, personagens e estrutura inicial do projeto.", modalidade: "Prototipagem Maker", atividadeGuiadaNome: "Montando o Cenário e os Personagens" },
  { semana: 36, bloco: "projeto_integrador", tema: "Artefato Digital (Parte 2)", atividade: "Programação dos movimentos, regras do jogo e interações.", modalidade: "Prototipagem Maker", atividadeGuiadaNome: "Programando as Regras do Jogo" },
  { semana: 37, bloco: "projeto_integrador", tema: "Testes e Debugging", atividade: "Troca de projetos entre os alunos para encontrar e corrigir falhas.", modalidade: "Teste entre Pares", atividadeGuiadaNome: "Teste às Cegas: Achando os Bugs dos Colegas" },
  { semana: 38, bloco: "projeto_integrador", tema: "Refatoração e Polimento", atividade: "Ajustes finais na lógica de programação e na estética visual.", modalidade: "Finalização Maker", atividadeGuiadaNome: "Últimos Ajustes: Lógica e Estética" },
  { semana: 39, bloco: "projeto_integrador", tema: "Feira de Exposição dos Projetos", atividade: "Apresentação dos jogos e histórias interativas criados pelas turmas.", modalidade: "Mostra Cultural", atividadeGuiadaNome: "Feira de Projetos Maker" },
  { semana: 40, bloco: "projeto_integrador", tema: "Encerramento e Certificação", atividade: "Consolidação das avaliações e fechamento do curso de formação.", modalidade: "Fechamento do Curso", atividadeGuiadaNome: "Fechamento do Curso e Entrega dos Certificados" },
];

export const TOTAL_SEMANAS_CURSO = SEMANAS_CURSO_BNCC.length;

// Atividades-modelo guiadas (passo a passo completo), 3 por eixo — extraídas
// da coletânea de atividades desplugadas ItaGamificaEdu, com o código de
// habilidade BNCC correspondente onde já mapeado.
export type AtividadeGuiadaCurso = {
  eixo: BlocoCurso;
  nome: string;
  objetivo: string;
  faixaEtaria: string;
  recursos: string;
  passoAPasso: string[];
  habilidadeBncc?: string;
};

export const ATIVIDADES_GUIADAS_CURSO: AtividadeGuiadaCurso[] = [
  {
    eixo: "pensamento_computacional",
    nome: "O Robô Humano",
    objetivo: "Desenvolver a noção de algoritmo, sequenciamento lógico e correção de erros (debugging).",
    faixaEtaria: "1º ao 5º Ano",
    recursos: "Fita de chão, cones/cadeiras, cartões de setas.",
    passoAPasso: [
      "Monte uma matriz de quadros no chão usando fita crepe.",
      "Posicione obstáculos (cones) e um ponto de chegada.",
      "Um aluno atua como 'Programador' e organiza os cartões de comando (Avançar, Girar Esquerda/Direita).",
      "Outro aluno atua como 'Robô' e executa estritamente a sequência de instruções programada.",
      "Caso o robô colida com um obstáculo, a turma analisa onde ocorreu a falha e corrige o algoritmo (debug).",
    ],
    habilidadeBncc: "EF01CO01 — Criar e seguir algoritmos simples para resolver problemas cotidianos e trajetos corporais.",
  },
  {
    eixo: "pensamento_computacional",
    nome: "Labirinto Condicional",
    objetivo: "Compreender estruturas condicionais (SE... ENTÃO / SENÃO) e controle de fluxo.",
    faixaEtaria: "3º ao 7º Ano",
    recursos: "Folha impressa com labirinto e cartões de pergunta.",
    passoAPasso: [
      "O estudante recebe um mapa impresso contendo bifurcações e cartas de teste no caminho.",
      "Ao chegar a um ponto de decisão, lê a carta (ex: 'SE a cor da casa for azul, avance 2 casas; SE NÃO, vire à esquerda').",
      "O aluno registra a rota percorrida e a condição necessária para atingir a saída com sucesso.",
    ],
    habilidadeBncc: "EF02CO02 — Utilizar estruturas condicionais simples no planejamento de soluções e regras de jogos.",
  },
  {
    eixo: "pensamento_computacional",
    nome: "Empilhamento de Copos e Decomposição",
    objetivo: "Aplicar a decomposição de problemas e a padronização de rotinas repetitivas (loops).",
    faixaEtaria: "1º ao 6º Ano",
    recursos: "Copos plásticos reutilizáveis e cartões de instruções.",
    passoAPasso: [
      "Uma pirâmide de copos-modelo é apresentada à turma.",
      "Os alunos devem escrever um algoritmo instrucional descrevendo a posição exata de cada copo (use o bloco REPETIR Nx quando possível).",
      "Um colega tenta reproduzir a pirâmide lendo apenas o algoritmo escrito, sem ver o modelo original.",
    ],
    habilidadeBncc: "EF03CO01 — Identificar padrões de repetição em processos e otimizar sequências lógicas.",
  },
  {
    eixo: "mundo_digital",
    nome: "Pixel Art com Números",
    objetivo: "Compreender como computadores armazenam e exibem imagens por meio de matrizes e pixels.",
    faixaEtaria: "2º ao 9º Ano",
    recursos: "Malha quadriculada 8x8 ou 10x10 e uma folha de dados codificados.",
    passoAPasso: [
      "Distribua malhas quadriculadas acompanhadas de uma folha de dados codificados (0 = branco/desligado, 1 = preto/ligado).",
      "Os estudantes leem os códigos numéricos e preenchem os quadradinhos correspondentes, descobrindo a figura oculta.",
      "Desafio extra: os alunos criam seu próprio desenho em Pixel Art e escrevem o código numérico para um colega decodificar.",
    ],
    habilidadeBncc: "EF03CO02 — Decodificar e representar informações (imagens e texto) por meio de matrizes e sistemas simbólicos.",
  },
  {
    eixo: "mundo_digital",
    nome: "Contagem Binária com Cartões",
    objetivo: "Dominar o sistema numérico binário e a representação de dados na memória do computador.",
    faixaEtaria: "4º ao 9º Ano",
    recursos: "5 cartões com pontos (16, 8, 4, 2, 1).",
    passoAPasso: [
      "Cinco alunos seguram os cartões na frente da turma organizados em ordem de potência de 2.",
      "Um cartão virado para frente representa bit '1' (ligado); virado para trás representa '0' (desligado).",
      "A turma descobre como formar qualquer número somando apenas os pontos visíveis (ex: número 9 = [8] + [1] → 01001).",
    ],
    habilidadeBncc: "EF04CO03 — Compreender o armazenamento de dados numéricos em sistemas computacionais via código binário.",
  },
  {
    eixo: "mundo_digital",
    nome: "Envio de Pacotes na Rede de Papel",
    objetivo: "Simular o funcionamento da internet, o roteamento de redes e os cabeçalhos de pacotes.",
    faixaEtaria: "5º ao 9º Ano",
    recursos: "Envelopes de papel e fichas com endereços simulando IP.",
    passoAPasso: [
      "Alunos assumem os papéis de 'Roteadores' e 'Dispositivos de Origem/Destino'.",
      "Uma mensagem longa é dividida em 3 pequenos pedaços (pacotes) com número de sequência e endereço.",
      "Os roteadores repassam os envelopes pelo menor caminho na sala até o destino, onde a mensagem é remontada.",
    ],
    habilidadeBncc: "EF06CO02 — Compreender o fluxo de transmissão de dados em redes de comunicação e protocolos da internet.",
  },
  {
    eixo: "cultura_digital",
    nome: "Detetives da Informação",
    objetivo: "Desenvolver letramento midiático, verificação de fontes e combate à desinformação.",
    faixaEtaria: "3º ao 9º Ano",
    recursos: "Fichas impressas com textos fictícios e reportagens reais.",
    passoAPasso: [
      "Em equipes, os alunos recebem diferentes notícias e usam o checklist de checagem (Autor, Data, Fonte, Sensacionalismo).",
      "Classificam cada texto como 'Informação Confiável' ou 'Boato/Suspeito'.",
      "Apresentam os argumentos e critérios que justificaram a classificação, e a turma monta o 'Guia de Boas Práticas e Convivência Digital'.",
    ],
    habilidadeBncc: "EF05CO04 — Avaliar criticamente a veracidade de conteúdos digitais e adotar condutas éticas na rede.",
  },
  {
    eixo: "cultura_digital",
    nome: "O Cofre das Senhas Fortes",
    objetivo: "Aprender sobre proteção de dados, privacidade e métodos simples de criptografia.",
    faixaEtaria: "4º ao 9º Ano",
    recursos: "Disco de Cifra de César impresso.",
    passoAPasso: [
      "Os alunos constroem uma cifra giratória de papel para deslocar as letras do alfabeto por um número-chave.",
      "Codificam mensagens secretas sobre segurança na internet e trocam com duplas para decifrar.",
      "Testam senhas criadas contra a lista de requisitos de segurança (comprimento, símbolos, números, sem dados pessoais).",
    ],
    habilidadeBncc: "EF07CO03 — Compreender conceitos básicos de criptografia e proteção de identidade digital na rede.",
  },

  // A partir daqui: atividades criadas pra preencher as semanas que no
  // material de origem tinham só uma linha de resumo na grade semanal, sem
  // passo a passo completo — escritas no mesmo padrão pedagógico das
  // atividades acima (desplugadas sempre que possível), com código BNCC
  // plausível quando a semana corresponde a uma habilidade objetiva.
  {
    eixo: "pensamento_computacional",
    nome: "Tempestade de Ideias: Tecnologia no Meu Dia a Dia",
    objetivo: "Levantar o repertório prévio da turma sobre onde a tecnologia aparece no cotidiano, sensibilizando pro tema do curso.",
    faixaEtaria: "Educação Infantil ao 9º Ano",
    recursos: "Quadro ou cartaz, canetinhas, post-its ou pedaços de papel.",
    passoAPasso: [
      "Pergunte à turma: 'Onde vocês veem tecnologia no dia a dia?' e anote as respostas no quadro.",
      "Separe as respostas em dois grupos: 'coisas com tela' e 'coisas sem tela, mas que também são tecnologia' (ex: lápis, roda, semáforo).",
      "Explique que Computação não é só usar celular — é aprender a pensar como quem cria essas soluções.",
      "Feche com uma votação simples: qual dessas tecnologias a turma mais quer entender por dentro esse ano?",
    ],
  },
  {
    eixo: "pensamento_computacional",
    nome: "Caça ao Padrão Escondido",
    objetivo: "Desenvolver a percepção de sequências lógicas e regularidades, base do reconhecimento de padrões.",
    faixaEtaria: "Educação Infantil ao 5º Ano",
    recursos: "Cartões ou folhas impressas com sequências de cores/formas, lápis de cor.",
    passoAPasso: [
      "Apresente sequências incompletas (ex: 🔴🔵🔴🔵___) e peça que os alunos descubram o próximo elemento.",
      "Aumente a dificuldade com sequências de 3 elementos e padrões numéricos simples.",
      "Em duplas, um aluno cria uma sequência e o colega tenta adivinhar a regra e completar.",
      "Discuta: por que reconhecer padrões ajuda o computador (e a gente) a resolver problemas mais rápido?",
    ],
    habilidadeBncc: "EF01CO02 — Reconhecer padrões e regularidades em sequências de objetos, sons, cores ou formas.",
  },
  {
    eixo: "pensamento_computacional",
    nome: "Receita de Algoritmo",
    objetivo: "Compreender que um algoritmo é uma sequência ordenada e precisa de instruções para resolver um problema.",
    faixaEtaria: "1º ao 6º Ano",
    recursos: "Papel e lápis (ou ingredientes/objetos do dia a dia, como fazer um sanduíche).",
    passoAPasso: [
      "Peça que os alunos escrevam o passo a passo de uma tarefa simples (escovar os dentes, fazer um sanduíche) como se explicassem pra um robô que não sabe nada.",
      "Troque as instruções com um colega, que deve executá-las exatamente como escrito, sem completar lacunas por conta própria.",
      "Quando a execução falhar por falta de detalhe, discuta por que precisão importa em um algoritmo.",
      "Reescrevam juntos a versão corrigida e mais detalhada.",
    ],
    habilidadeBncc: "EF02CO01 — Elaborar algoritmos simples, em linguagem natural, para resolver problemas do cotidiano.",
  },
  {
    eixo: "pensamento_computacional",
    nome: "Leitura de Mapas e Comandos de Seta",
    objetivo: "Associar símbolos gráficos (setas) a comandos de movimento e orientação espacial.",
    faixaEtaria: "1º ao 5º Ano",
    recursos: "Cartões de setas (↑ ↓ ← →) e uma folha com um percurso simples desenhado.",
    passoAPasso: [
      "Apresente os 4 cartões de comando (Avançar, Girar Esquerda, Girar Direita, Voltar) e pratique cada um com o corpo.",
      "Em duplas, um aluno lê uma sequência curta de setas em voz alta e o colega executa os movimentos.",
      "Desenhe um mini percurso no papel e peça que escrevam a sequência de setas do início ao fim.",
      "Compartilhe algumas soluções e verifique se todas chegam ao mesmo destino por caminhos diferentes.",
    ],
    habilidadeBncc: "EF01CO01 — Criar e seguir algoritmos simples para resolver problemas cotidianos e trajetos corporais.",
  },
  {
    eixo: "pensamento_computacional",
    nome: "Caça aos Bugs",
    objetivo: "Desenvolver a capacidade de identificar e corrigir falhas lógicas em uma sequência de instruções (debugging).",
    faixaEtaria: "2º ao 7º Ano",
    recursos: "Fichas com algoritmos 'quebrados' (passo fora de ordem ou faltando), lápis.",
    passoAPasso: [
      "Distribua fichas com um algoritmo simples que contém um erro proposital.",
      "Em duplas, simulem a execução passo a passo ('dry run'), apontando com o dedo, até identificar onde a lógica falha.",
      "Reescrevam o algoritmo corrigido e testem novamente com um colega executando à risca.",
      "Discuta: por que 'testar seguindo à risca' é a melhor forma de achar um bug?",
    ],
    habilidadeBncc: "EF03CO03 — Identificar e corrigir erros (bugs) em algoritmos simples por meio de testes passo a passo.",
  },
  {
    eixo: "pensamento_computacional",
    nome: "Fechamento do Eixo 1: Diário de Bordo e Rubrica",
    objetivo: "Consolidar a avaliação formativa do eixo Pensamento Computacional, registrando evidências de aprendizagem.",
    faixaEtaria: "Todas as etapas",
    recursos: "Diário de Bordo do aluno e a rubrica 'Algoritmos e Lógica' (ver apostila, seção de rubricas).",
    passoAPasso: [
      "Peça que cada aluno registre no Diário de Bordo qual desafio do bimestre achou mais fácil e qual achou mais difícil, e por quê.",
      "Aplique um desafio-síntese rápido combinando decomposição, padrão, algoritmo e condicional.",
      "Use a rubrica 'Algoritmos e Lógica' pra registrar o nível de cada aluno.",
      "Dê um retorno individual breve, destacando um ponto forte e um próximo passo.",
    ],
  },
  {
    eixo: "mundo_digital",
    nome: "Corpo por Fora, Corpo por Dentro",
    objetivo: "Diferenciar componentes físicos (hardware) de programas e instruções (software) em um sistema digital.",
    faixaEtaria: "2º ao 7º Ano",
    recursos: "Imagens/recortes de componentes de computador e de ícones de programas/apps.",
    passoAPasso: [
      "Compare com o corpo humano: hardware é como o corpo (o que dá pra tocar), software é como os pensamentos e comandos.",
      "Distribua recortes variados e peça que a turma classifique em dois cartazes: 'Hardware' e 'Software'.",
      "Discuta casos que geram dúvida (ex: um jogo instalado é software, o computador é hardware).",
      "Feche pedindo que cada aluno cite 1 hardware e 1 software que usa em casa.",
    ],
    habilidadeBncc: "EF03CO04 — Distinguir hardware (componentes físicos) de software (programas e instruções) em sistemas digitais.",
  },
  {
    eixo: "mundo_digital",
    nome: "Organizando a Caixa de Tesouros",
    objetivo: "Praticar a classificação e organização de dados por múltiplos critérios, base da organização de bancos de dados.",
    faixaEtaria: "1º ao 6º Ano",
    recursos: "Tampinhas de garrafa coloridas ou botões variados, potes/caixas pra separação.",
    passoAPasso: [
      "Espalhe uma mistura de objetos variados sobre a mesa.",
      "Peça que os alunos organizem os objetos por um critério (ex: cor).",
      "Em seguida, peça que reorganizem os mesmos objetos por outro critério (ex: tamanho).",
      "Discuta: sites de compras 'filtram' produtos usando essa mesma ideia de classificar dados por critérios.",
    ],
    habilidadeBncc: "EF04CO02 — Classificar e organizar dados segundo múltiplos critérios.",
  },
  {
    eixo: "mundo_digital",
    nome: "Cofre de Códigos: Como a Informação Vira Símbolo",
    objetivo: "Entender que letras, números e símbolos são formas convencionadas de representar informação.",
    faixaEtaria: "3º ao 8º Ano",
    recursos: "Tabela de correspondência simples (ex: A=1, B=2...), papel e lápis.",
    passoAPasso: [
      "Mostre que o Braile, o Código Morse e os emojis são formas diferentes de representar a mesma informação.",
      "Distribua a tabela letra-número e peça que os alunos codifiquem seu nome.",
      "Troquem os códigos entre duplas para decodificar o nome do colega.",
      "Discuta: por que os computadores também precisam de um código combinado (como o binário)?",
    ],
    habilidadeBncc: "EF04CO04 — Compreender que informações podem ser representadas por diferentes sistemas de códigos e símbolos.",
  },
  {
    eixo: "mundo_digital",
    nome: "Batalha das Coordenadas",
    objetivo: "Localizar pontos em uma malha quadriculada usando coordenadas (linha, coluna / eixos X e Y).",
    faixaEtaria: "3º ao 8º Ano",
    recursos: "Malha quadriculada 8x8 ou 10x10, duas cores de lápis por dupla.",
    passoAPasso: [
      "Apresente a malha com colunas (eixo X) e linhas (eixo Y) numeradas, mostrando como localizar o ponto (3,4).",
      "Em duplas, um aluno marca 3 pontos em segredo numa lista de coordenadas.",
      "O colega tenta descobrir os pontos escondidos (como um 'Batalha Naval' simplificado) até acertar todos.",
      "Feche relacionando com a lógica usada no Pixel Art e em mapas/jogos digitais.",
    ],
    habilidadeBncc: "EF04CO05 — Localizar e representar pontos em um sistema de coordenadas cartesianas simples.",
  },
  {
    eixo: "mundo_digital",
    nome: "O Caminho Mais Curto",
    objetivo: "Explorar noções básicas de grafos (pontos conectados) e busca do caminho mais curto entre dois pontos.",
    faixaEtaria: "5º ao 9º Ano",
    recursos: "Folha com um mapa de pontos conectados por linhas, cada uma com uma 'distância' em passos.",
    passoAPasso: [
      "Apresente um mapa simples de 'cidades' conectadas por 'estradas', cada uma com um número de passos.",
      "Peça que os alunos encontrem todos os caminhos possíveis entre o ponto A e o ponto Z.",
      "Peça que descubram qual caminho é o mais curto, somando os números de cada trecho.",
      "Relacione com aplicativos de mapa (GPS), que fazem esse mesmo cálculo em milissegundos.",
    ],
    habilidadeBncc: "EF07CO04 — Compreender a representação de redes por meio de grafos e identificar rotas mais eficientes.",
  },
  {
    eixo: "mundo_digital",
    nome: "Fechamento do Eixo 2: Galeria e Rubrica",
    objetivo: "Consolidar a avaliação formativa do eixo Mundo Digital através da análise das produções da turma.",
    faixaEtaria: "Todas as etapas",
    recursos: "Pixel Arts e matrizes criadas nas semanas anteriores, rubrica 'Dados e Matrizes'.",
    passoAPasso: [
      "Monte uma pequena galeria na sala com os Pixel Arts e códigos criados pelos alunos no bimestre.",
      "Cada aluno apresenta rapidamente sua criação e o código que a gerou pra um colega decodificar ao vivo.",
      "Use a rubrica 'Dados e Matrizes' pra registrar o nível de cada estudante.",
      "Feche perguntando qual dessas ideias mais surpreendeu a turma.",
    ],
  },
  {
    eixo: "cultura_digital",
    nome: "Linha do Tempo da Tecnologia",
    objetivo: "Refletir sobre a evolução dos artefatos tecnológicos e seu impacto na sociedade ao longo do tempo.",
    faixaEtaria: "3º ao 9º Ano",
    recursos: "Imagens impressas de tecnologias antigas e atuais, barbante ou linha no chão/parede.",
    passoAPasso: [
      "Distribua imagens de tecnologias de diferentes épocas embaralhadas.",
      "Em grupos, os alunos organizam as imagens em ordem cronológica ao longo de uma linha do tempo física.",
      "Cada grupo explica por que aquela tecnologia foi substituída ou evoluiu pra a próxima.",
      "Debate final: o que vocês acham que vai substituir o smartphone daqui a 20 anos?",
    ],
    habilidadeBncc: "EF06CO03 — Analisar a evolução histórica das tecnologias digitais e seus impactos sociais.",
  },
  {
    eixo: "cultura_digital",
    nome: "Minha Pegada Digital",
    objetivo: "Refletir sobre os rastros de informação (pegada digital) deixados ao usar a internet e a importância da privacidade.",
    faixaEtaria: "4º ao 9º Ano",
    recursos: "Papel e lápis, ou quadro pra listar exemplos coletivos.",
    passoAPasso: [
      "Explique o conceito de pegada digital: tudo que compartilhamos ou pesquisamos online deixa um rastro.",
      "Em duplas, os alunos listam exemplos de informações que uma pessoa pode 'deixar' sem perceber.",
      "Promova uma roda de debate: isso é sempre ruim? Como usar a internet sem se expor demais?",
      "Feche com 3 combinados práticos da turma pra proteger a própria privacidade online.",
    ],
    habilidadeBncc: "EF06CO04 — Refletir sobre a própria pegada digital e adotar práticas de proteção da privacidade.",
  },
  {
    eixo: "cultura_digital",
    nome: "Quem Está Falando Comigo?",
    objetivo: "Desenvolver o pensamento crítico sobre quem produz, com que intenção e para quem se destina um conteúdo digital.",
    faixaEtaria: "4º ao 9º Ano",
    recursos: "Exemplos impressos de posts, propagandas e vídeos (podem ser prints).",
    passoAPasso: [
      "Apresente 3-4 exemplos de conteúdos digitais variados (propaganda, notícia, post de influenciador).",
      "Pra cada um, a turma responde: quem fez isso? Por que fez? Quem essa pessoa quer alcançar?",
      "Discuta como um mesmo fato pode ser contado de formas diferentes dependendo de quem fala e por quê.",
      "Feche com a reflexão: antes de acreditar ou compartilhar, vale perguntar 'quem está falando comigo, e por quê?'",
    ],
    habilidadeBncc: "EF07CO05 — Analisar criticamente a intencionalidade por trás de conteúdos midiáticos.",
  },
  {
    eixo: "cultura_digital",
    nome: "Regras de Boa Convivência Online",
    objetivo: "Refletir sobre boas práticas de convivência em ambientes digitais e prevenção ao cyberbullying.",
    faixaEtaria: "3º ao 9º Ano",
    recursos: "Cartões com situações fictícias de conflito online, papel pra respostas.",
    passoAPasso: [
      "Apresente pequenas situações de conflito em grupos de mensagem ou redes sociais.",
      "Em grupos, discutam o que deu errado e o que a pessoa poderia ter feito diferente.",
      "Cada grupo propõe uma 'regra de ouro' de convivência online baseada na situação analisada.",
      "Junte as regras de todos os grupos num mural coletivo da turma.",
    ],
    habilidadeBncc: "EF05CO05 — Adotar condutas éticas de convivência em ambientes digitais, prevenindo situações de cyberbullying.",
  },
  {
    eixo: "cultura_digital",
    nome: "Isso é Meu ou Foi Emprestado?",
    objetivo: "Compreender a importância dos direitos autorais e da atribuição correta de autoria em conteúdos digitais.",
    faixaEtaria: "5º ao 9º Ano",
    recursos: "Exemplos de imagens/textos com e sem crédito de autor (impressos ou projetados).",
    passoAPasso: [
      "Explique que toda imagem, música ou texto tem um autor, mesmo quando está 'solto' na internet.",
      "Mostre exemplos de uso correto (com crédito/licença) e incorreto (cópia sem citar a fonte).",
      "Em duplas, os alunos praticam escrever uma citação correta de fonte para uma imagem dada.",
      "Debate: por que copiar e colar sem citar prejudica quem criou o conteúdo original?",
    ],
    habilidadeBncc: "EF08CO02 — Reconhecer a importância dos direitos autorais e da atribuição de autoria no ambiente digital.",
  },
  {
    eixo: "cultura_digital",
    nome: "Nosso Guia de Convivência Digital",
    objetivo: "Sistematizar, em produção coletiva, tudo o que a turma aprendeu sobre segurança, ética e boas práticas digitais.",
    faixaEtaria: "Todas as etapas",
    recursos: "Cartolina ou papel pardo, canetinhas, os registros das semanas anteriores do eixo.",
    passoAPasso: [
      "Revise coletivamente os temas do eixo Cultura Digital (senhas, fake news, privacidade, netiqueta, direitos autorais).",
      "Em grupos, cada grupo fica responsável por uma 'regra de ouro' de um desses temas e a ilustra na cartolina.",
      "Montem juntos o Guia de Boas Práticas da Turma, unindo as contribuições de todos os grupos.",
      "Decida com a turma onde o guia vai ficar exposto (mural da sala, corredor da escola).",
    ],
  },
  {
    eixo: "cultura_digital",
    nome: "Fechamento do Eixo 3: Autoavaliação e Rubrica",
    objetivo: "Consolidar a avaliação formativa do eixo Cultura Digital por meio da autorreflexão do estudante.",
    faixaEtaria: "Todas as etapas",
    recursos: "Ficha de autoavaliação (ver Caderno do Aluno) e a rubrica 'Ética e Segurança'.",
    passoAPasso: [
      "Peça que cada aluno preencha a ficha de autoavaliação sobre segurança e ética digital.",
      "Promova uma roda final: cada aluno compartilha 1 atitude que vai mudar no uso da internet.",
      "Use a rubrica 'Ética e Segurança' pra registrar o nível de cada estudante.",
      "Anuncie o Projeto Integrador, onde a turma vai criar seu próprio jogo ou história aplicando os 3 eixos.",
    ],
  },
  {
    eixo: "projeto_integrador",
    nome: "Primeiros Passos com Blocos Lógicos",
    objetivo: "Associar comandos visuais (blocos) a ações, introduzindo a lógica de programação em blocos (ex: Scratch).",
    faixaEtaria: "3º ao 9º Ano",
    recursos: "Cartões de blocos lógicos impressos (Mover, Girar, Repetir, Se...Então) ou Scratch, se disponível.",
    passoAPasso: [
      "Apresente os blocos básicos: eventos ('Quando clicar na bandeira verde'), movimento, som e controle.",
      "Monte junto com a turma uma sequência simples: o personagem anda e emite um som.",
      "Em duplas, os alunos montam sua própria sequência curta de blocos e testam.",
      "Discuta em que essa lógica de blocos se parece com os algoritmos desplugados do Eixo 1.",
    ],
    habilidadeBncc: "EF06CO05 — Utilizar lógica de programação em blocos para criar sequências de comandos simples.",
  },
  {
    eixo: "projeto_integrador",
    nome: "Repetir Sem Repetir o Código",
    objetivo: "Compreender e aplicar estruturas de repetição (loops) para otimizar sequências de comandos.",
    faixaEtaria: "3º ao 9º Ano",
    recursos: "Cartões de blocos 'Repetir Nx', exemplos de rotinas repetitivas do cotidiano.",
    passoAPasso: [
      "Peça que a turma escreva o algoritmo de 'dar 4 voltas na quadra' sem usar repetição — vai ficar longo.",
      "Apresente o bloco 'REPETIR 4x [andar até a marca]' como forma de simplificar a mesma instrução.",
      "Em duplas, os alunos reescrevem 2-3 algoritmos anteriores do curso usando blocos de repetição.",
      "Discuta por que 'não repetir código' é uma boa prática também pra quem programa de verdade.",
    ],
    habilidadeBncc: "EF06CO06 — Utilizar estruturas de repetição para simplificar algoritmos com ações repetidas.",
  },
  {
    eixo: "projeto_integrador",
    nome: "Guardando Informação: Pontos, Tempo e Vidas",
    objetivo: "Compreender o conceito de variável como um espaço que guarda e atualiza informação (pontuação, tempo, respostas).",
    faixaEtaria: "4º ao 9º Ano",
    recursos: "Fichas de 'placar' (papel), objetos pra representar pontos (tampinhas, fichas).",
    passoAPasso: [
      "Explique variável com uma analogia: uma caixinha com nome (ex: 'pontos') que guarda um número e pode mudar.",
      "Simule um jogo de perguntas em que cada acerto soma 1 tampinha na caixinha 'pontos' da equipe.",
      "Introduza a ideia de 'evento': algo que dispara uma mudança na variável (ex: 'quando acertar, +1 ponto').",
      "Relacione com os jogos que os alunos jogam: todos usam variáveis de pontos, vidas e tempo.",
    ],
    habilidadeBncc: "EF07CO06 — Compreender o conceito de variável e evento no controle de um programa ou jogo simples.",
  },
  {
    eixo: "projeto_integrador",
    nome: "Storyboard do Meu Jogo ou História",
    objetivo: "Planejar, antes de programar, o roteiro visual de um jogo ou história interativa (storyboard).",
    faixaEtaria: "3º ao 9º Ano",
    recursos: "Folha de roteiro do Caderno do Aluno (ou folha dividida em quadros), lápis.",
    passoAPasso: [
      "Explique que todo bom jogo ou animação começa com um roteiro desenhado antes de qualquer programação.",
      "Cada dupla preenche: nome do projeto, personagens, cenário, objetivo e a regra principal (Se...Então).",
      "Desenhe em 4-6 quadros a sequência principal da história ou das telas do jogo.",
      "Troque o storyboard com um colega pra receber uma sugestão antes de começar a montar de verdade.",
    ],
  },
  {
    eixo: "projeto_integrador",
    nome: "Montando o Cenário e os Personagens",
    objetivo: "Iniciar a montagem prática do artefato digital (jogo/história) planejado no storyboard.",
    faixaEtaria: "3º ao 9º Ano",
    recursos: "Storyboard da semana anterior, blocos lógicos (físicos ou Scratch), cartolina/recortes se for versão desplugada.",
    passoAPasso: [
      "Retome o storyboard de cada dupla/grupo.",
      "Monte o cenário de fundo e os personagens principais (desenhados, recortados ou no Scratch).",
      "Organize os primeiros blocos de evento e movimento pra dar vida ao cenário inicial.",
      "Reserve os últimos minutos pra cada grupo mostrar o que já montou e receber uma dica rápida da turma.",
    ],
  },
  {
    eixo: "projeto_integrador",
    nome: "Programando as Regras do Jogo",
    objetivo: "Implementar as regras, movimentos e interações principais do artefato digital.",
    faixaEtaria: "3º ao 9º Ano",
    recursos: "Continuação do projeto da semana anterior.",
    passoAPasso: [
      "Retome o projeto e liste as regras principais definidas no storyboard.",
      "Monte os blocos de condição (Se...Então) e repetição necessários pra essas regras funcionarem.",
      "Teste cada regra separadamente antes de juntar tudo.",
      "Ajuste o que não funcionou como esperado (primeira rodada de debugging).",
    ],
  },
  {
    eixo: "projeto_integrador",
    nome: "Teste às Cegas: Achando os Bugs dos Colegas",
    objetivo: "Testar sistematicamente um projeto criado por outra dupla e identificar falhas de lógica ou usabilidade.",
    faixaEtaria: "3º ao 9º Ano",
    recursos: "Projetos em andamento das duplas, ficha de 'relatório de bug'.",
    passoAPasso: [
      "Cada dupla troca seu projeto com outra dupla, sem receber explicação prévia de como funciona.",
      "A dupla que recebe usa o projeto 'como um jogador normal' e anota tudo que não funcionou como esperado.",
      "Devolvem o projeto com o relatório de bugs pra dupla original.",
      "Cada dupla prioriza os 2-3 bugs mais importantes pra corrigir na próxima aula.",
    ],
    habilidadeBncc: "EF08CO03 — Testar sistematicamente um programa e reportar falhas de forma estruturada.",
  },
  {
    eixo: "projeto_integrador",
    nome: "Últimos Ajustes: Lógica e Estética",
    objetivo: "Corrigir os bugs reportados e refinar a estética e a experiência do artefato digital final.",
    faixaEtaria: "3º ao 9º Ano",
    recursos: "Relatório de bugs da semana anterior, projeto em andamento.",
    passoAPasso: [
      "Revise o relatório de bugs recebido e corrija os problemas de lógica prioritários.",
      "Ajuste detalhes estéticos: cores, nomes, mensagens de vitória/derrota.",
      "Peça pra uma segunda dupla testar rapidamente de novo, só pra confirmar que os bugs prioritários sumiram.",
      "Prepare uma frase curta de apresentação do projeto pra Feira da próxima semana.",
    ],
  },
  {
    eixo: "projeto_integrador",
    nome: "Feira de Projetos Maker",
    objetivo: "Compartilhar e celebrar os artefatos digitais criados, exercitando a comunicação e o protagonismo dos estudantes.",
    faixaEtaria: "Todas as etapas",
    recursos: "Os projetos finalizados, espaço na sala/escola organizado em estações.",
    passoAPasso: [
      "Organize a sala em 'estações' — cada dupla/grupo fica responsável por apresentar seu projeto.",
      "Divida a turma em rodízio: metade apresenta enquanto a outra metade visita e testa os projetos dos colegas.",
      "Peça que cada visitante deixe um elogio ou sugestão por escrito pra dupla que apresentou.",
      "Feche com uma roda de agradecimento e destaque coletivo do que mais surpreendeu a turma.",
    ],
  },
  {
    eixo: "projeto_integrador",
    nome: "Fechamento do Curso e Entrega dos Certificados",
    objetivo: "Consolidar a jornada de formação, revisando os 3 eixos e celebrando a conclusão do curso.",
    faixaEtaria: "Não aplicável (fechamento institucional)",
    recursos: "Certificados de conclusão (emitidos pela plataforma), registros/rubricas dos 3 eixos.",
    passoAPasso: [
      "Revise coletivamente os 3 eixos trabalhados ao longo do curso e os principais aprendizados de cada um.",
      "Emita e entregue os certificados de 40h de formação aos professores/participantes.",
      "Recolha um feedback rápido sobre o curso pra próximas turmas.",
      "Aponte os próximos passos: aplicar as trilhas gamificadas e os geradores da plataforma com os alunos ao longo do ano.",
    ],
  },
];

// Matriz de alinhamento interdisciplinar (apostila, seção 5) — não depende
// de eixo específico, por isso não precisou de ajuste.
export const MATRIZ_INTERDISCIPLINAR: { componente: string; conexao: string; exemplo: string }[] = [
  {
    componente: "Matemática",
    conexao: "Geometria, matrizes, sistema cartesiano, padrões numéricos, decomposição e raciocínio lógico.",
    exemplo: "Trabalho com coordenadas e matrizes na atividade de Pixel Art e gráficos numéricos.",
  },
  {
    componente: "Língua Portuguesa",
    conexao: "Textos instrucionais (algoritmos), coesão, leitura crítica de mídias e combate a Fake News.",
    exemplo: "Escrita de instruções claras para receitas/algoritmos e análise de notícias no eixo Cultura Digital.",
  },
  {
    componente: "Geografia",
    conexao: "Cartografia, orientação espacial, rotas, navegação e leitura de mapas gráficos.",
    exemplo: "Mapeamento de trajetos no piso e no papel na atividade 'O Robô Humano'.",
  },
  {
    componente: "Ciências",
    conexao: "Método científico, formulação de hipóteses, investigação de erros e sistemas biológicos.",
    exemplo: "Processo de debugging (teste e correção de hipóteses) ao falhar na lógica de um algoritmo.",
  },
  {
    componente: "Artes",
    conexao: "Estética visual, representação de cores por códigos cromáticos e animação.",
    exemplo: "Criação de animações e personagens em Pixel Art e design de jogos no projeto integrador.",
  },
  {
    componente: "Educação Física",
    conexao: "Esquema corporal, lateralidade, orientação espaço-temporal e jogos de regras.",
    exemplo: "Execução física de comandos de direção e circuitos motores na quadra de esportes.",
  },
];

// Rubricas de avaliação formativa por eixo (apostila, seção 6) — já nascia
// organizada em 3 eixos oficiais, sem precisar de ajuste.
export const RUBRICAS_AVALIACAO: {
  eixo: EixoBnccComputacao;
  criterio: string;
  emDesenvolvimento: string;
  proficiente: string;
  avancado: string;
}[] = [
  {
    eixo: "pensamento_computacional",
    criterio: "Algoritmos e Lógica",
    emDesenvolvimento: "Identifica instruções isoladas, mas necessita de mediação direta para organizar a sequência lógica.",
    proficiente: "Constrói sequências ordenadas de comandos e resolve desafios desplugados com autonomia.",
    avancado: "Otimiza algoritmos, utiliza repetições (loops) e identifica/corrige erros (debugging) com facilidade.",
  },
  {
    eixo: "mundo_digital",
    criterio: "Dados e Matrizes",
    emDesenvolvimento: "Compreende a ideia de dados, mas apresenta dificuldade em ler coordenadas em matrizes.",
    proficiente: "Decodifica informações em matrizes e representa dados através de Pixel Art ou código binário.",
    avancado: "Cria seus próprios sistemas de codificação e explica o fluxo de informações em redes.",
  },
  {
    eixo: "cultura_digital",
    criterio: "Ética e Segurança",
    emDesenvolvimento: "Reconhece a necessidade de cuidado na web, mas requer auxílio para identificar riscos reais.",
    proficiente: "Aplica regras de segurança, cria senhas fortes e identifica sinais de notícias falsas.",
    avancado: "Atua como multiplicador de boas práticas digitais, respeitando direitos autorais e ética.",
  },
];

// Checklist de materiais desplugados (apostila, seção 8).
export const CHECKLIST_MATERIAIS_IMPRESSOS = [
  "Cartões de Comandos: setas de navegação (Avançar, Girar Direita/Esquerda, Repetir, Parar).",
  "Malhas Quadriculadas: grades 8x8, 10x10 e 16x16 para Pixel Art e coordenadas.",
  "Cartões Binários: fichas numeradas (1, 2, 4, 8, 16) e díspares 0 e 1.",
  "Fichas de Investigação: exemplos de notícias e checklist dos Detetives da Informação.",
];

export const CHECKLIST_MATERIAIS_RECICLAVEIS = [
  "Tampinhas de garrafa PET coloridas: usadas como pixels, contadores binários e marcadores.",
  "Copos plásticos reutilizáveis: demonstração de empilhamento de dados e ordenação (sorting).",
  "Caixas de papelão e envelopes: simulação de pacotes de dados em rede e criptografia.",
  "Fita crepe e cones: demarcação de matrizes corporais no piso da sala ou quadra.",
];

export const REFERENCIAS_CURSO = [
  "BRASIL. Ministério da Educação. Computação na Educação Básica – Complemento à BNCC. Parecer CNE/CEB nº 2/2022 e Resolução CNE/CEB nº 1/2022. Brasília: MEC/CNE, 2022.",
  "BRASIL. Ministério da Educação. Base Nacional Comum Curricular: Educação é a Base. Brasília: MEC, 2018.",
  "CIEB – Centro de Inovação para a Educação Brasileira. Currículo de Referência em Tecnologia e Computação da Educação Infantil ao Ensino Fundamental. São Paulo: CIEB, 2021.",
  "WING, Jeannette M. Computational Thinking. Communications of the ACM, v. 49, n. 3, p. 33-35, 2006.",
];

export function semanasDoBloco(bloco: BlocoCurso): SemanaCurso[] {
  return SEMANAS_CURSO_BNCC.filter((s) => s.bloco === bloco);
}

export function atividadeGuiadaDaSemana(semana: SemanaCurso): AtividadeGuiadaCurso | undefined {
  if (!semana.atividadeGuiadaNome) return undefined;
  return ATIVIDADES_GUIADAS_CURSO.find((a) => a.nome === semana.atividadeGuiadaNome);
}
