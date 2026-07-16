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
