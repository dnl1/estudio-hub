import Link from "next/link";
import { howItWorks, benefits, modules, useCases } from "@/components/site-content";

export default function HomePage() {
  return (
    <main>
      <section className="container hero">
        <p className="eyebrow">SaaS para gestão operacional de estúdios</p>
        <h1>Seu estúdio no controle: agenda, comandas, estoque e cobranças em um só lugar.</h1>
        <p className="lead">
          Organize reservas, acompanhe consumo por ensaio e gerencie operação por unidade com visão
          completa do negócio. Não é só agenda: é o sistema operacional do estúdio.
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/contato">
            Quero uma demonstração
          </Link>
          <Link className="btn btn-secondary" href="/funcionalidades">
            Conhecer funcionalidades
          </Link>
        </div>

        <div className="hero-panels">
          <article className="glass-card">
            <h3>Tudo em um só lugar</h3>
            <p>Agenda, comandas, estoque, pagamentos, comunicação e auditoria em fluxo único.</p>
          </article>
          <article className="glass-card">
            <h3>Do operacional ao estratégico</h3>
            <p>Saia do improviso com dados confiáveis para gestão diária e decisão de crescimento.</p>
          </article>
          <article className="glass-card">
            <h3>Pronto para crescer com seu estúdio</h3>
            <p>Estrutura preparada para 1 unidade ou operação multiunidade com governança central.</p>
          </article>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <p className="eyebrow">Problema</p>
          <h2>Planilha, WhatsApp e caderno não escalam a operação.</h2>
        </div>
        <p>
          Quando a rotina roda em ferramentas desconectadas, os erros aparecem rápido: conflito de
          horário, consumo que não fecha, estoque inconsistente e pagamentos sem rastreio. O
          resultado é retrabalho, perda de receita e equipe sobrecarregada.
        </p>
      </section>

      <section className="container section">
        <div className="section-head">
          <p className="eyebrow">Solução</p>
          <h2>Ecossistema completo para operar, vender, controlar e crescer.</h2>
        </div>
        <p>
          O EstudioHub centraliza a rotina do estúdio da reserva à comanda, do estoque ao
          pagamento, da confirmação ao relatório. Você ganha previsibilidade da agenda,
          controle financeiro-operacional e capacidade de escala com governança.
        </p>
      </section>

      <section className="container section">
        <div className="section-head">
          <p className="eyebrow">Módulos principais</p>
          <h2>Funcionalidades com foco em resultado operacional.</h2>
        </div>
        <div className="cards-grid">
          {modules.slice(0, 6).map((item) => (
            <article className="module-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
        <div className="cta-row">
          <Link className="btn btn-secondary" href="/funcionalidades">
            Ver todos os módulos
          </Link>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <p className="eyebrow">Como funciona</p>
          <h2>Implantação objetiva para rotina real de estúdio.</h2>
        </div>
        <div className="benefits-grid">
          {howItWorks.map((step) => (
            <article className="benefit-item" key={step}>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <p className="eyebrow">Benefícios</p>
          <h2>Menos improviso, mais previsibilidade de operação.</h2>
        </div>
        <div className="benefits-grid">
          {benefits.map((item) => (
            <article className="benefit-item" key={item}>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <p className="eyebrow">Para quem</p>
          <h2>Feito para operações que precisam profissionalizar gestão sem complicar.</h2>
        </div>
        <div className="stage-grid">
          {useCases.map((item) => (
            <article className="stage-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section cta-final">
        <h2>Transforme a gestão do seu estúdio em uma operação previsível e escalável.</h2>
        <p>
          Solicite uma demonstração e receba um diagnóstico operacional com recomendação de plano
          por porte da sua operação.
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/contato">
            Agendar demonstração
          </Link>
          <Link className="btn btn-secondary" href="/planos">
            Ver planos
          </Link>
        </div>
      </section>
    </main>
  );
}
