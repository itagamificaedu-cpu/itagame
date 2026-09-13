import { gerarLabirinto, resolverLabirinto, type CelulaLabirinto } from "./labirinto";
import { embaralhar, aleatorioInt } from "./aleatorio";

// Gerador "desplugado" de BNCC Computação — atividades sem tela, pensadas
// pra Educação Infantil e Anos Iniciais (mas usáveis em qualquer etapa):
// programar um robô com setas, completar um padrão e organizar os passos
// de uma tarefa em ordem. Mesmo princípio dos outros geradores (embaralha
// e monta na hora, sem repetir), só que aqui a "resposta" fica no próprio
// papel — o aluno escreve/numera à mão.

// ---------------------------------------------------------------------------
// 1) Programe o Robô — reaproveita o motor de labirinto (lib/geradores/
// labirinto.ts) e transforma o caminho da solução numa sequência de setas
// que o aluno escreve no espaço reservado da folha.
// ---------------------------------------------------------------------------

export type ComandoSeta = "↑" | "↓" | "←" | "→";

export function caminhoParaComandos(caminho: [number, number][]): ComandoSeta[] {
  const comandos: ComandoSeta[] = [];
  for (let i = 1; i < caminho.length; i++) {
    const [rAnterior, cAnterior] = caminho[i - 1];
    const [r, c] = caminho[i];
    if (r < rAnterior) comandos.push("↑");
    else if (r > rAnterior) comandos.push("↓");
    else if (c < cAnterior) comandos.push("←");
    else comandos.push("→");
  }
  return comandos;
}

export function gerarProgrameORobo(tamanho: number): {
  grade: CelulaLabirinto[][];
  caminho: [number, number][];
  comandos: ComandoSeta[];
} {
  const grade = gerarLabirinto(tamanho, tamanho);
  const caminho = resolverLabirinto(grade);
  const comandos = caminhoParaComandos(caminho);
  return { grade, caminho, comandos };
}

// ---------------------------------------------------------------------------
// 2) Complete o Padrão — sequência de ícones que se repete (AB, ABC ou ABCD)
// com uma lacuna pro aluno descobrir o próximo. Temas com cara de tecnologia
// pra reforçar o eixo Pensamento Computacional, além de formas/animais mais
// neutros pra Educação Infantil.
// ---------------------------------------------------------------------------

export type TemaPadrao = "robos" | "formas" | "animais";

const TEMAS_PADRAO: Record<TemaPadrao, string[]> = {
  robos: ["🤖", "⚙️", "🔌", "💾"],
  formas: ["⭐", "🔺", "🔵", "🟩"],
  animais: ["🐶", "🐱", "🐰", "🐢"],
};

export type DificuldadePadrao = "facil" | "medio" | "dificil";
const TAMANHO_UNIDADE: Record<DificuldadePadrao, number> = { facil: 2, medio: 3, dificil: 4 };
const REPETICOES = 3;

export function gerarPadraoDesplugado(tema: TemaPadrao, dificuldade: DificuldadePadrao) {
  const unidade = TEMAS_PADRAO[tema].slice(0, TAMANHO_UNIDADE[dificuldade]);
  const termos = Array.from({ length: unidade.length * REPETICOES }, (_, i) => unidade[i % unidade.length]);
  // a lacuna nunca cai nas duas primeiras posições, pra dar pro aluno pelo
  // menos uma repetição completa do padrão antes de precisar adivinhar
  const posicaoLacuna = aleatorioInt(unidade.length, termos.length - 1);
  return { termos, posicaoLacuna, resposta: termos[posicaoLacuna] };
}

// ---------------------------------------------------------------------------
// 3) Organize os Passos — decomposição de uma tarefa do dia a dia em passos
// numerados. O aluno recebe os passos embaralhados e escreve a ordem certa.
// ---------------------------------------------------------------------------

export type TarefaDesplugada = { titulo: string; passos: string[] };

export const BANCO_TAREFAS_DESPLUGADAS: TarefaDesplugada[] = [
  {
    titulo: "Escovar os dentes",
    passos: [
      "Pegar a escova e o creme dental",
      "Passar o creme dental na escova",
      "Escovar todos os dentes",
      "Enxaguar a boca com água",
      "Guardar a escova no lugar",
    ],
  },
  {
    titulo: "Montar um sanduíche",
    passos: [
      "Pegar duas fatias de pão",
      "Passar o recheio em uma fatia",
      "Colocar a outra fatia por cima",
      "Cortar o sanduíche ao meio",
      "Colocar no prato",
    ],
  },
  {
    titulo: "Ligar o computador e abrir um joguinho",
    passos: [
      "Apertar o botão de ligar",
      "Esperar a tela carregar",
      "Digitar a senha (se tiver)",
      "Clicar no ícone do joguinho",
      "Esperar o jogo abrir",
    ],
  },
  {
    titulo: "Ir da cama até a escola",
    passos: [
      "Acordar e levantar da cama",
      "Tomar café da manhã",
      "Vestir o uniforme",
      "Colocar a mochila nas costas",
      "Sair de casa a caminho da escola",
    ],
  },
  {
    titulo: "Enviar uma mensagem de áudio",
    passos: [
      "Abrir o aplicativo de mensagens",
      "Escolher a conversa certa",
      "Apertar e segurar o botão do microfone",
      "Falar a mensagem",
      "Soltar o botão pra enviar",
    ],
  },
  {
    titulo: "Regar uma planta",
    passos: [
      "Pegar o regador",
      "Encher o regador com água",
      "Levar até a planta",
      "Molhar a terra devagar",
      "Guardar o regador no lugar",
    ],
  },
];

export function sortearTarefaDesplugada(indiceExcluir?: number): { tarefa: TarefaDesplugada; indice: number } {
  let indice = aleatorioInt(0, BANCO_TAREFAS_DESPLUGADAS.length - 1);
  if (BANCO_TAREFAS_DESPLUGADAS.length > 1) {
    while (indice === indiceExcluir) indice = aleatorioInt(0, BANCO_TAREFAS_DESPLUGADAS.length - 1);
  }
  return { tarefa: BANCO_TAREFAS_DESPLUGADAS[indice], indice };
}

export function embaralharPassos(tarefa: TarefaDesplugada): string[] {
  return embaralhar(tarefa.passos);
}
