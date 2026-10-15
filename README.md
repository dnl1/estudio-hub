# EstudioHub Site

Landing page do EstudioHub em Next.js, exportada como site estático (`output: "export"`) e publicada
pela Cloudflare Pages a cada push na `main`.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Export estático

```bash
npm run build
```

Arquivos gerados em `out/`.

## Testes

```bash
npm run lint
npm run test:e2e
```

`test:e2e` faz o build, serve `out/` num servidor estático mínimo (`e2e/serve-out.mjs`) e roda os
testes de `e2e/` com Playwright.

## Estrutura

Página única em `/`, com seções navegáveis por âncora:

- `#topo`: título, botão de demonstração e a grade da noite
- `#como-funciona`: três problemas, com telas reais do produto
- `#tambem-tem`
- `#para-quem`
- `#como-comecar`
- `#precos`
- `#duvidas`
- `#contato`

O texto da página fica todo em `components/site-content.ts`. O design segue
`docs/superpowers/specs/2026-10-15-landing-grade-da-noite-design.md`.

## Telas do produto

As imagens de `public/produto/` são capturas reais, com dados fictícios. Para refazer, siga
`scripts/product-screens/README.md`.
