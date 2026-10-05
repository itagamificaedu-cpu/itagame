"use client";

// Popup de "badge desbloqueado" — aparece por cima da tela quando uma
// missão concede um badge novo pro aluno (ver MissaoAlunoCliente).

type Props = {
  badge: { nome: string; icone: string };
  onFechar: () => void;
};

export function PopupBadge({ badge, onFechar }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onFechar}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD600] to-[#f59e0b] text-5xl shadow-lg">
          {badge.icone}
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-[#f59e0b]">Badge desbloqueado!</p>
        <h3 className="mt-1 text-xl font-extrabold text-neutral-900">{badge.nome}</h3>
        <button
          type="button"
          onClick={onFechar}
          className="mt-5 w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110"
        >
          Continuar 🚀
        </button>
      </div>
    </div>
  );
}
