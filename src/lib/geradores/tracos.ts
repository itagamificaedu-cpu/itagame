export type TipoTraco = "reta" | "ondulada" | "zigzag" | "espiral";

export const ROTULO_TRACO: Record<TipoTraco, string> = {
  reta: "Linha reta",
  ondulada: "Linha ondulada",
  zigzag: "Zigue-zague",
  espiral: "Espiral",
};

export function pathLinha(tipo: TipoTraco, largura: number, y: number): string {
  if (tipo === "reta") return `M 10 ${y} L ${largura - 10} ${y}`;

  if (tipo === "ondulada") {
    const passos = 60;
    const amplitude = 16;
    const ciclos = 4;
    let d = `M 10 ${y}`;
    for (let i = 1; i <= passos; i++) {
      const x = 10 + ((largura - 20) * i) / passos;
      const yy = y + amplitude * Math.sin((i / passos) * ciclos * 2 * Math.PI);
      d += ` L ${x.toFixed(1)} ${yy.toFixed(1)}`;
    }
    return d;
  }

  if (tipo === "zigzag") {
    const picos = 8;
    const amplitude = 16;
    let d = `M 10 ${y}`;
    for (let i = 1; i <= picos; i++) {
      const x = 10 + ((largura - 20) * i) / picos;
      const yy = i % 2 === 0 ? y + amplitude : y - amplitude;
      d += ` L ${x.toFixed(1)} ${yy.toFixed(1)}`;
    }
    return d;
  }

  return "";
}

export function pathEspiral(centroX: number, centroY: number, raioMax = 40, voltas = 3): string {
  const passos = 100;
  let d = "";
  for (let i = 0; i <= passos; i++) {
    const t = i / passos;
    const angulo = t * voltas * 2 * Math.PI;
    const raio = t * raioMax;
    const x = centroX + raio * Math.cos(angulo);
    const y = centroY + raio * Math.sin(angulo);
    d += `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d;
}
