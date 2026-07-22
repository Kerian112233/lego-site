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
 * §5.2 — payload attendu par la RPC `create_booking_request(payload jsonb)`.
 */
export interface BookingPayload {
  full_name: string;
  nationality: string | null;
  email: string | null;
  phone: string;
  model_id: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  pickup_zone: string;
  pickup_address: string | null;
  message: string | null;
  locale: 'fr' | 'en';
  source: 'website';
}

/** §5.2 — retour de la RPC. */
export interface BookingResult {
  request_id: string;
  reference: string;
}

/**
 * Retour de `submitBookingRequest`. Étend le contrat §5.2 avec l'URL WhatsApp,
 * que la fonction construit dans les DEUX phases (cf. CLAUDE.md règle 3 & §6).
 */
export interface SubmitBookingResult extends BookingResult {
  whatsappUrl: string;
}
