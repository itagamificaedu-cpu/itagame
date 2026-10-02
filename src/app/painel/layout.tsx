import { cookies } from "next/headers";
import { descriptografar } from "@/lib/sessao";
import ProtecaoColaborador from "@/components/ProtecaoColaborador";

// Só o login compartilhado dos professores (restrito) ganha a proteção contra
// print e cópia. Para a conta do dono e das escolas nada muda.
export default async function LayoutPainel({ children }: { children: React.ReactNode }) {
  const cookie = (await cookies()).get("itagame_sessao")?.value;
  const sessao = await descriptografar(cookie);

  return (
    <>
      {sessao?.restrito && <ProtecaoColaborador />}
      {children}
    </>
  );
}
