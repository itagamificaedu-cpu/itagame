export type TipoForma = "circulo" | "quadrado" | "triangulo" | "estrela" | "coracao" | "retangulo";

export const ROTULO_FORMA: Record<TipoForma, string> = {
  circulo: "Círculo",
  quadrado: "Quadrado",
  triangulo: "Triângulo",
  estrela: "Estrela",
  coracao: "Coração",
  retangulo: "Retângulo",
};

export function pontosForma(tipo: TipoForma, tamanho: number): { path?: string; pontos?: string } {
  const meio = tamanho / 2;
  switch (tipo) {
    case "quadrado":
      return { pontos: `${tamanho * 0.1},${tamanho * 0.1} ${tamanho * 0.9},${tamanho * 0.1} ${tamanho * 0.9},${tamanho * 0.9} ${tamanho * 0.1},${tamanho * 0.9}` };
    case "retangulo":
      return { pontos: `${tamanho * 0.05},${tamanho * 0.25} ${tamanho * 0.95},${tamanho * 0.25} ${tamanho * 0.95},${tamanho * 0.75} ${tamanho * 0.05},${tamanho * 0.75}` };
    case "triangulo":
      return { pontos: `${meio},${tamanho * 0.1} ${tamanho * 0.9},${tamanho * 0.9} ${tamanho * 0.1},${tamanho * 0.9}` };
    case "estrela": {
      const pontosEstrela: string[] = [];
      const raioExterno = tamanho * 0.45;
      const raioInterno = tamanho * 0.2;
      for (let i = 0; i < 10; i++) {
        const raio = i % 2 === 0 ? raioExterno : raioInterno;
        const angulo = (Math.PI / 5) * i - Math.PI / 2;
        pontosEstrela.push(`${meio + raio * Math.cos(angulo)},${meio + raio * Math.sin(angulo)}`);
      }
      return { pontos: pontosEstrela.join(" ") };
    }
    case "coracao":
      return {
        path: `M ${meio} ${tamanho * 0.85} C ${tamanho * 0.05} ${tamanho * 0.5}, ${tamanho * 0.1} ${tamanho * 0.1}, ${meio} ${tamanho * 0.3} C ${tamanho * 0.9} ${tamanho * 0.1}, ${tamanho * 0.95} ${tamanho * 0.5}, ${meio} ${tamanho * 0.85} Z`,
      };
    case "circulo":
    default:
      return {};
  }
}
