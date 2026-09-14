import Link from "next/link";
import { exigirAcessoBnccComputacao } from "@/lib/acessoDados";
import { EIXOS_BNCC_COMPUTACAO } from "@/lib/bnccComputacao";
import {
  ATIVIDADES_GUIADAS_CURSO,
  BLOCO_PROJETO_INTEGRADOR,
  CHECKLIST_MATERIAIS_IMPRESSOS,
  CHECKLIST_MATERIAIS_RECICLAVEIS,
  COMPOSICAO_CARGA_HORARIA_AULA,
  FUNDAMENTACAO_MODULOS,
  HORAS_POR_AULA,
  MATRIZ_INTERDISCIPLINAR,
  NUMERO_MODULO,
  REFERENCIAS_CURSO,
  RUBRICAS_AVALIACAO,
  TOTAL_HORAS_CURSO,
  TOTAL_MODULOS_CURSO,
  TOTAL_SEMANAS_CURSO,
  semanasDoBloco,
} from "@/lib/cursoBnccComputacao";
import { BotaoImprimirCurso } from "@/components/curso-bncc-computacao/BotaoImprimirCurso";

// Apostila completa do Curso de Formação BNCC Computação — versão para
// impressão/PDF, reorganizada em 4 módulos (os 3 eixos oficiais + o "Módulo
// 4: Programação e Cultura Maker" do material de origem, que virou aqui o
// módulo de fechamento "Projeto Integrador", não um eixo oficial). Mesmo
// padrão de impressão já usado no Mapa BNCC (window.print(), sem pipeline
// de PDF).
export default async function PaginaApostilaCurso() {
  await exigirAcessoBnccComputacao();

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4 print:hidden">
          <Link href="/painel/bncc-computacao/curso" className="text-sm font-semibold text-[#1a3fd4]">
            ← Curso de Formação
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="/materiais/bncc-computacao/apostila-ilustrada-complementar.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#1a3fd4]"
            >
              🎨 Apostila ilustrada complementar (PDF)
            </a>
            <BotaoImprimirCurso />
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm print:rounded-none print:border-0 print:shadow-none">
          {/* Capa */}
          <div className="border-b-4 border-[#1a3fd4] pb-6">
            <p className="text-xs font-bold uppercase tracking-wide text-[#1a3fd4]">
              Formação Continuada de Educadores · Parecer CNE/CEB nº 2/2022
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-neutral-900">
              Apostila Completa — BNCC Computação na Prática
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              Estrutura Curricular, Atividades Práticas Desplugadas e Avaliação por Rubricas — organizada em{" "}
              {TOTAL_MODULOS_CURSO} módulos, cobrindo os 3 eixos oficiais da BNCC Computação (Educação Infantil ao
              9º ano).
            </p>
            <p className="mt-3 text-xs text-neutral-400">
              Organização: ItaGamificaEdu & Equipe Pedagógica de Computação · Carga horária: {TOTAL_HORAS_CURSO} horas
            </p>
          </div>

          {/* Introdução */}
          <section className="mt-8 break-inside-avoid">
            <h2 className="text-lg font-extrabold text-neutral-900">1. Introdução e Fundamentação</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Com a homologação do Complemento à Base Nacional Comum Curricular (BNCC Computação) pelo MEC e
              pelo CNE, a Computação deixa de ser uma atividade extracurricular opcional para se tornar um
              direito de aprendizagem garantido a todos os estudantes da Educação Básica. Esta apostila prioriza
              o uso de metodologias desplugadas — atividades sem necessidade de computadores ou internet —
              permitindo que qualquer escola aplique o currículo com alta qualidade, independentemente de sua
              infraestrutura tecnológica.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              O curso está organizado em {TOTAL_MODULOS_CURSO} módulos de 10 aulas cada, num total de{" "}
              {TOTAL_SEMANAS_CURSO} aulas: os Módulos 1 a 3 correspondem aos 3 eixos oficiais da BNCC Computação
              (Pensamento Computacional, Mundo Digital e Cultura Digital), e o Módulo 4 é um Projeto Integrador de
              fechamento, no qual o professor aplica os três eixos juntos na criação de um artefato digital. A
              carga horária de {TOTAL_HORAS_CURSO} horas é composta, em cada aula, pelo estudo do conteúdo, pela
              aplicação prática da atividade com a própria turma e pelo registro reflexivo no Diário de Bordo —
              ver o detalhamento na seção 2.
            </p>
          </section>

          {/* Composição da carga horária */}
          <section className="mt-8 break-inside-avoid">
            <h2 className="text-lg font-extrabold text-neutral-900">2. Composição da Carga Horária ({TOTAL_HORAS_CURSO}h)</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Cada uma das {TOTAL_SEMANAS_CURSO} aulas do curso equivale a {HORAS_POR_AULA} horas de formação
              continuada, distribuídas nas três etapas abaixo. O Diário de Bordo (produzido pelo professor a cada
              aula) é a evidência de aplicação que sustenta essa carga horária.
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th className="border border-neutral-200 bg-neutral-50 px-3 py-2 font-bold text-neutral-600">Etapa</th>
                    <th className="border border-neutral-200 bg-neutral-50 px-3 py-2 font-bold text-neutral-600">Duração</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPOSICAO_CARGA_HORARIA_AULA.map((item) => (
                    <tr key={item.etapa}>
                      <td className="border border-neutral-200 px-3 py-2 text-neutral-600">{item.etapa}</td>
                      <td className="border border-neutral-200 px-3 py-2 font-semibold text-neutral-700">{item.minutos} min</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="border border-neutral-200 bg-neutral-50 px-3 py-2 font-bold text-neutral-700">
                      Total por aula × {TOTAL_SEMANAS_CURSO} aulas
                    </td>
                    <td className="border border-neutral-200 bg-neutral-50 px-3 py-2 font-bold text-neutral-700">
                      {HORAS_POR_AULA}h × {TOTAL_SEMANAS_CURSO} = {TOTAL_HORAS_CURSO}h
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Fundamentação teórica de cada módulo */}
          <section className="mt-8">
            <h2 className="text-lg font-extrabold text-neutral-900">3. Fundamentação Teórica dos Módulos</h2>
            <div className="mt-3 space-y-6">
              {([BLOCO_PROJETO_INTEGRADOR.chave, ...EIXOS_BNCC_COMPUTACAO.map((e) => e.chave)] as const)
                .slice()
                .sort((a, b) => NUMERO_MODULO[a] - NUMERO_MODULO[b])
                .map((chave) => {
                  const fundamentacao = FUNDAMENTACAO_MODULOS[chave];
                  return (
                    <div key={chave} className="break-inside-avoid">
                      <h3 className="text-sm font-extrabold text-neutral-800">{fundamentacao.titulo}</h3>
                      <div className="mt-2 space-y-2">
                        {fundamentacao.paragrafos.map((paragrafo, indice) => (
                          <p key={indice} className="text-sm leading-relaxed text-neutral-600">
                            {paragrafo}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>

          {/* Eixos */}
          <section className="mt-8 break-inside-avoid">
            <h2 className="text-lg font-extrabold text-neutral-900">4. Os 3 Eixos Estruturantes</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th className="border border-neutral-200 bg-neutral-50 px-3 py-2 font-bold text-neutral-600">Eixo</th>
                    <th className="border border-neutral-200 bg-neutral-50 px-3 py-2 font-bold text-neutral-600">Foco Pedagógico</th>
                    <th className="border border-neutral-200 bg-neutral-50 px-3 py-2 font-bold text-neutral-600">Subconceitos</th>
                  </tr>
                </thead>
                <tbody>
                  {EIXOS_BNCC_COMPUTACAO.map((eixo) => (
                    <tr key={eixo.chave}>
                      <td className="border border-neutral-200 px-3 py-2 font-semibold text-neutral-700">
                        {eixo.icone} {eixo.nome}
                      </td>
                      <td className="border border-neutral-200 px-3 py-2 text-neutral-600">{eixo.resumo}</td>
                      <td className="border border-neutral-200 px-3 py-2 text-neutral-500">
                        {eixo.subconceitos.join(" · ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Atividades guiadas por eixo (+ Projeto Integrador de fechamento) */}
          <section className="mt-8">
            <h2 className="text-lg font-extrabold text-neutral-900">5. Atividades Práticas Guiadas</h2>
            <div className="mt-3 space-y-6">
              {[...EIXOS_BNCC_COMPUTACAO, BLOCO_PROJETO_INTEGRADOR].map((eixo) => (
                <div key={eixo.chave} className="break-inside-avoid">
                  <h3 className="border-b-2 pb-1 text-sm font-extrabold text-neutral-800" style={{ borderColor: eixo.cor }}>
                    Módulo {NUMERO_MODULO[eixo.chave]} — {eixo.icone} {eixo.nome}
                  </h3>
                  <div className="mt-2 space-y-4">
                    {ATIVIDADES_GUIADAS_CURSO.filter((a) => a.eixo === eixo.chave).map((atividade) => (
                      <div key={atividade.nome} className="rounded-xl border border-neutral-200 p-4">
                        <p className="text-sm font-bold text-neutral-900">{atividade.nome}</p>
                        <p className="mt-1 text-xs text-neutral-500">
                          Faixa etária: {atividade.faixaEtaria} · Recursos: {atividade.recursos}
                        </p>
                        <p className="mt-2 text-sm text-neutral-600">
                          <span className="font-semibold">Objetivo:</span> {atividade.objetivo}
                        </p>
                        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-neutral-600">
                          {atividade.passoAPasso.map((passo, indice) => (
                            <li key={indice}>{passo}</li>
                          ))}
                        </ol>
                        {atividade.habilidadeBncc && (
                          <p className="mt-2 text-xs font-semibold text-neutral-400">{atividade.habilidadeBncc}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Matriz interdisciplinar */}
          <section className="mt-8 break-inside-avoid">
            <h2 className="text-lg font-extrabold text-neutral-900">6. Matriz de Alinhamento Interdisciplinar</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th className="border border-neutral-200 bg-neutral-50 px-3 py-2 font-bold text-neutral-600">Componente</th>
                    <th className="border border-neutral-200 bg-neutral-50 px-3 py-2 font-bold text-neutral-600">Conexão com a BNCC Computação</th>
                    <th className="border border-neutral-200 bg-neutral-50 px-3 py-2 font-bold text-neutral-600">Exemplo de Prática</th>
                  </tr>
                </thead>
                <tbody>
                  {MATRIZ_INTERDISCIPLINAR.map((linha) => (
                    <tr key={linha.componente}>
                      <td className="border border-neutral-200 px-3 py-2 font-semibold text-neutral-700">{linha.componente}</td>
                      <td className="border border-neutral-200 px-3 py-2 text-neutral-600">{linha.conexao}</td>
                      <td className="border border-neutral-200 px-3 py-2 text-neutral-500">{linha.exemplo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Rubricas */}
          <section className="mt-8 break-inside-avoid">
            <h2 className="text-lg font-extrabold text-neutral-900">7. Rubricas de Avaliação Formativa</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th className="border border-neutral-200 bg-neutral-50 px-3 py-2 font-bold text-neutral-600">Eixo / Critério</th>
                    <th className="border border-neutral-200 bg-neutral-50 px-3 py-2 font-bold text-neutral-600">Em Desenvolvimento</th>
                    <th className="border border-neutral-200 bg-neutral-50 px-3 py-2 font-bold text-neutral-600">Proficiente</th>
                    <th className="border border-neutral-200 bg-neutral-50 px-3 py-2 font-bold text-neutral-600">Avançado</th>
                  </tr>
                </thead>
                <tbody>
                  {RUBRICAS_AVALIACAO.map((rubrica) => {
                    const eixo = EIXOS_BNCC_COMPUTACAO.find((e) => e.chave === rubrica.eixo);
                    return (
                      <tr key={rubrica.eixo}>
                        <td className="border border-neutral-200 px-3 py-2 font-semibold text-neutral-700">
                          {eixo?.nome}: {rubrica.criterio}
                        </td>
                        <td className="border border-neutral-200 px-3 py-2 text-neutral-500">{rubrica.emDesenvolvimento}</td>
                        <td className="border border-neutral-200 px-3 py-2 text-neutral-500">{rubrica.proficiente}</td>
                        <td className="border border-neutral-200 px-3 py-2 text-neutral-500">{rubrica.avancado}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Grade de aulas por módulo */}
          <section className="mt-8">
            <h2 className="text-lg font-extrabold text-neutral-900">
              8. Plano de Ensino — Grade de Aulas por Módulo ({TOTAL_SEMANAS_CURSO} aulas · {TOTAL_HORAS_CURSO}h)
            </h2>
            <div className="mt-3 space-y-6">
              {[...EIXOS_BNCC_COMPUTACAO.map((e) => ({ chave: e.chave, nome: e.nome, icone: e.icone, cor: e.cor })), BLOCO_PROJETO_INTEGRADOR].map(
                (bloco) => (
                  <div key={bloco.chave} className="break-inside-avoid">
                    <h3 className="border-b-2 pb-1 text-sm font-extrabold text-neutral-800" style={{ borderColor: bloco.cor }}>
                      Módulo {NUMERO_MODULO[bloco.chave]} — {bloco.icone} {bloco.nome}
                    </h3>
                    <div className="mt-2 overflow-x-auto">
                      <table className="w-full border-collapse text-left text-sm">
                        <thead>
                          <tr>
                            <th className="border border-neutral-200 bg-neutral-50 px-2 py-1.5 font-bold text-neutral-600">Aula</th>
                            <th className="border border-neutral-200 bg-neutral-50 px-2 py-1.5 font-bold text-neutral-600">Tema</th>
                            <th className="border border-neutral-200 bg-neutral-50 px-2 py-1.5 font-bold text-neutral-600">Atividade</th>
                            <th className="border border-neutral-200 bg-neutral-50 px-2 py-1.5 font-bold text-neutral-600">Modalidade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {semanasDoBloco(bloco.chave).map((s, indice) => (
                            <tr key={s.semana}>
                              <td className="border border-neutral-200 px-2 py-1.5 font-semibold text-neutral-700">{indice + 1}</td>
                              <td className="border border-neutral-200 px-2 py-1.5 text-neutral-700">{s.tema}</td>
                              <td className="border border-neutral-200 px-2 py-1.5 text-neutral-500">{s.atividade}</td>
                              <td className="border border-neutral-200 px-2 py-1.5 text-neutral-400">{s.modalidade}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          {/* Checklist de materiais */}
          <section className="mt-8 break-inside-avoid">
            <h2 className="text-lg font-extrabold text-neutral-900">9. Checklist de Materiais Desplugados</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-bold text-neutral-700">Materiais impressos e gráficos</p>
                <ul className="mt-1 space-y-1 text-sm text-neutral-600">
                  {CHECKLIST_MATERIAIS_IMPRESSOS.map((item) => (
                    <li key={item}>☐ {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-700">Materiais recicláveis e reutilizáveis</p>
                <ul className="mt-1 space-y-1 text-sm text-neutral-600">
                  {CHECKLIST_MATERIAIS_RECICLAVEIS.map((item) => (
                    <li key={item}>☐ {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Referências */}
          <section className="mt-8 break-inside-avoid">
            <h2 className="text-lg font-extrabold text-neutral-900">10. Referências Bibliográficas e Normativas</h2>
            <ul className="mt-2 space-y-1.5 text-xs text-neutral-500">
              {REFERENCIAS_CURSO.map((ref) => (
                <li key={ref}>{ref}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
