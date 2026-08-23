/**
 * Construction du deeplink WhatsApp — fonction PURE, utilisable côté client
 * comme côté serveur (elle est volontairement hors de booking.ts, qui est un
 * fichier `use server` et ne peut donc exporter que des fonctions async).
 *
 * Lien wa.me : numéro international sans `+`, message encodé (kickoff §6).
 */
export function buildWhatsAppUrl(whatsappNumber: string, text: string): string {
  const number = whatsappNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
