"use client";

import { useState } from "react";
import { ADMIN_URL, CONTACT_EMAIL, footer, navLinks } from "@/components/site-content";
import { DEMO_URL, DemoButton, WHATSAPP_DISPLAY } from "@/components/whatsapp";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="logo" href="#topo" onClick={closeMenu}>
          EstudioHub
        </a>
        <nav
          id="main-navigation"
          className={`site-nav${isMenuOpen ? " is-open" : ""}`}
          aria-label="Navegação principal"
        >
          <ul className="nav-list">
            {navLinks.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={closeMenu}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href={ADMIN_URL} target="_blank" rel="noreferrer" onClick={closeMenu}>
                Entrar
              </a>
            </li>
          </ul>
        </nav>
        <DemoButton className="header-cta" />
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-brand">EstudioHub</p>
          <p>{footer.text}</p>
        </div>
        <ul className="footer-links">
          <li>
            <a href={DEMO_URL} target="_blank" rel="noreferrer">
              WhatsApp {WHATSAPP_DISPLAY}
            </a>
          </li>
          <li>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </li>
          <li>
            <a href={ADMIN_URL} target="_blank" rel="noreferrer">
              Entrar no sistema
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
