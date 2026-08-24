import 'server-only';

const VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Vérification serveur d'un token Cloudflare Turnstile.
 *
 * Contrat de sécurité :
 *  - `TURNSTILE_SECRET_KEY` défini  → le token est OBLIGATOIRE et vérifié
 *    auprès de Cloudflare. Pas de token / token refusé → refus, aucune écriture.
 *  - `TURNSTILE_SECRET_KEY` absent  → vérification désactivée (dev local /
 *    Phase 1). C'est le SEUL cas où l'on passe sans token : documenté dans
 *    .env.local.example, à ne jamais laisser tel quel en production.
 *
 * La clé secrète ne porte volontairement pas de préfixe `NEXT_PUBLIC_` : elle
 * ne doit jamais atteindre le bundle client.
 */
export async function verifyTurnstileToken(
  token: string | null,
  remoteIp?: string | null
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) return true; // anti-spam non configuré → on laisse passer
  if (!token) return false;

  const body = new URLSearchParams({secret, response: token});
  if (remoteIp) body.set('remoteip', remoteIp);

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      body,
      cache: 'no-store'
    });
    if (!res.ok) return false;
    const data: {success?: boolean} = await res.json();
    return data.success === true;
  } catch {
    // Cloudflare injoignable : on refuse plutôt que d'ouvrir la porte.
    return false;
  }
}

/** `true` si l'anti-spam est réellement actif côté serveur. */
export function isTurnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}
