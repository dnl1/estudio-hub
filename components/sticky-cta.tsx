"use client";

import { useEffect, useState } from "react";
import { DemoButton } from "@/components/whatsapp";

// Barra do celular: aparece quando o botão do topo sai da tela e some na chamada final.
export function StickyCta() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-cta");
    const contact = document.getElementById("contato");
    if (!hero || !contact) return;
    const heroObserver = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting));
    const contactObserver = new IntersectionObserver(([entry]) => setContactVisible(entry.isIntersecting));
    heroObserver.observe(hero);
    contactObserver.observe(contact);
    return () => {
      heroObserver.disconnect();
      contactObserver.disconnect();
    };
  }, []);

  const visible = !heroVisible && !contactVisible;

  return (
    <div className={`sticky-cta${visible ? " is-visible" : ""}`} aria-hidden={!visible} inert={!visible}>
      <DemoButton />
    </div>
  );
}
