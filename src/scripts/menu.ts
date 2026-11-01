const toggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
const navigation = document.getElementById("main-navigation");

if (toggle && navigation) {
  const close = () => {
    navigation.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
  };

  toggle.addEventListener("click", () => {
    const open = !navigation.classList.contains("is-open");
    navigation.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });
  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
}
