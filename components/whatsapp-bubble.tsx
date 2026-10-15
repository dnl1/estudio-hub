import { BookingDate } from "@/components/booking-date";
import { nextTuesday } from "@/components/next-tuesday";
import { whatsappConfirmation } from "@/components/site-content";

export function WhatsAppBubble() {
  const [beforeDate, afterDate] = whatsappConfirmation.text.split("{data}");
  return (
    <figure className="wa-bubble">
      <figcaption className="wa-bubble__caption">{whatsappConfirmation.caption}</figcaption>
      <p className="wa-bubble__text">
        {beforeDate}
        <BookingDate fallback={nextTuesday(new Date())} />
        {afterDate}
        <span className="wa-bubble__time">{whatsappConfirmation.time}</span>
      </p>
    </figure>
  );
}
