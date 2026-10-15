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
    // Num gesto rápido chegam várias leituras de uma vez: vale a última, que é o estado atual.
    const latest = (entries: IntersectionObserverEntry[]) => entries[entries.length - 1].isIntersecting;
    const heroObserver = new IntersectionObserver((entries) => setHeroVisible(latest(entries)));
    const contactObserver = new IntersectionObserver((entries) => setContactVisible(latest(entries)));
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
