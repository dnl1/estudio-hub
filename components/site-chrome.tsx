import Link from "next/link";
import { navLinks } from "@/components/site-content";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="logo" href="/">
          EstudioHub
        </Link>
        <nav aria-label="Navegação principal">
          <ul className="nav-list">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link className="btn btn-primary header-cta" href="/contato">
          Quero uma demonstração
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="brand">EstudioHub</p>
          <p>
            Plataforma SaaS multi-tenant para gestão de estúdios: agenda, consumo, estoque,
            pagamentos, comunicação e governança em um só ecossistema.
          </p>
        </div>
        <div>
          <p className="footer-title">Contato</p>
          <p>comercial@estudiohub.com.br</p>
          <p>+55 (11) 99999-0000</p>
        </div>
        <div>
          <p className="footer-title">Links</p>
          <p>
            <Link href="/funcionalidades">Funcionalidades</Link>
          </p>
          <p>
            <Link href="/planos">Planos</Link>
          </p>
          <p>
            <Link href="/seguranca-governanca">Segurança e Governança</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="container page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="lead">{description}</p>
    </section>
  );
}
