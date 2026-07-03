import 'server-only';
import {mockScooterModels} from './mock/scooters';
import type {ScooterModel} from './types';

/**
 * SEUL point de lecture du catalogue (CLAUDE.md règle 2).
 *
 * Phase 1 : renvoie le mock local, filtré `is_active` et trié par `sort_order`
 *           — exactement ce que fera la vue Supabase.
 * Phase 2 : remplacer UNIQUEMENT le corps de cette fonction par un SELECT sur
 *           `public_scooter_models` (anon key). Signature inchangée → zéro
 *           composant touché.
 */
export async function getScooterModels(): Promise<ScooterModel[]> {
  return mockScooterModels
    .filter((model) => model.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
}

/**
 * Lecture d'un modèle par id (utilisé par le formulaire de réservation).
 * Même contrat de swap que getScooterModels.
 */
export async function getScooterModelById(
  id: string
): Promise<ScooterModel | null> {
  const models = await getScooterModels();
  return models.find((model) => model.id === id) ?? null;
}

/**
 * Disponibilité par dates — Phase 1 SIMULÉE (mock déterministe).
 * Renvoie les ids des modèles NON disponibles pour la période. Sans dates → [].
 *
 * La dispo dépend du modèle ET des dates (démontre le mécanisme pour la démo).
 * Phase 2 : remplacer le corps par un appel Supabase (RPC/vue
 * `available_models(start, end)` croisant le calendrier des réservations),
 * signature inchangée → zéro composant touché.
 */
export async function getUnavailableModelIds(
  models: ScooterModel[],
  startDate: string,
  endDate: string
): Promise<string[]> {
  if (!startDate || !endDate) return [];
  return models
    .filter((model) => !isMockAvailable(model.id, startDate, endDate))
    .map((model) => model.id);
}

/** Mock : ~1 modèle sur 5 indisponible, stable pour un couple (modèle, dates). */
function isMockAvailable(id: string, start: string, end: string): boolean {
  return hashString(`${id}|${start}|${end}`) % 5 !== 0;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}
