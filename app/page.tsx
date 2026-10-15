import { NightGrid } from "@/components/night-grid";
import { ProductShot } from "@/components/product-shot";
import { audience, extras, hero, productSection } from "@/components/site-content";
import { DemoButton } from "@/components/whatsapp";
import { WhatsAppBubble } from "@/components/whatsapp-bubble";

export default function HomePage() {
  return (
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
    </main>
  );
}
