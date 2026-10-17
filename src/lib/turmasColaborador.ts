// Quais turmas um professor colaborador (login restrito) pode enxergar.
// - Dono da conta: vê tudo.
// - Turma com `areaExclusiva` (ex.: "enfermagem"): só o colaborador daquela área.
// - Demais turmas: só colaboradores da aba SPAECE, e nunca as bloqueadas
//   (turmas do CEITEC com acesso de alunos desativado).
type SessaoComColaborador = { colaborador: { acessoRestrito: string | null } | null };
type TurmaVisivel = { acessoAlunosBloqueado: boolean; areaExclusiva: string | null };

export function filtroTurmas(sessao: SessaoComColaborador) {
  if (!sessao.colaborador) return {};
  const area = sessao.colaborador.acessoRestrito;
  if (area === "spaece_9ano") return { acessoAlunosBloqueado: false, areaExclusiva: null };
  return { areaExclusiva: area };
}

export function turmaOculta(sessao: SessaoComColaborador, turma: TurmaVisivel): boolean {
  if (!sessao.colaborador) return false;
  const area = sessao.colaborador.acessoRestrito;
  if (turma.areaExclusiva) return turma.areaExclusiva !== area;
  return area !== "spaece_9ano" || turma.acessoAlunosBloqueado;
}
