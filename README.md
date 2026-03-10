# EstudioHub Site

Site institucional completo em Next.js para posicionamento comercial do EstudioHub.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Export estático

O projeto está configurado como static export (`output: "export"`).

```bash
npm run build
```

Arquivos gerados em `out/`.

## Estrutura

SPA de página única em `/`, com seções navegáveis por âncora:

- `#home`
- `#funcionalidades`
- `#planos`
- `#para-quem`
- `#integracoes`
- `#seguranca`
- `#sobre`
- `#contato`
