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
