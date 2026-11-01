const sticky = document.querySelector<HTMLElement>(".sticky-cta");
const hero = document.getElementById("hero-cta");
const contact = document.getElementById("contato");

if (sticky && hero && contact) {
  let heroVisible = true;
  let contactVisible = false;
  const update = () => {
    const visible = !heroVisible && !contactVisible;
    sticky.classList.toggle("is-visible", visible);
    sticky.setAttribute("aria-hidden", String(!visible));
    if (visible) sticky.removeAttribute("inert");
    else sticky.setAttribute("inert", "");
  };
  const latest = (entries: IntersectionObserverEntry[]) => entries[entries.length - 1].isIntersecting;
  const heroObserver = new IntersectionObserver((entries) => { heroVisible = latest(entries); update(); });
  const contactObserver = new IntersectionObserver((entries) => { contactVisible = latest(entries); update(); });
  heroObserver.observe(hero);
  contactObserver.observe(contact);
}
