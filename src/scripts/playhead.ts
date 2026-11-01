const saoPauloHour = (now: Date) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(now);
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
  return hour + minute / 60;
};

document.querySelectorAll<HTMLElement>(".playhead-lane").forEach((lane) => {
  const playhead = lane.querySelector<HTMLElement>(".playhead");
  if (!playhead) return;
  const startHour = Number(lane.dataset.startHour);
  const endHour = Number(lane.dataset.endHour);
  requestAnimationFrame(() => {
    const hour = saoPauloHour(new Date());
    const target = hour >= startHour && hour < endHour ? hour : 21;
    const position = ((target - startHour) / (endHour - startHour)) * 100;
    playhead.style.setProperty("--playhead-position", `${position}%`);
    playhead.dataset.position = position.toFixed(2);
  });
});
