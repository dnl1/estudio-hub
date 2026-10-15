const TUESDAY = 2;

// "20/10/2026 (terça)": a próxima terça depois de hoje, contando o dia de São Paulo.
export function nextTuesday(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).formatToParts(now);
  const part = (type: string) => Number(parts.find((item) => item.type === type)?.value);
  const date = new Date(Date.UTC(part("year"), part("month") - 1, part("day")));
  date.setUTCDate(date.getUTCDate() + ((TUESDAY - date.getUTCDay() + 6) % 7) + 1);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()} (terça)`;
}
