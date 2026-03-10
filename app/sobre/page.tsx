import Link from "next/link";
import { PageIntro } from "@/components/site-chrome";

export default function AboutPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Sobre"
        title="Produto construído para a operação real de estúdios."
        description="Nosso foco é transformar rotinas operacionais fragmentadas em processos padronizados, rastreáveis e escaláveis."
      />

      <section className="container section">
        <div className="two-col">
          <article className="trust-card">
            <h3>Visão de produto</h3>
            <p>
              Ser o sistema operacional de referência para estúdios e operações com salas,
              conectando agenda, consumo, estoque, cobrança e gestão administrativa.
            </p>
          </article>
          <article className="trust-card">
            <h3>Proposta de valor</h3>
            <p>
              Centralizar operação diária para reduzir perda de receita por desorganização e dar
              previsibilidade para crescimento.
            </p>
          </article>
          <article className="trust-card">
            <h3>Evolução contínua</h3>
            <p>
              Trabalhamos com evolução incremental de funcionalidades, integrações e billing para
              acompanhar maturidade de operação dos clientes.
            </p>
          </article>
          <article className="trust-card">
            <h3>Parceria tecnológica</h3>
            <p>
              Atuamos próximos ao negócio para orientar configuração, adoção e melhoria de processos
              críticos da rotina.
            </p>
          </article>
        </div>
      </section>

      <section className="container section cta-final">
        <h2>Vamos mapear o próximo nível da sua operação.</h2>
        <p>Converse com nosso time e veja como o EstudioHub se adapta ao seu porte e objetivo.</p>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/contato">
            Falar com o time
          </Link>
        </div>
      </section>
    </main>
  );
}
