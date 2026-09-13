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
};

// As 40 semanas (1 aula de 50min/semana). Semanas 1–30: um eixo oficial por
// bloco de 10 semanas (igual à grade original). Semanas 31–40: fechamento
// prático, reaproveitando o antigo "Módulo 4" como projeto de aplicação.
export const SEMANAS_CURSO_BNCC: SemanaCurso[] = [
  // Eixo 1 — Pensamento Computacional (semanas 1–10)
  { semana: 1, bloco: "pensamento_computacional", tema: "Introdução à Computação", atividade: "Roda de conversa e tempestade de ideias sobre tecnologia no cotidiano.", modalidade: "Conversação / Roda livre" },
  { semana: 2, bloco: "pensamento_computacional", tema: "Decomposição de Problemas", atividade: "Divisão de tarefas diárias em etapas menores e ordenadas.", modalidade: "Desplugada (Cartões de papel)" },
  { semana: 3, bloco: "pensamento_computacional", tema: "Reconhecimento de Padrões", atividade: "Identificação de sequências lógicas em cores, formas e figuras.", modalidade: "Desplugada (Folhas impressas)" },
  { semana: 4, bloco: "pensamento_computacional", tema: "Conceito de Algoritmo", atividade: "Formulação de receitas e instruções ordenadas passo a passo.", modalidade: "Desplugada (Escrita e desenho)" },
  { semana: 5, bloco: "pensamento_computacional", tema: "Simbologia e Comandos", atividade: "Leitura de comandos de direção e orientação de rotas.", modalidade: "Desplugada (Cartões de setas)" },
  { semana: 6, bloco: "pensamento_computacional", tema: "O Robô Humano (Parte 1)", atividade: "Montagem da sequência de comandos corporais na matriz de chão.", modalidade: "Desplugada (Fita crepe e cones)" },
  { semana: 7, bloco: "pensamento_computacional", tema: "O Robô Humano (Parte 2)", atividade: "Execução do percurso físico, desvio de obstáculos e testes.", modalidade: "Desplugada (Circuito motor)" },
  { semana: 8, bloco: "pensamento_computacional", tema: "Identificação de Erros (Debugging)", atividade: "Análise e correção de algoritmos que contêm falhas lógicas.", modalidade: "Desplugada (Desafios em folha)" },
  { semana: 9, bloco: "pensamento_computacional", tema: "Tomada de Decisão (Se... Então)", atividade: "Jogos condicionais para escolha de caminhos alternativos.", modalidade: "Desplugada (Cartões de decisão)" },
  { semana: 10, bloco: "pensamento_computacional", tema: "Avaliação do Eixo 1", atividade: "Registros no Diário de Bordo e preenchimento da rubrica de Pensamento Computacional.", modalidade: "Avaliação Formativa" },

  // Eixo 2 — Mundo Digital (semanas 11–20)
  { semana: 11, bloco: "mundo_digital", tema: "Hardware vs. Software", atividade: "Identificação dos componentes físicos e digitais das máquinas.", modalidade: "Desplugada (Ilustrações)" },
  { semana: 12, bloco: "mundo_digital", tema: "Classificação de Dados", atividade: "Organização e agrupamento de objetos por múltiplos critérios.", modalidade: "Desplugada (Tampinhas / Peças)" },
  { semana: 13, bloco: "mundo_digital", tema: "Representação de Informações", atividade: "Como símbolos, letras e números são codificados.", modalidade: "Desplugada (Tabelas e códigos)" },
  { semana: 14, bloco: "mundo_digital", tema: "Coordenadas e Matrizes", atividade: "Localização de pontos em malhas quadriculadas (eixos X e Y).", modalidade: "Desplugada (Grades 8x8 e 10x10)" },
  { semana: 15, bloco: "mundo_digital", tema: "Pixel Art com Números (Parte 1)", atividade: "Leitura de códigos numéricos e preenchimento da matriz gráfica.", modalidade: "Desplugada (Malha e lápis de cor)" },
  { semana: 16, bloco: "mundo_digital", tema: "Pixel Art com Números (Parte 2)", atividade: "Criação de figuras originais e troca de códigos entre colegas.", modalidade: "Desplugada (Criação de matrizes)" },
  { semana: 17, bloco: "mundo_digital", tema: "Introdução ao Código Binário", atividade: "Representação de números e estados (0 e 1 / ligado e desligado).", modalidade: "Desplugada (Cartões de pontos)" },
  { semana: 18, bloco: "mundo_digital", tema: "Redes e Comunicação", atividade: "Simulação do fluxo de envio e recepção de pacotes de dados.", modalidade: "Desplugada (Envelopes e papel pardo)" },
  { semana: 19, bloco: "mundo_digital", tema: "Grafos e Sistemas de Rotas", atividade: "Interconexão de pontos e busca pelo caminho mais curto.", modalidade: "Desplugada (Desafios impressos)" },
  { semana: 20, bloco: "mundo_digital", tema: "Avaliação do Eixo 2", atividade: "Análise das matrizes criadas e preenchimento da rubrica de Mundo Digital.", modalidade: "Avaliação Formativa" },

  // Eixo 3 — Cultura Digital (semanas 21–30)
  { semana: 21, bloco: "cultura_digital", tema: "Evolução das Tecnologias", atividade: "Linha do tempo sobre o impacto dos artefatos na sociedade.", modalidade: "Desplugada (Imagens históricas)" },
  { semana: 22, bloco: "cultura_digital", tema: "Pegada Digital e Privacidade", atividade: "Reflexão sobre as marcas e informações que deixamos na web.", modalidade: "Roda de Debate / Estudo de caso" },
  { semana: 23, bloco: "cultura_digital", tema: "Criação de Senhas Seguras", atividade: "Construção e teste de combinações fortes para proteção de dados.", modalidade: "Desplugada (Jogo das senhas)" },
  { semana: 24, bloco: "cultura_digital", tema: "Letramento Midiático", atividade: "Análise crítica sobre quem produz e compartilha conteúdos.", modalidade: "Leitura Guiada" },
  { semana: 25, bloco: "cultura_digital", tema: "Detetives da Informação (Parte 1)", atividade: "Investigação de notícias reais e fictícias para checar fontes.", modalidade: "Leitura de Fichas" },
  { semana: 26, bloco: "cultura_digital", tema: "Detetives da Informação (Parte 2)", atividade: "Identificação de sinais de alerta de Fake News e boatos.", modalidade: "Análise em Grupo" },
  { semana: 27, bloco: "cultura_digital", tema: "Netiqueta e Convivência", atividade: "Prevenção ao cyberbullying e boas atitudes em ambientes virtuais.", modalidade: "Estudo de Casos" },
  { semana: 28, bloco: "cultura_digital", tema: "Direitos Autorais e Imagem", atividade: "Uso ético de obras, textos, imagens e atribuição de autoria.", modalidade: "Debate e Exemplos" },
  { semana: 29, bloco: "cultura_digital", tema: "Guia de Boas Práticas da Turma", atividade: "Elaboração coletiva do cartaz de regras de convivência digital.", modalidade: "Cartolina e Papel Pardo" },
  { semana: 30, bloco: "cultura_digital", tema: "Avaliação do Eixo 3", atividade: "Autoavaliação de atitudes digitais e preenchimento da rubrica de Cultura Digital.", modalidade: "Avaliação Formativa" },

  // Projeto Integrador Final (semanas 31–40) — aplica os 3 eixos juntos
  { semana: 31, bloco: "projeto_integrador", tema: "Lógica de Blocos de Programação", atividade: "Associação de comandos visuais a ações na tela ou no papel.", modalidade: "Plugada / Blocos Físicos" },
  { semana: 32, bloco: "projeto_integrador", tema: "Estruturas de Repetição (Loops)", atividade: "Otimização de rotinas repetitivas utilizando laços de repetição.", modalidade: "Prática de Blocos" },
  { semana: 33, bloco: "projeto_integrador", tema: "Variáveis e Eventos", atividade: "Controle de pontuação, tempo e respostas dos personagens.", modalidade: "Prática de Blocos" },
  { semana: 34, bloco: "projeto_integrador", tema: "Planejamento (Storyboarding)", atividade: "Esboço e roteiro da história interativa ou jogo a ser criado.", modalidade: "Desplugada (Desenho do roteiro)" },
  { semana: 35, bloco: "projeto_integrador", tema: "Artefato Digital (Parte 1)", atividade: "Montagem dos cenários, personagens e estrutura inicial do projeto.", modalidade: "Prototipagem Maker" },
  { semana: 36, bloco: "projeto_integrador", tema: "Artefato Digital (Parte 2)", atividade: "Programação dos movimentos, regras do jogo e interações.", modalidade: "Prototipagem Maker" },
  { semana: 37, bloco: "projeto_integrador", tema: "Testes e Debugging", atividade: "Troca de projetos entre os alunos para encontrar e corrigir falhas.", modalidade: "Teste entre Pares" },
  { semana: 38, bloco: "projeto_integrador", tema: "Refatoração e Polimento", atividade: "Ajustes finais na lógica de programação e na estética visual.", modalidade: "Finalização Maker" },
  { semana: 39, bloco: "projeto_integrador", tema: "Feira de Exposição dos Projetos", atividade: "Apresentação dos jogos e histórias interativas criados pelas turmas.", modalidade: "Mostra Cultural" },
  { semana: 40, bloco: "projeto_integrador", tema: "Encerramento e Certificação", atividade: "Consolidação das avaliações e fechamento do curso de formação.", modalidade: "Fechamento do Curso" },
];

export const TOTAL_SEMANAS_CURSO = SEMANAS_CURSO_BNCC.length;

// Atividades-modelo guiadas (passo a passo completo), 3 por eixo — extraídas
// da coletânea de atividades desplugadas ItaGamificaEdu, com o código de
// habilidade BNCC correspondente onde já mapeado.
export type AtividadeGuiadaCurso = {
  eixo: EixoBnccComputacao;
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
