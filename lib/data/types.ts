/**
 * Contrats d'interface du data layer (kickoff §5).
 * Ces types sont le POINT FIXE entre Phase 1 (mock) et Phase 2 (Supabase) :
 * on remplacera l'implémentation de models.ts / booking.ts, jamais ces types
 * ni les composants qui les consomment.
 */

/** Clés de saison tarifaire (le calendrier des saisons vit dans content.seasons). */
export type SeasonKey = 'low' | 'high' | 'peak';

/**
 * §5.1 — miroir de la future vue publique `public_scooter_models`.
 * Tarification SAISONNIÈRE : un prix/jour par saison (basse / haute / peak).
 * Phase 2 : la vue Supabase devra exposer ces colonnes de prix par saison.
 */
export interface ScooterModel {
  id: string;
  name: string;
  brand: string;
  category: string;
  cc: number;
  description_fr: string;
  description_en: string;
  /** Prix/jour par saison (฿). */
  prices: Record<SeasonKey, number>;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  /** Regroupe les variantes d'un même modèle (ex: 'tmax', 'nmax', 'xadv'). */
  variant_group?: string;
  /** Label court affiché dans le sélecteur de variante (ex: 'Iron', '2023'). */
  variant_label?: string;
}

/**
 * Payload du formulaire de demande.
 *
 * ⚠️ Le contrat kickoff §5.2 (`create_booking_request(payload jsonb)`) n'a PAS
 * été déployé. La RPC réellement en prod est :
 *   create_client_lead(p_first_name, p_last_name, p_phone, p_email,
 *                      p_nationality, p_message, p_scooter_interest)
 * → pas de dates, pas de model_id, pas de zone de livraison en colonne.
 *
 * Ce type reste le contrat côté SITE (ce que le formulaire collecte) ;
 * `lib/data/booking.ts` fait la traduction vers les paramètres de la RPC :
 * dates + modèle sont sérialisés dans `p_message`, le modèle est dupliqué
 * dans `p_scooter_interest`.
 *
 * `pickup_zone` / `pickup_address` du §5.2 ont été retirés : LEXO ne livre pas
 * et la RPC n'a aucune colonne pour les stocker (ils partaient déjà vides).
 */
export interface BookingPayload {
  /** Requis par la RPC (`p_first_name`). */
  first_name: string;
  /** Requis par la RPC (`p_last_name`) — « — » si non fourni. */
  last_name: string;
  nationality: string | null;
  email: string | null;
  phone: string;
  /** Id du modèle dans le catalogue local (mock) — sert au site, pas à la base. */
  model_id: string;
  /** Libellé lisible du modèle, envoyé tel quel dans `p_scooter_interest`. */
  model_label: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  message: string | null;
  locale: 'fr' | 'en';
  source: 'website';
}

/** Succès : identifiant du lead créé + référence lisible dérivée. */
export interface BookingResult {
  request_id: string;
  reference: string;
}

/**
 * Retour de la server action `submitBookingRequest`.
 * Union discriminée plutôt qu'une exception : le formulaire doit pouvoir
 * afficher un message précis (anti-spam refusé vs. panne serveur) sans
 * transformer une erreur attendue en crash.
 */
export type BookingActionResult =
  | ({ok: true} & BookingResult)
  | {ok: false; error: 'validation' | 'turnstile' | 'server'};
