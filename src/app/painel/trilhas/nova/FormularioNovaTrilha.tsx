"use client";

import { useActionState } from "react";
import { criarTrilha } from "@/app/actions/trilhas";

export default function FormularioNovaTrilha({ turmas }: { turmas: { id: string; nome: string }[] }) {
  const [estado, action, pendente] = useActionState(criarTrilha, undefined);

  return (
    <form
      action={action}
      className="mt-8 space-y-5 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm"
    >
      <div>
        <label htmlFor="nome" className="text-sm font-medium text-neutral-700">
          Nome da trilha
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          placeholder="Ex: Introdução à Robótica"
          required
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
        />
        {estado?.erros?.nome && <p className="mt-1 text-xs text-red-600">{estado.erros.nome[0]}</p>}
      </div>

      <div>
        <label htmlFor="descricao" className="text-sm font-medium text-neutral-700">
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          rows={3}
          placeholder="O que o aluno vai aprender nessa trilha"
          required
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
        />
        {estado?.erros?.descricao && (
          <p className="mt-1 text-xs text-red-600">{estado.erros.descricao[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="turmaId" className="text-sm font-medium text-neutral-700">
          Turma
        </label>
        <select
          id="turmaId"
          name="turmaId"
          required
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
        >
          <option value="">Escolha a turma</option>
          {turmas.map((turma) => (
            <option key={turma.id} value={turma.id}>
              {turma.nome}
            </option>
          ))}
        </select>
        {estado?.erros?.turmaId && (
          <p className="mt-1 text-xs text-red-600">{estado.erros.turmaId[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="tipoEstrutura" className="text-sm font-medium text-neutral-700">
          Estrutura
        </label>
        <select
          id="tipoEstrutura"
          name="tipoEstrutura"
          required
          defaultValue="linear"
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
        >
          <option value="linear">Linear (uma missão libera a próxima)</option>
          <option value="livre">Livre (todas as missões abertas de uma vez)</option>
        </select>
        {estado?.erros?.tipoEstrutura && (
          <p className="mt-1 text-xs text-red-600">{estado.erros.tipoEstrutura[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="nivel" className="text-sm font-medium text-neutral-700">
          Nível
        </label>
        <select
          id="nivel"
          name="nivel"
          required
          defaultValue="iniciante"
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
        >
          <option value="iniciante">Iniciante</option>
          <option value="intermediario">Intermediário</option>
          <option value="avancado">Avançado</option>
        </select>
        {estado?.erros?.nivel && <p className="mt-1 text-xs text-red-600">{estado.erros.nivel[0]}</p>}
      </div>

      {estado?.mensagem && <p className="text-sm text-red-600">{estado.mensagem}</p>}

      <button
        type="submit"
        disabled={pendente}
        className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {pendente ? "Criando..." : "Criar trilha"}
      </button>
    </form>
  );
}
