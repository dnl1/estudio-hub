# Promoção de entrada no site: plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** O site anuncia a promoção de entrada (1º mês grátis e 3 mensalidades com cerca de 30% do preço, para quem começar o teste até 31/03/2027) na seção de preços, no topo, no Como começar, nas dúvidas, na descrição da página e na imagem de compartilhamento.

**Architecture:** Todo o texto continua em `components/site-content.ts`, agora com um objeto `promo` que concentra a copy da promoção. `app/page.tsx` troca o bloco de preço de cada plano pelo layout da versão A (selo, preço promocional, janela "do 2º ao 4º mês" e duas linhas pequenas com o preço cheio e o anual em 12x). O semestral sai do site.

**Tech Stack:** Next 15 com `output: "export"`, React 19, CSS em `app/globals.css`, testes Playwright em `e2e/` (`npm run test:e2e` faz o build e serve `out/`).

**Spec:** `studio-scheduler/StudioScheduler/docs/superpowers/specs/2026-10-20-promocao-de-entrada-design.md`, seções "A oferta" e "Site (`estudio-hub`)".

## Global Constraints

- Push na `main` publica o site (Cloudflare Pages). Trabalhe num branch e só faça merge quando o backend já cobrar o preço promocional (plano do backend concluído e no ar).
- Valores exatos: Starter R$ 29,90 / R$ 99,90 / 12x de R$ 74,99 (R$ 899,90); Growth R$ 59,90 / R$ 199,90 / 12x de R$ 149,99 (R$ 1.799,90); Scale R$ 104,90 / R$ 349,90 / 12x de R$ 262,49 (R$ 3.149,90); Enterprise "Sob consulta".
- Data: "31 de março de 2027" no texto corrido.
- Toda a copy da promoção fica em `components/site-content.ts`.
- As linhas pequenas usam `--tinta-suave` sobre `--papel` (par já coberto por `e2e/contrast.spec.ts`), com `font-size: 0.75rem` (12 px). Não usar cor mais clara.
- Sem rolagem horizontal em nenhuma largura de `WIDTHS` (`e2e/page.spec.ts` já confere).
- Commits no estilo do repositório: `feat: ...` / `fix: ...` em português.

## Review Focus

- Largura de 320 px: selo, preço de R$ 104,90 e a linha "Ou plano anual em 12x de R$ 262,49 (R$ 3.149,90)" cabem sem rolagem horizontal (coberto por `e2e/page.spec.ts`; confira visualmente na Task 1).
- Sem JavaScript: a seção de preços mostra o preço promocional e o preço cheio (teste novo na Task 1).
- Enterprise sem selo fica alinhado com os outros planos no computador (sem selo, o título não pode subir acima dos vizinhos; confira na captura da Task 1).
- Leitor de tela: o selo "1º mês grátis" é lido antes do nome do plano. A ordem no HTML precisa ser selo, nome, salas, preço (teste na Task 1 confere a ordem do texto).
- A imagem de compartilhamento continua com 1200×630 e os cantos na cor da marca depois da troca do texto (`e2e/brand.spec.ts` já confere).

---

### Task 1: Seção de preços na versão A

**Files:**
- Modify: `components/site-content.ts:152-187` (tipo `Plan`, `plans`, `pricing`) e acrescentar o objeto `promo` logo antes de `hero`
- Modify: `app/page.tsx:100-137` (seção `#precos`)
- Modify: `app/globals.css:852-915` (bloco "Preços")
- Test: `e2e/pricing.spec.ts`, `e2e/page.spec.ts:41-48`

**Interfaces:**
- Produces (em `components/site-content.ts`):

```ts
export const promo = {
  trialLabel: "1º mês grátis", // selo dos planos; a Task 2 reaproveita no topo, no Como começar, na descrição e na imagem
  window: "do 2º ao 4º mês",
  until: "31 de março de 2027"
};

export type Plan = {
  name: string;
  rooms: string;
  promoMonthly: string | null; // "R$ 29,90"
  monthly: string | null; // "R$ 99,90"
  annualInstallments: string | null; // "12x de R$ 74,99 (R$ 899,90)"
  custom?: string; // só Enterprise
};
```

- `pricing.lead` = `` `Para estúdios que começarem até ${promo.until}: o primeiro mês é grátis e os três seguintes saem por cerca de 30% do preço.` ``
- O campo `cycles` sai do tipo e dos dados (o semestral não aparece mais).

- [ ] **Step 1: Atualize `e2e/pricing.spec.ts` para o layout novo**

Substitua o teste "preços batem com os planos do sistema" por:

```ts
test("preços mostram a promoção, o preço cheio e o anual em 12x", async ({ page }) => {
  await open(page, 1280);
  const section = page.locator("#precos");
  await expect(section.locator(".section-head p")).toHaveText(
    "Para estúdios que começarem até 31 de março de 2027: o primeiro mês é grátis e os três seguintes saem por cerca de 30% do preço."
  );
  const plans = section.locator(".plan");
  await expect(plans.locator("h3")).toHaveText(["Starter", "Growth", "Scale", "Enterprise"]);
  const expected = [
    ["Até 2 salas", "R$ 29,90", "Depois, R$ 99,90 por mês", "Ou plano anual em 12x de R$ 74,99 (R$ 899,90)"],
    ["De 3 a 5 salas", "R$ 59,90", "Depois, R$ 199,90 por mês", "Ou plano anual em 12x de R$ 149,99 (R$ 1.799,90)"],
    ["De 6 a 10 salas", "R$ 104,90", "Depois, R$ 349,90 por mês", "Ou plano anual em 12x de R$ 262,49 (R$ 3.149,90)"]
  ];
  for (const [index, texts] of expected.entries()) {
    const plan = plans.nth(index);
    await expect(plan.locator(".plan__badge")).toHaveText("1º mês grátis");
    await expect(plan.locator(".plan__price")).toContainText(texts[1]);
    await expect(plan.locator(".plan__window")).toHaveText("do 2º ao 4º mês");
    for (const text of [texts[0], texts[2], texts[3]]) await expect(plan).toContainText(text);
  }
  const enterprise = plans.nth(3);
  await expect(enterprise).toContainText("11 salas ou mais");
  await expect(enterprise).toContainText("Sob consulta");
  await expect(enterprise.locator(".plan__badge")).toHaveCount(0);
  await expect(section).not.toContainText("a cada 6 meses");
  await expect(section).toContainText(
    "Em uso no Warzone, estúdio de ensaio em Santos (SP), nas unidades Canal 1 e Canal 3."
  );
});

test("no plano, o selo vem antes do nome e o preço cheio é texto pequeno e legível", async ({ page }) => {
  await open(page, 390, 844);
  const starter = page.locator("#precos .plan").first();
  const text = (await starter.innerText()).replace(/\s+/g, " ");
  expect(text.indexOf("1º mês grátis")).toBeLessThan(text.indexOf("Starter"));
  const original = starter.locator(".plan__original");
  const style = await original.evaluate((element) => {
    const computed = getComputedStyle(element);
    return { size: computed.fontSize, color: computed.color };
  });
  expect(style.size).toBe("12px");
  const muted = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--tinta-suave").trim());
  expect(style.color.replace(/\s/g, "")).toBe(muted.replace(/\s/g, ""));
});
```

E, em `e2e/page.spec.ts:46`, troque `toContainText("R$ 99,90")` por duas checagens: `toContainText("R$ 29,90")` e `toContainText("Depois, R$ 99,90 por mês")`.

- [ ] **Step 2: Rode e veja falhar**

Run: `npm run test:e2e -- e2e/pricing.spec.ts e2e/page.spec.ts`
Expected: FAIL nos dois testes novos de `pricing.spec.ts` (sem `.plan__badge`) e no teste "sem JavaScript" (sem "R$ 29,90"). O teste "como começar" ainda passa.

- [ ] **Step 3: Implemente os dados em `components/site-content.ts`**

Acrescente `promo` e reescreva `Plan`, `plans` e `pricing.lead` como em **Interfaces**. Dados de `plans`, nesta ordem: Starter (`promoMonthly: "R$ 29,90"`, `monthly: "R$ 99,90"`, `annualInstallments: "12x de R$ 74,99 (R$ 899,90)"`), Growth (`"R$ 59,90"`, `"R$ 199,90"`, `"12x de R$ 149,99 (R$ 1.799,90)"`), Scale (`"R$ 104,90"`, `"R$ 349,90"`, `"12x de R$ 262,49 (R$ 3.149,90)"`), Enterprise (`null`, `null`, `null`, `custom: "Sob consulta"`).

- [ ] **Step 4: Implemente o bloco do plano em `app/page.tsx`**

Ordem dos elementos dentro de cada `li.plan` com `promoMonthly`: `<span className="plan__badge">{promo.trialLabel}</span>`, `h3`, `p.plan__rooms`, `p.plan__price` (`{plan.promoMonthly} <span>por mês</span>`), `p.plan__window` (`{promo.window}`), `p.plan__original` com dois `span`: `Depois, {plan.monthly} por mês` e `Ou plano anual em {plan.annualInstallments}`. O Enterprise continua com `h3`, `p.plan__rooms` e `p.plan__price` com `plan.custom`. Remova o `map` de `cycles` e o comentário sobre "a cada 6 meses".

- [ ] **Step 5: Implemente os estilos em `app/globals.css` (bloco "Preços")**

- `.plan__badge`: `justify-self: start`, fundo `var(--ambar)`, cor `var(--tinta)`, `font-weight: 700`, `font-size: 0.875rem`, `padding: 3px 8px`, `border-radius: var(--raio-bloco)`.
- `.plan__window`: cor `var(--tinta)`, `font-size: 1rem`.
- `.plan__original`: `margin-top: 6px`, `padding-top: 8px`, `border-top: 1px solid var(--linha)`, cor `var(--tinta-suave)`, `font-size: 0.75rem`, `line-height: 1.45`; `.plan__original span { display: block; }`.
- No computador (`min-width: 900px`), o Enterprise (sem selo) recebe espaço no topo igual à altura do selo, para o `h3` alinhar com os vizinhos. Use `.plan:not(:has(.plan__badge)) h3 { margin-top: ... }` ou uma classe `plan--sem-selo` aplicada no `page.tsx`; escolha a que mantiver o alinhamento nas larguras 1024, 1280 e 1440.
- Remova `.plan__cycles` e `.plan__per-month`, que ficam sem uso.

- [ ] **Step 6: Rode e veja passar**

Run: `npm run test:e2e -- e2e/pricing.spec.ts e2e/page.spec.ts e2e/contrast.spec.ts`
Expected: PASS em todos, inclusive "sem rolagem horizontal" em todas as larguras de `WIDTHS`.

- [ ] **Step 7: Confira a seção em 320, 390 e 1280 px**

Abra `out/` com `node e2e/serve-out.mjs` (ou `npm run dev`) e capture `#precos` nessas larguras. Confirme: nada corta a linha "Ou plano anual em 12x de R$ 262,49 (R$ 3.149,90)"; no computador, os quatro `h3` ficam na mesma altura.

- [ ] **Step 8: Commit**

```bash
git add components/site-content.ts app/page.tsx app/globals.css e2e/pricing.spec.ts e2e/page.spec.ts
git commit -m "feat: seção de preços mostra a promoção de entrada e o anual em 12x"
```

### Task 2: Textos da promoção no topo, Como começar, dúvidas, descrição e imagem

**Files:**
- Modify: `components/site-content.ts` (`hero.note`, `steps.items[2]`, `faq.items`)
- Modify: `app/layout.tsx:14-15` (`siteDescription`)
- Modify: `app/og-image.png/route.tsx:31`
- Test: `e2e/pricing.spec.ts` (testes "como começar" e "dúvidas"), `e2e/hero.spec.ts`

**Interfaces:**
- Consumes: `promo.trialLabel` e `promo.until` da Task 1, usados em `hero.note`, `steps`, na dúvida nova, em `siteDescription` e na imagem.

- [ ] **Step 1: Escreva os testes**

Em `e2e/pricing.spec.ts`:
- no teste "como começar tem os quatro passos em ordem", troque `"14 dias grátis"` por `"1º mês grátis"`;
- no teste "dúvidas abrem e fecham", troque `toHaveCount(6)` por `toHaveCount(7)`;
- acrescente:

```ts
test("dúvidas explicam o teste de 30 dias, a promoção e o anual em 12x", async ({ page }) => {
  await open(page, 1280);
  const items = page.locator("#duvidas details");
  await expect(items.locator("summary")).toHaveText([
    "Como funciona o teste grátis?",
    "Como funciona a promoção?",
    "Como é a migração do que eu uso hoje?",
    "Como funciona a cobrança da assinatura?",
    "Qual plano eu escolho?",
    "Meus dados ficam seguros?",
    "Funciona fora de São Paulo?"
  ]);
  await expect(items.nth(0)).toContainText("São 30 dias usando o EstudioHub");
  await expect(items.nth(1)).toContainText("até 31 de março de 2027");
  await expect(items.nth(1)).toContainText("A partir do 5º mês, a mensalidade volta ao valor cheio do plano.");
  await expect(items.nth(3)).toContainText("até 12x sem juros no cartão");
  await expect(page.locator("body")).not.toContainText("14 dias");
});
```

Em `e2e/hero.spec.ts`, acrescente:

```ts
test("nota do topo anuncia o primeiro mês grátis", async ({ page }) => {
  await open(page, 390, 844);
  await expect(page.locator(".hero__note")).toHaveText("1º mês grátis, com a gente acompanhando.");
  const description = await page.locator('meta[name="description"]').getAttribute("content");
  expect(description).toContain("1º mês grátis.");
  expect(description).not.toContain("14 dias");
});
```

- [ ] **Step 2: Rode e veja falhar**

Run: `npm run test:e2e -- e2e/pricing.spec.ts e2e/hero.spec.ts`
Expected: FAIL em "como começar", "dúvidas abrem e fecham", no teste novo das dúvidas e no teste novo do topo.

- [ ] **Step 3: Troque os textos**

Copy exata:
- `hero.note`: `` `${promo.trialLabel}, com a gente acompanhando.` ``
- `steps.items[2]`: `{ title: promo.trialLabel, text: "Você usa na rotina real, com acompanhamento." }`
- `faq.items[0].answer`: "São 30 dias usando o EstudioHub na rotina real do estúdio, sem pagar nada. A gente configura as salas, os preços e os mensalistas com você e acompanha os primeiros dias."
- Novo `faq.items[1]`: pergunta "Como funciona a promoção?"; resposta `` `Para estúdios novos que começarem o teste até ${promo.until}: o primeiro mês é grátis e as três mensalidades seguintes saem por cerca de 30% do preço (R$ 29,90 no Starter, R$ 59,90 no Growth e R$ 104,90 no Scale). A promoção vale no plano mensal. A partir do 5º mês, a mensalidade volta ao valor cheio do plano.` ``
- `faq` "Como funciona a cobrança da assinatura?": "Você paga por mês ou por ano, e o anual pode ser parcelado em até 12x sem juros no cartão. A assinatura e as faturas ficam no painel."
- `siteDescription` em `app/layout.tsx`: troque "Teste grátis por 14 dias." por `` `${promo.trialLabel}.` `` (importe `promo` de `@/components/site-content`).
- `app/og-image.png/route.tsx:31`: troque o texto "14 dias grátis" por `{promo.trialLabel}`.

- [ ] **Step 4: Rode a suíte inteira**

Run: `npm run test:e2e`
Expected: PASS em todos os testes, inclusive `e2e/brand.spec.ts` (imagem de compartilhamento com 1200×630).

- [ ] **Step 5: Confira a imagem de compartilhamento**

Abra `out/og-image.png` e confirme que "1º mês grátis" aparece em âmbar no canto de baixo, sem quebrar linha.

- [ ] **Step 6: Commit**

```bash
git add components/site-content.ts app/layout.tsx app/og-image.png/route.tsx e2e/pricing.spec.ts e2e/hero.spec.ts
git commit -m "feat: topo, dúvidas e prévia do link anunciam o primeiro mês grátis"
```
