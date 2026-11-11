/**
 * Single source of truth for business contact details (doc/prd.md section 3).
 */
export const CONTACT = {
  name: "EL PASEO Tours & Travels",
  phoneDisplay: "+91 90749 26319",
  phoneTel: "+919074926319",
  /** International format without "+", as wa.me expects. */
  whatsappNumber: "919074926319",
  email: "elpaseoin@gmail.com",
  address: "Mankavu, Calicut (Kozhikode), Kerala, India",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Mankavu%2C%20Calicut%2C%20Kerala",
} as const;

/**
 * Social page URLs. The PRD names Instagram and Facebook but gives no links,
 * so they are empty for now. Anything left empty falls back to WhatsApp.
 * Fill these in when the real pages exist, e.g.
 *   instagram: "https://instagram.com/<handle>"
 */
export const SOCIAL_LINKS: { instagram?: string; facebook?: string } = {
  instagram: undefined,
  facebook: undefined,
};

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${CONTACT.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hello EL PASEO Tours & Travels, I would like to plan a trip.";
