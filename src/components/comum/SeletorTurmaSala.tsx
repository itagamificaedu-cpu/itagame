// Seletor opcional de turma usado nos formulários que abrem uma sala ao vivo
// (Sala Ao Vivo / Cabo de Guerra) — quando escolhida, o aluno entra pelo nome
// da turma + PIN em vez de apelido livre, e a pontuação fica guardada nele
// entre partidas. Ver comentário em prisma/schema.prisma (SalaAoVivo.turmaId).
export function SeletorTurmaSala({ turmas }: { turmas: { id: string; nome: string }[] }) {
  if (turmas.length === 0) return null;

  return (
    <select
      name="turmaId"
      defaultValue=""
      title="Vincular a uma turma (opcional) — a pontuação fica ligada ao aluno entre partidas"
      className="rounded-lg border border-neutral-300 bg-white px-2 py-2 text-xs text-neutral-600 focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
    >
      <option value="">Sem turma (apelido livre)</option>
      {turmas.map((turma) => (
        <option key={turma.id} value={turma.id}>
          {turma.nome}
        </option>
      ))}
    </select>
  );
}
