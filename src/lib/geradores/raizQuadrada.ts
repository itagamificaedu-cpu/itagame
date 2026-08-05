import { aleatorioInt } from "./aleatorio";

export type DificuldadeRaiz = "facil" | "medio" | "dificil";

export type QuestaoRaiz = {
  enunciado: string;
  resposta: number;
  /** "exata": resposta é a raiz certinha. "estimativa": resposta é o menor dos 2 inteiros consecutivos. */
  tipo: "exata" | "estimativa";
};

/**
 * Gera uma questão de radiciação alinhada à BNCC EF08MA02 (relação entre
 * potências e raízes) e ao descritor SPAECE/SAEB D27 (valores aproximados
 * de radicais) no nível difícil.
 */
export function gerarQuestaoRaiz(dificuldade: DificuldadeRaiz): QuestaoRaiz {
  if (dificuldade === "facil") {
    const raiz = aleatorioInt(1, 10);
    return { enunciado: `√${raiz * raiz} =`, resposta: raiz, tipo: "exata" };
  }

  if (dificuldade === "medio") {
    const raiz = aleatorioInt(10, 20);
    return { enunciado: `√${raiz * raiz} =`, resposta: raiz, tipo: "exata" };
  }

  // Difícil: raiz não exata — estimar entre quais dois inteiros consecutivos ela está.
  const menor = aleatorioInt(2, 15);
  const n = aleatorioInt(menor * menor + 1, (menor + 1) * (menor + 1) - 1);
  return {
    enunciado: `Entre quais dois números inteiros consecutivos está √${n}? (responda o menor deles)`,
    resposta: menor,
    tipo: "estimativa",
  };
}
