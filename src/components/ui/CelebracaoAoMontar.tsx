"use client";

import { useEffect } from "react";
import { celebrarConquista, celebrarMissaoConcluida } from "@/lib/celebracao";

// Dispara som + confete assim que a tela aparece — usado em páginas de
// resultado/pódio que são Server Component (não têm onClick pra ligar o
// som), tipo o pódio da Gincana. "grande" = fanfarra + confete maior.
export function CelebracaoAoMontar({ intensidade = "grande" }: { intensidade?: "normal" | "grande" }) {
  useEffect(() => {
    if (intensidade === "grande") celebrarConquista();
    else celebrarMissaoConcluida();
  }, [intensidade]);

  return null;
}
