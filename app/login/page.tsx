import Link from "next/link";
import { PageIntro } from "@/components/site-chrome";

export default function LoginPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Login"
        title="Acesse sua operação no EstudioHub."
        description="Entre na plataforma para gerenciar agenda, comandas, estoque e governança da sua organização."
      />

      <section className="container section cta-final">
        <h2>Área de acesso da plataforma</h2>
        <p>
          Para ambiente de produção e suporte de acesso, fale com nosso time comercial/implantação.
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/contato">
            Solicitar acesso
          </Link>
        </div>
      </section>
    </main>
  );
}
