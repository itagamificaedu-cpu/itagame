"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

// QR code pro aluno escanear e entrar direto na sala, sem digitar o código
// nem o endereço do site — usado nas telas "código da sala" do professor
// (Cabo de Guerra, Salas ao Vivo). Gerado no navegador (sem chamar API
// externa nenhuma), direto num <canvas>.
export function QrCodeEntrada({ url, tamanho = 168 }: { url: string; tamanho?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, url, {
      width: tamanho,
      margin: 1,
      color: { dark: "#1a3fd4", light: "#ffffff" },
    }).catch(() => {
      // se der erro (ex: url vazia), só deixa o canvas em branco — o código
      // numérico logo acima continua funcionando normalmente.
    });
  }, [url, tamanho]);

  return (
    <canvas
      ref={canvasRef}
      width={tamanho}
      height={tamanho}
      className="mx-auto rounded-lg"
      aria-label="QR code para entrar na sala"
    />
  );
}
