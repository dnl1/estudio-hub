import Link from "next/link";
import { PageIntro } from "@/components/site-chrome";

export default function SecurityPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Segurança e Governança"
        title="Controle robusto para operação multi-organização."
        description="Com isolamento por organização, perfis de acesso e trilha auditável, o EstudioHub fortalece governança sem travar produtividade."
      />

      <section className="container section">
        <div className="trust-grid">
          <article className="trust-card">
            <h3>Isolamento por organização</h3>
            <p>
              Arquitetura multi-tenant com escopo por OrganizationId para separar dados e operação
              entre clientes.
            </p>
          </article>
          <article className="trust-card">
            <h3>Perfis e permissões</h3>
            <p>Perfis Admin, Manager e Staff com controle de acesso por responsabilidade.</p>
          </article>
          <article className="trust-card">
            <h3>Auditoria de ações</h3>
            <p>Registro de trilha sensível com filtros e retenção automática para compliance.</p>
          </article>
          <article className="trust-card">
            <h3>Admin global e impersonação</h3>
            <p>
              Suporte e administração multiunidade com troca de organização ativa e rastreabilidade.
            </p>
          </article>
          <article className="trust-card">
            <h3>Health checks operacionais</h3>
            <p>Monitoramento de disponibilidade com endpoints de live e ready.</p>
          </article>
          <article className="trust-card">
            <h3>Relatórios assíncronos</h3>
            <p>
              Jobs de retaguarda para manter desempenho da operação sem comprometer experiência do
              time.
            </p>
          </article>
        </div>
      </section>

      <section className="container section cta-final">
        <h2>Governança que acompanha seu crescimento.</h2>
        <p>
          Estruture acesso, monitoramento e histórico operacional para escalar com segurança
          administrativa.
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/contato">
            Solicitar demonstração técnica
          </Link>
        </div>
      </section>
    </main>
  );
}
