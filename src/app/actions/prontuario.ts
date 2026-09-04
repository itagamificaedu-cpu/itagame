"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { exigirAssinaturaAtiva, verificarSessaoAluno } from "@/lib/acessoDados";

// Simulador de Prontuário Eletrônico — pensado pra disciplina de Informática
// Aplicada (Curso Técnico em Enfermagem), módulo "Plataformas Eletrônicas e
// Registro Assistencial". O professor cadastra casos clínicos por turma; o
// aluno "atende" cada caso preenchendo um registro estruturado (sinais
// vitais + anotação de enfermagem), igual a uma ficha de prontuário
// eletrônico de verdade — substitui a planilha manual que o professor usava
// antes.

export type ResultadoAcaoProntuario = { ok: true } | { ok: false; erro: string };

async function verificarDonoTurma(turmaId: string, professorId: string) {
  const turma = await prisma.turma.findUnique({ where: { id: turmaId } });
  if (!turma || turma.professorId !== professorId) {
    throw new Error("Turma não encontrada.");
  }
  return turma;
}

export async function criarCasoClinico(input: {
  turmaId: string;
  titulo: string;
  enunciado: string;
}): Promise<ResultadoAcaoProntuario> {
  const sessao = await exigirAssinaturaAtiva();
  await verificarDonoTurma(input.turmaId, sessao.userId);

  const titulo = input.titulo.trim();
  const enunciado = input.enunciado.trim();
  if (!titulo || !enunciado) {
    return { ok: false, erro: "Preencha o título e o enunciado do caso." };
  }

  const ultimo = await prisma.casoClinicoProntuario.findFirst({
    where: { turmaId: input.turmaId },
    orderBy: { ordem: "desc" },
  });

  await prisma.casoClinicoProntuario.create({
    data: { turmaId: input.turmaId, titulo, enunciado, ordem: (ultimo?.ordem ?? -1) + 1 },
  });

  revalidatePath(`/painel/turmas/${input.turmaId}/prontuario`);
  return { ok: true };
}

export async function excluirCasoClinico(casoId: string) {
  const sessao = await exigirAssinaturaAtiva();
  const caso = await prisma.casoClinicoProntuario.findUnique({ where: { id: casoId } });
  if (!caso) return;
  await verificarDonoTurma(caso.turmaId, sessao.userId);

  await prisma.$transaction([
    prisma.registroProntuario.deleteMany({ where: { casoId } }),
    prisma.casoClinicoProntuario.delete({ where: { id: casoId } }),
  ]);

  revalidatePath(`/painel/turmas/${caso.turmaId}/prontuario`);
}

// Aluno abre um caso pela primeira vez → cria o registro em branco
// (idempotente: se já existe, só retorna o que já tinha, sem apagar nada).
export async function obterOuCriarRegistro(casoId: string) {
  const aluno = await verificarSessaoAluno();

  const caso = await prisma.casoClinicoProntuario.findUnique({ where: { id: casoId } });
  if (!caso || caso.turmaId !== aluno.turmaId) {
    throw new Error("Caso clínico não encontrado.");
  }

  const existente = await prisma.registroProntuario.findUnique({
    where: { casoId_alunoId: { casoId, alunoId: aluno.id } },
  });
  if (existente) return existente;

  return prisma.registroProntuario.create({
    data: { casoId, alunoId: aluno.id },
  });
}

export type DadosRegistroProntuario = {
  dataRegistro: string;
  horaRegistro: string;
  paciente: string;
  leito: string;
  pressaoArterial: string;
  frequenciaCardiaca: string;
  frequenciaRespiratoria: string;
  temperatura: string;
  saturacaoOxigenio: string;
  anotacaoEnfermagem: string;
  assinaturaTecnico: string;
};

export async function salvarRegistroProntuario(
  registroId: string,
  dados: DadosRegistroProntuario,
  finalizar: boolean
): Promise<ResultadoAcaoProntuario> {
  const aluno = await verificarSessaoAluno();

  const registro = await prisma.registroProntuario.findUnique({ where: { id: registroId } });
  if (!registro || registro.alunoId !== aluno.id) {
    return { ok: false, erro: "Registro não encontrado." };
  }

  if (finalizar) {
    const camposObrigatorios = [
      dados.paciente,
      dados.pressaoArterial,
      dados.frequenciaCardiaca,
      dados.anotacaoEnfermagem,
      dados.assinaturaTecnico,
    ];
    if (camposObrigatorios.some((campo) => !campo.trim())) {
      return {
        ok: false,
        erro: "Pra finalizar, preencha pelo menos paciente, PA, FC, anotação de enfermagem e assinatura.",
      };
    }
  }

  await prisma.registroProntuario.update({
    where: { id: registroId },
    data: {
      dataRegistro: dados.dataRegistro.trim(),
      horaRegistro: dados.horaRegistro.trim(),
      paciente: dados.paciente.trim(),
      leito: dados.leito.trim(),
      pressaoArterial: dados.pressaoArterial.trim(),
      frequenciaCardiaca: dados.frequenciaCardiaca.trim(),
      frequenciaRespiratoria: dados.frequenciaRespiratoria.trim(),
      temperatura: dados.temperatura.trim(),
      saturacaoOxigenio: dados.saturacaoOxigenio.trim(),
      anotacaoEnfermagem: dados.anotacaoEnfermagem.trim(),
      assinaturaTecnico: dados.assinaturaTecnico.trim(),
      status: finalizar ? "finalizado" : "pendente",
    },
  });

  revalidatePath(`/trilha/prontuario/${registro.casoId}`);
  revalidatePath(`/painel/turmas`);
  return { ok: true };
}
