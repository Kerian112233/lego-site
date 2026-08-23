import 'server-only';
import {mockScooterModels} from './mock/scooters';
import {getFamilyAvailability, resolveFamily} from './availability';
import type {ScooterModel} from './types';

/**
 * SEUL point de lecture du catalogue (CLAUDE.md règle 2).
 *
 * Le CATALOGUE reste un mock local : la vue `public_scooter_models` prévue au
 * kickoff §5.1 n'est PAS déployée (la base n'expose en anon que
 * `get_public_availability` et `create_client_lead`). Prix, descriptions et
 * photos restent donc pilotés par le repo. Seule la DISPO vient de la base
 * (cf. getUnavailableModelIds).
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
 * Disponibilité — branchée sur la RPC `get_public_availability()` (Phase 2).
 *
 * Renvoie les ids des modèles à considérer comme INDISPONIBLES.
 * Règle : un modèle est indisponible si la famille correspondante au parc réel
 * affiche `available_now === 0`. Un modèle sans famille reconnue n'est jamais
 * grisé (on ne prive pas le visiteur d'un modèle faute de mapping).
 *
 * ⚠️ LIMITE ASSUMÉE — `startDate`/`endDate` ne sont PAS transmises à la base :
 * la RPC déployée ne prend aucune plage de dates et ne sait répondre que
 * « libre maintenant ». Les dates ne servent donc qu'à déclencher le filtrage
 * côté page (comportement Phase 1 conservé). Le jour où une RPC datée existe
 * (ex. `available_models(start, end)`), seul le corps de cette fonction change.
 */
export async function getUnavailableModelIds(
  models: ScooterModel[],
  startDate: string,
  endDate: string
): Promise<string[]> {
  if (!startDate || !endDate) return [];

  const availability = await getFamilyAvailability();
  if (availability.length === 0) return [];

  const families = availability.map((row) => row.family);
  const soldOut = new Set(
    availability.filter((row) => row.available_now <= 0).map((row) => row.family)
  );

  return models
    .filter((model) => {
      const family = resolveFamily(model, families);
      return family !== null && soldOut.has(family);
    })
    .map((model) => model.id);
}
