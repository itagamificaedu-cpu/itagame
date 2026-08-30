import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";

const CINCO_MINUTOS_MS = 5 * 60 * 1000;

const ROTULO_PAPEL: Record<string, string> = {
  ita_owner: "Dono",
  escola_admin: "Coordenador",
  professor: "Professor",
};

function formatarData(data: Date | null) {
  if (!data) return "—";
  return new Date(data).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export default async function PaginaUsuariosAdmin() {
  const sessao = await exigirAssinaturaAtiva();
  if (sessao.papel !== "ita_owner") {
    notFound();
  }

  const usuarios = await prisma.usuario.findMany({
    where: { papel: { in: ["professor", "escola_admin", "ita_owner"] } },
    orderBy: [{ ultimoAcessoEm: "desc" }, { criadoEm: "desc" }],
    select: {
      id: true,
      nome: true,
      email: true,
      papel: true,
      ultimoAcessoEm: true,
      criadoEm: true,
      assinaturaProfessor: { select: { plano: true, status: true, validade: true, cortesia: true } },
    },
  });

  const agora = Date.now();
  const totalOnline = usuarios.filter(
    (u) => u.ultimoAcessoEm && agora - new Date(u.ultimoAcessoEm).getTime() < CINCO_MINUTOS_MS
  ).length;

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/painel" className="text-sm font-semibold text-[#1a3fd4]">
          ← Voltar ao painel
        </Link>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Usuários</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Quem está logado agora e status de assinatura de cada um.
            </p>
          </div>
          <span className="whitespace-nowrap rounded-full bg-[#00c264]/10 px-3 py-1 text-xs font-bold text-[#00854a]">
            🟢 {totalOnline} online agora
          </span>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
                <th className="px-4 py-3 font-semibold">Usuário</th>
                <th className="px-4 py-3 font-semibold">Papel</th>
                <th className="px-4 py-3 font-semibold">Plano</th>
                <th className="px-4 py-3 font-semibold">Válido até</th>
                <th className="px-4 py-3 font-semibold">Último acesso</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => {
                const online = u.ultimoAcessoEm && agora - new Date(u.ultimoAcessoEm).getTime() < CINCO_MINUTOS_MS;
                const a = u.assinaturaProfessor;
                const proAtivo = a?.plano === "pro" && a.status === "ativa" && a.validade && new Date(a.validade) > new Date();

                return (
                  <tr key={u.id} className="border-b border-neutral-100 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${online ? "bg-[#00c264]" : "bg-neutral-300"}`}
                          title={online ? "online agora" : "offline"}
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-neutral-900">{u.nome}</p>
                          <p className="truncate text-xs text-neutral-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-700">{ROTULO_PAPEL[u.papel] ?? u.papel}</td>
                    <td className="px-4 py-3">
                      {!a ? (
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
                          gratuito
                        </span>
                      ) : proAtivo ? (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                            a.cortesia ? "bg-amber-100 text-amber-700" : "bg-[#1a3fd4]/10 text-[#1a3fd4]"
                          }`}
                        >
                          {a.cortesia ? "🎁 cortesia" : "👑 Pro"}
                        </span>
                      ) : (
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
                          expirado
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-700">{formatarData(a?.validade ?? null)}</td>
                    <td className="px-4 py-3 text-neutral-700">{formatarData(u.ultimoAcessoEm)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-neutral-400">
          "Online agora" considera quem acessou alguma página do painel nos últimos 5 minutos.
          Cada conta só mantém uma sessão ativa por vez — logar em outro aparelho derruba a anterior.
        </p>
      </div>
    </main>
  );
}
