import Link from "next/link";
import { PageIntro } from "@/components/site-chrome";
import { modules } from "@/components/site-content";

export default function FeaturesPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Funcionalidades"
        title="Módulos conectados para gestão operacional de ponta a ponta."
        description="Cada módulo foi desenhado para reduzir falhas de rotina, proteger receita e dar visão real de operação por sala, unidade e organização."
      />

      <section className="container section">
        <div className="cards-grid">
          {modules.map((item) => (
            <article className="module-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section cta-final">
        <h2>Veja os módulos aplicados ao seu cenário operacional.</h2>
        <p>
          Nosso time mapeia seus processos e mostra a configuração ideal para seu porte e modelo de
          atendimento.
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/contato">
            Quero uma demonstração
          </Link>
        </div>
      </section>
    </main>
  );
}
