import Link from "next/link";
import { exigirAcessoBnccComputacao } from "@/lib/acessoDados";
import { EIXOS_BNCC_COMPUTACAO } from "@/lib/bnccComputacao";
import { ETAPAS_BNCC, MODELOS_BNCC_COMPUTACAO } from "@/lib/modelosBnccComputacao";
import { BotaoImprimirMapa } from "./BotaoImprimirMapa";

// "Mapa BNCC Computação" — documento de planejamento pra mostrar pra
// coordenação que o ano está coberto: cada eixo oficial (Parecer CNE/CEB
// nº 2/2022) cruzado com as 3 etapas da Educação Básica, mostrando qual
// trilha-modelo cobre cada célula e em que ordem sugerida aplicar (sequência
// didática). Mesmo padrão de impressão dos Geradores (window.print()), sem
// precisar de um pipeline de PDF novo.
export default async function PaginaMapaBncc() {
  await exigirAcessoBnccComputacao();

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4 print:hidden">
          <Link href="/painel/bncc-computacao" className="text-sm font-semibold text-[#1a3fd4]">
            ← BNCC Computação
          </Link>
          <BotaoImprimirMapa />
        </div>

        <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm print:rounded-none print:border-0 print:shadow-none">
          <div className="border-b-4 border-[#1a3fd4] pb-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[#1a3fd4]">
              Planejamento anual · Parecer CNE/CEB nº 2/2022
            </p>
            <h1 className="mt-1 text-2xl font-extrabold text-neutral-900">Mapa BNCC Computação</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Cobertura dos 3 eixos oficiais em todas as etapas da Educação Básica — Educação Infantil, Anos
              Iniciais e Anos Finais do Ensino Fundamental.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-6 text-sm text-neutral-600">
            <p>Escola: ________________________________</p>
            <p>Professor(a): ________________________</p>
            <p>Ano letivo: __________</p>
          </div>

          <div className="mt-8 space-y-8">
            {EIXOS_BNCC_COMPUTACAO.map((eixo) => (
              <section key={eixo.chave} className="break-inside-avoid">
                <div className="flex items-center gap-3 border-b-2 pb-2" style={{ borderColor: eixo.cor }}>
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg"
                    style={{ backgroundColor: `${eixo.cor}15` }}
                  >
                    {eixo.icone}
                  </span>
                  <div>
                    <h2 className="font-extrabold text-neutral-900">{eixo.nome}</h2>
                    <p className="text-xs text-neutral-500">
                      Subconceitos: {eixo.subconceitos.join(" · ")}
                    </p>
                  </div>
                </div>

                <div className="mt-3 overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr>
                        <th className="border border-neutral-200 bg-neutral-50 px-3 py-2 font-bold text-neutral-600">
                          Etapa
                        </th>
                        <th className="border border-neutral-200 bg-neutral-50 px-3 py-2 font-bold text-neutral-600">
                          Trilha-modelo
                        </th>
                        <th className="border border-neutral-200 bg-neutral-50 px-3 py-2 font-bold text-neutral-600">
                          Desafios
                        </th>
                        <th className="border border-neutral-200 bg-neutral-50 px-3 py-2 font-bold text-neutral-600">
                          Aplicada em
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ETAPAS_BNCC.map((etapa) => {
                        const modelo = MODELOS_BNCC_COMPUTACAO.find(
                          (m) => m.eixo === eixo.chave && m.etapa === etapa.chave
                        );
                        return (
                          <tr key={etapa.chave}>
                            <td className="border border-neutral-200 px-3 py-2 font-semibold text-neutral-700">
                              {etapa.nome}
                              <span className="block text-xs font-normal text-neutral-400">{etapa.faixa}</span>
                            </td>
                            <td className="border border-neutral-200 px-3 py-2 text-neutral-700">
                              {modelo ? modelo.nome : "—"}
                            </td>
                            <td className="border border-neutral-200 px-3 py-2 text-neutral-500">
                              {modelo ? `${modelo.missoes.length} desafios` : "—"}
                            </td>
                            <td className="border border-neutral-200 px-3 py-2 text-neutral-400">
                              ____ / ____ / ______
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-neutral-200 bg-neutral-50 p-5 print:border print:bg-white">
            <p className="text-sm font-extrabold text-neutral-800">Sequência didática sugerida</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-neutral-600">
              <li>
                Aplique 1 trilha-modelo por eixo na etapa da turma (3 trilhas no total), na ordem: Pensamento
                Computacional → Mundo Digital → Cultura Digital.
              </li>
              <li>
                Turmas que já concluíram os 3 modelos podem repetir gerando trilhas novas com IA em{" "}
                <span className="font-semibold">Trilhas → Gerar com IA</span>, mantendo o mesmo eixo travado.
              </li>
              <li>
                Use o <span className="font-semibold">Simulado BNCC Computação</span> (aba Geradores) como avaliação
                de fechamento e a <span className="font-semibold">BNCC Computação Desplugada</span> para reforço sem
                tela, especialmente na Educação Infantil e Anos Iniciais.
              </li>
              <li>O aluno conquista o emblema “Mestre da Computação” ao completar 1 trilha de cada eixo.</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
