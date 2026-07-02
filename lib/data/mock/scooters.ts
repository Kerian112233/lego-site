import type {ScooterModel} from '../types';

/**
 * Fixture Phase 1 : catalogue mock typé EXACTEMENT comme la vue
 * `public_scooter_models` (§5.1). Vit derrière le data layer (models.ts) —
 * les composants ne l'importent jamais en direct.
 *
 * Phase 2 : cette fixture disparaît, `getScooterModels()` lira Supabase.
 * (Prix en THB/jour, contexte Phuket. Images = placeholder à remplacer.)
 */
export const mockScooterModels: ScooterModel[] = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    name: 'Honda Click 125i',
    brand: 'Honda',
    category: 'Automatique 125cc',
    cc: 125,
    description_fr:
      'Le scooter urbain par excellence : léger, économique et parfait pour se faufiler dans Patong.',
    description_en:
      'The go-to city scooter: light, fuel-efficient and perfect for weaving through Patong.',
    price_per_day: 250,
    price_per_week: 1400,
    price_per_month: 3500,
    image_url: '/scooters/placeholder.svg',
    sort_order: 1,
    is_active: true
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    name: 'Yamaha NMAX 155',
    brand: 'Yamaha',
    category: 'Automatique 155cc',
    cc: 155,
    description_fr:
      'Confort et puissance pour explorer toute l’île, y compris les routes de colline vers Kata et Karon.',
    description_en:
      'Comfort and power to explore the whole island, including the hill roads to Kata and Karon.',
    price_per_day: 350,
    price_per_week: 2000,
    price_per_month: 5000,
    image_url: '/scooters/placeholder.svg',
    sort_order: 2,
    is_active: true
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    name: 'Honda PCX 160',
    brand: 'Honda',
    category: 'Automatique 160cc',
    cc: 160,
    description_fr:
      'Le best-seller : coffre spacieux, tenue de route irréprochable, idéal pour les trajets à deux.',
    description_en:
      'The best-seller: roomy under-seat storage, rock-solid handling, ideal for riding two-up.',
    price_per_day: 400,
    price_per_week: 2300,
    price_per_month: 5800,
    image_url: '/scooters/placeholder.svg',
    sort_order: 3,
    is_active: true
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    name: 'Yamaha XMAX 300',
    brand: 'Yamaha',
    category: 'Maxi-scooter',
    cc: 300,
    description_fr:
      'Maxi-scooter pour les longues distances : Phuket Town, Promthep, l’aéroport, sans effort.',
    description_en:
      'Maxi-scooter for long distances: Phuket Town, Promthep, the airport — effortlessly.',
    price_per_day: 700,
    price_per_week: 4200,
    price_per_month: 11000,
    image_url: '/scooters/placeholder.svg',
    sort_order: 4,
    is_active: true
  },
  {
    id: '11111111-1111-1111-1111-111111111105',
    name: 'Honda ADV 160',
    brand: 'Honda',
    category: 'ADV',
    cc: 160,
    description_fr:
      'Look aventure et suspensions surélevées pour les routes moins lisses du nord de l’île.',
    description_en:
      'Adventure styling and raised suspension for the rougher roads of the island’s north.',
    price_per_day: 450,
    price_per_week: 2600,
    price_per_month: 6500,
    image_url: '/scooters/placeholder.svg',
    sort_order: 5,
    is_active: true
  },
  {
    id: '11111111-1111-1111-1111-111111111106',
    name: 'Honda Scoopy 110',
    brand: 'Honda',
    category: 'Automatique 110cc',
    cc: 110,
    description_fr:
      'Mignon, ultra-maniable et très économique : le premier deux-roues idéal pour débuter.',
    description_en:
      'Cute, ultra-nimble and very cheap to run: the ideal first scooter for beginners.',
    price_per_day: 200,
    price_per_week: 1100,
    price_per_month: 2800,
    image_url: '/scooters/placeholder.svg',
    sort_order: 6,
    // Exemple d'entrée inactive : ne doit JAMAIS apparaître (filtrée par getScooterModels).
    is_active: false
  }
];
