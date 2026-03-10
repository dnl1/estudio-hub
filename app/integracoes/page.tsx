import Link from "next/link";
import { PageIntro } from "@/components/site-chrome";

export default function IntegrationsPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Integrações"
        title="Integrações operacionais para reduzir fricção no dia a dia."
        description="O EstudioHub integra pagamentos, comunicação e e-mail com configuração por organização para manter consistência de operação."
      />

      <section className="container section">
        <div className="cards-grid">
          <article className="module-card">
            <h3>Mercado Pago</h3>
            <p>
              Checkout PIX, processamento de webhooks e rastreio de transações com histórico de
              eventos.
            </p>
          </article>
          <article className="module-card">
            <h3>PagBank</h3>
            <p>Configuração por organização com suporte ao fluxo de cobrança operacional.</p>
          </article>
          <article className="module-card">
            <h3>WhatsApp (Meta)</h3>
            <p>
              Confirmações, lembretes, cancelamentos e avisos com trilha de envio por status de
              notificação.
            </p>
          </article>
          <article className="module-card">
            <h3>E-mail (SMTP/Resend)</h3>
            <p>Canal adicional para comunicação administrativa e operacional com a base de clientes.</p>
          </article>
          <article className="module-card">
            <h3>Configuração por unidade</h3>
            <p>
              Setup centralizado por tenant com regras de ativação para evitar configuração
              inconsistente.
            </p>
          </article>
          <article className="module-card">
            <h3>Ecossistema evolutivo</h3>
            <p>
              Arquitetura preparada para expansão de integrações conforme novas demandas do negócio.
            </p>
          </article>
        </div>
      </section>

      <section className="container section cta-final">
        <h2>Conecte operação e cobrança sem virar refém de ferramentas soltas.</h2>
        <p>
          Mapeamos seu cenário atual e recomendamos a configuração de integrações adequada para sua
          estrutura.
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/contato">
            Falar com consultor
          </Link>
        </div>
      </section>
    </main>
  );
}
