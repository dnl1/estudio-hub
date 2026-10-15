import { NightGrid } from "@/components/night-grid";
import { ProductShot } from "@/components/product-shot";
import { CONTACT_EMAIL, audience, contact, extras, faq, hero, pricing, productSection, steps } from "@/components/site-content";
import { StickyCta } from "@/components/sticky-cta";
import { DemoButton } from "@/components/whatsapp";
import { WhatsAppBubble } from "@/components/whatsapp-bubble";

export default function HomePage() {
  return (
    <>
      <main id="conteudo">
        <section className="hero" id="topo" aria-labelledby="topo-titulo">
          <div className="container">
            <h1 id="topo-titulo">{hero.title}</h1>
            <p className="hero__lead">{hero.lead}</p>
            <div className="hero__cta">
              <DemoButton id="hero-cta">{hero.cta}</DemoButton>
              <p className="hero__note">{hero.note}</p>
            </div>
            <NightGrid />
          </div>
        </section>

        <section className="section" id="como-funciona" aria-labelledby="como-funciona-titulo">
          <div className="container">
            <div className="section-head">
              <h2 id="como-funciona-titulo">{productSection.title}</h2>
              <p>{productSection.lead}</p>
            </div>
            <div className="product-rows">
              {productSection.rows.map((row) => (
                <article className="product-row" key={row.id}>
                  <div className="product-row__text">
                    <h3>{row.title}</h3>
                    <p>{row.text}</p>
                  </div>
                  <div className="product-row__media">
                    <ProductShot {...row.shot} />
                    {row.bubble ? <WhatsAppBubble /> : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--espuma" id="tambem-tem" aria-labelledby="tambem-tem-titulo">
          <div className="container">
            <div className="section-head">
              <h2 id="tambem-tem-titulo">{extras.title}</h2>
            </div>
            <ul className="feature-list">
              {extras.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section" id="para-quem" aria-labelledby="para-quem-titulo">
          <div className="container">
            <div className="section-head">
              <h2 id="para-quem-titulo">{audience.title}</h2>
            </div>
            <ul className="audience-list">
              {audience.items.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="section section--espuma" id="como-comecar" aria-labelledby="como-comecar-titulo">
          <div className="container">
            <div className="section-head">
              <h2 id="como-comecar-titulo">{steps.title}</h2>
            </div>
            <ol className="steps">
              {steps.items.map((step) => (
                <li key={step.title}>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section" id="precos" aria-labelledby="precos-titulo">
          <div className="container">
            <div className="section-head">
              <h2 id="precos-titulo">{pricing.title}</h2>
              <p>{pricing.lead}</p>
            </div>
            <ul className="plans">
              {pricing.plans.map((plan) => (
                <li className="plan" key={plan.name}>
                  <h3>{plan.name}</h3>
                  <p className="plan__rooms">{plan.rooms}</p>
                  {plan.monthly ? (
                    <>
                      <p className="plan__price">
                        {plan.monthly} <span>por mês</span>
                      </p>
                      <ul className="plan__cycles">
                        {plan.cycles.map((cycle) => {
                          // "R$ 499,90 a cada 6 meses (R$ 83,32 por mês)": o valor por mês vai numa linha própria
                          const [total, perMonth] = cycle.split(" (");
                          return (
                            <li key={cycle}>
                              {total} <span className="plan__per-month">({perMonth}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : (
                    <p className="plan__price">{plan.custom}</p>
                  )}
                </li>
              ))}
            </ul>
            <p className="client-line">{pricing.client}</p>
          </div>
        </section>

        <section className="section section--espuma" id="duvidas" aria-labelledby="duvidas-titulo">
          <div className="container">
            <div className="section-head">
              <h2 id="duvidas-titulo">{faq.title}</h2>
            </div>
            <div className="faq">
              {faq.items.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="section contact" id="contato" aria-labelledby="contato-titulo">
          <div className="container">
            <h2 id="contato-titulo">{contact.title}</h2>
            <p className="contact__lead">{contact.lead}</p>
            <div className="contact__actions">
              <DemoButton>{contact.cta}</DemoButton>
              <p>
                {contact.emailIntro} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <StickyCta />
    </>
  );
}
