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

export const EsquemaGeracaoAtividade = z.object({
  tipo: z.enum(["quiz", "verdadeiro_falso"], { error: "Escolha um tipo de atividade." }),
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
