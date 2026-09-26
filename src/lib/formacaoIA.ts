// Formação em IA Aplicada à Educação — curso pago, turma fechada (evento com
// datas, não uma trilha sempre-disponível). Conteúdo dos módulos é fixo aqui
// no código (não tem tela de admin pra editar módulo/sessão, só matrícula).

export const CURSO_FORMACAO_IA = {
  nome: "Formação em Inteligência Artificial Aplicada à Educação",
  edicao: "2026.2 (Nov–Dez/2026)",
  cargaHorariaTotal: 120,
  cargaHorariaEad: 96,
  cargaHorariaPresencial: 24,
  periodoEadDescricao: "Novembro (trilha online)",
  periodoPresencialDescricao: "Dezembro (imersão presencial + projeto final)",
  localPresencial: "Itapipoca, Ceará",
  valorInscricao: 99.9,
  vagasTotal: 40,
  frequenciaMinimaPct: 75,
  notaMinima: 6.0,
  certificacaoDescricao:
    "Certificado de Extensão/Aperfeiçoamento, mediante 75% de frequência e aproveitamento mínimo (nota final ≥ 6,0)",
};

// Introdução, justificativa, metodologia geral e organização curricular —
// texto original do documento-fonte do curso (Claude Docs), seções
// "2. Apresentação e Justificativa", "6. Cronograma Híbrido" e "7. Metodologia".
export const SOBRE_CURSO_FORMACAO_IA = {
  introducao:
    "A Inteligência Artificial (IA) já integra ferramentas de planejamento, correção, personalização do ensino e gamificação utilizadas no cotidiano escolar. No entanto, grande parte dos professores da Educação Básica ainda não teve formação estruturada para compreender, avaliar criticamente e aplicar essas tecnologias em sala de aula.",
  justificativa:
    "Este curso nasce da experiência em Robótica Educacional, Cultura Maker e desenvolvimento de plataformas gamificadas (como ItaGame e GamificaEdu), reunindo fundamentos teóricos de IA aplicada à educação com prática direta em ferramentas e plataformas digitais. A proposta segue o modelo de oferta híbrida adotado por instituições de referência (como IFCE/UAB), combinando uma etapa presencial concentrada, essencial para práticas orientadas, avaliação presencial e integração entre cursistas, com uma trilha formativa contínua em plataforma digital, respeitando o marco regulatório de EaD vigente e as boas práticas de design instrucional para formação continuada de professores.",
  metodologiaGeral: {
    intro: "O curso combina metodologias ativas com gamificação do próprio processo formativo:",
    itens: [
      "Metodologias ativas: sala de aula invertida (leitura/vídeo antes, prática depois), aprendizagem baseada em problemas e projetos (PBL)",
      "Gamificação do próprio curso: pontuação, badges e ranking dos cursistas na plataforma, como vitrine viva das técnicas ensinadas",
      'Etapa presencial "mão na massa": oficinas práticas de robótica, cultura maker e prototipagem, com uso de IA como copiloto',
      "Etapa EAD ativa: trilhas em microlearning (vídeos curtos de 8–12 min), estudos de caso, simulados interativos e fóruns de discussão mediados por tutor",
      "Aprendizagem por projeto: cada cursista desenvolve, ao longo do curso, um projeto aplicado à sua realidade escolar (plano de aula com IA, jogo/desafio gamificado, ou rotina de correção automatizada)",
      "Mentoria: acompanhamento individual/coletivo via webconferência nas semanas do Projeto Aplicado Final",
    ],
  },
  organizacaoCurricular: {
    intro: "O curso é organizado em 4 fases, da abertura à certificação:",
    itens: [
      "Fase 1, Abertura na plataforma (última semana de outubro): ambientação no AVA, apresentação do curso, formação de turmas e liberação do Módulo 2 para início em novembro",
      "Fase 2, Trilha online (novembro, 72h): Módulos 2 a 5, um por semana",
      "Fase 3, Imersão presencial (dezembro, 3 dias): Dia 1 com o Módulo 1 (fundamentos), Dia 2 com o Módulo 6 (robótica e cultura maker), Dia 3 com avaliação presencial e lançamento do projeto aplicado",
      "Fase 4, Projeto Aplicado Final e encerramento (dezembro, 24h): desenvolvimento do Módulo 7 com mentoria assíncrona, seguido da apresentação dos projetos e emissão de certificados",
    ],
  },
};

export interface SessaoFormacaoIA {
  codigo: string;
  titulo: string;
  cargaHoraria: number;
  objetivo?: string;
  conteudo?: string[];
  metodologia?: string;
  exemploPratico?: string;
  recursos?: string[];
  avaliacaoProduto?: string;
  referencias?: string[];
}

export interface ModuloFormacaoIA {
  numero: number;
  titulo: string;
  formato: string;
  cargaHoraria: number;
  fundamentacaoTeorica?: string;
  sessoes: SessaoFormacaoIA[];
}

export const MODULOS_FORMACAO_IA: ModuloFormacaoIA[] = [
  {
    numero: 1,
    titulo: "Fundamentos de IA e Educação",
    formato: "Presencial (dezembro, Dia 1)",
    cargaHoraria: 12,
    fundamentacaoTeorica:
      "O módulo é apoiado no AI Competency Framework for Teachers (UNESCO, 2024), que organiza a formação docente em IA em cinco dimensões (perspectiva humana, ética, pedagogia, avaliação de ferramentas e desenvolvimento profissional), e no working paper Trustworthy Artificial Intelligence (AI) in Education: Promises and Challenges (OECD, 2020), que mapeia riscos e benefícios do uso de IA em sistemas educacionais.",
    sessoes: [
      {
        codigo: "1.1",
        titulo: "O que é IA: histórico, tipos e aplicações",
        cargaHoraria: 4,
        objetivo: "Compreender, em linguagem acessível, o que é Inteligência Artificial e diferenciar seus principais tipos.",
        conteudo: [
          "Linha do tempo da IA: da IA simbólica ao boom da IA generativa",
          "Tipos de IA: machine learning, IA preditiva, IA generativa (texto, imagem, voz) e automação",
          "Como a IA já aparece no cotidiano do professor, como em corretores ortográficos, recomendação de conteúdo, chatbots e assistentes de planejamento",
        ],
        metodologia:
          "Exposição dialogada e dinâmica \"caça ao IA\", identificando onde a IA já está presente na rotina escolar dos participantes.",
        recursos: ["slides", "vídeos curtos", "quadro para construção coletiva da linha do tempo"],
        avaliacaoProduto: "Lista coletiva de usos de IA identificados pelo grupo.",
      },
      {
        codigo: "1.2",
        titulo: "IA na educação: tendências, cases e riscos",
        cargaHoraria: 4,
        objetivo: "Analisar criticamente experiências reais de uso de IA na educação, identificando oportunidades e riscos.",
        conteudo: [
          "Tendências de IA na educação: tutoria adaptativa, personalização, correção automatizada e analytics de aprendizagem",
          "Cases nacionais e internacionais de escolas e redes que adotaram IA",
          "Riscos: dependência tecnológica, vieses, perda de autoria docente e desinformação",
        ],
        metodologia: "Estudo de caso em grupos e debate estruturado sobre prós e contras de um case apresentado.",
        recursos: ["reportagens e artigos selecionados", "roteiro de análise de caso"],
        avaliacaoProduto: "Ficha de análise crítica do case discutido em grupo.",
      },
      {
        codigo: "1.3",
        titulo: "Oficina prática: primeiro contato com IA generativa",
        cargaHoraria: 4,
        objetivo: "Utilizar, na prática, ferramentas de IA generativa (texto e imagem) para uma finalidade pedagógica simples.",
        conteudo: [
          "Tour guiado por 2 a 3 ferramentas de IA generativa gratuitas",
          "Boas práticas de uso: o que compartilhar e o que evitar, considerando os dados de alunos protegidos pela LGPD",
          "Primeiros comandos (prompts) para gerar um texto ou imagem de uso escolar",
        ],
        metodologia:
          "Oficina mão na massa em duplas, com apoio de monitores; cada dupla produz um material simples, como um convite ilustrado ou um texto de apoio a uma aula.",
        recursos: ["computadores, notebooks ou celulares com internet", "roteiro passo a passo da oficina"],
        avaliacaoProduto: "Material pedagógico gerado pela dupla, compartilhado ao final da sessão.",
      },
    ],
  },
  {
    numero: 2,
    titulo: "IA Generativa no Planejamento Pedagógico",
    formato: "Plataforma (EAD) · novembro, semana 1",
    cargaHoraria: 20,
    fundamentacaoTeorica:
      "As atividades seguem a Guidance for generative AI in education and research (UNESCO, 2023), primeira orientação global sobre IA generativa na educação, que recomenda o uso da IA como apoio ao planejamento docente, preservando sempre o julgamento pedagógico e a autoria do professor.",
    sessoes: [
      {
        codigo: "2.1",
        titulo: "Fundamentos de prompt engineering para professores",
        cargaHoraria: 4,
        objetivo: "Estruturar comandos (prompts) claros e eficazes para obter respostas úteis de ferramentas de IA generativa.",
        conteudo: [
          "Anatomia de um bom prompt: contexto, tarefa, formato e exemplos",
          "Erros comuns e técnicas de refinamento por tentativa e ajuste",
          "Ferramentas: ChatGPT, Google Gemini e Microsoft Copilot",
        ],
        metodologia: "Videoaula e exercício guiado na plataforma, com biblioteca de prompts prontos.",
        exemploPratico:
          "Transformar o prompt genérico \"crie uma atividade sobre frações\" em um prompt completo, com série, tempo de aula, nível de dificuldade e formato de saída.",
        recursos: ["guia de prompts para professores", "ferramentas gratuitas de IA generativa"],
        avaliacaoProduto: "Entrega de 3 prompts testados e refinados para uma necessidade real da turma do cursista.",
        referencias: ["OpenAI, Prompt Engineering Guide", "Bozkurt (2023), Generative AI in education"],
      },
      {
        codigo: "2.2",
        titulo: "Criação de planos de aula e sequências didáticas com IA",
        cargaHoraria: 4,
        objetivo: "Usar IA generativa para acelerar e enriquecer o planejamento de aulas alinhado à BNCC.",
        conteudo: [
          "Estrutura de um plano de aula: objetivos, habilidades BNCC, metodologia e avaliação",
          "Geração assistida de sequências didáticas, preservando a autoria pedagógica do professor",
          "Adaptação do material gerado à realidade da turma",
        ],
        metodologia: "Oficina prática em que cada cursista gera e revisa um plano de aula real com apoio de IA.",
        exemploPratico: "Gerar um plano de aula de 50 minutos sobre \"frações\" para o 6º ano, revisado e ajustado pelo professor.",
        recursos: ["modelo de plano de aula", "referência à BNCC", "ferramenta de IA generativa"],
        avaliacaoProduto: "Plano de aula finalizado, pronto para aplicação em sala.",
        referencias: ["BNCC (2018)", "Guia \"IA no planejamento docente\" (MEC/UNESCO)"],
      },
      {
        codigo: "2.3",
        titulo: "Produção de materiais didáticos com apoio de IA",
        cargaHoraria: 4,
        objetivo: "Criar materiais didáticos (textos, questões, slides) usando IA como copiloto.",
        conteudo: [
          "Geração de questões de múltipla escolha e discursivas por nível de dificuldade",
          "Passo a passo para criar slides com IA: primeiro pedir um roteiro de tópicos da aula e só depois gerar o design visual em cima desse roteiro",
          "Ferramentas prontas para montar a apresentação: Gamma (cola o roteiro e ele monta os slides completos) e Canva IA/Magic Design (gera o layout a partir do texto do plano de aula)",
          "Como pedir boas imagens para cada slide: descrever o tema de cada tela e pedir sugestão de ícone ou foto, usando os bancos de imagem já integrados nessas ferramentas",
          "Boas práticas de slide gerado por IA: no máximo 20 palavras por tela, um tópico por slide e uma pausa para pergunta a cada 3 ou 4 slides",
          "Revisão e adequação de linguagem ao público-alvo",
        ],
        metodologia: "Produção prática de um mini-kit didático, com questões e slide, sobre um tema da disciplina do cursista.",
        exemploPratico:
          "Gerar 5 questões sobre um tema à escolha e, para o mesmo tema, um roteiro de 8 slides no Gamma ou no Canva IA, revisando o texto e trocando as imagens sugeridas pelas mais adequadas à turma.",
        recursos: ["Canva IA / Gamma", "banco de questões geradas"],
        avaliacaoProduto: "Mini-kit didático postado na plataforma.",
        referencias: ["Documentação oficial Canva IA e Gamma", "Boas práticas de design instrucional"],
      },
      {
        codigo: "2.4",
        titulo: "Diferenciação pedagógica e adaptação de conteúdo",
        cargaHoraria: 4,
        objetivo: "Aplicar IA para adaptar conteúdos a alunos com diferentes ritmos e necessidades específicas.",
        conteudo: [
          "Adaptação de textos por nível de leitura",
          "Recursos de acessibilidade gerados por IA: resumos, simplificação de linguagem e apoio a alunos com deficiência",
          "Limites da IA na educação inclusiva: o que ela não substitui",
        ],
        metodologia: "Estudo de caso de um aluno fictício com necessidade específica, seguido de adaptação de material com apoio de IA.",
        exemploPratico: "Simplificar um texto didático complexo para um aluno com defasagem de leitura, mantendo o conteúdo essencial.",
        recursos: ["roteiro de estudo de caso", "ferramenta de IA generativa"],
        avaliacaoProduto: "Versão adaptada do material para o caso estudado.",
        referencias: ["Política Nacional de Educação Especial", "UNESCO (2023), Guidance for generative AI in education"],
      },
      {
        codigo: "2.5",
        titulo: "Estudo de caso e atividade avaliativa do módulo",
        cargaHoraria: 4,
        objetivo: "Consolidar o aprendizado do módulo por meio de um estudo de caso integrado.",
        conteudo: [
          "Revisão dos temas das sessões 2.1 a 2.4",
          "Discussão de um caso real de escola que usa IA no planejamento pedagógico",
        ],
        metodologia:
          "Fórum de discussão seguido de atividade avaliativa: produção de um plano de aula completo com materiais gerados por IA.",
        recursos: ["fórum na plataforma", "rubrica de avaliação do módulo"],
        avaliacaoProduto: "Entrega final: plano de aula e kit de materiais, avaliado por rubrica.",
      },
    ],
  },
  {
    numero: 3,
    titulo: "Ética, LGPD e Uso Responsável de IA na Escola",
    formato: "Plataforma (EAD) · novembro, semana 2",
    cargaHoraria: 16,
    fundamentacaoTeorica:
      "O módulo articula a Lei nº 13.709/2018 (LGPD) com a Recommendation on the Ethics of Artificial Intelligence (UNESCO, 2021), primeiro padrão ético global sobre IA adotado por 193 países, e com a Tomada de Subsídios da ANPD sobre Tratamento de Dados Pessoais de Crianças e Adolescentes (2023), que orienta boas práticas para dados de estudantes em ambientes digitais.",
    sessoes: [
      {
        codigo: "3.1",
        titulo: "LGPD na escola: dados de alunos e responsabilidade docente",
        cargaHoraria: 4,
        objetivo: "Compreender os princípios da LGPD aplicados ao ambiente escolar e à responsabilidade do professor no uso de dados de alunos.",
        conteudo: [
          "Conceitos-chave da LGPD: dado pessoal, dado sensível, consentimento e finalidade",
          "Dados de crianças e adolescentes: cuidados específicos",
          "O que um professor pode e não pode inserir em ferramentas de IA, como nomes, notas, laudos e imagens de alunos",
        ],
        metodologia: "Exposição dialogada e análise de casos reais de vazamento ou uso indevido de dados escolares.",
        exemploPratico: "Identificar, em uma lista de 10 situações de uso de IA na escola, quais violam a LGPD e por quê.",
        recursos: ["texto da LGPD (Lei 13.709/2018)", "checklist de conformidade para professores"],
        avaliacaoProduto: "Checklist de boas práticas de dados preenchido pelo cursista.",
        referencias: ["Lei nº 13.709/2018 (LGPD)", "ANPD, Guia de boas práticas para o setor educacional"],
      },
      {
        codigo: "3.2",
        titulo: "Vieses algorítmicos e desinformação",
        cargaHoraria: 4,
        objetivo: "Desenvolver pensamento crítico sobre respostas geradas por IA, identificando vieses e \"alucinações\".",
        conteudo: [
          "O que são vieses algorítmicos e como surgem nos dados de treinamento",
          "Alucinações de IA generativa: como verificar informações antes de usar em sala",
          "Desinformação e checagem de fatos com apoio de fontes confiáveis",
        ],
        metodologia: "Oficina \"caça ao erro\", identificando erros e vieses em respostas geradas por IA sobre temas escolares.",
        exemploPratico: "Comparar a resposta de uma IA sobre um evento histórico com uma fonte confiável e apontar as divergências.",
        recursos: ["respostas de IA pré-selecionadas com erros propositais", "fontes de checagem (agências de fact-checking)"],
        avaliacaoProduto: "Relatório de checagem de uma resposta de IA usada em contexto escolar.",
        referencias: ["UNESCO (2023), Guidance for generative AI in education", "Artigos sobre viés algorítmico em IA educacional"],
      },
      {
        codigo: "3.3",
        titulo: "Letramento em IA para alunos",
        cargaHoraria: 4,
        objetivo: "Planejar como ensinar aos alunos o uso crítico e responsável de ferramentas de IA.",
        conteudo: [
          "O que é letramento em IA (AI literacy) e por que ensinar aos alunos",
          "Estratégias por faixa etária: Fundamental I, Fundamental II e Ensino Médio",
          "Prevenção de plágio e uso indevido de IA em trabalhos escolares",
        ],
        metodologia: "Oficina de criação de uma micro-aula sobre uso responsável de IA para a turma do cursista.",
        exemploPratico: "Roteiro de aula de 20 minutos sobre \"como usar IA para estudar sem colar\".",
        recursos: ["modelos de aula sobre letramento digital", "exemplos de políticas escolares de uso de IA"],
        avaliacaoProduto: "Roteiro de micro-aula sobre uso responsável de IA, pronto para aplicação.",
        referencias: ["BNCC, Cultura Digital", "UNESCO AI Competency Framework for Students (2024)"],
      },
      {
        codigo: "3.4",
        titulo: "Elaboração de política de uso de IA para a sala de aula",
        cargaHoraria: 4,
        objetivo: "Consolidar os temas do módulo na produção de um documento prático de uso da IA em sala.",
        conteudo: [
          "Critérios de uma boa política de uso de IA: o que é permitido, o que exige supervisão e o que é vetado",
          "Exemplos de políticas de escolas e redes de ensino",
        ],
        metodologia: "Atividade avaliativa: elaboração individual de uma política de uso de IA para a turma ou disciplina do cursista.",
        recursos: ["modelo de política de uso de IA", "rubrica de avaliação"],
        avaliacaoProduto: "Documento de política de uso de IA, avaliado por rubrica e disponível para uso real na escola do cursista.",
      },
    ],
  },
  {
    numero: 4,
    titulo: "IA e Gamificação: Rankings, Desafios e Engajamento",
    formato: "Plataforma (EAD) · novembro, semana 3",
    cargaHoraria: 20,
    fundamentacaoTeorica:
      "A proposta segue a definição clássica de gamificação de Deterding et al. (2011), \"From Game Design Elements to Gamefulness: Defining Gamification\" (o uso de elementos de design de jogos em contextos que não são jogos), combinada aos princípios de engajamento e motivação de Kapp (2012), The Gamification of Learning and Instruction.",
    sessoes: [
      {
        codigo: "4.1",
        titulo: "Fundamentos de gamificação na educação",
        cargaHoraria: 4,
        objetivo: "Compreender os elementos de mecânica, dinâmica e estética (MDE) da gamificação aplicados ao ensino.",
        conteudo: [
          "Diferença entre jogo, jogo sério e gamificação",
          "Elementos de jogo: pontos, níveis, badges, missões, narrativa e feedback",
          "Motivação intrínseca e extrínseca no engajamento de alunos",
        ],
        metodologia: "Exposição dialogada e análise de uma experiência gamificada já vivida pelo cursista, como um jogo, aplicativo ou plataforma.",
        exemploPratico: "Mapear os elementos MDE presentes em um aplicativo popular, como o Duolingo, e discutir como aplicá-los na escola.",
        recursos: ["framework MDE (Mecânica, Dinâmica e Estética)", "estudos de caso de gamificação educacional"],
        avaliacaoProduto: "Mapa dos elementos MDE identificados na experiência analisada.",
        referencias: ["Kapp (2012), The Gamification of Learning and Instruction", "Fardo (2013), A gamificação aplicada em ambientes de aprendizagem"],
      },
      {
        codigo: "4.2",
        titulo: "Desenho de desafios e missões gamificadas com apoio de IA",
        cargaHoraria: 4,
        objetivo: "Projetar desafios e missões gamificadas para conteúdos curriculares, com apoio de IA generativa.",
        conteudo: [
          "Estrutura de uma missão ou desafio: objetivo, regras, recompensa e narrativa",
          "Uso de IA para gerar variações de desafios por nível de dificuldade",
          "Progressão e curva de dificuldade ao longo de um bimestre",
        ],
        metodologia: "Oficina prática de desenho de uma sequência de 3 missões gamificadas sobre um conteúdo do cursista, com apoio de IA.",
        exemploPratico: "Transformar uma lista de exercícios tradicional em uma \"trilha de missões\" com narrativa e recompensas.",
        recursos: ["modelo de desenho de missão", "ferramenta de IA generativa"],
        avaliacaoProduto: "Trilha de 3 missões gamificadas documentada.",
        referencias: ["Werbach e Hunter (2012), For the Win", "ItaGame (estudo de caso interno)"],
      },
      {
        codigo: "4.3",
        titulo: "Sistemas de pontuação, rankings e badges",
        cargaHoraria: 4,
        objetivo: "Desenhar sistemas de pontuação e ranking que engajem sem gerar competição tóxica ou exclusão.",
        conteudo: [
          "Tipos de pontuação: individual, por equipe, cumulativa e com \"resets\"",
          "Rankings saudáveis: rankings por esforço e evolução, não só por acerto",
          "Badges e conquistas como reconhecimento de trajetórias diferentes",
        ],
        metodologia: "Oficina de desenho de um sistema de pontuação e badges para a turma do cursista, com checagem de riscos de exclusão.",
        exemploPratico:
          "Criar 5 badges, como \"Persistente\", \"Colaborador\" e \"Evoluiu 20%\", que valorizem trajetórias diversas, não só o desempenho máximo.",
        recursos: ["modelos de sistemas de pontuação", "exemplos de badges de plataformas educacionais"],
        avaliacaoProduto: "Desenho do sistema de pontuação e badges da turma do cursista.",
        referencias: ["McGonigal (2011), Reality is Broken", "Estudos sobre efeitos da competição excessiva em sala"],
      },
      {
        codigo: "4.4",
        titulo: "Estudo de caso: plataformas gamificadas na prática",
        cargaHoraria: 4,
        objetivo: "Analisar, na prática, como plataformas gamificadas reais estruturam desafios, rankings e acompanhamento pedagógico.",
        conteudo: [
          "Demonstração guiada de uma plataforma gamificada educacional, como o ItaGame/GamificaEdu",
          "Como o professor acompanha desempenho e engajamento pelo painel do educador",
          "Integração entre gamificação e correção/avaliação, preparando o Módulo 5",
        ],
        metodologia: "Demonstração ao vivo seguida de exploração guiada da plataforma pelos cursistas.",
        exemploPratico: "Criar um desafio de teste na plataforma e acompanhar o ranking gerado em tempo real.",
        recursos: ["acesso à plataforma GamificaEdu/ItaGame (ambiente de demonstração)"],
        avaliacaoProduto: "Relato de exploração da plataforma com 3 observações práticas.",
        referencias: ["Documentação do GamificaEdu/ItaGame"],
      },
      {
        codigo: "4.5",
        titulo: "Criação de um desafio gamificado para a própria turma",
        cargaHoraria: 4,
        objetivo: "Consolidar o módulo com a criação de um desafio gamificado aplicável de fato.",
        conteudo: ["Revisão dos elementos MDE, sistemas de pontuação e boas práticas contra competição tóxica"],
        metodologia:
          "Atividade avaliativa: criação completa de um desafio gamificado (objetivo, regras, pontuação, badges) para a turma do cursista.",
        recursos: ["rubrica de avaliação do módulo", "modelos das sessões anteriores"],
        avaliacaoProduto: "Desafio gamificado completo, pronto para aplicação em sala, avaliado por rubrica.",
      },
    ],
  },
  {
    numero: 5,
    titulo: "IA na Correção e Avaliação de Provas",
    formato: "Plataforma (EAD) · novembro, semana 4",
    cargaHoraria: 16,
    fundamentacaoTeorica:
      "O módulo se baseia nos princípios de avaliação formativa de Black e Wiliam (1998), Assessment and Classroom Learning, e no modelo de feedback eficaz de Hattie e Timperley (2007), The Power of Feedback, aplicando-os ao contexto de correção assistida por IA.",
    sessoes: [
      {
        codigo: "5.1",
        titulo: "Modelos de avaliação: da prova tradicional à avaliação formativa digital",
        cargaHoraria: 4,
        objetivo: "Comparar modelos de avaliação tradicionais e formativos e identificar onde a IA pode apoiar cada um.",
        conteudo: [
          "Avaliação somativa, formativa e diagnóstica",
          "Instrumentos digitais de avaliação: formulários, quizzes e provas online",
          "Onde a IA agrega valor: correção, feedback e identificação de lacunas de aprendizagem",
        ],
        metodologia: "Exposição dialogada e comparação de instrumentos avaliativos usados pelos próprios cursistas.",
        exemploPratico: "Transformar uma prova tradicional de 10 questões em um instrumento digital com feedback automático por questão.",
        recursos: ["modelos de formulários digitais", "exemplos de rubricas"],
        avaliacaoProduto: "Quadro comparativo dos instrumentos avaliativos analisados.",
        referencias: ["Hadji (2001), Avaliação Desmistificada", "Fernandes (2009), Avaliação formativa"],
      },
      {
        codigo: "5.2",
        titulo: "Correção automatizada e assistida por IA",
        cargaHoraria: 4,
        objetivo: "Utilizar ferramentas de correção automatizada e assistida por IA para questões objetivas e discursivas.",
        conteudo: [
          "Correção de gabaritos e questões objetivas por leitura ótica/digital",
          "Correção assistida de questões discursivas e redações com IA",
          "Possibilidades e limites: onde a IA erra e por que a validação humana continua essencial",
        ],
        metodologia: "Oficina prática de correção assistida de um conjunto de respostas discursivas simuladas.",
        exemploPratico: "Corrigir 5 respostas discursivas com apoio de IA e comparar com a correção manual do próprio cursista.",
        recursos: ["ferramenta de correção do GamificaEdu/ItaGame", "banco de respostas simuladas"],
        avaliacaoProduto: "Relatório comparativo entre correção humana e assistida por IA.",
        referencias: ["Documentação do Corretor de Provas ItaGame", "Estudos sobre IA em correção de redações (ENEM)"],
      },
      {
        codigo: "5.3",
        titulo: "Rubricas e feedback personalizado com apoio de IA",
        cargaHoraria: 4,
        objetivo: "Construir rubricas claras e gerar feedback personalizado e formativo para os alunos com apoio de IA.",
        conteudo: [
          "Estrutura de uma rubrica: critérios, níveis de desempenho e descritores",
          "Geração de feedback personalizado por aluno a partir do desempenho na avaliação",
          "Como transformar erro em orientação de estudo (feedback acionável)",
        ],
        metodologia: "Oficina prática de construção de uma rubrica e geração de 3 modelos de feedback personalizado com IA.",
        exemploPratico:
          "Gerar um feedback individual para um aluno fictício que errou questões de interpretação de texto, sugerindo próximos passos de estudo.",
        recursos: ["modelo de rubrica", "ferramenta de IA generativa"],
        avaliacaoProduto: "Rubrica e 3 modelos de feedback personalizado.",
        referencias: ["Hattie e Timperley (2007), The Power of Feedback"],
      },
      {
        codigo: "5.4",
        titulo: "Simulação prática de correção de provas na plataforma",
        cargaHoraria: 4,
        objetivo: "Aplicar, de ponta a ponta, o fluxo de correção assistida por IA na plataforma GamificaEdu/ItaGame.",
        conteudo: ["Fluxo completo: aplicação da prova, correção assistida, geração de feedback e lançamento no ranking gamificado"],
        metodologia: "Atividade avaliativa: simulação completa de correção de uma turma fictícia na plataforma.",
        recursos: ["ambiente de simulação da plataforma", "rubrica de avaliação do módulo"],
        avaliacaoProduto: "Relatório da simulação, com prints e registro do fluxo completo, avaliado por rubrica.",
      },
    ],
  },
  {
    numero: 6,
    titulo: "Robótica, Cultura Maker e IA na Prática",
    formato: "Presencial (dezembro, Dia 2)",
    cargaHoraria: 12,
    fundamentacaoTeorica:
      "A oficina segue os princípios do construcionismo de Seymour Papert, que propõe aprender construindo artefatos significativos e compartilháveis, e a literatura sobre cultura maker na educação básica de Blikstein (2016), Maker Movement in Education.",
    sessoes: [
      {
        codigo: "6.1",
        titulo: "Fundamentos de robótica educacional integrados à IA",
        cargaHoraria: 4,
        objetivo: "Revisar fundamentos de robótica educacional (Arduino/PictoBlox) e entender pontos de integração com IA embarcada.",
        conteudo: [
          "Componentes básicos: placas (Arduino/ESP32), sensores (luz, distância, temperatura) e atuadores (motores, LEDs)",
          "Programação em blocos com PictoBlox e sua ponte com Python/IA",
          "Onde a IA entra: reconhecimento de imagem, voz e padrões em projetos robotizados simples",
        ],
        metodologia: "Revisão prática guiada, seguida de montagem de um circuito básico com sensor e atuador.",
        exemploPratico:
          "Montar um sensor de luminosidade que aciona um LED e, na sequência, discutir como uma câmera com IA poderia substituir o sensor simples por reconhecimento visual.",
        recursos: ["kits de Arduino/ESP32", "sensores básicos", "PictoBlox instalado"],
        avaliacaoProduto: "Circuito funcional montado e documentado, com foto e esquema.",
        referencias: ["Documentação oficial Arduino", "Documentação PictoBlox (Quarky/evive)"],
      },
      {
        codigo: "6.2",
        titulo: "Oficina maker: prototipagem com sensores e IA embarcada",
        cargaHoraria: 4,
        objetivo:
          "Prototipar, em grupo, um projeto maker que combine sensores/atuadores com um componente de IA, como visão computacional simples ou reconhecimento de voz.",
        conteudo: [
          "Metodologia de prototipagem rápida, com design thinking aplicado ao maker",
          "Integração de módulos de IA embarcada disponíveis no PictoBlox, como reconhecimento facial, de objetos ou de voz",
          "Trabalho em equipe e distribuição de papéis no projeto",
        ],
        metodologia: "Oficina mão na massa em grupos de 3 a 4 pessoas, com apoio de monitores.",
        exemploPratico: "Protótipo de \"porteiro inteligente\" que reconhece um objeto ou gesto específico e aciona uma trava ou alerta.",
        recursos: ["kits maker completos (placas, sensores e módulo de câmera quando disponível)", "materiais de prototipagem (papelão, fita etc.)"],
        avaliacaoProduto: "Protótipo funcional, ou em desenvolvimento avançado, por grupo.",
        referencias: ["Documentação de visão computacional do PictoBlox", "Metodologia de Design Thinking (IDEO)"],
      },
      {
        codigo: "6.3",
        titulo: "Apresentação dos protótipos e aplicação em sala de aula",
        cargaHoraria: 4,
        objetivo: "Compartilhar os protótipos desenvolvidos e planejar sua transposição para atividades de sala de aula.",
        conteudo: [
          "Roteiro de apresentação técnica e pedagógica de um projeto maker",
          "Como adaptar um projeto de oficina para uma aula de 50 minutos, considerando os recursos disponíveis na escola",
          "Avaliação por pares dos protótipos apresentados",
        ],
        metodologia: "Feira de protótipos, com cada grupo apresentando em 5 a 8 minutos, seguida de roda de feedback entre pares.",
        exemploPratico: "Plano de adaptação do \"porteiro inteligente\" para uma aula introdutória de sensores no Ensino Fundamental II.",
        recursos: ["roteiro de apresentação", "ficha de avaliação por pares"],
        avaliacaoProduto: "Apresentação do protótipo e plano de adaptação para sala de aula.",
        referencias: ["BNCC, Competência Geral 5 (Cultura Digital)", "Blikstein (2016), referências de cultura maker na educação básica"],
      },
    ],
  },
  {
    numero: 7,
    titulo: "Projeto Aplicado Final",
    formato: "EAD com mentoria + apresentação presencial (Dia 3)",
    cargaHoraria: 24,
    fundamentacaoTeorica:
      "O projeto aplicado segue o modelo Gold Standard PBL (PBLWorks/Buck Institute for Education), que define sete elementos essenciais de um projeto eficaz: problema desafiador, investigação sustentada, autenticidade, voz e escolha do estudante, reflexão, crítica e revisão, e produto público.",
    sessoes: [
      {
        codigo: "7.1",
        titulo: "Definição do escopo do projeto aplicado",
        cargaHoraria: 4,
        objetivo: "Definir um projeto aplicado viável, conectado à realidade escolar do cursista e a pelo menos um tema do curso.",
        conteudo: [
          "Critérios de um bom projeto aplicado: viabilidade, relevância e mensurabilidade",
          "Opções de formato: plano de aula com IA, desafio gamificado, rotina de correção automatizada ou projeto maker com IA",
          "Elaboração do escopo: objetivo, público, recursos necessários e cronograma pessoal",
        ],
        metodologia: "Oficina de planejamento individual com apoio de roteiro, seguida de fórum de troca de ideias entre cursistas.",
        exemploPratico:
          "Um cursista de Matemática opta por um desafio gamificado sobre frações com correção assistida por IA; um cursista de Ciências opta por um protótipo maker com sensor para medir umidade do solo.",
        recursos: ["roteiro de definição de escopo", "exemplos de projetos de turmas anteriores"],
        avaliacaoProduto: "Documento de escopo do projeto aplicado, com 1 a 2 páginas.",
        referencias: ["Metodologia de Aprendizagem Baseada em Projetos (ABP/PBL), Buck Institute for Education"],
      },
      {
        codigo: "7.2",
        titulo: "Desenvolvimento do projeto com mentoria assíncrona",
        cargaHoraria: 8,
        objetivo: "Desenvolver o projeto aplicado com apoio de mentoria, por fórum e webconferências pontuais.",
        conteudo: [
          "Produção dos materiais e artefatos do projeto (plano, desafio, kit ou protótipo, conforme o formato escolhido)",
          "Aplicação de conceitos dos Módulos 2 a 6 conforme a natureza do projeto",
          "Registro do processo em um diário de desenvolvimento",
        ],
        metodologia: "Trabalho individual assíncrono na plataforma, com check-ins de mentoria e fórum de dúvidas.",
        exemploPratico: "Um cursista testa o desafio gamificado com uma turma piloto e ajusta a dificuldade com base no retorno dos alunos.",
        recursos: ["plataforma do curso", "materiais de apoio dos módulos anteriores", "agenda de mentoria"],
        avaliacaoProduto: "Versão intermediária do projeto e diário de desenvolvimento.",
      },
      {
        codigo: "7.3",
        titulo: "Refinamento, testes e produção do material de apresentação",
        cargaHoraria: 8,
        objetivo: "Refinar o projeto a partir de testes e feedback, e preparar a apresentação final.",
        conteudo: [
          "Ciclo de teste e ajuste, com piloto aplicado a alunos, colegas ou pares do curso",
          "Construção de uma apresentação clara: problema, solução, resultados e próximos passos",
          "Preparação de evidências: fotos, prints, dados de uso e depoimentos",
        ],
        metodologia: "Oficina de refinamento com mentoria, seguida de produção do material de apresentação (slide ou vídeo curto).",
        exemploPratico: "Gravar um vídeo de 3 minutos mostrando o protótipo maker funcionando e o retorno dos alunos.",
        recursos: ["modelo de slide/roteiro de apresentação", "ferramenta de gravação de vídeo"],
        avaliacaoProduto: "Versão final do projeto e material de apresentação pronto.",
      },
      {
        codigo: "7.4",
        titulo: "Apresentação final e avaliação por pares",
        cargaHoraria: 4,
        objetivo: "Apresentar o projeto aplicado à turma e receber avaliação formativa de pares e formadores.",
        conteudo: ["Apresentações de 5 a 8 minutos por cursista ou grupo", "Roda de perguntas", "Devolutiva estruturada por rubrica"],
        metodologia: "Sessão presencial de apresentações, com avaliação por pares e pelos formadores.",
        recursos: ["rubrica final do curso", "espaço e equipamento para apresentações"],
        avaliacaoProduto: "Apresentação final avaliada, compondo 30% da nota final do curso.",
        referencias: ["Buck Institute for Education, Gold Standard PBL", "Rubricas de avaliação de projetos aplicados em formação docente"],
      },
    ],
  },
];

export const TEMPO_DOCENCIA_LABEL: Record<string, string> = {
  menos_1: "Menos de 1 ano",
  de_1_a_3: "De 1 a 3 anos",
  de_4_a_10: "De 4 a 10 anos",
  mais_10: "Mais de 10 anos",
};

export const STATUS_MATRICULA_LABEL: Record<string, string> = {
  pendente: "Pendente",
  aguardando_pagamento: "Aguardando Pagamento",
  pago: "Pago",
  cancelado: "Cancelado",
  certificado_emitido: "Certificado Emitido",
};

export function codigoCurto(codigoMatricula: string) {
  return codigoMatricula.slice(0, 8).toUpperCase();
}

export function telefoneFormatado(telefone: string) {
  const t = telefone.replace(/\D/g, "");
  if (t.length === 11) return `(${t.slice(0, 2)}) ${t.slice(2, 7)}-${t.slice(7)}`;
  if (t.length === 10) return `(${t.slice(0, 2)}) ${t.slice(2, 6)}-${t.slice(6)}`;
  return telefone;
}

export function aptoCertificado(matricula: {
  frequenciaPct: number | null;
  notaFinal: unknown;
}) {
  if (matricula.frequenciaPct == null || matricula.notaFinal == null) return false;
  const nota = Number(matricula.notaFinal);
  return matricula.frequenciaPct >= CURSO_FORMACAO_IA.frequenciaMinimaPct && nota >= CURSO_FORMACAO_IA.notaMinima;
}

// Validador de CPF (dígitos verificadores), mesmo algoritmo usado no
// CEITEC ID System (Django) — só dígitos, sem formatação.
export function cpfValido(cpfEntrada: string): boolean {
  const cpf = cpfEntrada.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calcularDigito = (base: string, pesoInicial: number) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += Number(base[i]) * (pesoInicial - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const digito1 = calcularDigito(cpf.slice(0, 9), 10);
  const digito2 = calcularDigito(cpf.slice(0, 10), 11);

  return digito1 === Number(cpf[9]) && digito2 === Number(cpf[10]);
}
