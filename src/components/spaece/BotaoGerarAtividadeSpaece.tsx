"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { gerarAtividadeSpaece } from "@/app/actions/atividades";
import type { EixoSpaece9Ano } from "@/lib/spaece";

// Botão "1 clique" das atividades SPAECE — chama a action e navega pelo
// router.push() no cliente em vez de deixar o redirect() rodar dentro da
// própria server action (ver comentário em actions/atividades.ts sobre o
// ERR_ABORTED que isso causava com várias dessas ações na mesma tela). Como
// bônus, dá pra mostrar "Gerando..." enquanto a IA trabalha (8-12 questões
// demoram alguns segundos), coisa que o botão antigo não tinha.
export function BotaoGerarAtividadeSpaece({
  eixoChave,
  tipo,
  rotulo,
  variante,
  cor,
  corEscura,
}: {
  eixoChave: EixoSpaece9Ano;
  tipo: "quiz" | "cabo_de_guerra";
  rotulo: string;
  variante: "solido" | "tracejado";
  cor: string;
  corEscura: string;
}) {
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();
  const router = useRouter();

  function clicar() {
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await gerarAtividadeSpaece(eixoChave, tipo);
      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }
      router.push(`/painel/atividades/${resultado.atividadeId}`);
    });
  }

  const classeBase =
    "w-full rounded-lg py-2 text-center text-sm font-bold transition disabled:opacity-60";
  const classeVariante =
    variante === "solido"
      ? "text-white hover:brightness-95"
      : "border-2 border-dashed hover:bg-neutral-50";

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={clicar}
        disabled={pendente}
        className={`${classeBase} ${classeVariante}`}
        style={variante === "solido" ? { backgroundColor: cor } : { borderColor: cor, color: corEscura }}
      >
        {pendente ? "Gerando com IA..." : rotulo}
      </button>
      {erro && <p className="mt-1 text-xs text-red-600">{erro}</p>}
    </div>
  );
}
