export type LinkItem = {
  href: string;
  label: string;
};

export const navLinks: LinkItem[] = [
  { href: "/", label: "Home" },
  { href: "/funcionalidades", label: "Funcionalidades" },
  { href: "/planos", label: "Planos" },
  { href: "/para-quem", label: "Para Quem" },
  { href: "/integracoes", label: "Integrações" },
  { href: "/seguranca-governanca", label: "Segurança" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato / Demo" }
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
    title: "Importação XML NF-e",
    description:
      "Dê entrada de mercadoria com importação de XML em minutos, com tentativa de vínculo por produto e sinalização de itens que exigem mapeamento."
  },
  {
    title: "Pagamentos e Conciliação",
    description:
      "Configure gateway por organização, acompanhe checkout e webhooks com rastreio de transações e histórico confiável de eventos de pagamento."
  },
  {
    title: "Comunicação via WhatsApp",
    description:
      "Envie confirmações, lembretes, cancelamentos e avisos de pagamento recebido, com histórico de envio por status."
  },
  {
    title: "Gestão Multiunidade",
    description:
      "Administre organizações, unidades, usuários e permissões com troca de organização ativa e operação centralizada."
  },
  {
    title: "Auditoria e Relatórios",
    description:
      "Mantenha trilha de ações sensíveis, geração assíncrona de relatórios e visão operacional para decisões mais rápidas."
  }
];

export const howItWorks = [
  "1. Configure sua organização, unidades, salas e integrações operacionais.",
  "2. Organize agenda e mensalistas em poucos cliques, sem conflito de horário.",
  "3. Registre consumo e estoque durante o atendimento, com histórico completo.",
  "4. Acompanhe pagamentos, notificações e indicadores em uma visão central."
];

export const benefits = [
  "Menos falhas operacionais e menos retrabalho.",
  "Mais controle de receita por ensaio e por unidade.",
  "Equipe alinhada com processos padronizados.",
  "Decisões mais rápidas com dados confiáveis.",
  "Escala com governança para operações multiunidade.",
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
      "Padronize reservas por ambiente e mantenha rastreabilidade financeira-operacional."
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
      "Mais governança para gestão de equipe."
    ]
  },
  {
    title: "Scale",
    subtitle: "Para multiunidade",
    points: [
      "Gestão global de organizações e unidades.",
      "Fluxos administrativos centralizados.",
      "Recomendado para operação com alta demanda."
    ]
  }
];
