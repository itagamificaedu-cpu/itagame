// Importa o Diagnóstico Bimestral de Matemática (8 habilidades básicas —
// 4 operações + 4 situações-problema), 9º ano, CEITEC 2026 — vindo do
// painel "Foco Pedagógico" do dashboard oficial da SME de Itapipoca.
// Diferente do SISPAI (2x/ano, escala TRI): este é aplicado a cada
// bimestre e já vem com o ponto de atenção classificado pela SME
// ("avançou pouco" / "não avançou") por aluno e por habilidade.
//
// Fonte: dados-diagnostico-bimestral-matematica.json (gitignored — dado
// pessoal real de aluno). Roda uma vez por bimestre; é seguro rodar de
// novo (apaga e recria os registros do bimestre antes de inserir).
//
// Uso: node scripts/importarDiagnosticoBimestralMatematica.js

const { PrismaClient } = require("@prisma/client");
const dados = require("./dados-diagnostico-bimestral-matematica.json");

const prisma = new PrismaClient();

const EMAIL_PROFESSOR = "itagamificaedu@gmail.com";

async function main() {
  const professor = await prisma.usuario.findUnique({ where: { email: EMAIL_PROFESSOR } });
  if (!professor) throw new Error(`Professor não encontrado: ${EMAIL_PROFESSOR}`);

  const bimestres = Object.keys(dados.aggregado).map(Number);

  await prisma.diagnosticoBimestralMatematica.deleteMany({
    where: { professorId: professor.id, ano: dados.ano, bimestre: { in: bimestres } },
  });
  await prisma.habilidadeBimestralMatematica.deleteMany({
    where: { professorId: professor.id, ano: dados.ano, bimestre: { in: bimestres } },
  });

  // Os registros por aluno (pontos de atenção) só têm detalhe completo no
  // bimestre mais recente capturado (2º bimestre/2026); ainda assim ficam
  // associados a esse bimestre específico.
  const BIMESTRE_REGISTROS = 2;
  await prisma.diagnosticoBimestralMatematica.createMany({
    data: dados.registros.map((r) => ({
      ano: dados.ano,
      bimestre: BIMESTRE_REGISTROS,
      turma: r.turma,
      nomeAluno: r.nomeAluno,
      matricula: r.matricula,
      habilidade: r.habilidade,
      situacao: r.situacao,
      professorId: professor.id,
    })),
  });

  const habilidadesRegistros = [];
  for (const bimestre of bimestres) {
    for (const [habilidade, v] of Object.entries(dados.aggregado[bimestre])) {
      habilidadesRegistros.push({
        ano: dados.ano,
        bimestre,
        habilidade,
        percentualAcertoGeral: v.pct,
        totalAlunos: v.total,
        professorId: professor.id,
      });
    }
  }
  await prisma.habilidadeBimestralMatematica.createMany({ data: habilidadesRegistros });

  console.log(`Importado: ${dados.registros.length} pontos de atenção, ${habilidadesRegistros.length} linhas de habilidade agregada.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
