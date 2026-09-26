import type { ModuloFormacaoIA } from "@/lib/formacaoIA";

export function ModulosAccordion({ modulos }: { modulos: ModuloFormacaoIA[] }) {
  return (
    <div className="space-y-3">
      {modulos.map((modulo) => (
        <details
          key={modulo.numero}
          className="group rounded-xl border border-neutral-200 bg-white p-4 open:shadow-sm"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#1a3fd4]">
                Módulo {modulo.numero} · {modulo.formato}
              </p>
              <p className="mt-1 text-sm font-semibold text-neutral-900">{modulo.titulo}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <p className="text-xs text-neutral-400">{modulo.cargaHoraria}h</p>
              <span className="text-neutral-400 transition group-open:rotate-180">▾</span>
            </div>
          </summary>

          <div className="mt-4 space-y-4 border-t border-neutral-100 pt-4">
            {modulo.fundamentacaoTeorica && (
              <p className="text-justify text-xs italic text-neutral-500">📚 {modulo.fundamentacaoTeorica}</p>
            )}

            {modulo.sessoes.map((sessao) => (
              <div key={sessao.codigo} className="rounded-lg bg-neutral-50 p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-bold text-neutral-900">
                    {sessao.codigo} · {sessao.titulo}
                  </p>
                  <p className="shrink-0 text-xs text-neutral-400">{sessao.cargaHoraria}h</p>
                </div>

                {sessao.objetivo && (
                  <p className="mt-2 text-justify text-xs text-neutral-600">
                    <span className="font-bold text-neutral-700">Objetivo:</span> {sessao.objetivo}
                  </p>
                )}

                {sessao.conteudo && sessao.conteudo.length > 0 && (
                  <ul className="mt-2 list-disc space-y-0.5 pl-4 text-xs text-neutral-600">
                    {sessao.conteudo.map((item) => (
                      <li key={item} className="text-justify">{item}</li>
                    ))}
                  </ul>
                )}

                {sessao.metodologia && (
                  <p className="mt-2 text-justify text-xs text-neutral-600">
                    <span className="font-bold text-neutral-700">Metodologia:</span> {sessao.metodologia}
                  </p>
                )}

                {sessao.exemploPratico && (
                  <p className="mt-1 text-justify text-xs text-neutral-600">
                    <span className="font-bold text-neutral-700">Exemplo prático:</span> {sessao.exemploPratico}
                  </p>
                )}

                {sessao.recursos && sessao.recursos.length > 0 && (
                  <p className="mt-1 text-justify text-xs text-neutral-600">
                    <span className="font-bold text-neutral-700">Recursos:</span> {sessao.recursos.join(", ")}
                  </p>
                )}

                {sessao.avaliacaoProduto && (
                  <p className="mt-1 text-justify text-xs text-neutral-600">
                    <span className="font-bold text-neutral-700">Produto avaliativo:</span>{" "}
                    {sessao.avaliacaoProduto}
                  </p>
                )}

                {sessao.referencias && sessao.referencias.length > 0 && (
                  <p className="mt-1 text-justify text-xs text-neutral-500">
                    <span className="font-bold text-neutral-600">Referências:</span> {sessao.referencias.join("; ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
