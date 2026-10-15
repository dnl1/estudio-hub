# Landing page "grade da noite": design

Data: 2026-10-15. Direção aprovada pelo Danilo na conversa da mesma data.

## Objetivo

Transformar estudio-hub.com de folheto institucional em landing page que converte dono de estúdio em
**demonstração agendada pelo WhatsApp**.

- **Quem chega:** donos e gestores de estúdios de ensaio (principal), gravação, escolas de música e
  estúdios de podcast/vídeo, no Brasil todo. A maior parte vem da prospecção por WhatsApp, então
  lê no celular.
- **O que a página promete:** o mesmo que a mensagem de prospecção. Agenda das salas, comandas e
  pagamentos num lugar só; fim do conflito de horário e do consumo que não fecha no fim do mês;
  teste grátis assistido; demonstração de 15 min.
- **Sucesso:** o botão "Agendar demonstração" aparece na primeira tela e fica sempre ao alcance no
  celular; a página mostra o produto de verdade; tem preço e um cliente real; fica com menos da
  metade da rolagem de hoje (hoje: 7,8 telas no computador, 13,8 no celular).

## Diagnóstico da versão atual (resumo)

- 0 imagens, 41 caixas de texto, 870 palavras; o produto nunca aparece.
- 12 seções com a mesma forma (rótulo em caixa alta, título, grade de caixas); topo, "Solução" e
  "Benefícios" repetem a mesma ideia.
- O WhatsApp só aparece no fim (6.685 px no computador, 11.101 px no celular); o botão principal
  leva a um `mailto`.
- "Grátis" e "15 min" não aparecem em lugar nenhum.
- Visual de modelo pronto: azul-marinho, degradê azul-verde, caixas iguais.

## Conceito

O topo é a agenda de uma noite de ensaios desenhada como a linha do tempo de uma DAW: as salas são
as faixas, as reservas são os blocos e uma linha vertical marca "agora". Esse é o único elemento
ousado da página; o resto fica calmo e direto.

## Tokens

### Cores

| Nome     | Hex       | Uso                                                        |
|----------|-----------|------------------------------------------------------------|
| Papel    | `#FFFFFF` | Fundo da página                                            |
| Espuma   | `#EDEEF0` | Seções alternadas, fundo das molduras de tela              |
| Tinta    | `#1F2125` | Texto, botão principal, fundo da grade                     |
| Azul     | `#3366FF` | Marca, links, reservas de mensalistas                      |
| Âmbar    | `#F5B700` | Reservas avulsas                                           |
| Vermelho | `#E5484D` | Bloqueios (sempre com hachura, nunca só a cor)             |

- Texto secundário: Tinta com 70% de opacidade sobre Papel. Precisa passar 4,5:1.
- O verde do WhatsApp (`#25D366`) aparece só no ícone do botão.
- Sem degradês. O monograma "EH" e a imagem de prévia passam a usar o Azul sólido.
- Na grade, a cor do bloco sempre vem acompanhada do texto do tipo (mensal, avulsa, bloqueio).
  Cor nunca é a única pista.
- Contraste dos blocos:
  - Azul: texto branco (~4,7:1).
  - Âmbar: texto Tinta (~9:1).
  - Vermelho não passa 4,5:1 nem com branco (~3,9:1) nem com Tinta (~4,1:1). Por isso o bloqueio
    é hachura e borda vermelhas sobre o fundo Tinta da grade, com o texto em branco sobre Tinta.

### Tipografia

- **Família única:** Archivo (Google Fonts, variável em peso e largura), carregada pelo
  `next/font/google` com o eixo `wdth`. Saem Sora e Manrope.
- **Títulos:** largura ~75 (condensada), peso 800, em frase normal (sem caixa alta).
- **Texto:** largura 100, peso 400, até ~65 caracteres por linha.
- **Etiquetas da grade:** largura ~75, peso 600.
- **Escala:** 14 / 16 / 18 / 21 / 24 / 36 / 48 / 72 px. O H1 vai de 40 px no celular a 72 px no
  computador; o texto base tem 17 px no celular e 18 px no computador.
- **Sem rótulos em caixa alta acima dos títulos:** o título de cada seção carrega o conteúdo.

### Layout

- Tudo alinhado à esquerda. Coluna de texto até ~65 caracteres. A grade do topo ocupa a largura
  inteira do conteúdo.
- Raio de canto por hierarquia: blocos da grade 4 px, botões 8 px, molduras de tela 12 px.
- Sombra só nas molduras das telas do produto.

### Movimento

- Um único momento: ao carregar, a linha "agora" corre do início da grade até a hora atual de
  São Paulo (ou até 21h, fora do horário da grade), uma vez, em ~1,2 s.
- Com `prefers-reduced-motion`, a linha aparece parada.
- As dúvidas abrem e fecham (`<details>`), o que é movimento disparado pela pessoa.

## Estrutura (12 → 7 seções)

1. **Topo com a grade da noite.**
   - H1: "A agenda das salas, as comandas e os pagamentos do seu estúdio num lugar só."
   - Linha de apoio: "Sem conflito de horário e sem consumo que não fecha no fim do mês."
   - Botão "Agendar demonstração de 15 min", com a linha "14 dias grátis, com a gente
     acompanhando".
   - Abaixo, a grade de uma terça das 18h às 00h: 3 salas, com reservas mensais, avulsas, um
     bloqueio de manutenção e uma comanda presa a uma reserva.
   - Nomes de bandas fictícios.
2. **Três problemas, três telas.** Uma linha por problema, com o texto de um lado e a tela real do
   admin do outro (empilhados no celular):
   - **Agenda:** conflito de horário impossível; mensalistas com exceção pontual.
   - **Comanda:** consumo lançado na reserva, dividido entre os integrantes, fechado com
     validação.
   - **Pagamento:** PIX por Mercado Pago ou PagBank; confirmação e lembrete pelo WhatsApp.
3. **Também tem:** lista em duas colunas, sem caixas:
   - estoque por unidade;
   - entrada de produtos importando o XML da nota fiscal;
   - várias unidades;
   - perfis e permissões;
   - relatórios e auditoria;
   - integração com Google Agenda;
   - app de reservas para as bandas.
4. **Para quem:** ensaio, gravação, escola de música, podcast/vídeo, uma linha de texto para cada.
5. **Como começar.** Sequência real, por isso numerada:
   1. Conversa de 15 min pelo WhatsApp.
   2. A gente configura suas salas, preços e mensalistas com você.
   3. 14 dias de teste grátis, com acompanhamento.
   4. Você escolhe o plano pelo número de salas.
6. **Preços e dúvidas.**
   - **Planos:** os mesmos nomes do produto (Starter, Growth, Scale, Enterprise), por número de
     salas ativas. O preço mensal fica em destaque, com semestral e anual embaixo.
   - **Prova social:** uma linha com o cliente real (ver "Conteúdo confirmado").
   - **Dúvidas** que abrem e fecham: teste grátis, migração, cobrança da assinatura, como escolher
     o plano, segurança dos dados.
7. **Chamada final e rodapé.** WhatsApp como botão principal; email como opção; "Entrar" para
   clientes no rodapé e no topo.

**Saem:** "Sobre", "Benefícios", "Solução", "Confiança" (vira uma dúvida), as 3 caixas do topo e
os 12 rótulos em caixa alta.

## Preços (fonte: `StudioScheduler.Migrations/SeedData.cs`, que o deploy do backend regrava)

| Plano      | Salas ativas | Mensal     | Semestral                   | Anual                         |
|------------|--------------|------------|-----------------------------|-------------------------------|
| Teste      | —            | grátis por 14 dias | —                   | —                             |
| Starter    | até 2        | R$ 99,90   | R$ 499,90 (R$ 83,32/mês)    | R$ 899,90 (R$ 74,99/mês)      |
| Growth     | 3 a 5        | R$ 199,90  | R$ 999,90 (R$ 166,65/mês)   | R$ 1.799,90 (R$ 149,99/mês)   |
| Scale      | 6 a 10       | R$ 349,90  | R$ 1.749,90 (R$ 291,65/mês) | R$ 3.149,90 (R$ 262,49/mês)   |
| Enterprise | 11 ou mais   | sob consulta | —                         | —                             |

## Chamada para ação

- Um nome só em todo lugar: **"Agendar demonstração"** (topo, grade, barra fixa no celular,
  chamada final).
- Link: `https://wa.me/5511974571064?text=` com a mensagem "Oi! Quero agendar a demonstração de
  15 min do EstudioHub." (codificada na URL).
- Ícone oficial do WhatsApp em SVG no lugar do "W" improvisado.
- **Barra fixa no rodapé do celular:** aparece depois que o botão do topo sai da tela e some na
  chamada final.
- **Topo da página:**
  - Celular: logo, "Agendar demonstração" compacto e ☰.
  - Computador: links "Como funciona", "Preços", "Dúvidas", mais "Entrar" e o botão.
  - Os 183 px de topo no celular viram uma linha só.

## Telas do produto (capturas)

As telas da seção 2 são capturas reais do admin, feitas com Playwright num ambiente 100% local e
com dados fictícios. Nenhum dado de cliente real entra no site.

- **Banco:** um banco novo `landing_demo` no container `studioscheduler-db` já existente. Não
  mexe no banco `postgres` nem nos outros bancos locais, que têm trabalho de outras sessões em
  andamento.
- **Schema:** criado rodando `StudioScheduler.Migrations` contra `landing_demo`.
- **Dados fictícios:** um estúdio "Estúdio Demonstração" com 3 salas, bandas fictícias, reservas
  avulsas e mensais com uma exceção, uma comanda com itens e divisão, e produtos no estoque.
- **API e admin:** a API local na porta 5150 e o admin (vite) na porta 5183, apontando para essa
  API. Mesmas travas dos testes fullstack: só host local e `database-target` igual a `LOCAL`.
- **Repositórios do sistema:** `StudioScheduler` e `studio-scheduler-admin` são usados só para
  leitura e execução. Nenhum arquivo deles é alterado, e as branches atuais (que são de outra
  sessão) ficam como estão. Se for preciso, o código roda a partir de um `git worktree` separado.
- **Arquivos gerados:** as capturas vão para `public/produto/` no site, em PNG ou WebP,
  dimensionadas para 2x, com `alt` descritivo.
- **Se o ambiente local falhar em algum ponto:** paro e aviso antes de buscar outro caminho. Nada de
  logar no admin de produção.

## Conteúdo confirmado pelo Danilo (2026-10-15)

- **Warzone:** "Em uso no Warzone, estúdio de ensaio em Santos (SP), nas unidades Canal 1 e
  Canal 3." Sem depoimento; nenhuma frase será inventada.
- **Preços:** os valores da tabela acima são os de produção.
- **App de reservas das bandas** (app.estudio-hub.com): as bandas reservam sozinhas pelo app.
  Entra em "Também tem".

## Técnico

- Mesmo projeto: Next 15.5 com export estático e CSS em `app/globals.css`, reescrito com os
  tokens acima.
- O conteúdo continua em `components/site-content.ts`.
- **Componentes novos:**
  - `components/night-grid.tsx`: grade do topo, em HTML/CSS. Só a linha "agora" usa JS (cliente),
    calculando a hora de São Paulo.
  - `components/sticky-cta.tsx`: barra fixa do celular, com `IntersectionObserver`.
  - `components/whatsapp-link.tsx`: link e ícone.
- **Imagens:** o monograma e a prévia de link (`components/brand-image.tsx`) passam para o Azul
  sólido.
- **Sem dependências novas no site:** a fonte vem do `next/font/google`.

## Verificação

- O teste de navegador do topo é reaproveitado e ampliado, nas larguras 320, 390, 720, 721, 1024,
  1101, 1200, 1280, 1366, 1440 e 1920. Ele verifica:
  - nada de rolagem horizontal;
  - nada saindo da tela;
  - o botão "Agendar demonstração" visível na primeira tela;
  - a barra fixa aparecendo e sumindo no celular;
  - todos os links do WhatsApp com a mensagem pronta.
- **Acessibilidade:**
  - foco visível navegando só com o teclado;
  - contraste de todos os pares de cor dos tokens ≥ 4,5:1 para texto (calculado);
  - `prefers-reduced-motion` respeitado;
  - a grade legível por leitor de tela, como uma lista de reservas.
- **Altura da página:** menos da metade da atual nas duas larguras de referência (1440 e 390).
- **Em todo commit:** `npm run lint` e `npm run build` passando.
- **Entrega:** prints no computador e no celular, e o link de prévia da Cloudflare da branch.
  Merge na `main` só com aprovação explícita, porque publica em produção.

## Fora do escopo

- Blog e páginas extras.
- Formulário de contato. O canal continua sendo o WhatsApp e o email.
- Mudanças no admin ou na API.
- Analytics e pixels de anúncio.
