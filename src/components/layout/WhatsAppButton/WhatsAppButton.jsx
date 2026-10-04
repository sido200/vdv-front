import { FaWhatsapp } from "react-icons/fa";
import "./WhatsAppButton.css";

const WHATSAPP_NUMBER = "213560221788"; // +213 560 22 17 88 (format international sans +)

const WhatsAppButton = () => {
  const url = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
      aria-label="Contactez-nous sur WhatsApp"
    >
      <FaWhatsapp />
    </a>
  );
};

export default WhatsAppButton;
