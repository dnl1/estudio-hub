"use client";

import { useEffect, useState } from "react";

// Hora decimal de São Paulo, qualquer que seja o fuso do navegador.
function saoPauloHour(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(now);
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
  return hour + minute / 60;
}

// Posição em % da grade. Fora do horário da grade, a linha para em 21h.
export function playheadTarget(hourNow: number, startHour: number, endHour: number) {
  const hour = hourNow >= startHour && hourNow < endHour ? hourNow : 21;
  return ((hour - startHour) / (endHour - startHour)) * 100;
}

export function Playhead({ startHour, endHour }: { startHour: number; endHour: number }) {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      setPosition(playheadTarget(saoPauloHour(new Date()), startHour, endHour))
    );
    return () => cancelAnimationFrame(frame);
  }, [startHour, endHour]);

  return (
    <div className="playhead-lane" aria-hidden="true">
      <div className="playhead" style={{ left: `${position}%` }} data-position={position.toFixed(2)}>
        <span className="playhead__label">agora</span>
      </div>
    </div>
  );
}
