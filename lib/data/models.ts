import 'server-only';
import {mockScooterModels} from './mock/scooters';
import {getAvailabilityForRange, type RangeAvailability} from './availability';
import type {ScooterModel} from './types';

/**
 * SEUL point de lecture du catalogue (CLAUDE.md règle 2).
 *
 * Le CATALOGUE reste un mock local : la vue `public_scooter_models` prévue au
 * kickoff §5.1 n'est PAS déployée (la base n'expose en anon que
 * `get_availability_for_dates` et `create_client_lead`). Prix, descriptions et
 * photos restent donc pilotés par le repo. Seule la DISPO vient de la base
 * (cf. getModelAvailability).
 *
 * Le jour où la vue existe : remplacer UNIQUEMENT le corps de cette fonction
 * par un SELECT anon. Signature inchangée → zéro composant touché.
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
 * Disponibilité sur une période — API du data layer consommée par les pages
 * (CLAUDE.md règle 2).
 *
 * Ne contient AUCUNE logique : elle délègue à `getAvailabilityForRange`
 * (`lib/data/availability.ts`), point de branchement unique côté base, qui
 * interroge la RPC `get_availability_for_dates(p_start, p_end)` avec les dates
 * choisies par le client.
 *
 * Sans dates, on ne demande rien et on n'affirme rien.
 */
export async function getModelAvailability(
  models: ScooterModel[],
  startDate: string,
  endDate: string
): Promise<RangeAvailability> {
  if (!startDate || !endDate) return {unavailableIds: [], availableByModelId: {}};
  return getAvailabilityForRange(models, startDate, endDate);
}
