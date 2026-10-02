// Organiza as trilhas "Banco Oficial SPAECE" (criadas a partir do caderno
// modelo, ver criarConteudoSpaeceMatematicaDoBanco em src/app/actions/trilhas.ts):
//
// 1. Apaga duplicatas — mesma trilha criada 2x na mesma turma fica só a
//    publicada (ou a mais antiga); Simulado/Cabo de Guerra repetido fica só
//    o que já foi jogado em sala (ou o mais antigo). Nunca apaga nada que
//    tenha missão concluída ou sala jogada.
// 2. Copia cada trilha pra TODAS as turmas do 9º ano do professor
//    ("9º Ano A", "9º Ano B", ...) — Trilha pertence a uma turma só.
// 3. Publica todas. Alunos que entrarem depois na turma recebem o progresso
//    inicial ao abrir /trilha.
//
// Seguro rodar de novo. Uso: node scripts/publicarTrilhasSpaece9Ano.js

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

const EMAIL_PROFESSOR = "itagamificaedu@gmail.com";
const SUFIXO_TRILHA = "— Banco Oficial SPAECE";

async function apagarTrilha(trilhaId) {
  const missoes = await prisma.missao.findMany({ where: { trilhaId }, select: { id: true } });
  const ids = missoes.map((m) => m.id);
  await prisma.$transaction([
    prisma.progressoAluno.deleteMany({ where: { missaoId: { in: ids } } }),
    prisma.missao.updateMany({ where: { id: { in: ids } }, data: { preRequisitoId: null } }),
    prisma.missao.deleteMany({ where: { id: { in: ids } } }),
    prisma.trilha.delete({ where: { id: trilhaId } }),
  ]);
}

async function publicar(trilha) {
  const missoes = await prisma.missao.findMany({ where: { trilhaId: trilha.id } });
  const alunos = await prisma.aluno.findMany({ where: { turmaId: trilha.turmaId }, select: { id: true } });
  await prisma.$transaction([
    prisma.trilha.update({ where: { id: trilha.id }, data: { status: "publicada" } }),
    prisma.progressoAluno.createMany({
      data: alunos.flatMap((aluno) =>
        missoes.map((missao) => ({
          alunoId: aluno.id,
          missaoId: missao.id,
          status: trilha.tipoEstrutura === "livre" || !missao.preRequisitoId ? "disponivel" : "bloqueada",
        }))
      ),
      skipDuplicates: true,
    }),
  ]);
  return alunos.length;
}

// Copia trilha + missões (mantendo a corrente de pré-requisitos) pra outra turma.
async function copiarParaTurma(origem, turmaId) {
  const missoes = await prisma.missao.findMany({ where: { trilhaId: origem.id }, orderBy: { ordem: "asc" } });
  return prisma.$transaction(async (tx) => {
    const nova = await tx.trilha.create({
      data: {
        nome: origem.nome,
        descricao: origem.descricao,
        tipoEstrutura: origem.tipoEstrutura,
        nivel: origem.nivel,
        competenciasBncc: origem.competenciasBncc,
        eixoSpaece: origem.eixoSpaece,
        capaUrl: origem.capaUrl,
        professorId: origem.professorId,
        turmaId,
      },
    });
    const novoIdPorAntigo = new Map();
    for (const m of missoes) {
      const criada = await tx.missao.create({
        data: {
          titulo: m.titulo,
          descricao: m.descricao,
          xpRecompensa: m.xpRecompensa,
          criadaPorId: m.criadaPorId,
          trilhaId: nova.id,
          ordem: m.ordem,
          tipoAtividade: m.tipoAtividade,
          nivelDificuldade: m.nivelDificuldade,
          criterioDesbloqueio: m.criterioDesbloqueio,
          badgeId: m.badgeId,
          checkpointTipo: m.checkpointTipo,
          notaMinima: m.notaMinima,
          quizPerguntas: m.quizPerguntas ?? undefined,
          mapaImagemUrl: m.mapaImagemUrl,
          mapaPontos: m.mapaPontos ?? undefined,
        },
      });
      novoIdPorAntigo.set(m.id, criada.id);
    }
    for (const m of missoes) {
      if (m.preRequisitoId && novoIdPorAntigo.has(m.preRequisitoId)) {
        await tx.missao.update({
          where: { id: novoIdPorAntigo.get(m.id) },
          data: { preRequisitoId: novoIdPorAntigo.get(m.preRequisitoId) },
        });
      }
    }
    return nova;
  });
}

async function main() {
  const professor = await prisma.usuario.findUnique({ where: { email: EMAIL_PROFESSOR } });
  if (!professor) throw new Error(`Professor ${EMAIL_PROFESSOR} não encontrado.`);

  // --- 1a. Trilhas duplicadas na mesma turma ---
  const trilhas = await prisma.trilha.findMany({
    where: { professorId: professor.id, eixoSpaece: { not: null }, nome: { endsWith: SUFIXO_TRILHA } },
    orderBy: { criadaEm: "asc" },
  });
  const grupos = new Map();
  for (const t of trilhas) {
    const chave = `${t.turmaId}|${t.nome}`;
    grupos.set(chave, [...(grupos.get(chave) ?? []), t]);
  }
  for (const grupo of grupos.values()) {
    if (grupo.length < 2) continue;
    const manter = grupo.find((t) => t.status === "publicada") ?? grupo[0];
    for (const t of grupo) {
      if (t.id === manter.id) continue;
      const concluidas = await prisma.progressoAluno.count({
        where: { missao: { trilhaId: t.id }, status: "concluida" },
      });
      if (concluidas > 0) {
        console.log(`Mantida (tem missão concluída): ${t.nome} ${t.id}`);
        continue;
      }
      await apagarTrilha(t.id);
      console.log(`Apagada trilha duplicada: ${t.nome} (${t.id})`);
    }
  }

  // --- 1b. Simulado / Cabo de Guerra duplicados ---
  const atividades = await prisma.atividade.findMany({
    where: {
      professorId: professor.id,
      OR: [{ tema: { endsWith: "(SPAECE) — Simulado" } }, { tema: { endsWith: "(SPAECE) — Cabo de Guerra" } }],
    },
    include: { _count: { select: { salasAoVivo: true, aplicacoes: true, gincanaRodadas: true } } },
    orderBy: { criadaEm: "asc" },
  });
  const porTema = new Map();
  for (const a of atividades) porTema.set(`${a.tipo}|${a.tema}`, [...(porTema.get(`${a.tipo}|${a.tema}`) ?? []), a]);
  const usada = (a) => a._count.salasAoVivo + a._count.aplicacoes + a._count.gincanaRodadas > 0;
  for (const grupo of porTema.values()) {
    if (grupo.length < 2) continue;
    const manter = grupo.find(usada) ?? grupo[0];
    for (const a of grupo) {
      if (a.id === manter.id || usada(a)) continue;
      await prisma.atividade.delete({ where: { id: a.id } });
      console.log(`Apagada atividade duplicada: ${a.tema} (${a.id})`);
    }
  }

  // --- 2. Uma cópia de cada trilha em cada turma do 9º ano ---
  const turmas9 = await prisma.turma.findMany({
    where: { professorId: professor.id, nome: { startsWith: "9º Ano" } },
    orderBy: { nome: "asc" },
  });
  const restantes = await prisma.trilha.findMany({
    where: { professorId: professor.id, eixoSpaece: { not: null }, nome: { endsWith: SUFIXO_TRILHA } },
    orderBy: { criadaEm: "asc" },
  });
  const modelos = new Map();
  for (const t of restantes) if (!modelos.has(t.nome)) modelos.set(t.nome, t);

  for (const turma of turmas9) {
    for (const modelo of modelos.values()) {
      let trilha = restantes.find((t) => t.turmaId === turma.id && t.nome === modelo.nome);
      if (!trilha) {
        trilha = await copiarParaTurma(modelo, turma.id);
        console.log(`Copiada: ${modelo.nome} → ${turma.nome}`);
      }
      // --- 3. Publica ---
      if (trilha.status !== "publicada") {
        const qtd = await publicar(trilha);
        console.log(`Publicada: ${trilha.nome} em ${turma.nome} (${qtd} alunos)`);
      }
    }
  }

  const final = await prisma.trilha.groupBy({
    by: ["status"],
    where: { professorId: professor.id, nome: { endsWith: SUFIXO_TRILHA } },
    _count: true,
  });
  console.log("Resumo:", JSON.stringify(final));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
