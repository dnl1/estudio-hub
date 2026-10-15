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
  celular; a página mostra o produto de verdade; tem preço e um cliente real; fica mais curta que
  hoje no computador (hoje 7.042 px em 1440×900) e pelo menos 30% mais curta no celular, de onde
  vem a maior parte das visitas (hoje 11.683 px em 390×844). A meta inicial de "metade" não cabe
  com as 7 seções e as 3 telas reais aprovadas; a estimativa da nova página é ~6.000 px no
  computador e ~6.900 px no celular.

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
2. **Três problemas, três telas.** Uma linha por problema, com o texto de um lado e uma tela real
   do produto do outro (empilhados no celular):
   - **Agenda:** as bandas escolhem a sala e os horários livres da semana no app e pedem a
     reserva; o estúdio confirma. Mensalistas e bloqueios já aparecem ocupados. Tela: a grade
     semanal do app das bandas.
   - **Comanda:** consumo lançado na comanda da reserva, junto com o ensaio, e dividido entre os
     integrantes, com o saldo que falta receber. Tela: a comanda no admin.
   - **Recebimento e avisos:** recebimento no balcão por Pix, cartão ou dinheiro, item por item,
     com troco; confirmação da reserva e lembrete na véspera pelo WhatsApp. Telas: a janela
     "Receber itens selecionados" do admin, mais o texto real do modelo de confirmação do
     WhatsApp (`estudiohub_reserva_aprovada`) num balão desenhado em HTML.
   - Nada de prometer pagamento online pela banda: o app ainda não cobra na reserva.
3. **Também tem:** lista em duas colunas, sem caixas:
   - painel do dia (reservas de hoje, comandas abertas, pendências, receita);
   - estoque por unidade, com entrada de produtos pelo XML da nota fiscal;
   - mensalistas semanais ou quinzenais, com remarcação e cancelamento de um dia só;
   - várias unidades na mesma conta;
   - perfis de gestor e equipe, com histórico das ações importantes;
   - integração com Google Agenda e relatórios para exportar.
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
  - Celular: logo, "Agendar demonstração" compacto e ☰. Abaixo de 450 px de largura o botão não
    cabe ao lado do logo com folga e sai do topo; o botão do primeiro bloco e a barra fixa cobrem esse caso.
  - Computador (a partir de 900 px): links "Como funciona", "Preços", "Dúvidas", mais "Entrar" e
    o botão.
  - Os 183 px de topo no celular viram uma linha só, fixa no alto ao rolar.
- **A grade da noite é ilustração:** ela mostra uma noite do estúdio (várias salas, bandas e
  tipos de reserva) e não é apresentada como uma tela do sistema. A grade real do produto é a do
  app das bandas, que aparece como captura na seção 2.

## Telas do produto (capturas)

As telas da seção 2 são capturas reais do produto (admin e app das bandas), feitas com Playwright
num ambiente 100% local e com dados fictícios. Nenhum dado de cliente real entra no site.

- **Código:** clones novos da `main` do GitHub de `StudioScheduler`, `studio-scheduler-admin` e
  `studio-scheduler-customer` numa pasta temporária. É a versão que está em produção. As cópias de
  trabalho em `/Users/danilo/work/repos/studio-scheduler/` não são tocadas (estão em branches de
  outra sessão), nem as pastas de build delas.
- **Banco:** um banco novo `landing_demo` no container `studioscheduler-db` já existente. Não
  mexe no banco `postgres` nem nos outros bancos locais.
- **Schema:** criado rodando `StudioScheduler.Migrations` contra `landing_demo`. O seed padrão dele
  traz a organização real (Warzone); o script de dados fictícios renomeia tudo (organização
  "Estúdio Exemplo", unidades "Unidade Centro" e "Unidade Norte", salas "Sala 1" a "Sala 3") e
  desativa o usuário real, sem escrever nenhum dado pessoal no repositório do site.
- **Dados fictícios** (`scripts/product-screens/demo-seed.sql`): licença gratuita ativa, uma
  gestora fictícia, salas com disponibilidade e preço, reservas avulsas e pendentes na próxima
  semana da Sala 2, dois mensalistas, um bloqueio, e a comanda de hoje da Sala 1 com ensaio,
  produtos e divisão entre três pessoas. O script se recusa a rodar fora do banco `landing_demo`.
- **Execução:** API local na porta 5150, admin na 5184 e app das bandas na 5185 (a 5183 é usada
  pelos testes do app das bandas). Travas antes de qualquer captura: API em host local,
  `database-target` igual a `LOCAL` e organização com o nome fictício (o `database-target` não
  olha o nome do banco). Só requisições para `localhost` passam; o resto é bloqueado.
- **Capturas** (`scripts/product-screens/capture.mjs`), em 2x e em JPEG (até 350 KB cada, para não pesar no celular):
  - `public/produto/agenda-bandas.jpg`: a grade semanal da Sala 2 no app das bandas.
  - `public/produto/comanda.jpg`: a comanda da Sala 1 no admin.
  - `public/produto/recebimento.jpg`: a janela "Receber itens selecionados", sem confirmar o
    recebimento.
- **Se o ambiente local falhar em algum ponto:** paro e aviso antes de buscar outro caminho. Nada de
  logar no admin de produção.

## Conteúdo confirmado pelo Danilo (2026-10-15)

- **Warzone:** "Em uso no Warzone, estúdio de ensaio em Santos (SP), nas unidades Canal 1 e
  Canal 3." Sem depoimento; nenhuma frase será inventada.
- **Preços:** os valores da tabela acima são os de produção.
- **App de reservas das bandas** (app.estudio-hub.com): as bandas reservam sozinhas pelo app.
  Vira a primeira linha da seção 2, com a captura da grade semanal.

## Técnico

- Mesmo projeto: Next 15.5 com export estático e CSS em `app/globals.css`, reescrito com os
  tokens acima.
- O conteúdo continua em `components/site-content.ts`.
- **Componentes novos:**
  - `components/night-grid.tsx`: grade do topo, em HTML/CSS. Só a linha "agora"
    (`components/playhead.tsx`) usa JS (cliente), calculando a hora de São Paulo.
  - `components/sticky-cta.tsx`: barra fixa do celular, com `IntersectionObserver`.
  - `components/whatsapp.tsx`: link da demonstração, botão e ícone.
  - `components/product-shot.tsx`: moldura das capturas, com o tamanho lido do próprio arquivo JPEG.
  - `components/whatsapp-bubble.tsx`: balão com o texto real do modelo de confirmação.
- **Imagens:** o monograma e a prévia de link (`components/brand-image.tsx`) passam para o Azul
  sólido e a Archivo Narrow (`@fontsource/archivo-narrow`, no lugar do `@fontsource/sora`).
- **Sem dependências novas em produção:** a fonte do site vem do `next/font/google`. Em
  desenvolvimento entram `@playwright/test` 1.63.0 (testes; usa o Chromium já baixado nesta
  máquina) e `@fontsource/archivo-narrow` (imagens geradas no build).
- **Testes:** `npm run test:e2e` faz o build, serve `out/` num servidor estático mínimo
  (`e2e/serve-out.mjs`) e roda os testes de `e2e/`.

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
- **Altura da página:** menor que 7.042 px em 1440×900 e menor que 8.178 px (−30%) em 390×844.
- **Em todo commit:** `npm run lint` e `npm run build` passando.
- **Entrega:** prints no computador e no celular, e o link de prévia da Cloudflare da branch.
  Merge na `main` só com aprovação explícita, porque publica em produção.

## Fora do escopo

- Blog e páginas extras.
- Formulário de contato. O canal continua sendo o WhatsApp e o email.
- Mudanças no admin ou na API.
- Analytics e pixels de anúncio.
