import Link from "next/link";
import { PageIntro } from "@/components/site-chrome";
import { useCases } from "@/components/site-content";

export default function AudiencePage() {
  return (
    <main>
      <PageIntro
        eyebrow="Para Quem"
        title="Feito para quem precisa operar com padrão e escalar com governança."
        description="Atendemos negócios de 1 a múltiplas unidades, com 1 a 20+ salas ativas e necessidade real de controle operacional e financeiro."
      />

      <section className="container section">
        <div className="stage-grid">
          {useCases.map((item) => (
            <article className="stage-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section highlight">
        <div className="section-head">
          <p className="eyebrow">Dores resolvidas</p>
          <h2>O que muda na prática com o EstudioHub.</h2>
        </div>
        <div className="benefits-grid">
          <article className="benefit-item">
            <p>Agenda fragmentada entre WhatsApp, papel e planilha.</p>
          </article>
          <article className="benefit-item">
            <p>Consumo sem controle e fechamento de comanda inconsistente.</p>
          </article>
          <article className="benefit-item">
            <p>Estoque sem trilha confiável de movimentação.</p>
          </article>
          <article className="benefit-item">
            <p>Cobrança e confirmação de pagamento com baixa visibilidade.</p>
          </article>
          <article className="benefit-item">
            <p>Gestão entre unidades e equipe sem padrão administrativo.</p>
          </article>
        </div>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/contato">
            Diagnosticar minha operação
          </Link>
        </div>
      </section>
    </main>
  );
}
