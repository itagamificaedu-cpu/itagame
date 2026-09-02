import * as z from "zod";

export const EsquemaCadastro = z.object({
  nome: z.string().min(2, { error: "Informe seu nome completo." }).trim(),
  email: z.email({ error: "Informe um e-mail válido." }).trim(),
  senha: z
    .string()
    .min(8, { error: "A senha precisa ter pelo menos 8 caracteres." })
    .regex(/[a-zA-Z]/, { error: "A senha precisa ter ao menos uma letra." })
    .regex(/[0-9]/, { error: "A senha precisa ter ao menos um número." })
    .trim(),
});

export const EsquemaLogin = z.object({
  email: z.email({ error: "Informe um e-mail válido." }).trim(),
  senha: z.string().min(1, { error: "Informe sua senha." }),
});

export type EstadoFormulario =
  | {
      erros?: {
        nome?: string[];
        email?: string[];
        senha?: string[];
      };
      mensagem?: string;
    }
  | undefined;

export const EsquemaEsqueciSenha = z.object({
  email: z.email({ error: "Informe um e-mail válido." }).trim(),
});

export type EstadoEsqueciSenha =
  | {
      erros?: { email?: string[] };
      mensagem?: string;
    }
  | undefined;

export const EsquemaRedefinirSenha = z.object({
  id: z.string().min(1, { error: "Link inválido." }),
  token: z.string().min(1, { error: "Link inválido." }),
  senha: z
    .string()
    .min(8, { error: "A senha precisa ter pelo menos 8 caracteres." })
    .regex(/[a-zA-Z]/, { error: "A senha precisa ter ao menos uma letra." })
    .regex(/[0-9]/, { error: "A senha precisa ter ao menos um número." })
    .trim(),
});

export type EstadoRedefinirSenha =
  | {
      erros?: { id?: string[]; token?: string[]; senha?: string[] };
      mensagem?: string;
    }
  | undefined;

export const EsquemaGeracaoAtividade = z.object({
  tipo: z.enum(
    [
      "quiz",
      "verdadeiro_falso",
      "completar_frase",
      "caca_palavras",
      "associar_colunas",
      "apresentacao",
      "cabo_de_guerra",
    ],
    { error: "Escolha um tipo de atividade." }
  ),
  disciplina: z.string().min(2, { error: "Informe a disciplina." }).trim(),
  serie: z.string().min(1, { error: "Informe a série/ano." }).trim(),
  tema: z.string().min(3, { error: "Informe o tema da atividade." }).trim(),
  quantidadeQuestoes: z.coerce
    .number({ error: "Informe a quantidade de questões." })
    .int()
    .min(3, { error: "Mínimo de 3 questões." })
    .max(15, { error: "Máximo de 15 questões." }),
});

export type EstadoGeracaoAtividade =
  | {
      erros?: {
        tipo?: string[];
        disciplina?: string[];
        serie?: string[];
        tema?: string[];
        quantidadeQuestoes?: string[];
      };
      mensagem?: string;
    }
  | undefined;

export const EsquemaEntrarSala = z.object({
  codigo: z.string().length(6, { error: "O código tem 6 dígitos." }).trim(),
  apelido: z
    .string()
    .min(2, { error: "Informe um apelido." })
    .max(20, { error: "Apelido muito longo (máx. 20 caracteres)." })
    .trim(),
});

export type EstadoEntrarSala =
  | {
      erros?: {
        codigo?: string[];
        apelido?: string[];
      };
      mensagem?: string;
    }
  | undefined;

export const EsquemaCorrecaoRedacao = z.object({
  tema: z.string().min(3, { error: "Informe o tema da redação." }).trim(),
  texto: z
    .string()
    .min(100, { error: "Cole o texto completo da redação (mínimo 100 caracteres)." })
    .max(12000, { error: "Texto muito longo (máx. 12.000 caracteres)." })
    .trim(),
});

export type EstadoCorrecaoRedacao =
  | {
      erros?: {
        tema?: string[];
        texto?: string[];
      };
      mensagem?: string;
    }
  | undefined;

export const EsquemaCriarTurma = z.object({
  nome: z.string().min(2, { error: "Informe o nome da turma." }).trim(),
  serie: z.string().min(1, { error: "Informe a série/ano." }).trim(),
});

export type EstadoCriarTurma =
  | {
      erros?: {
        nome?: string[];
        serie?: string[];
      };
      mensagem?: string;
    }
  | undefined;

export const EsquemaAdicionarAluno = z.object({
  nome: z.string().min(2, { error: "Informe o nome do aluno." }).trim(),
});

export type EstadoAdicionarAluno =
  | {
      erros?: {
        nome?: string[];
      };
      mensagem?: string;
    }
  | undefined;

export const EsquemaAdicionarProfessorEscola = z.object({
  email: z.email({ error: "Informe um e-mail válido." }).trim(),
});

export type EstadoAdicionarProfessorEscola =
  | {
      erros?: {
        email?: string[];
      };
      mensagem?: string;
    }
  | undefined;

export const EsquemaCriarSalaCaboGuerra = z.object({
  nomeEquipe1: z.string().min(1, { error: "Informe o nome da equipe 1." }).max(20).trim(),
  nomeEquipe2: z.string().min(1, { error: "Informe o nome da equipe 2." }).max(20).trim(),
});

export type EstadoCriarSalaCaboGuerra =
  | {
      erros?: {
        nomeEquipe1?: string[];
        nomeEquipe2?: string[];
      };
      mensagem?: string;
    }
  | undefined;

export const EsquemaCriarTrilha = z.object({
  nome: z.string().min(3, { error: "Dê um nome pra trilha." }).trim(),
  descricao: z.string().min(3, { error: "Descreva a trilha." }).trim(),
  tipoEstrutura: z.enum(["linear", "livre"], { error: "Escolha o tipo de estrutura." }),
  nivel: z.enum(["iniciante", "intermediario", "avancado"], { error: "Escolha o nível." }),
  turmaId: z.string().min(1, { error: "Escolha a turma." }),
});

export type EstadoCriarTrilha =
  | {
      erros?: {
        nome?: string[];
        descricao?: string[];
        tipoEstrutura?: string[];
        nivel?: string[];
        turmaId?: string[];
      };
      mensagem?: string;
    }
  | undefined;

export const EsquemaEntrarCaboGuerra = z.object({
  codigo: z.string().length(6, { error: "O código tem 6 dígitos." }).trim(),
  apelido: z
    .string()
    .min(2, { error: "Informe um apelido." })
    .max(20, { error: "Apelido muito longo (máx. 20 caracteres)." })
    .trim(),
  equipe: z.coerce.number({ error: "Escolha uma equipe." }).int().min(1).max(2),
});

export type EstadoEntrarCaboGuerra =
  | {
      erros?: {
        codigo?: string[];
        apelido?: string[];
        equipe?: string[];
      };
      mensagem?: string;
    }
  | undefined;
