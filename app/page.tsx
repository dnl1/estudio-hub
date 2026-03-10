import { benefits, howItWorks, modules, plans, useCases } from "@/components/site-content";

export default function HomePage() {
  return (
    <main id="home" className="spa-main">
      <section className="container hero hero-panel">
        <p className="eyebrow">Gestão completa para estúdios</p>
        <h1>Seu estúdio no controle: agenda, comandas, estoque e cobranças em um só lugar.</h1>
        <p className="lead">
          Organize reservas, acompanhe consumo por ensaio e gerencie operação por unidade com visão
          completa do negócio. Não é só agenda: é o coração da gestão do estúdio.
        </p>
        <div className="cta-row">
          <a className="btn btn-primary" href="#contato">
            Quero uma demonstração
          </a>
          <a className="btn btn-secondary" href="#funcionalidades">
            Conhecer funcionalidades
          </a>
        </div>

        <div className="hero-panels">
          <article className="glass-card">
            <h3>Tudo em um só lugar</h3>
            <p>Agenda, comandas, estoque, pagamentos e comunicação em um único fluxo.</p>
          </article>
          <article className="glass-card">
            <h3>Do dia a dia ao crescimento</h3>
            <p>Saia do improviso com dados claros para decisões rápidas e melhores resultados.</p>
          </article>
          <article className="glass-card">
            <h3>Pronto para crescer com seu estúdio</h3>
            <p>Funciona para estúdios menores e acompanha seu crescimento sem complicar a rotina.</p>
          </article>
        </div>
      </section>

      <section className="container section section-panel">
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

      <section className="container section section-panel">
        <div className="section-head">
          <p className="eyebrow">Solução</p>
          <h2>Ecossistema completo para operar, vender, controlar e crescer.</h2>
        </div>
        <p>
          O EstudioHub centraliza a rotina do estúdio da reserva à comanda, do estoque ao
          pagamento, da confirmação ao relatório. Você ganha previsibilidade da agenda,
          controle financeiro e organização para crescer com segurança.
        </p>
      </section>

      <section className="container section section-panel" id="funcionalidades">
        <div className="section-head">
          <p className="eyebrow">Funcionalidades</p>
          <h2>Ferramentas conectadas para simplificar toda a operação.</h2>
        </div>
        <div className="cards-grid">
          {modules.map((item) => (
            <article className="module-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section section-panel">
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

      <section className="container section section-panel">
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

      <section className="container section section-panel" id="planos">
        <div className="section-head">
          <p className="eyebrow">Planos</p>
          <h2>Planos por capacidade real de operação.</h2>
        </div>
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
        <div className="highlight">
          <div className="section-head">
            <p className="eyebrow">FAQ de migração</p>
            <h2>Dúvidas comuns na mudança de operação.</h2>
          </div>
          <div className="two-col">
            <article className="trust-card">
              <h3>Tem trial?</h3>
              <p>Sim. Validamos seu cenário e liberamos teste assistido para rotina real.</p>
            </article>
            <article className="trust-card">
              <h3>Como funciona a migração?</h3>
              <p>Onboarding por etapas: estrutura, agenda, estoque, usuários e operação diária.</p>
            </article>
            <article className="trust-card">
              <h3>Automação de cobrança de assinatura</h3>
              <p>
                O billing segue em evolução contínua. Hoje já existe gestão de assinatura e fatura
                com controles administrativos.
              </p>
            </article>
            <article className="trust-card">
              <h3>Como escolher plano?</h3>
              <p>A recomendação considera salas ativas, volume e meta de crescimento.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="container section section-panel" id="para-quem">
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

      <section className="container section section-panel" id="integracoes">
        <div className="section-head">
          <p className="eyebrow">Integrações</p>
          <h2>Integrações operacionais para reduzir fricção no dia a dia.</h2>
        </div>
        <div className="cards-grid">
          <article className="module-card">
            <h3>Mercado Pago e PagBank</h3>
            <p>Receba no PIX com mais controle de pagamentos e menos trabalho manual.</p>
          </article>
          <article className="module-card">
            <h3>WhatsApp (Meta)</h3>
            <p>Confirmações, lembretes, cancelamentos e avisos de pagamento com histórico.</p>
          </article>
          <article className="module-card">
            <h3>E-mail (SMTP/Resend)</h3>
            <p>Comunicação de apoio para operação e rotinas administrativas.</p>
          </article>
        </div>
      </section>

      <section className="container section section-panel" id="seguranca">
        <div className="section-head">
          <p className="eyebrow">Confiança e controle</p>
          <h2>Sua operação com segurança, organização e histórico claro.</h2>
        </div>
        <div className="trust-grid">
          <article className="trust-card">
            <h3>Dados organizados por unidade</h3>
            <p>Cada unidade mantém sua rotina bem definida, com visão clara para a gestão.</p>
          </article>
          <article className="trust-card">
            <h3>Perfis e permissões</h3>
            <p>Defina quem pode ver e fazer cada ação para evitar erros e retrabalho.</p>
          </article>
          <article className="trust-card">
            <h3>Auditoria e rastreabilidade</h3>
            <p>Histórico de ações importantes para dar transparência e apoiar decisões.</p>
          </article>
        </div>
      </section>

      <section className="container section section-panel" id="sobre">
        <div className="section-head">
          <p className="eyebrow">Sobre</p>
          <h2>Produto construído para a operação real de estúdios.</h2>
        </div>
        <div className="two-col">
          <article className="trust-card">
            <h3>Visão de produto</h3>
            <p>
              Ser a plataforma de referência para estúdios, conectando agenda, consumo,
              estoque, cobrança e gestão administrativa.
            </p>
          </article>
          <article className="trust-card">
            <h3>Proposta de valor</h3>
            <p>
              Centralizar operação diária para reduzir perda de receita por desorganização e dar
              previsibilidade para crescimento.
            </p>
          </article>
        </div>
      </section>

      <section className="container section section-panel cta-final" id="contato">
        <h2>Transforme a gestão do seu estúdio em uma operação previsível e escalável.</h2>
        <p>
          Solicite uma demonstração e receba um diagnóstico da sua operação com recomendação por porte
          da sua operação.
        </p>
        <div className="cta-row">
          <a className="btn btn-primary" href="mailto:danilo.o.gomes@proton.me">
            Agendar demonstração
          </a>
          <a
            className="btn btn-secondary wa-btn"
            href="https://wa.me/5511946010528"
            target="_blank"
            rel="noreferrer"
          >
            <span className="wa-icon" aria-hidden="true">
              W
            </span>
            WhatsApp: +55 (11) 94601-0528
          </a>
        </div>
      </section>
    </main>
  );
}
