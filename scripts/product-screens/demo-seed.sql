-- Dados fictícios para as capturas da landing page do EstudioHub.
-- Roda só no banco local landing_demo, depois do StudioScheduler.Migrations (schema + seed padrão).
-- Recebe o hash da senha da conta fictícia na variável :demo_hash (veja o README).
\set ON_ERROR_STOP on

DO $$
BEGIN
  IF current_database() <> 'landing_demo' THEN
    RAISE EXCEPTION 'demo-seed.sql só roda no banco landing_demo (atual: %)', current_database();
  END IF;
END $$;

BEGIN;

-- Data e hora de São Paulo convertidas para timestamptz
CREATE FUNCTION pg_temp.sp(dia date, hora text) RETURNS timestamptz
LANGUAGE sql STABLE AS $$ SELECT (dia + hora::time) AT TIME ZONE 'America/Sao_Paulo' $$;

CREATE TEMP TABLE ref AS
SELECT (now() AT TIME ZONE 'America/Sao_Paulo')::date AS hoje,
       date_trunc('week', now() AT TIME ZONE 'America/Sao_Paulo')::date + 7 AS proxima_segunda;

-- Organização, unidades e salas com nomes fictícios (o seed padrão traz a organização real)
UPDATE "Organizations"
SET "Name" = 'Estúdio Exemplo', "Slug" = 'exemplo', "Responsible" = 'Equipe EstudioHub',
    "Email" = 'demo@estudio-exemplo.test', "MobileNumber" = '+5511900000000'
WHERE "OrganizationID" = 1;

UPDATE "Studios" SET "Name" = 'Unidade Centro', "Address" = 'Rua Exemplo, 100 - São Paulo/SP',
  "ContactNumber" = '(11) 90000-0000' WHERE "StudioID" = 1;
UPDATE "Studios" SET "Name" = 'Unidade Norte', "Address" = 'Rua Exemplo, 200 - São Paulo/SP',
  "ContactNumber" = '(11) 90000-0001' WHERE "StudioID" = 2;

UPDATE "Rooms" SET "RoomName" = 'Sala 1' WHERE "RoomID" = 1;
UPDATE "Rooms" SET "RoomName" = 'Sala A' WHERE "RoomID" = 2;
INSERT INTO "Rooms" ("StudioID", "RoomName", "MinimumBookingHours") VALUES (1, 'Sala 2', 1), (1, 'Sala 3', 1);

CREATE TEMP TABLE sala AS
SELECT "RoomID" AS id, "RoomName" AS nome FROM "Rooms" WHERE "StudioID" = 1;

-- Usuários do seed padrão ficam desativados e sem email real; entra só a gestora fictícia
UPDATE "Users" SET "IsActive" = false, "Email" = 'desativado-' || "UserId" || '@estudio-exemplo.test';
INSERT INTO "Users" ("Name", "Email", "PasswordHash", "Role", "OrganizationId", "ActiveOrganizationId",
                     "FavoriteStudioId", "IsActive")
VALUES ('Marina', 'gestora@estudio-exemplo.test', :'demo_hash', 'Manager', 1, 1, 1, true);

-- Licença gratuita e isenta de cobrança, para o admin não pedir assinatura
INSERT INTO "OrganizationLicenses" ("OrganizationId", "LicensePlanId", "BillingCycle", "PriceSnapshot",
  "StartDate", "EndDate", "Status", "GrantType", "IsBillingExempt", "GrantReason")
SELECT 1, "Id", NULL, 0, now() - interval '30 days', now() + interval '5 years', 'Active', 'Free', true,
       'Demonstração local para capturas da landing page'
FROM "LicensePlans" WHERE "Code" = 'scale';

-- Disponibilidade e preço de ensaio das salas da Unidade Centro
DELETE FROM "RoomAvailability" WHERE "RoomId" IN (SELECT id FROM sala);
INSERT INTO "RoomAvailability" ("RoomId", "DayOfWeek", "StartHour", "EndHour")
SELECT sala.id, dia, time '10:00', time '23:00' FROM sala CROSS JOIN generate_series(0, 6) AS dia;

DELETE FROM "RehearsalPriceRules" WHERE "RoomId" IN (SELECT id FROM sala);
INSERT INTO "RehearsalPriceRules" ("RoomId", "DayOfWeek", "StartTime", "EndTime", "Price",
  "MonthlyMemberPrice", "Priority", "ValidFrom", "IsActive")
SELECT sala.id, dia, faixa.inicio, faixa.fim, faixa.preco, faixa.preco_mensalista, 0,
       now() - interval '1 year', true
FROM sala
CROSS JOIN generate_series(0, 6) AS dia
CROSS JOIN (VALUES (time '10:00', time '18:00', 80.00, 70.00),
                   (time '18:00', time '23:00', 120.00, 100.00)) AS faixa(inicio, fim, preco, preco_mensalista);

-- Estoque dos produtos da Unidade Centro
INSERT INTO "ProductStocks" ("OrganizationId", "StudioId", "ProductId", "Quantity")
SELECT "OrganizationId", "StudioId", "Id", 24 FROM "Products" WHERE "StudioId" = 1
ON CONFLICT DO NOTHING;
UPDATE "Products" SET "StockQuantity" = 24 WHERE "StudioId" = 1;

-- Próxima semana da Sala 2: reservas avulsas (uma pendente), dois mensalistas e um bloqueio
INSERT INTO "Scheduler" ("RoomID", "BandName", "ContactName", "Email", "MobileNumber", "StartDate",
  "EndDate", "Status", "CreatedAt")
SELECT (SELECT id FROM sala WHERE nome = 'Sala 2'), b.banda, b.contato, b.email, b.celular,
       pg_temp.sp(ref.proxima_segunda + b.dia, b.inicio), pg_temp.sp(ref.proxima_segunda + b.dia, b.fim),
       b.status, now()
FROM ref, (VALUES
  ('Lia Trio', 'Lia', 'lia@banda.test', '+5511900000001', 0, '19:00', '21:00', 'Confirmed'),
  ('Banda Norte', 'Caio', 'caio@banda.test', '+5511900000002', 2, '20:00', '22:00', 'Confirmed'),
  ('Fuzz Club', 'Rafa', 'rafa@banda.test', '+5511900000003', 4, '18:00', '20:00', 'Pending'),
  ('Maré Alta', 'Bia', 'bia@banda.test', '+5511900000004', 5, '15:00', '18:00', 'Confirmed')
) AS b(banda, contato, email, celular, dia, inicio, fim, status);

INSERT INTO "MonthlyContracts" ("RoomID", "BandName", "ContactName", "MobileNumber", "StartDate",
  "EndDate", "Weekday", "StartTime", "EndTime", "IntervalWeeks", "CreatedAt")
SELECT (SELECT id FROM sala WHERE nome = 'Sala 2'), m.banda, m.contato, m.celular,
       pg_temp.sp(ref.hoje - 60, '00:00'), NULL, m.dia_semana, m.inicio::interval, m.fim::interval, 1, now()
FROM ref, (VALUES
  ('Os Cobras', 'Duda', '+5511900000005', 2, '19:00', '22:00'),
  ('Quarto Escuro', 'Téo', '+5511900000006', 4, '20:00', '22:00')
) AS m(banda, contato, celular, dia_semana, inicio, fim);

INSERT INTO "RoomBlocks" ("RoomId", "StartDate", "EndDate", "Reason")
SELECT (SELECT id FROM sala WHERE nome = 'Sala 2'), pg_temp.sp(ref.proxima_segunda + 2, '14:00'),
       pg_temp.sp(ref.proxima_segunda + 2, '17:00'), 'Manutenção do ar-condicionado'
FROM ref;

-- Hoje na Sala 1: reserva da Ruído Branco com a comanda aberta, dividida entre três pessoas
INSERT INTO "Scheduler" ("RoomID", "BandName", "ContactName", "Email", "MobileNumber", "StartDate",
  "EndDate", "Status", "CreatedAt")
SELECT (SELECT id FROM sala WHERE nome = 'Sala 1'), 'Ruído Branco', 'Nina', 'nina@banda.test',
       '+5511900000007', pg_temp.sp(ref.hoje, '19:00'), pg_temp.sp(ref.hoje, '21:00'), 'Confirmed', now()
FROM ref
RETURNING "ScheduleID" AS reserva_id \gset

INSERT INTO "Tabs" ("OrganizationId", "StudioId", "ReservationId", "Status", "TotalAmount")
VALUES (1, 1, :reserva_id, 'OPEN', 0)
RETURNING "Id" AS comanda_id \gset

-- Mesmo formato que o sistema usa: horas como quantidade e preço por hora
INSERT INTO "TabItems" ("TabId", "ProductId", "ItemType", "Description", "Quantity", "UnitPrice", "Total",
  "IsPaid", "RowVersion")
VALUES (:comanda_id, NULL, 'RehearsalCharge', 'Ensaio da reserva #' || :reserva_id, 2, 120.00, 240.00,
        false, '\x'::bytea);

INSERT INTO "TabItems" ("TabId", "ProductId", "ItemType", "Description", "Quantity", "UnitPrice", "Total",
  "IsPaid", "RowVersion")
SELECT :comanda_id, p."Id", 'Product', p."Name", q.quantidade, p."SalePrice", p."SalePrice" * q.quantidade,
       false, '\x'::bytea
FROM (VALUES ('Cerveja', 4), ('Água', 2), ('Cordas de Guitarra', 1), ('Baquetas', 1)) AS q(nome, quantidade)
JOIN LATERAL (SELECT "Id", "Name", "SalePrice" FROM "Products"
              WHERE "StudioId" = 1 AND "Name" = q.nome ORDER BY "Id" LIMIT 1) p ON true;

INSERT INTO "TabParticipants" ("TabId") VALUES (:comanda_id), (:comanda_id), (:comanda_id);

-- O ensaio é dividido entre as três pessoas; cada produto fica com uma delas
INSERT INTO "TabItemSplits" ("TabItemId", "TabParticipantId")
SELECT item."Id", pessoa."Id"
FROM "TabItems" item
JOIN (SELECT "Id", row_number() OVER (ORDER BY "Id") AS n
      FROM "TabParticipants" WHERE "TabId" = :comanda_id) pessoa
  ON item."ItemType" = 'RehearsalCharge'
  OR (item."Description", pessoa.n) IN (('Cerveja', 1), ('Baquetas', 1), ('Água', 2), ('Cordas de Guitarra', 3))
WHERE item."TabId" = :comanda_id;

UPDATE "Tabs" SET "TotalAmount" = (SELECT sum("Total") FROM "TabItems" WHERE "TabId" = :comanda_id)
WHERE "Id" = :comanda_id;

-- Conferência: falha se algum produto do seed padrão mudou de nome e ficou de fora
DO $$
DECLARE itens int;
BEGIN
  SELECT count(*) INTO itens FROM "TabItems" t JOIN "Tabs" c ON c."Id" = t."TabId" WHERE c."Status" = 'OPEN';
  IF itens <> 5 THEN
    RAISE EXCEPTION 'Comanda de demonstração com % itens (esperado 5): confira os nomes dos produtos', itens;
  END IF;
END $$;

COMMIT;
