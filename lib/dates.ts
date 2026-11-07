import {clientConfig} from '@/config/client';

/**
 * Dates de location au format `YYYY-MM-DD` : SOURCE UNIQUE des conversions,
 * partagée par la recherche (date-search), le formulaire (booking-form), les
 * pages qui lisent `?start` / `?end` et la validation serveur.
 *
 * Toutes les dates sont des jours CALENDAIRES, sans heure : on construit les
 * `Date` à minuit local et on relit avec les getters locaux, jamais via
 * `toISOString()` (qui repasse en UTC et peut décaler d'un jour).
 */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** `Date` → `YYYY-MM-DD` (jour local). */
export function toISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/**
 * `YYYY-MM-DD` → `Date` à minuit local. STRICT : format exact ET date réelle
 * (le 31 novembre n'existe pas → `undefined`, au lieu d'être silencieusement
 * décalé au 1er décembre par `new Date`).
 */
export function parseISO(value?: string): Date | undefined {
  if (!value || !ISO_DATE.test(value)) return undefined;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return toISO(date) === value ? date : undefined;
}

/** Vrai si `value` est une vraie date `YYYY-MM-DD`. */
export function isISODate(value: string): boolean {
  return parseISO(value) !== undefined;
}

/**
 * Paramètre d'URL → date valide ou `undefined`. Next renvoie un TABLEAU pour
 * une clé répétée (`?start=a&start=b`) : on n'accepte qu'une chaîne unique et
 * valide, tout le reste est ignoré (le visiteur rechoisit ses dates).
 */
export function dateParam(value: string | string[] | undefined): string | undefined {
  return typeof value === 'string' && isISODate(value) ? value : undefined;
}

/**
 * « Aujourd'hui » au sens de la BOUTIQUE (fuseau de `clientConfig.booking`),
 * pas du visiteur ni du serveur (UTC sur Vercel). Même référence pour le
 * calendrier, la validation du formulaire et la validation serveur — sinon un
 * visiteur à l'ouest d'UTC se voyait proposer un jour que la validation
 * refusait ensuite (« date dans le passé »).
 */
export function todayISO(): string {
  // en-CA formate en AAAA-MM-JJ ; on passe par formatToParts pour ne dépendre
  // d'aucun ordre de locale.
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: clientConfig.booking.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}
