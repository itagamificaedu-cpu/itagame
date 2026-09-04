import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import type { StatusLead } from "@prisma/client";
import FormularioNovoLead from "./FormularioNovoLead";
import LeadCardCliente from "./LeadCardCliente";

const COLUNAS: { status: StatusLead; titulo: string; cor: string }[] = [
  { status: "novo", titulo: "Novo", cor: "#6b7280" },
  { status: "contatado", titulo: "Contatado", cor: "#1a3fd4" },
  { status: "demonstracao", titulo: "Demonstração", cor: "#7c3aed" },
  { status: "negociacao", titulo: "Negociação", cor: "#f59e0b" },
  { status: "fechado", titulo: "Fechado 🎉", cor: "#00c264" },
  { status: "perdido", titulo: "Perdido", cor: "#e11d48" },
];

// Funil de vendas manual — só o dono da plataforma vê. Não afeta nada da
// assinatura de verdade (Mercado Pago), é só o CRM de pré-venda pra
// acompanhar escola/professor em prospecção até fechar.
export default async function PaginaLeads() {
  const sessao = await exigirAssinaturaAtiva();
  if (sessao.papel !== "ita_owner") {
    notFound();
  }

  const leads = await prisma.leadVenda.findMany({
    where: { criadoPorId: sessao.userId },
    orderBy: [{ proximoContatoEm: "asc" }, { criadoEm: "desc" }],
  });

  const hoje = new Date(new Date().toDateString());
  const atrasados = leads.filter((l) => l.proximoContatoEm && new Date(l.proximoContatoEm) < hoje && l.status !== "fechado" && l.status !== "perdido");

  const fechados = leads.filter((l) => l.status === "fechado").length;
  const emAndamento = leads.filter((l) => l.status !== "fechado" && l.status !== "perdido").length;
  const taxaConversao = leads.length === 0 ? 0 : Math.round((fechados / leads.length) * 100);

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/painel" className="text-sm font-semibold text-[#1a3fd4]">
          ← Voltar ao painel
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">💼 Funil de Vendas</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Acompanhe cada escola/professor em prospecção até fechar a assinatura Pro.
            </p>
          </div>
          <div className="flex gap-3 text-center">
            <div className="rounded-xl border border-neutral-200 bg-white px-4 py-2">
              <p className="text-lg font-extrabold text-neutral-900">{emAndamento}</p>
              <p className="text-xs text-neutral-500">em andamento</p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white px-4 py-2">
              <p className="text-lg font-extrabold text-[#00854a]">{fechados}</p>
              <p className="text-xs text-neutral-500">fechados</p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white px-4 py-2">
              <p className="text-lg font-extrabold text-neutral-900">{taxaConversao}%</p>
              <p className="text-xs text-neutral-500">conversão</p>
            </div>
          </div>
        </div>

        {atrasados.length > 0 && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-bold text-red-700">
              ⏰ {atrasados.length} {atrasados.length === 1 ? "contato atrasado" : "contatos atrasados"}: {atrasados.map((l) => l.nome).join(", ")}
            </p>
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm font-bold text-neutral-900">+ Novo lead</p>
          <FormularioNovoLead />
        </div>

        {leads.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
            <p className="text-3xl">💼</p>
            <p className="mt-2 font-semibold text-neutral-700">Nenhum lead cadastrado ainda</p>
            <p className="mt-1 text-sm text-neutral-500">Adicione a primeira escola/professor que você está tentando converter.</p>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto pb-4">
            <div className="flex min-w-max gap-4">
              {COLUNAS.map((coluna) => {
                const leadsColuna = leads.filter((l) => l.status === coluna.status);
                return (
                  <div key={coluna.status} className="w-72 shrink-0">
                    <div className="mb-2 flex items-center gap-2 px-1">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: coluna.cor }} />
                      <p className="text-sm font-bold text-neutral-700">{coluna.titulo}</p>
                      <span className="text-xs text-neutral-400">({leadsColuna.length})</span>
                    </div>
                    <div className="space-y-3">
                      {leadsColuna.map((lead) => (
                        <LeadCardCliente
                          key={lead.id}
                          lead={{
                            ...lead,
                            proximoContatoEm: lead.proximoContatoEm?.toISOString() ?? null,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
