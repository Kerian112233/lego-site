import 'server-only';
import {getSupabaseClient, isSupabaseConfigured} from '@/lib/supabase/server';
import type {ScooterModel} from './types';

/**
 * Ligne renvoyée par la RPC `get_availability_for_dates(p_start, p_end)`
 * (déployée en prod, exécutable en `anon`). Une ligne par FAMILLE de scooters
 * du parc réel.
 *
 * `available` = nombre d'unités de la famille libres SUR TOUTE LA PÉRIODE
 * demandée (et non à l'instant T, contrairement à l'ancienne
 * `get_public_availability()` qu'elle remplace).
 */
export interface FamilyAvailability {
  family: string;
  total_active: number;
  available: number;
  sample_photo: string | null;
}

/**
 * Dispo par famille SUR UNE PÉRIODE. Ne jette jamais : si Supabase est absent
 * ou en erreur, on renvoie [] → le site reste debout et n'affirme simplement
 * rien sur la dispo (mode dégradé).
 */
export async function getFamilyAvailabilityForDates(
  startDate: string,
  endDate: string
): Promise<FamilyAvailability[]> {
  if (!isSupabaseConfigured()) return [];

  const {data, error} = await getSupabaseClient().rpc(
    'get_availability_for_dates',
    {p_start: startDate, p_end: endDate}
  );

  if (error || !Array.isArray(data)) return [];

  return (data as FamilyAvailability[]).filter(
    (row) => typeof row?.family === 'string' && typeof row?.available === 'number'
  );
}

/**
 * Familles réellement présentes en base (constat live 2026-08-24) :
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

/**
 * Dispo du catalogue sur une période, projetée sur les ids du mock local.
 *
 * ⚠️ GRANULARITÉ : la base compte par FAMILLE (TMAX, XADV…), le catalogue
 * découpe ces familles en variantes marketing (TMAX Iron, TMAX 560 2024…).
 * Toutes les variantes d'une même famille portent donc LE MÊME compteur :
 * c'est un nombre de scooters de la famille, pas de la variante. L'UI ne doit
 * l'afficher qu'au niveau famille (carte / titre), jamais accolé au sélecteur
 * de variante.
 */
export interface RangeAvailability {
  /** Ids des modèles du catalogue dont la famille a `available = 0`. */
  unavailableIds: string[];
  /** Nb d'unités libres sur la période, par id de modèle (valeur famille). */
  availableByModelId: Record<string, number>;
}

const EMPTY_AVAILABILITY: RangeAvailability = {
  unavailableIds: [],
  availableByModelId: {}
};

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │  POINT DE BRANCHEMENT UNIQUE de la dispo « sur une période ».              │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * Source : RPC `get_availability_for_dates(p_start, p_end)`, à qui on passe
 * telles quelles les dates choisies par le client (format `YYYY-MM-DD`).
 *
 * Un modèle du catalogue est déclaré indisponible quand la famille base qui lui
 * correspond renvoie `available = 0`. Un modèle sans famille correspondante
 * (modèle marketing absent du parc) n'est jamais grisé et n'affiche aucun
 * compteur : on ne sait rien de lui, on n'affirme rien.
 *
 * Mode dégradé (Supabase absent, RPC en erreur, réponse vide) : aucun grisage,
 * aucun compteur — le site reste debout sans mentir sur la dispo.
 */
export async function getAvailabilityForRange(
  models: ScooterModel[],
  startDate: string,
  endDate: string
): Promise<RangeAvailability> {
  const rows = await getFamilyAvailabilityForDates(startDate, endDate);
  if (rows.length === 0) return EMPTY_AVAILABILITY;

  const availableByFamily = new Map(rows.map((row) => [row.family, row.available]));
  const families = rows.map((row) => row.family);

  const unavailableIds: string[] = [];
  const availableByModelId: Record<string, number> = {};

  for (const model of models) {
    const family = resolveFamily(model, families);
    if (!family) continue;

    const available = availableByFamily.get(family) ?? 0;
    availableByModelId[model.id] = available;
    if (available === 0) unavailableIds.push(model.id);
  }

  return {unavailableIds, availableByModelId};
}

/**
 * Raccourci « quels modèles sont indisponibles sur la période ».
 * Conservé pour les appelants qui n'ont besoin que du grisage.
 */
export async function getUnavailableModelIdsForRange(
  models: ScooterModel[],
  startDate: string,
  endDate: string
): Promise<string[]> {
  const {unavailableIds} = await getAvailabilityForRange(
    models,
    startDate,
    endDate
  );
  return unavailableIds;
}
