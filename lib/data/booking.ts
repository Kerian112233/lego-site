'use server';

import {headers} from 'next/headers';
import {getSupabaseClient, isSupabaseConfigured} from '@/lib/supabase/server';
import {verifyTurnstileToken} from '@/lib/security/turnstile';
import {clientConfig} from '@/config/client';
import type {BookingActionResult, BookingPayload} from './types';

/**
 * SEUL point d'écriture d'une demande (CLAUDE.md règle 2) — Phase 2.
 *
 * Server action. Séquence, dans cet ordre et sans raccourci :
 *   1. validation serveur du payload (on ne fait pas confiance au client) ;
 *   2. vérification Turnstile auprès de Cloudflare ;
 *   3. RPC `create_client_lead` (anon, SECURITY DEFINER).
 *
 * ⚠️ Le formulaire AWAIT ce retour avant d'ouvrir wa.me, pour ne rediriger
 * qu'une fois le lead réellement enregistré. Le lien WhatsApp est construit
 * côté client (`buildWhatsAppUrl`) à partir de la référence renvoyée ici, et
 * le formulaire affiche un lien de secours si la navigation auto est bloquée
 * (iOS Safari) — le geste utilisateur n'est donc jamais un point de rupture.
 *
 * ⚠️ La RPC déployée ne connaît NI les dates NI le modèle : elle n'accepte que
 * (prénom, nom, téléphone, email, nationalité, message, scooter_interest).
 * Les dates et le modèle sont donc sérialisés dans `p_message`, et le modèle
 * dupliqué dans `p_scooter_interest` (texte libre côté base).
 */
export async function submitBookingRequest(
  payload: BookingPayload,
  turnstileToken: string | null
): Promise<BookingActionResult> {
  if (!isValidPayload(payload)) {
    return {ok: false, error: 'validation'};
  }

  const ip = await getClientIp();
  const humanVerified = await verifyTurnstileToken(turnstileToken, ip);
  if (!humanVerified) {
    return {ok: false, error: 'turnstile'};
  }

  if (!isSupabaseConfigured()) {
    return {ok: false, error: 'server'};
  }

  const {first_name, last_name} = splitName(payload);

  const {data, error} = await getSupabaseClient().rpc('create_client_lead', {
    p_first_name: first_name,
    p_last_name: last_name,
    p_phone: payload.phone,
    p_email: payload.email,
    p_nationality: payload.nationality,
    p_message: composeLeadMessage(payload),
    p_scooter_interest: payload.model_label
  });

  if (error) {
    return {ok: false, error: 'server'};
  }

  const request_id = extractLeadId(data);

  return {
    ok: true,
    request_id: request_id ?? '',
    reference: buildReference(request_id)
  };
}

/** Validation serveur — miroir des règles du formulaire, jamais déléguée au client. */
function isValidPayload(payload: BookingPayload): boolean {
  const today = new Date().toISOString().slice(0, 10);
  const isDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

  if (!payload.first_name?.trim()) return false;
  if (!payload.phone?.trim()) return false;
  if (!payload.model_id?.trim()) return false;
  if (!isDate(payload.start_date) || !isDate(payload.end_date)) return false;
  if (payload.start_date < today) return false;
  if (payload.end_date < payload.start_date) return false;
  if (payload.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email)) {
    return false;
  }
  // Garde-fou anti-abus : longueurs raisonnables avant insertion.
  const tooLong = [
    payload.first_name,
    payload.last_name,
    payload.phone,
    payload.email,
    payload.nationality,
    payload.model_label
  ].some((value) => (value?.length ?? 0) > 200);
  if (tooLong) return false;

  return (payload.message?.length ?? 0) <= 2000;
}

/**
 * `p_last_name` est requis par la RPC. Si le visiteur n'a saisi qu'un prénom,
 * on retombe sur un marqueur explicite plutôt que sur une chaîne vide : côté
 * dashboard, « — » se lit comme « non fourni », pas comme un bug d'affichage.
 */
function splitName(payload: BookingPayload): {
  first_name: string;
  last_name: string;
} {
  return {
    first_name: payload.first_name.trim(),
    last_name: payload.last_name.trim() || '—'
  };
}

/**
 * Sérialise dans `p_message` tout ce que la RPC ne sait pas stocker en colonne
 * (dates, modèle exact, langue, origine) + le message libre du visiteur.
 * Format volontairement lisible tel quel dans le dashboard.
 */
function composeLeadMessage(payload: BookingPayload): string {
  const lines = [
    `Modèle souhaité : ${payload.model_label}`,
    `Dates : ${payload.start_date} → ${payload.end_date}`,
    `Langue : ${payload.locale} · Origine : ${payload.source}`
  ];
  if (payload.message?.trim()) {
    lines.push('', `Message du client : ${payload.message.trim()}`);
  }
  return lines.join('\n');
}

/**
 * Le type de retour de `create_client_lead` n'est pas documenté côté base
 * (OpenAPI PostgREST ne l'expose pas). On accepte donc les trois formes
 * plausibles — uuid nu, objet `{id}`, tableau d'objets — plutôt que de parier
 * sur une seule et de casser au premier écart.
 */
function extractLeadId(data: unknown): string | null {
  if (typeof data === 'string' && data.length > 0) return data;
  if (Array.isArray(data)) return extractLeadId(data[0]);
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const id = record.id ?? record.lead_id ?? record.request_id;
    if (typeof id === 'string') return id;
  }
  return null;
}

/**
 * Référence lisible affichée au client et reprise dans le message WhatsApp.
 * Dérivée de l'id du lead quand la RPC en renvoie un → LEXO retrouve la
 * demande en base à partir du message WhatsApp. Sinon, référence locale.
 */
function buildReference(leadId: string | null): string {
  const year = new Date().getFullYear();
  const prefix = clientConfig.booking.referencePrefix;
  const suffix = leadId
    ? leadId.replace(/[^0-9a-z]/gi, '').slice(0, 6).toUpperCase()
    : Math.floor(Math.random() * 999999)
        .toString()
        .padStart(6, '0');
  return `${prefix}-${year}-${suffix}`;
}

/** IP visiteur transmise à Cloudflare (améliore le scoring Turnstile). */
async function getClientIp(): Promise<string | null> {
  const headerList = await headers();
  const forwarded = headerList.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() ?? null;
}
