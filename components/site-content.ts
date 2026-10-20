export const ADMIN_URL = "https://admin.estudio-hub.com";
export const CONTACT_EMAIL = "contato@estudio-hub.com";

export type LinkItem = {
  href: string;
  label: string;
};

export const navLinks: LinkItem[] = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#precos", label: "Preços" },
  { href: "#duvidas", label: "Dúvidas" }
];

// Volta da promoção (a partir de 01/04/2027). O site não desliga sozinho: alguém republica a versão sem promoção.
// 1. Em `plans`, troque `promoMonthly` por null nos planos pagos (Starter, Growth, Scale). `app/page.tsx` então
//    mostra `monthly` como preço grande, sem selo e sem janela.
// 2. Revise os textos que citam a promoção: `promo.trialLabel` (nota do topo, passo "Como começar", descrição em
//    `app/layout.tsx` e imagem em `app/og-image.png/route.tsx`), `pricing.lead` e o FAQ "Como funciona a promoção?"
//    (remova a pergunta). Se o teste grátis continuar, mantenha `promo.trialDays`.
// 3. Atualize os testes e2e: `e2e/pricing.spec.ts` (selo, janela, "Depois, ..." e FAQ esperam a promoção; com
//    `promoMonthly` null o preço grande passa a ser `monthly` e não há selo nem janela) e `e2e/hero.spec.ts`
//    (nota do topo e descrição da página).
// 4. Rode `npm run test:e2e` e `npm run lint`, confira `#precos` em 390, 900 e 1280 px e republique o site.
export const promo = {
  trialLabel: "1º mês grátis",
  trialDays: 30,
  window: "do 2º ao 4º mês",
  until: "31 de março de 2027",
  afterPrice: (monthly: string) => `Depois, ${monthly} por mês`,
  annualLine: (installments: string) => `Ou plano anual em ${installments}`
};

export const hero = {
  title: "A agenda das salas, as comandas e os pagamentos do seu estúdio num lugar só.",
  lead: "Sem conflito de horário e sem consumo que não fecha no fim do mês.",
  cta: "Agendar demonstração de 15 min",
  note: `${promo.trialLabel}, com a gente acompanhando.`
};

export type BookingKind = "mensal" | "avulsa" | "bloqueio";

export type NightBooking = {
  room: string;
  start: number;
  end: number;
  label: string;
  kind: BookingKind;
  tab?: string;
};

export const bookingKindLabel: Record<BookingKind, string> = {
  mensal: "mensalista",
  avulsa: "avulsa",
  bloqueio: "bloqueio"
};

const nightBookings: NightBooking[] = [
  { room: "Sala 1", start: 18, end: 20, label: "Os Cobras", kind: "mensal" },
  { room: "Sala 1", start: 20, end: 22, label: "Lia Trio", kind: "avulsa", tab: "Comanda R$ 86,00" },
  { room: "Sala 1", start: 22, end: 24, label: "Maré Alta", kind: "mensal" },
  { room: "Sala 2", start: 19, end: 21, label: "Banda Norte", kind: "avulsa" },
  { room: "Sala 2", start: 21, end: 23, label: "Quarto Escuro", kind: "mensal" },
  { room: "Sala 3", start: 18, end: 20, label: "Manutenção", kind: "bloqueio" },
  { room: "Sala 3", start: 20, end: 22, label: "Ruído Branco", kind: "mensal" },
  { room: "Sala 3", start: 22, end: 24, label: "Fuzz Club", kind: "avulsa" }
];

// Ilustração de uma noite no estúdio: não é uma tela do sistema.
export const nightGrid = {
  caption: "Uma terça no estúdio, das 18h à meia-noite",
  startHour: 18,
  endHour: 24,
  rooms: ["Sala 1", "Sala 2", "Sala 3"],
  bookings: nightBookings
};

export type ProductShotImage = {
  src: string;
  alt: string;
  crop?: boolean;
  narrow?: boolean;
};

export type ProductRow = {
  id: string;
  title: string;
  text: string;
  shot: ProductShotImage;
  bubble?: boolean;
};

const productRows: ProductRow[] = [
  {
    id: "agenda",
    title: "Ninguém marca em cima de ninguém",
    text: "As bandas escolhem a sala e os horários livres da semana pelo app e pedem a reserva; o estúdio confirma. Mensalistas e bloqueios já aparecem ocupados, e remarcar ou cancelar um dia de mensalista não mexe no resto do mês.",
    shot: {
      src: "/produto/agenda-bandas.jpg",
      alt: "App de reservas do EstudioHub com quatro dias da Sala 2: horários livres em verde e ocupados em vermelho"
    }
  },
  {
    id: "comanda",
    title: "A comanda fecha no fim da noite",
    text: "Cerveja, corda e baqueta entram na comanda da própria reserva, junto com o valor do ensaio. Na hora de pagar, você divide os itens entre os integrantes da banda e vê quanto ainda falta receber.",
    shot: {
      src: "/produto/comanda.jpg",
      alt: "Divisão de uma comanda no EstudioHub: o ensaio repartido entre três pessoas e o valor em aberto de cada uma"
    }
  },
  {
    id: "recebimento",
    title: "Recebimento no balcão e aviso no WhatsApp",
    text: "Receba por Pix, cartão ou dinheiro, item por item, com o troco calculado. A banda recebe pelo WhatsApp a confirmação da reserva e um lembrete um dia antes do ensaio.",
    shot: {
      src: "/produto/recebimento.jpg",
      alt: "Janela de recebimento do EstudioHub com dois itens selecionados e R$ 65,00 a receber no Pix",
      narrow: true
    },
    bubble: true
  }
];

export const productSection = {
  title: "O que sai do caderno, da planilha e do WhatsApp",
  lead: "Três problemas de toda noite de ensaio, resolvidos no mesmo sistema.",
  rows: productRows
};

// Texto do modelo estudiohub_reserva_aprovada, que o sistema envia quando o estúdio confirma.
export const whatsappConfirmation = {
  caption: "Mensagem que a banda recebe quando o estúdio confirma",
  // A reserva do Lia Trio na grade do topo; {data} vira a próxima terça
  text: "Olá, Lia! Seu ensaio no Estúdio Exemplo está confirmado. ✅\n\nSala: Sala 1\nData: {data}\nHorário: 20:00 às 22:00\nEndereço: Rua Exemplo, 100 - São Paulo/SP\n\nNos vemos em breve!",
  time: "18:42"
};

export const extras = {
  title: "E o resto que o dia a dia pede",
  items: [
    "Painel do dia com as reservas de hoje, as comandas abertas, as pendências e a receita.",
    "Estoque por unidade, com entrada de produtos pelo XML da nota fiscal.",
    "Mensalistas semanais ou quinzenais, com remarcação e cancelamento de um dia só.",
    "Várias unidades na mesma conta, cada uma com suas salas e seu estoque.",
    "Perfis de gestor e de equipe, com histórico das ações importantes.",
    "Integração com o Google Agenda e relatórios para exportar."
  ]
};

export const audience = {
  title: "Feito para quem aluga sala por hora",
  items: [
    { title: "Estúdios de ensaio", text: "Agenda por sala, mensalistas e comanda de consumo na mesma noite." },
    { title: "Estúdios de gravação", text: "Reserva por sala, consumo e financeiro num lugar só, com histórico e relatório." },
    { title: "Escolas de música", text: "Turmas recorrentes como mensalistas, com exceções pontuais e sem planilha paralela." },
    { title: "Podcast e vídeo", text: "Reserva do estúdio, consumo e cobrança num painel só, mesmo com vários horários por dia." }
  ]
};

export const steps = {
  title: "Como começar",
  items: [
    { title: "Conversa de 15 minutos", text: "Pelo WhatsApp, a gente entende como o seu estúdio funciona hoje." },
    { title: "Configuração com você", text: "Salas, preços, mensalistas e equipe, com a gente do lado." },
    { title: promo.trialLabel, text: "Você usa na rotina real, com acompanhamento." },
    { title: "Escolha do plano", text: "Pelo número de salas ativas, sem surpresa no valor." }
  ]
};

export type Plan = {
  name: string;
  rooms: string;
  promoMonthly: string | null;
  monthly: string | null;
  annualInstallments: string | null;
  custom?: string;
};

const plans: Plan[] = [
  {
    name: "Starter",
    rooms: "Até 2 salas",
    promoMonthly: "R$ 29,90",
    monthly: "R$ 99,90",
    annualInstallments: "12x de R$ 74,99 (R$ 899,90)"
  },
  {
    name: "Growth",
    rooms: "De 3 a 5 salas",
    promoMonthly: "R$ 59,90",
    monthly: "R$ 199,90",
    annualInstallments: "12x de R$ 149,99 (R$ 1.799,90)"
  },
  {
    name: "Scale",
    rooms: "De 6 a 10 salas",
    promoMonthly: "R$ 104,90",
    monthly: "R$ 349,90",
    annualInstallments: "12x de R$ 262,49 (R$ 3.149,90)"
  },
  {
    name: "Enterprise",
    rooms: "11 salas ou mais",
    promoMonthly: null,
    monthly: null,
    annualInstallments: null,
    custom: "Sob consulta"
  }
];

// "R$ 29,90 no Starter, R$ 59,90 no Growth e R$ 104,90 no Scale", a partir dos planos com preço promocional
function promoPriceList(list: Plan[]) {
  const items = list.filter((plan) => plan.promoMonthly).map((plan) => `${plan.promoMonthly} no ${plan.name}`);
  return items.length > 1 ? `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}` : items.join("");
}

export const pricing = {
  title: "Preço pelo número de salas",
  lead: `Para estúdios que começarem até ${promo.until}: o primeiro mês é grátis e os três seguintes saem por cerca de 30% do preço.`,
  plans,
  client: "Em uso no Warzone, estúdio de ensaio em Santos (SP), nas unidades Canal 1 e Canal 3."
};

export const faq = {
  title: "Dúvidas",
  items: [
    {
      question: "Como funciona o teste grátis?",
      answer: `São ${promo.trialDays} dias usando o EstudioHub na rotina real do estúdio, sem pagar nada. A gente configura as salas, os preços e os mensalistas com você e acompanha os primeiros dias.`
    },
    {
      question: "Como funciona a promoção?",
      answer: `Para estúdios novos que começarem o teste até ${promo.until}: o primeiro mês é grátis e as três mensalidades seguintes saem por cerca de 30% do preço (${promoPriceList(plans)}). A promoção vale só no plano mensal. A partir do 5º mês, a mensalidade volta ao valor cheio do plano.`
    },
    {
      question: "Como é a migração do que eu uso hoje?",
      answer: "Por etapas: primeiro salas e preços, depois agenda e mensalistas, estoque, usuários e a operação do dia a dia."
    },
    {
      question: "Como funciona a cobrança da assinatura?",
      answer: "Você paga por mês ou por ano, e o anual pode ser parcelado em até 12x sem juros no cartão. A assinatura e as faturas ficam no painel."
    },
    {
      question: "Qual plano eu escolho?",
      answer: "O que cobre o número de salas ativas do seu estúdio: até 2 no Starter, de 3 a 5 no Growth, de 6 a 10 no Scale e a partir de 11 no Enterprise."
    },
    {
      question: "Meus dados ficam seguros?",
      answer: "Cada estúdio só vê os próprios dados, cada pessoa da equipe só acessa o que o perfil dela permite, e as ações importantes ficam registradas no histórico."
    },
    {
      question: "Funciona fora de São Paulo?",
      answer: "Funciona no Brasil todo. A demonstração e o acompanhamento são feitos pelo WhatsApp."
    }
  ]
};

export const contact = {
  title: "Quer ver como fica no seu estúdio?",
  lead: "Em 15 minutos pelo WhatsApp a gente mostra o sistema com as salas e a rotina do seu estúdio.",
  cta: "Agendar demonstração",
  emailIntro: "Prefere email? Escreva para"
};

export const footer = {
  text: "Agenda das salas, comandas e pagamentos do seu estúdio num lugar só."
};
