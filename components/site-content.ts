export type LinkItem = {
  href: string;
  label: string;
};

export const navLinks: LinkItem[] = [
  { href: "#home", label: "Home" },
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#planos", label: "Planos" },
  { href: "#para-quem", label: "Para Quem" },
  { href: "#integracoes", label: "Integrações" },
  { href: "#seguranca", label: "Confiança" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato / Demo" }
];

export const modules = [
  {
    title: "Agenda Inteligente de Salas",
    description:
      "Controle reservas avulsas, bloqueios de sala e contratos recorrentes em calendário único, com prevenção de conflito e visão real de disponibilidade."
  },
  {
    title: "Mensalistas com Exceções",
    description:
      "Gerencie recorrência semanal com ajustes pontuais sem planilha paralela, mantendo previsibilidade da ocupação ao longo do mês."
  },
  {
    title: "Comandas Integradas ao Ensaio",
    description:
      "Abra comandas vinculadas à reserva, mensalista ou avulsa, registre consumo por item, faça split por participante e feche com validações."
  },
  {
    title: "Estoque por Unidade",
    description:
      "Acompanhe produtos, categorias, saldo por estúdio e movimentações com trilha auditável para reduzir ruptura e divergência de saldo."
  },
  {
    title: "Entrada rápida de produtos",
    description:
      "Agilize a entrada de mercadorias e mantenha o estoque atualizado sem processos demorados."
  },
  {
    title: "Pagamentos e Conciliação",
    description:
      "Acompanhe pagamentos em um só painel e reduza falhas de conferência no fechamento."
  },
  {
    title: "Comunicação via WhatsApp",
    description:
      "Envie confirmações, lembretes, cancelamentos e avisos de pagamento recebido, com histórico de envio por status."
  },
  {
    title: "Gestão Multiunidade",
    description:
      "Centralize unidades e equipe em uma visão única para expandir com mais controle."
  },
  {
    title: "Auditoria e Relatórios",
    description:
      "Tenha histórico e indicadores para acompanhar resultados e tomar decisões com confiança."
  }
];

export const howItWorks = [
  "1. Configure unidades, salas e regras da sua operação em poucos passos.",
  "2. Organize agenda e mensalistas em poucos cliques, sem conflito de horário.",
  "3. Registre consumo e estoque durante o atendimento, sem perder informações.",
  "4. Acompanhe pagamentos, notificações e indicadores em uma visão central."
];

export const benefits = [
  "Menos falhas operacionais e menos retrabalho.",
  "Mais controle de receita por ensaio e por unidade.",
  "Equipe alinhada com processos padronizados.",
  "Decisões mais rápidas com dados confiáveis.",
  "Crescimento com organização para operações com mais de uma unidade.",
  "Centralização de agenda, consumo, estoque e cobrança."
];

export const useCases = [
  {
    title: "Estúdios de ensaio musical",
    description:
      "Controle agenda por sala, consumo por atendimento e operação diária com previsibilidade."
  },
  {
    title: "Estúdios de gravação",
    description:
      "Padronize reservas por ambiente e mantenha controle financeiro do dia a dia."
  },
  {
    title: "Escolas de música",
    description:
      "Organize recorrência de turmas e contratos mensais com ajustes de exceção."
  },
  {
    title: "Espaços criativos",
    description:
      "Gerencie ambientes compartilhados com reservas avulsas e regras de acesso por equipe."
  }
];

export const plans = [
  {
    title: "Start",
    subtitle: "Para operação inicial",
    points: [
      "Ideal para 1 unidade com poucas salas.",
      "Agenda, comandas, estoque e operação base.",
      "Trial para validação de rotina."
    ]
  },
  {
    title: "Growth",
    subtitle: "Para operação em expansão",
    points: [
      "Mais capacidade por quantidade de salas.",
      "Integrações operacionais e relatórios avançados.",
      "Mais controle para gestão da equipe."
    ]
  },
  {
    title: "Scale",
    subtitle: "Para expansão",
    points: [
      "Gestão central de unidades e equipe.",
      "Fluxos administrativos centralizados.",
      "Recomendado para operação com alta demanda."
    ]
  }
];
