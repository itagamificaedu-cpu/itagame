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
// texto redigido a partir da estrutura já definida do curso (módulos,
// carga horária e critérios de avaliação), já que o documento original
// com essas seções em prosa não estava disponível no momento da implementação.
export const SOBRE_CURSO_FORMACAO_IA = {
  introducao:
    "A Inteligência Artificial já faz parte da rotina de qualquer sala de aula, mesmo quando ninguém percebe: alunos usam ferramentas de IA generativa pra fazer trabalho, professores recebem redações escritas por chatbot, e o mercado de trabalho que espera esses alunos já mudou. A Formação em IA Aplicada à Educação é uma resposta prática da ITA Tecnologia Educacional a essa mudança: um curso de extensão de 120 horas, pensado para professores da Educação Básica de Itapipoca e região, que combina fundamentação teórica com oficinas mão na massa.",
  justificativa:
    "Poucos professores tiveram, na formação inicial ou continuada, algum contato estruturado com IA generativa aplicada à docência. O resultado é um uso desorganizado — ora por medo e rejeição, ora por uso ingênuo, sem critério pedagógico ou atenção à LGPD. Este curso existe para fechar essa lacuna: formar professores capazes de usar IA de forma crítica e responsável no planejamento, na produção de materiais, na avaliação e na gestão da sala de aula, sem abrir mão da autoria docente nem da segurança dos dados dos alunos.",
  metodologiaGeral:
    "O curso é híbrido: 96 horas em plataforma online (EAD), cursadas no próprio ritmo do professor ao longo de novembro, e 24 horas presenciais em Itapipoca, em dezembro, divididas em 3 dias. Cada sessão combina exposição dialogada, estudo de caso e oficina prática — o professor sai de cada aula com um produto concreto (um plano de aula, um prompt testado, uma rubrica), não só com teoria. A etapa presencial abre e fecha o curso: o Dia 1 (dezembro) trabalha os fundamentos de IA e educação, o Dia 2 aprofunda robótica e cultura maker aplicadas à IA, e o Dia 3 é a apresentação do projeto aplicado final, com mentoria assíncrona ao longo do módulo 7.",
  organizacaoCurricular:
    "A carga horária de 120h está distribuída em 7 módulos sequenciais, do fundamento (Módulo 1) até o projeto aplicado final (Módulo 7), passando por planejamento pedagógico com IA generativa, ética e LGPD, gamificação, e avaliação/correção assistida por IA. A avaliação final combina 4 critérios: 40% prova/projeto presencial, 20% atividades por módulo, 10% participação nos fóruns, e 30% o projeto aplicado final — exigindo frequência mínima de 75% e nota final ≥ 6,0 para a emissão do certificado de Extensão/Aperfeiçoamento.",
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
      "AI Competency Framework for Teachers (UNESCO, 2024) e Trustworthy Artificial Intelligence (AI) in Education (OECD, 2020).",
    sessoes: [
      {
        codigo: "1.1",
        titulo: "O que é IA: histórico, tipos e aplicações",
        cargaHoraria: 4,
        objetivo: "Compreender, em linguagem acessível, o que é Inteligência Artificial e diferenciar seus principais tipos.",
        conteudo: [
          "Linha do tempo da IA: da IA simbólica ao boom da IA generativa",
          "Tipos de IA: machine learning, IA preditiva, IA generativa (texto, imagem, voz), automação",
          "Como a IA já aparece no cotidiano do professor",
        ],
        metodologia: "Exposição dialogada + dinâmica \"caça ao IA\"",
        exemploPratico: "Identificar onde a IA já está presente na rotina escolar dos participantes",
        recursos: ["slides", "vídeos curtos", "quadro para linha do tempo"],
        avaliacaoProduto: "Lista coletiva de usos de IA identificados pelo grupo",
      },
      {
        codigo: "1.2",
        titulo: "IA na educação: tendências, cases e riscos",
        cargaHoraria: 4,
        objetivo: "Analisar criticamente experiências reais de uso de IA na educação, identificando oportunidades e riscos.",
        conteudo: [
          "Tendências: tutoria adaptativa, personalização, correção automatizada, learning analytics",
          "Cases nacionais e internacionais",
          "Riscos: dependência tecnológica, vieses, perda de autoria docente, desinformação",
        ],
        metodologia: "Estudo de caso em grupos + debate estruturado",
        recursos: ["reportagens e artigos selecionados", "roteiro de análise de caso"],
        avaliacaoProduto: "Ficha de análise crítica do case discutido em grupo",
      },
      {
        codigo: "1.3",
        titulo: "Oficina prática: primeiro contato com IA generativa",
        cargaHoraria: 4,
        objetivo: "Utilizar, na prática, ferramentas de IA generativa (texto e imagem) para uma finalidade pedagógica simples.",
        conteudo: [
          "Tour guiado por 2-3 ferramentas de IA generativa gratuitas",
          "Boas práticas de uso (LGPD, o que evitar compartilhar)",
          "Primeiros prompts para gerar texto/imagem de uso escolar",
        ],
        metodologia: "Oficina mão na massa em duplas, com monitores",
        recursos: ["computadores/celulares com internet", "roteiro passo a passo"],
        avaliacaoProduto: "Material pedagógico gerado pela dupla",
      },
    ],
  },
  {
    numero: 2,
    titulo: "IA Generativa no Planejamento Pedagógico",
    formato: "Plataforma (EAD) — novembro, semana 1",
    cargaHoraria: 20,
    fundamentacaoTeorica: "Guidance for generative AI in education and research (UNESCO, 2023).",
    sessoes: [
      {
        codigo: "2.1",
        titulo: "Fundamentos de prompt engineering para professores",
        cargaHoraria: 4,
        objetivo: "Estruturar comandos (prompts) claros e eficazes para obter respostas úteis de ferramentas de IA generativa.",
        conteudo: [
          "Anatomia de um bom prompt (contexto, tarefa, formato, exemplos)",
          "Erros comuns e refinamento por tentativa e ajuste",
          "Ferramentas: ChatGPT, Google Gemini, Microsoft Copilot",
        ],
        metodologia: "Videoaula + exercício guiado com biblioteca de prompts",
        exemploPratico: "Transformar um prompt genérico em um prompt completo com série, tempo de aula, dificuldade e formato de saída",
        recursos: ["guia de prompts para professores"],
        avaliacaoProduto: "3 prompts testados e refinados para uma necessidade real da turma",
      },
      {
        codigo: "2.2",
        titulo: "Criação de planos de aula e sequências didáticas com IA",
        cargaHoraria: 4,
        objetivo: "Usar IA generativa para acelerar e enriquecer o planejamento de aulas alinhado à BNCC.",
        conteudo: [
          "Estrutura de um plano de aula (objetivos, habilidades BNCC, metodologia, avaliação)",
          "Geração assistida de sequências didáticas, preservando a autoria docente",
          "Adaptação do material gerado à realidade da turma",
        ],
        metodologia: "Oficina prática — geração e revisão de um plano de aula real",
        exemploPratico: "Plano de aula de 50 min sobre \"frações\" para o 6º ano, revisado pelo professor",
        avaliacaoProduto: "Plano de aula finalizado, pronto para aplicação em sala",
      },
      {
        codigo: "2.3",
        titulo: "Produção de materiais didáticos com apoio de IA",
        cargaHoraria: 4,
        objetivo: "Criar materiais didáticos (textos, questões, slides) usando IA como copiloto.",
        conteudo: [
          "Geração de questões por nível de dificuldade",
          "Criação de slides/resumos visuais (Canva IA, Gamma)",
          "Revisão e adequação de linguagem ao público-alvo",
        ],
        metodologia: "Produção prática de um mini-kit didático (questões + slide)",
        avaliacaoProduto: "Mini-kit didático postado na plataforma",
      },
      {
        codigo: "2.4",
        titulo: "Diferenciação pedagógica e adaptação de conteúdo",
        cargaHoraria: 4,
        objetivo: "Aplicar IA para adaptar conteúdos a alunos com diferentes ritmos e necessidades específicas.",
        conteudo: [
          "Adaptação de textos por nível de leitura",
          "Recursos de acessibilidade gerados por IA",
          "Limites da IA na educação inclusiva",
        ],
        metodologia: "Estudo de caso de aluno fictício + adaptação de material",
        avaliacaoProduto: "Versão adaptada do material para o caso estudado",
      },
      {
        codigo: "2.5",
        titulo: "Estudo de caso e atividade avaliativa do módulo",
        cargaHoraria: 4,
        objetivo: "Consolidar o aprendizado do módulo por meio de um estudo de caso integrado.",
        metodologia: "Fórum de discussão + atividade avaliativa final do módulo",
        avaliacaoProduto: "Plano de aula + kit de materiais, avaliado por rubrica",
      },
    ],
  },
  {
    numero: 3,
    titulo: "Ética, LGPD e Uso Responsável de IA na Escola",
    formato: "Plataforma (EAD) — novembro, semana 2",
    cargaHoraria: 16,
    fundamentacaoTeorica:
      "Lei nº 13.709/2018 (LGPD), Recommendation on the Ethics of Artificial Intelligence (UNESCO, 2021) e Tomada de Subsídios da ANPD sobre dados de crianças e adolescentes (2023).",
    sessoes: [
      {
        codigo: "3.1",
        titulo: "LGPD na escola: dados de alunos e responsabilidade docente",
        cargaHoraria: 4,
        objetivo: "Compreender os princípios da LGPD aplicados ao ambiente escolar.",
        conteudo: [
          "Conceitos-chave (dado pessoal, dado sensível, consentimento, finalidade)",
          "Dados de crianças e adolescentes: cuidados específicos",
          "O que inserir/não inserir em ferramentas de IA",
        ],
        metodologia: "Exposição dialogada + análise de casos reais",
        avaliacaoProduto: "Checklist de boas práticas de dados preenchido",
      },
      {
        codigo: "3.2",
        titulo: "Vieses algorítmicos e desinformação",
        cargaHoraria: 4,
        objetivo: "Desenvolver pensamento crítico sobre respostas geradas por IA.",
        metodologia: "Oficina \"caça ao erro\" em respostas de IA",
        avaliacaoProduto: "Relatório de checagem de uma resposta de IA",
      },
      {
        codigo: "3.3",
        titulo: "Letramento em IA para alunos",
        cargaHoraria: 4,
        objetivo: "Planejar como ensinar aos alunos o uso crítico e responsável de IA.",
        metodologia: "Oficina de criação de uma micro-aula sobre uso responsável de IA",
        avaliacaoProduto: "Roteiro de micro-aula pronto para aplicação",
      },
      {
        codigo: "3.4",
        titulo: "Elaboração de política de uso de IA para a sala de aula",
        cargaHoraria: 4,
        objetivo: "Consolidar o módulo produzindo um documento prático de uso da IA em sala.",
        metodologia: "Atividade avaliativa — elaboração individual de política de uso de IA",
        avaliacaoProduto: "Documento de política de uso de IA, avaliado por rubrica",
      },
    ],
  },
  {
    numero: 4,
    titulo: "IA e Gamificação: Rankings, Desafios e Engajamento",
    formato: "Plataforma (EAD) — novembro, semana 3",
    cargaHoraria: 20,
    fundamentacaoTeorica:
      "Deterding et al. (2011), \"From Game Design Elements to Gamefulness: Defining Gamification\"; Kapp (2012), The Gamification of Learning and Instruction.",
    sessoes: [
      {
        codigo: "4.1",
        titulo: "Fundamentos de gamificação na educação",
        cargaHoraria: 4,
        objetivo: "Compreender os elementos de mecânica, dinâmica e estética (MDE) da gamificação.",
        avaliacaoProduto: "Mapa dos elementos MDE identificados em uma experiência analisada",
      },
      {
        codigo: "4.2",
        titulo: "Desenho de desafios e missões gamificadas com apoio de IA",
        cargaHoraria: 4,
        objetivo: "Projetar desafios e missões gamificadas com apoio de IA generativa.",
        avaliacaoProduto: "Trilha de 3 missões gamificadas documentada",
      },
      {
        codigo: "4.3",
        titulo: "Sistemas de pontuação, rankings e badges",
        cargaHoraria: 4,
        objetivo: "Desenhar sistemas de pontuação/ranking que engajem sem competição tóxica.",
        avaliacaoProduto: "Desenho do sistema de pontuação/badges da turma",
      },
      {
        codigo: "4.4",
        titulo: "Estudo de caso: plataformas gamificadas na prática",
        cargaHoraria: 4,
        objetivo: "Analisar como plataformas gamificadas reais (ItaGame/GamificaEdu) estruturam desafios e rankings.",
        avaliacaoProduto: "Relato de exploração da plataforma com 3 observações práticas",
      },
      {
        codigo: "4.5",
        titulo: "Criação de um desafio gamificado para a própria turma",
        cargaHoraria: 4,
        objetivo: "Consolidar o módulo com a criação de um desafio gamificado aplicável.",
        avaliacaoProduto: "Desafio gamificado completo, avaliado por rubrica",
      },
    ],
  },
  {
    numero: 5,
    titulo: "IA na Correção e Avaliação de Provas",
    formato: "Plataforma (EAD) — novembro, semana 4",
    cargaHoraria: 16,
    fundamentacaoTeorica: "Black & Wiliam (1998), Assessment and Classroom Learning; Hattie & Timperley (2007), The Power of Feedback.",
    sessoes: [
      {
        codigo: "5.1",
        titulo: "Modelos de avaliação: da prova tradicional à avaliação formativa digital",
        cargaHoraria: 4,
        avaliacaoProduto: "Quadro comparativo dos instrumentos avaliativos analisados",
      },
      {
        codigo: "5.2",
        titulo: "Correção automatizada e assistida por IA",
        cargaHoraria: 4,
        avaliacaoProduto: "Relatório comparativo entre correção humana e assistida por IA",
      },
      {
        codigo: "5.3",
        titulo: "Rubricas e feedback personalizado com apoio de IA",
        cargaHoraria: 4,
        avaliacaoProduto: "Rubrica + 3 modelos de feedback personalizado",
      },
      {
        codigo: "5.4",
        titulo: "Simulação prática de correção de provas na plataforma",
        cargaHoraria: 4,
        avaliacaoProduto: "Relatório da simulação completa na plataforma, avaliado por rubrica",
      },
    ],
  },
  {
    numero: 6,
    titulo: "Robótica, Cultura Maker e IA na Prática",
    formato: "Presencial (dezembro, Dia 2)",
    cargaHoraria: 12,
    fundamentacaoTeorica: "Construcionismo de Seymour Papert; Blikstein (2016), Maker Movement in Education.",
    sessoes: [
      {
        codigo: "6.1",
        titulo: "Fundamentos de robótica educacional integrados à IA",
        cargaHoraria: 4,
        avaliacaoProduto: "Circuito funcional montado e documentado (foto + esquema)",
      },
      {
        codigo: "6.2",
        titulo: "Oficina maker: prototipagem com sensores e IA embarcada",
        cargaHoraria: 4,
        avaliacaoProduto: "Protótipo funcional por grupo",
      },
      {
        codigo: "6.3",
        titulo: "Apresentação dos protótipos e aplicação em sala de aula",
        cargaHoraria: 4,
        avaliacaoProduto: "Apresentação do protótipo + plano de adaptação para sala de aula",
      },
    ],
  },
  {
    numero: 7,
    titulo: "Projeto Aplicado Final",
    formato: "EAD com mentoria + apresentação presencial (Dia 3)",
    cargaHoraria: 24,
    fundamentacaoTeorica: "Gold Standard PBL (PBLWorks / Buck Institute for Education).",
    sessoes: [
      {
        codigo: "7.1",
        titulo: "Definição do escopo do projeto aplicado",
        cargaHoraria: 4,
        avaliacaoProduto: "Documento de escopo do projeto aplicado (1-2 páginas)",
      },
      {
        codigo: "7.2",
        titulo: "Desenvolvimento do projeto com mentoria assíncrona",
        cargaHoraria: 8,
        avaliacaoProduto: "Versão intermediária do projeto + diário de desenvolvimento",
      },
      {
        codigo: "7.3",
        titulo: "Refinamento, testes e produção do material de apresentação",
        cargaHoraria: 8,
        avaliacaoProduto: "Versão final do projeto + material de apresentação pronto",
      },
      {
        codigo: "7.4",
        titulo: "Apresentação final e avaliação por pares",
        cargaHoraria: 4,
        avaliacaoProduto: "Apresentação final avaliada — 30% da nota final do curso",
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
