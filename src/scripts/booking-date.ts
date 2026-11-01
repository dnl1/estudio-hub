import { nextTuesday } from "../lib/next-tuesday";

const date = document.querySelector<HTMLElement>("[data-booking-date]");
if (date) date.textContent = nextTuesday(new Date());
