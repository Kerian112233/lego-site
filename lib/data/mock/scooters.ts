import type {ScooterModel} from '../types';

/**
 * Flotte LEXO réelle — dérivée du CSV client, regroupée en 7 modèles.
 *
 * Type STRICT = ScooterModel (§5.1), aucun champ en plus → swap Supabase trivial.
 *
 * TODO client :
 *  - prix : `prices` (basse/haute/peak, ฿/jour) = PLACEHOLDERS inventés, à
 *    remplacer par les vrais tarifs. Le calendrier des saisons vit dans
 *    content.seasons.
 *  - description_fr/en : brouillons à relire (// TODO desc).
 *  - image_url : photos client dans /public/scooters/.
 */
export const mockScooterModels: ScooterModel[] = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    name: 'Honda ADV160',
    brand: 'Honda',
    category: 'ADV 160cc',
    cc: 160,
    description_fr:
      'Le SUV des scooters : look aventure, position haute et agilité en ville comme sur les routes de l’île.', // TODO desc
    description_en:
      'The SUV of scooters: adventure looks, an upright ride and agility both in town and on the island’s roads.', // TODO desc
    prices: {low: 350, high: 500, peak: 650},
    image_url: '/scooters/adv160.jpg',
    sort_order: 1,
    is_active: true
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    name: 'Honda X-ADV 750',
    brand: 'Honda',
    category: 'Maxi-scooter',
    cc: 750,
    description_fr:
      'Maxi-trail bicylindre à boîte automatique DCT, pour avaler les distances avec caractère.', // TODO desc
    description_en:
      'Twin-cylinder maxi-trail with automatic DCT gearbox, built to cover distance with character.', // TODO desc
    prices: {low: 1300, high: 1500, peak: 2500}, // TODO prix réels
    image_url: '/scooters/xadv.jpg',
    sort_order: 2,
    is_active: true
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    name: 'Yamaha TMAX 560',
    brand: 'Yamaha',
    category: 'Maxi-scooter',
    cc: 560,
    description_fr:
      'L’icône des maxi-scooters sportifs : puissance, tenue de route et confort sur les longs trajets.', // TODO desc
    description_en:
      'The iconic sport maxi-scooter: power, handling and comfort on longer rides.', // TODO desc
    prices: {low: 1200, high: 1400, peak: 2300}, // TODO prix réels
    image_url: '/scooters/tmax.jpg',
    sort_order: 3,
    is_active: true
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    name: 'Yamaha NMAX 2019/2020',
    brand: 'Yamaha',
    category: 'Automatique 155cc',
    cc: 155,
    description_fr:
      'Compact et économique, parfait pour se faufiler et explorer Phuket au quotidien.', // TODO desc
    description_en:
      'Compact and economical, perfect for weaving through traffic and exploring Phuket day to day.', // TODO desc
    prices: {low: 300, high: 350, peak: 400},
    image_url: '/scooters/nmax.jpg',
    sort_order: 4,
    is_active: true
  },
  {
    id: '11111111-1111-1111-1111-111111111108',
    name: 'Yamaha NMAX 2024-2026',
    brand: 'Yamaha',
    category: 'Automatique 155cc',
    cc: 155,
    description_fr:
      'La dernière génération du NMAX : design modernisé, plus de technologies et toujours aussi agile.', // TODO desc
    description_en:
      'The latest NMAX generation: updated design, more tech and just as nimble.', // TODO desc
    prices: {low: 350, high: 450, peak: 550},
    image_url: '/scooters/nmax.jpg',
    sort_order: 5,
    is_active: true
  },
  {
    id: '11111111-1111-1111-1111-111111111105',
    name: 'Honda ADV350',
    brand: 'Honda',
    category: 'ADV 350cc',
    cc: 350,
    description_fr:
      'L’équilibre idéal entre agilité urbaine et aisance sur route, avec un vrai look aventure.', // TODO desc
    description_en:
      'The ideal balance of city agility and open-road ease, with genuine adventure styling.', // TODO desc
    prices: {low: 800, high: 1000, peak: 1500}, // TODO prix réels
    image_url: '/scooters/adv350.jpg',
    sort_order: 5,
    is_active: true
  },
  {
    id: '11111111-1111-1111-1111-111111111106',
    name: 'Yamaha XMAX 300',
    brand: 'Yamaha',
    category: 'Automatique 300cc',
    cc: 300,
    description_fr:
      'Confortable et polyvalent, un maxi-scooter accessible pour rouler à deux sur toute l’île.', // TODO desc
    description_en:
      'Comfortable and versatile, an accessible maxi-scooter for riding two-up across the island.', // TODO desc
    prices: {low: 700, high: 900, peak: 1300}, // TODO prix réels
    image_url: '/scooters/xmax.jpg',
    sort_order: 6,
    is_active: true
  },
  {
    id: '11111111-1111-1111-1111-111111111107',
    name: 'Honda PCX160',
    brand: 'Honda',
    category: 'Automatique 160cc',
    cc: 160, // TODO cc à confirmer (PCX125 vs PCX160)
    description_fr:
      'Le best-seller élégant : souple, économe et facile à prendre en main.', // TODO desc
    description_en:
      'The elegant best-seller: smooth, fuel-efficient and easy to ride.', // TODO desc
    prices: {low: 350, high: 450, peak: 550},
    image_url: '/scooters/pcx.jpg',
    sort_order: 7,
    is_active: true
  }
];
