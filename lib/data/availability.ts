import 'server-only';
import {getSupabaseClient, isSupabaseConfigured} from '@/lib/supabase/server';
import type {ScooterModel} from './types';

/**
 * Ligne renvoyée par la RPC `get_public_availability()` (déployée en prod,
 * exécutable en `anon`). Une ligne par FAMILLE de scooters du parc réel.
 *
 * ⚠️ Sémantique : `available_now` est une photo à l'INSTANT T. La RPC ne prend
 * aucune plage de dates — elle ne sait pas dire si un scooter sera libre du 12
 * au 18. Toute lecture « disponible sur mes dates » est donc une approximation
 * (cf. getUnavailableModelIds dans models.ts).
 */
export interface FamilyAvailability {
  family: string;
  total_active: number;
  available_now: number;
  sample_photo: string | null;
}

/**
 * Dispo temps réel par famille. Ne jette jamais : si Supabase est absent ou
 * en erreur, on renvoie [] → le site reste debout et ne grise aucun modèle
 * (un catalogue complet vaut mieux qu'un catalogue faussement vide).
 */
export async function getFamilyAvailability(): Promise<FamilyAvailability[]> {
  if (!isSupabaseConfigured()) return [];

  const {data, error} = await getSupabaseClient().rpc('get_public_availability');

  if (error || !Array.isArray(data)) return [];

  return data as FamilyAvailability[];
}

/**
 * Familles réellement présentes en base (constat live 2026-08-23) :
 * ADV160, ADV350, NMAX, PCX, TMAX, XADV, XMAX.
 *
 * Le catalogue du site nomme les modèles côté marketing (« Honda X-ADV »,
 * « Yamaha XMAX 300 »…), la base les nomme par code famille. Ce mapping fait
 * le pont. Il est volontairement dérivé du NOM (et non d'un id) : le catalogue
 * reste un mock local, il n'a pas d'identifiant partagé avec la base.
 */
function normalize(name: string): string {
  return name
    .toUpperCase()
    .replace(/^(HONDA|YAMAHA)\s+/, '')
    .replace(/[^A-Z0-9]/g, '');
}

/**
 * Résout la famille base d'un modèle du catalogue, ou null si aucune ne
 * correspond (modèle marketing sans équivalent au parc → jamais grisé).
 */
export function resolveFamily(
  model: ScooterModel,
  families: string[]
): string | null {
  const key = normalize(model.name);

  // 1) Correspondance exacte (ADV160, NMAX, TMAX, XADV…).
  const exact = families.find((f) => normalize(f) === key);
  if (exact) return exact;

  // 2) Sinon préfixe le plus long (« XMAX300 » → XMAX, « PCX160 » → PCX).
  //    Le tri décroissant évite qu'une famille courte capte un modèle qu'une
  //    famille plus spécifique décrit mieux.
  const prefix = [...families]
    .sort((a, b) => normalize(b).length - normalize(a).length)
    .find((f) => key.startsWith(normalize(f)));

  return prefix ?? null;
}
