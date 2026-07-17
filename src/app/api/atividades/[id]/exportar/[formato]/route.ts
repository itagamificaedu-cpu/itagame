import { NextRequest, NextResponse } from "next/server";
import { verificarSessao } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { extrairDadosAtividade, nomeArquivo } from "@/lib/exportacao/dados";
import { gerarDocx } from "@/lib/exportacao/docx";
import { gerarPptx } from "@/lib/exportacao/pptx";
import { gerarPdf } from "@/lib/exportacao/pdf";

export const dynamic = "force-dynamic";

const CONTENT_TYPE: Record<string, string> = {
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  pdf: "application/pdf",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; formato: string }> }
) {
  const { id, formato } = await params;

  if (!CONTENT_TYPE[formato]) {
    return NextResponse.json({ erro: "Formato inválido." }, { status: 400 });
  }

  const sessao = await verificarSessao();

  const atividade = await prisma.atividade.findUnique({ where: { id } });
  if (!atividade || atividade.professorId !== sessao.userId) {
    return NextResponse.json({ erro: "Atividade não encontrada." }, { status: 404 });
  }

  const dados = extrairDadosAtividade(atividade);

  let arquivo: Buffer | Uint8Array;
  if (formato === "docx") {
    arquivo = await gerarDocx(dados);
  } else if (formato === "pptx") {
    arquivo = await gerarPptx(dados);
  } else {
    arquivo = await gerarPdf(dados);
  }

  return new NextResponse(Buffer.from(arquivo), {
    headers: {
      "Content-Type": CONTENT_TYPE[formato],
      "Content-Disposition": `attachment; filename="${nomeArquivo(dados)}.${formato}"`,
    },
  });
}
