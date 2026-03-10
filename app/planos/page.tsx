import Link from "next/link";
import { PageIntro } from "@/components/site-chrome";
import { plans } from "@/components/site-content";

export default function PlansPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Planos e Licenciamento"
        title="Planos por capacidade real de operação."
        description="O licenciamento do EstudioHub considera quantidade de salas, ciclo de contratação e estágio da sua operação para garantir aderência sem excesso."
      />

      <section className="container section">
        <div className="stage-grid">
          {plans.map((plan) => (
            <article className="stage-card" key={plan.title}>
              <h3>{plan.title}</h3>
              <p className="benefit-line">{plan.subtitle}</p>
              {plan.points.map((point) => (
                <p key={point}>{point}</p>
              ))}
            </article>
          ))}
        </div>
      </section>

      <section className="container section highlight">
        <div className="section-head">
          <p className="eyebrow">FAQ de migração</p>
          <h2>Dúvidas comuns na mudança de operação.</h2>
        </div>
        <div className="two-col">
          <article className="trust-card">
            <h3>Tem trial?</h3>
            <p>Sim. Avaliamos seu porte e liberamos período de teste assistido para validação real.</p>
          </article>
          <article className="trust-card">
            <h3>Como funciona a migração?</h3>
            <p>Fazemos onboarding por etapas: estrutura, agenda, estoque, usuários e operação diária.</p>
          </article>
          <article className="trust-card">
            <h3>Existe cobrança recorrente automática de licença?</h3>
            <p>
              O billing está em evolução contínua. Hoje já existe gestão de assinatura e fatura com
              controles administrativos de cobrança.
            </p>
          </article>
          <article className="trust-card">
            <h3>Como escolher plano?</h3>
            <p>A recomendação considera salas ativas, volume operacional e objetivos de crescimento.</p>
          </article>
        </div>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/contato">
            Receber recomendação de plano
          </Link>
        </div>
      </section>
    </main>
  );
}
