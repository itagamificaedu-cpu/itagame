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

export const MODULOS_FORMACAO_IA = [
  { numero: 1, titulo: "Fundamentos de IA e Educação", formato: "Presencial (dezembro, Dia 1)", cargaHoraria: 12 },
  { numero: 2, titulo: "IA Generativa no Planejamento Pedagógico", formato: "Plataforma (EAD) — novembro, semana 1", cargaHoraria: 20 },
  { numero: 3, titulo: "Ética, LGPD e Uso Responsável de IA na Escola", formato: "Plataforma (EAD) — novembro, semana 2", cargaHoraria: 16 },
  { numero: 4, titulo: "IA e Gamificação: Rankings, Desafios e Engajamento", formato: "Plataforma (EAD) — novembro, semana 3", cargaHoraria: 20 },
  { numero: 5, titulo: "IA na Correção e Avaliação de Provas", formato: "Plataforma (EAD) — novembro, semana 4", cargaHoraria: 16 },
  { numero: 6, titulo: "Robótica, Cultura Maker e IA na Prática", formato: "Presencial (dezembro, Dia 2)", cargaHoraria: 12 },
  { numero: 7, titulo: "Projeto Aplicado Final", formato: "EAD com mentoria + apresentação presencial (Dia 3)", cargaHoraria: 24 },
] as const;

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
