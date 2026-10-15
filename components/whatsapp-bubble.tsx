import { whatsappConfirmation } from "@/components/site-content";

export function WhatsAppBubble() {
  return (
    <figure className="wa-bubble">
      <figcaption className="wa-bubble__caption">{whatsappConfirmation.caption}</figcaption>
      <p className="wa-bubble__text">
        {whatsappConfirmation.text}
        <span className="wa-bubble__time">{whatsappConfirmation.time}</span>
      </p>
    </figure>
  );
}
