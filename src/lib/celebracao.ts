"use client";

// Sons e confete usados pra animar desafios/missões, badges e competições.
// Os arquivos ficam em /public/materiais/audio (nomes sem espaço, cópias
// dos originais, pra não precisar de encodeURI no <audio>/new Audio()).

export type NomeSom = "fanfare" | "confirm" | "fruit-collect" | "select" | "lose" | "erro";

const ARQUIVO_SOM: Record<NomeSom, string> = {
  fanfare: "/materiais/audio/fanfare.ogg",
  confirm: "/materiais/audio/confirm.wav",
  "fruit-collect": "/materiais/audio/fruit-collect.wav",
  select: "/materiais/audio/select.wav",
  lose: "/materiais/audio/lose.wav",
  // Som curto de resposta errada — mais suave que "lose" (que é pra quando
  // perde a partida/missão toda, não só uma pergunta).
  erro: "/materiais/audio/erro.wav",
};

// Cache simples pra não recriar o objeto Audio a cada clique.
const cacheAudio = new Map<NomeSom, HTMLAudioElement>();

/** Toca um efeito sonoro curto. Silencioso se o navegador bloquear autoplay sem interação. */
export function tocarSom(nome: NomeSom, volume = 0.6) {
  if (typeof window === "undefined") return;
  let audio = cacheAudio.get(nome);
  if (!audio) {
    audio = new Audio(ARQUIVO_SOM[nome]);
    cacheAudio.set(nome, audio);
  }
  audio.volume = volume;
  audio.currentTime = 0;
  audio.play().catch(() => {
    // Autoplay bloqueado (sem interação do usuário ainda) — ignora.
  });
}

/** Explosão de confete no centro da tela, com as cores da marca ITA. */
export async function dispararConfete(intensidade: "normal" | "grande" = "normal") {
  if (typeof window === "undefined") return;
  const confetti = (await import("canvas-confetti")).default;
  const cores = ["#1a3fd4", "#00c264", "#FFD600", "#6a3fe0"];

  if (intensidade === "grande") {
    // Comemoração maior (badge novo, pódio de competição): dois jorros
    // cruzados dos cantos, mais partículas e mais tempo no ar.
    const duracao = 1500;
    const fim = Date.now() + duracao;
    (function disparo() {
      confetti({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors: cores });
      confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors: cores });
      if (Date.now() < fim) requestAnimationFrame(disparo);
    })();
    confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 }, colors: cores, startVelocity: 45 });
  } else {
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors: cores });
  }
}

/** Atalho: toca o som e dispara o confete junto (XP de missão concluída). */
export function celebrarMissaoConcluida() {
  tocarSom("fruit-collect");
  dispararConfete("normal");
}

/** Atalho: comemoração maior pra badge desbloqueado ou vitória em competição. */
export function celebrarConquista() {
  tocarSom("fanfare");
  dispararConfete("grande");
}
