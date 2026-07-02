import {clientConfig} from '@/config/client';
import type {BookingPayload, SubmitBookingResult} from './types';

/**
 * SEUL point d'écriture d'une demande (CLAUDE.md règle 2). Client-side.
 *
 * Phase 1 : génère une référence mock locale et construit le lien WhatsApp
 *           (qui fonctionne POUR DE VRAI — aucun backend requis).
 * Phase 2 : ajouter en tête l'appel à la RPC `create_booking_request` (via une
 *           server action) pour obtenir la vraie référence, PUIS construire le
 *           même lien WhatsApp. Signature inchangée → zéro composant touché.
 *
 * @param composeMessage reçoit la référence et renvoie le texte WhatsApp
 *   déjà localisé. Le template vit dans messages/*.json (structurel produit) et
 *   est composé par le formulaire ; on l'injecte ici pour que la construction
 *   du lien reste l'unique responsabilité du data layer.
 */
export async function submitBookingRequest(
  payload: BookingPayload,
  composeMessage: (reference: string) => string
): Promise<SubmitBookingResult> {
  const reference = generateReference();
  const request_id = generateRequestId();

  const text = composeMessage(reference);
  const whatsappUrl = buildWhatsAppUrl(
    clientConfig.contact.whatsappNumber,
    text
  );

  return {request_id, reference, whatsappUrl};
}

/** Lien wa.me : numéro international sans `+`, message encodé (§6). */
export function buildWhatsAppUrl(whatsappNumber: string, text: string): string {
  const number = whatsappNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/** Réf lisible mock, ex: LEXO-2026-0042. Préfixe piloté par la config. */
function generateReference(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, '0');
  return `${clientConfig.booking.referencePrefix}-${year}-${seq}`;
}

function generateRequestId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `mock-${Date.now()}`;
}
