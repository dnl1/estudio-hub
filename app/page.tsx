import { NightGrid } from "@/components/night-grid";
import { ProductShot } from "@/components/product-shot";
import { CONTACT_EMAIL, audience, contact, extras, faq, hero, pricing, productSection, promo, steps } from "@/components/site-content";
import { StickyCta } from "@/components/sticky-cta";
import { DemoButton } from "@/components/whatsapp";
import { WhatsAppBubble } from "@/components/whatsapp-bubble";

// Âncoras do site antigo, que podem estar em links já compartilhados, levam à seção equivalente.
function OldAnchor({ id }: { id: string }) {
  return <span id={id} aria-hidden="true" />;
}

// Cada valor em reais fica inteiro: a linha pode quebrar entre as palavras, nunca dentro de "(R$ 899,90)"
function WholePrices({ text }: { text: string }) {
  return text.split(/(\(?R\$ [\d.,]+\)?)/).map((part, index) =>
    index % 2 ? (
      <span className="nowrap" key={index}>
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default function HomePage() {
  return (
    <>
      <main id="conteudo">
        <section className="hero" id="topo" aria-labelledby="topo-titulo">
          <OldAnchor id="home" />
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
          <OldAnchor id="funcionalidades" />
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
          <OldAnchor id="integracoes" />
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
          <OldAnchor id="sobre" />
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
          <OldAnchor id="planos" />
          <div className="container">
            <div className="section-head">
              <h2 id="precos-titulo">{pricing.title}</h2>
              <p>{pricing.lead}</p>
            </div>
            <ul className="plans">
              {pricing.plans.map((plan) => (
                <li className={plan.promoMonthly ? "plan" : "plan plan--sem-selo"} key={plan.name}>
                  {plan.promoMonthly ? <span className="plan__badge">{promo.trialLabel}</span> : null}
                  <h3>{plan.name}</h3>
                  <p className="plan__rooms">{plan.rooms}</p>
                  {plan.promoMonthly ? (
                    <>
                      <p className="plan__price">
                        {plan.promoMonthly} <span>por mês</span>
                      </p>
                      <p className="plan__window">{promo.window}</p>
                      <p className="plan__original">
                        <span>
                          <WholePrices text={promo.afterPrice(plan.monthly ?? "")} />
                        </span>
                        <span>
                          <WholePrices text={promo.annualLine(plan.annualInstallments ?? "")} />
                        </span>
                      </p>
                    </>
                  ) : plan.monthly ? (
                    <>
                      <p className="plan__price">
                        {plan.monthly} <span>por mês</span>
                      </p>
                      <p className="plan__original">
                        <span>
                          <WholePrices text={promo.annualLine(plan.annualInstallments ?? "")} />
                        </span>
                      </p>
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
          <OldAnchor id="seguranca" />
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
