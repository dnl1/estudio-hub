# EstudioHub Site

Landing page do EstudioHub em Astro, publicada pela Cloudflare Pages como site estático. O build
produz `out/`, preserva as âncoras e a experiência do folheto anterior, e não depende de JavaScript
para exibir conteúdo, preços ou chamadas para ação.

## Requisitos

- Node.js 24 (Astro 7 exige Node.js >=22.23.4)
- npm

## Rodar localmente

```bash
npm ci
npm run dev
```

Abra `http://localhost:4321`.

## Deploy na Cloudflare Pages

A Cloudflare Pages é a hospedagem de produção. Configure o projeto externo com:

- Build command: `npm run build`
- Build output directory: `out`
- Node.js: `24` (defina `NODE_VERSION=24` nas variáveis de ambiente do projeto; o `engines` do
  `package.json` declara apenas o mínimo exigido pelo Astro)

O arquivo `public/_headers` é aplicado pela Cloudflare Pages. Apenas arquivos com hash em `/_astro/`
recebem cache imutável; fontes e imagens públicas usam cache com revalidação. O HTTPS é fornecido
pela hospedagem.

O Azure Static Web Apps é apenas uma opção de portabilidade. `public/staticwebapp.config.json`
repete as políticas de segurança, cache, MIME e 404 para essa plataforma; mantenha-o em sincronia
com `public/_headers`. O servidor local dos testes usa esse JSON para preservar a compatibilidade
do conjunto E2E, mas isso não muda a hospedagem de produção.

## Export estático

```bash
npm run build
npm run start
```

O build gera `out/`, incluindo `index.html`, `404.html`, `robots.txt`, `sitemap.xml`, imagens,
fontes self-hosted, `_headers` e o config secundário do Azure. `npm run start` e `npm run preview`
usam o preview do Astro. Para conferir também os cabeçalhos do servidor E2E e o status do 404, use
`node e2e/serve-out.mjs` e abra `http://127.0.0.1:4300`.

## Verificações

```bash
npx playwright install chromium
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

`test:e2e` faz o build, serve `out/` num servidor estático mínimo (`e2e/serve-out.mjs`) e roda os
testes de `e2e/` com Playwright sob os cabeçalhos do Azure, incluindo CSP. A suíte também valida as
regras reais declaradas em `public/_headers`, inclusive a política de cache imutável dos assets
hashados. A CI usa Node.js 24 e instala o Chromium com suas dependências de sistema. Os testes
verificam também SEO, JSON-LD, robots, sitemap, 404 e navegação sem JavaScript.

## Estrutura

A página única em `/` mantém as seções navegáveis por âncora:

- `#topo`: título, botão de demonstração e grade da noite
- `#como-funciona`
- `#tambem-tem`
- `#para-quem`
- `#como-comecar`
- `#precos`
- `#duvidas`
- `#contato`

O texto da página fica em `src/components/site-content.ts`. Componentes Astro ficam em
`src/components/`, scripts de melhoria progressiva em `src/scripts/` e o CSS em `src/styles/global.css`.

O domínio de produção é `https://estudio-hub.com/`. Metadados e JSON-LD ficam em `src/layouts/Layout.astro`;
`public/robots.txt` e `public/sitemap.xml` são estáticos e devem ser atualizados se novas páginas
forem criadas. A página 404 tem `noindex` e não entra no sitemap.

As fontes Archivo estão em `public/fonts/`, com a licença OFL. Os PNGs de compartilhamento e ícones
estão em `public/`; são arquivos estáticos, sem geração em runtime.

O design segue `docs/superpowers/specs/2026-10-15-landing-grade-da-noite-design.md`.
Os planos em `docs/superpowers/` são históricos e citam caminhos Next.js; os caminhos e comandos
atuais estão neste README e em `AGENTS.md`.

As imagens de `public/produto/` são capturas reais, com dados fictícios. Para refazer, siga
`scripts/product-screens/README.md`.
