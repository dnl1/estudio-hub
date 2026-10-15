import { NightGrid } from "@/components/night-grid";
import { hero } from "@/components/site-content";
import { DemoButton } from "@/components/whatsapp";

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
    </main>
  );
}
