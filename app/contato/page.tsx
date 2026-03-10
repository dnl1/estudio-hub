import { PageIntro } from "@/components/site-chrome";

export default function ContactPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Contato / Demo"
        title="Solicite uma demonstração com diagnóstico operacional."
        description="Preencha os dados abaixo para receber uma avaliação do seu cenário atual e recomendação de implantação."
      />

      <section className="container section">
        <form className="contact-form" aria-label="Formulário de contato comercial">
          <label htmlFor="nome">Nome</label>
          <input id="nome" name="nome" type="text" placeholder="Seu nome" />

          <label htmlFor="empresa">Nome do estúdio / empresa</label>
          <input id="empresa" name="empresa" type="text" placeholder="Ex.: Estúdio Exemplo" />

          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" placeholder="voce@empresa.com" />

          <label htmlFor="telefone">WhatsApp</label>
          <input id="telefone" name="telefone" type="tel" placeholder="(11) 90000-0000" />

          <label htmlFor="salas">Quantidade de salas</label>
          <select id="salas" name="salas" defaultValue="">
            <option value="" disabled>
              Selecione
            </option>
            <option value="1-3">1 a 3 salas</option>
            <option value="4-10">4 a 10 salas</option>
            <option value="11-20">11 a 20 salas</option>
            <option value="20+">20+ salas</option>
          </select>

          <label htmlFor="diagnostico">Principal desafio operacional hoje</label>
          <textarea
            id="diagnostico"
            name="diagnostico"
            rows={5}
            placeholder="Conte rapidamente como estão agenda, comandas, estoque, pagamentos e gestão entre unidades."
          />

          <button type="submit" className="btn btn-primary">
            Quero uma demonstração
          </button>
        </form>
      </section>
    </main>
  );
}
