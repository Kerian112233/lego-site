import {clientConfig} from '@/config/client';
import type {BookingPayload, SubmitBookingResult} from './types';

/**
 * SEUL point d'écriture d'une demande (CLAUDE.md règle 2). Client-side.
 *
 * ⚠️ SYNCHRONE À DESSEIN. Sur iOS Safari, naviguer vers wa.me APRÈS un `await`
 * perd le "user gesture" du tap → Safari bloque l'ouverture. Le formulaire doit
 * donc construire l'URL et naviguer dans le MÊME tap, sans rien awaiter avant.
 *
 * Phase 1 : génère une référence mock locale + construit le lien WhatsApp
 *           (fonctionne pour de vrai, aucun backend).
 * Phase 2 : l'enregistrement (RPC `create_booking_request`) se fait via une
 *           server action, en fire-and-forget APRÈS la navigation, ou côté
 *           serveur — sans réintroduire d'await avant la redirection.
 *
 * @param composeMessage reçoit la référence et renvoie le texte WhatsApp
 *   déjà localisé (template dans messages/*.json), composé par le formulaire.
 */
export function submitBookingRequest(
  payload: BookingPayload,
  composeMessage: (reference: string) => string
): SubmitBookingResult {
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
