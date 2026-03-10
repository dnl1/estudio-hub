"use client";

import Link from "next/link";
import { useState } from "react";
import { navLinks } from "@/components/site-content";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="logo" href="/">
          EstudioHub
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav
          id="main-navigation"
          className={`site-nav ${isMenuOpen ? "is-open" : ""}`}
          aria-label="Navegação principal"
        >
          <ul className="nav-list">
            {navLinks.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={handleNavClick}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn btn-primary header-cta" href="#contato" onClick={handleNavClick}>
          Quero uma demonstração
        </a>
        <a
          className="btn btn-secondary header-admin-cta"
          href="https://admin.estudio-hub.com"
          target="_blank"
          rel="noreferrer"
          onClick={handleNavClick}
        >
          Acessar APP ADMIN
        </a>
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
            Plataforma completa para gestão de estúdios: agenda, consumo, estoque, pagamentos e
            comunicação em um só lugar.
          </p>
        </div>
        <div>
          <p className="footer-title">Contato</p>
          <p>
            <a href="mailto:danilo.o.gomes@proton.me">danilo.o.gomes@proton.me</a>
          </p>
          <p>
            <a
              className="wa-link"
              href="https://wa.me/5511946010528"
              target="_blank"
              rel="noreferrer"
              aria-label="Falar no WhatsApp: +55 (11) 94601-0528"
            >
              <span className="wa-icon" aria-hidden="true">
                W
              </span>
              +55 (11) 94601-0528
            </a>
          </p>
        </div>
        <div>
          <p className="footer-title">Links</p>
          <p>
            <a href="#funcionalidades">Funcionalidades</a>
          </p>
          <p>
            <a href="#planos">Planos</a>
          </p>
          <p>
            <a href="#seguranca">Segurança e Governança</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
