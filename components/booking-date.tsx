"use client";

import { useEffect, useState } from "react";
import { nextTuesday } from "@/components/next-tuesday";

// O HTML sai com a terça do dia do build; no navegador, a data vira a próxima terça de hoje.
export function BookingDate({ fallback }: { fallback: string }) {
  const [date, setDate] = useState(fallback);

  useEffect(() => setDate(nextTuesday(new Date())), []);

  return <>{date}</>;
}
