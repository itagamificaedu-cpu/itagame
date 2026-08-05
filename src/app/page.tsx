import { Cabecalho } from "@/components/landing/Cabecalho";
import { SecaoPrincipal } from "@/components/landing/SecaoPrincipal";
import { BarraDestaques } from "@/components/landing/BarraDestaques";
import { SecaoDor } from "@/components/landing/SecaoDor";
import { ComoFunciona } from "@/components/landing/ComoFunciona";
import { CatalogoAtividades } from "@/components/landing/CatalogoAtividades";
import { GeradoresAtividades } from "@/components/landing/GeradoresAtividades";
import { GradeFuncionalidades } from "@/components/landing/GradeFuncionalidades";
import { Publico } from "@/components/landing/Publico";
import { Objecoes } from "@/components/landing/Objecoes";
import { Depoimentos } from "@/components/landing/Depoimentos";
import { Planos } from "@/components/landing/Planos";
import { ChamadaFinal } from "@/components/landing/ChamadaFinal";
import { Faq } from "@/components/landing/Faq";
import { Rodape } from "@/components/landing/Rodape";
import { BarraCtaFixa } from "@/components/landing/BarraCtaFixa";

export default function Home() {
  return (
    <>
      <Cabecalho />
      <main>
        <SecaoPrincipal />
        <BarraDestaques />
        <SecaoDor />
        <ComoFunciona />
        <CatalogoAtividades />
        <GeradoresAtividades />
        <GradeFuncionalidades />
        <Publico />
        <Objecoes />
        <Depoimentos />
        <Planos />
        <ChamadaFinal />
        <Faq />
      </main>
      <Rodape />
      <BarraCtaFixa />
    </>
  );
}
