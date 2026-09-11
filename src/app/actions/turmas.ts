"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import {
  EsquemaCriarTurma,
  EstadoCriarTurma,
  EsquemaAdicionarAluno,
  EstadoAdicionarAluno,
} from "@/lib/definicoes";

async function verificarDonoTurma(turmaId: string, professorId: string) {
  const turma = await prisma.turma.findUnique({ where: { id: turmaId } });
  if (!turma || turma.professorId !== professorId) {
    throw new Error("Turma não encontrada.");
  }
  return turma;
}

// Código fixo de 6 dígitos que o aluno usa (junto com o PIN) pra entrar nas
// Trilhas sem precisar de e-mail/conta. Diferente do código de sala ao vivo
// (esse não expira). Gerado uma vez, na criação da turma.
function gerarCodigoAcessoTurma() {
  return String(crypto.randomInt(100000, 999999));
}

export async function criarTurma(
  _estado: EstadoCriarTurma,
  formData: FormData
): Promise<EstadoCriarTurma> {
  const sessao = await exigirAssinaturaAtiva();

  const camposValidados = EsquemaCriarTurma.safeParse({
    nome: formData.get("nome"),
    serie: formData.get("serie"),
  });

  if (!camposValidados.success) {
    return { erros: camposValidados.error.flatten().fieldErrors };
  }

  const { nome, serie } = camposValidados.data;

  let turma = null;
  for (let tentativa = 0; tentativa < 5 && !turma; tentativa++) {
    try {
      turma = await prisma.turma.create({
        data: { nome, serie, professorId: sessao.userId, codigoAcesso: gerarCodigoAcessoTurma() },
      });
    } catch {
      turma = null;
    }
  }

  if (!turma) {
    return { mensagem: "Não foi possível criar a turma. Tente novamente." };
  }

  revalidatePath("/painel/turmas");
  redirect(`/painel/turmas/${turma.id}`);
}

export async function excluirTurma(turmaId: string) {
  const sessao = await exigirAssinaturaAtiva();
  await verificarDonoTurma(turmaId, sessao.userId);

  await prisma.aluno.deleteMany({ where: { turmaId } });
  await prisma.turma.delete({ where: { id: turmaId } });

  revalidatePath("/painel/turmas");
  redirect("/painel/turmas");
}

export async function adicionarAluno(
  turmaId: string,
  _estado: EstadoAdicionarAluno,
  formData: FormData
): Promise<EstadoAdicionarAluno> {
  const sessao = await exigirAssinaturaAtiva();
  await verificarDonoTurma(turmaId, sessao.userId);

  const camposValidados = EsquemaAdicionarAluno.safeParse({
    nome: formData.get("nome"),
  });

  if (!camposValidados.success) {
    return { erros: camposValidados.error.flatten().fieldErrors };
  }

  await prisma.aluno.create({
    data: { nome: camposValidados.data.nome, turmaId },
  });

  revalidatePath(`/painel/turmas/${turmaId}`);
  return undefined;
}

// Limite de segurança: uma planilha razoável de turma não passa disso.
// Evita que um arquivo gigante trave o servidor tentando processar tudo.
const MAXIMO_LINHAS_XLS = 500;
const TAMANHO_MAXIMO_XLS = 2 * 1024 * 1024; // 2MB

export type ResultadoImportarAlunosXls =
  | { ok: true; quantidade: number }
  | { ok: false; erro: string };

// Importa alunos em lote a partir de uma planilha .xlsx com uma única coluna
// de nomes (um aluno por linha) — dá pra colar a lista da secretaria/diário
// de classe direto, sem cadastrar um por um. Ignora a primeira linha se ela
// parecer um cabeçalho (ex: "Nome", "Aluno").
export async function importarAlunosXls(
  turmaId: string,
  formData: FormData
): Promise<ResultadoImportarAlunosXls> {
  const sessao = await exigirAssinaturaAtiva();
  await verificarDonoTurma(turmaId, sessao.userId);

  const arquivo = formData.get("arquivo");
  if (!(arquivo instanceof File) || arquivo.size === 0) {
    return { ok: false, erro: "Escolha um arquivo .xlsx pra importar." };
  }
  if (arquivo.size > TAMANHO_MAXIMO_XLS) {
    return { ok: false, erro: "Arquivo muito grande (máximo 2MB)." };
  }

  let linhas: unknown[][];
  try {
    const buffer = Buffer.from(await arquivo.arrayBuffer());
    const planilha = XLSX.read(buffer, { type: "buffer" });
    const primeiraAba = planilha.Sheets[planilha.SheetNames[0]];
    linhas = XLSX.utils.sheet_to_json(primeiraAba, { header: 1 });
  } catch {
    return { ok: false, erro: "Não foi possível ler esse arquivo. Confirme que é um .xlsx válido." };
  }

  const candidatos = linhas
    .map((linha) => (Array.isArray(linha) ? linha[0] : null))
    .map((valor) => (typeof valor === "string" ? valor.trim() : valor != null ? String(valor).trim() : ""))
    .filter((nome) => nome.length > 0);

  // Remove a primeira linha se parecer cabeçalho, não um nome de aluno.
  const primeira = candidatos[0]?.toLowerCase() ?? "";
  const nomes = primeira === "nome" || primeira === "aluno" || primeira === "aluno(a)"
    ? candidatos.slice(1)
    : candidatos;

  if (nomes.length === 0) {
    return { ok: false, erro: "Não encontrei nenhum nome na planilha." };
  }
  if (nomes.length > MAXIMO_LINHAS_XLS) {
    return { ok: false, erro: `Muitas linhas (máximo ${MAXIMO_LINHAS_XLS} alunos por importação).` };
  }

  await prisma.aluno.createMany({
    data: nomes.map((nome) => ({ nome: nome.slice(0, 200), turmaId })),
  });

  revalidatePath(`/painel/turmas/${turmaId}`);
  return { ok: true, quantidade: nomes.length };
}

export async function removerAluno(turmaId: string, alunoId: string) {
  const sessao = await exigirAssinaturaAtiva();
  await verificarDonoTurma(turmaId, sessao.userId);

  await prisma.aluno.deleteMany({ where: { id: alunoId, turmaId } });

  revalidatePath(`/painel/turmas/${turmaId}`);
}
