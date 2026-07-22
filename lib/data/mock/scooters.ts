import type {ScooterModel} from '../types';

export const mockScooterModels: ScooterModel[] = [
  // ── Groupe 1 : PCX / NMAX / ADV160 ──────────────────────────────────────
  {
    id: '11111111-1111-1111-1111-111111111107',
    name: 'Honda PCX160',
    brand: 'Honda',
    category: 'Automatique 160cc',
    cc: 160,
    description_fr: 'Le best-seller élégant : souple, économe et facile à prendre en main.',
    description_en: 'The elegant best-seller: smooth, fuel-efficient and easy to ride.',
    prices: {low: 350, high: 450, peak: 550},
    image_url: '/scooters/pcx.jpg',
    sort_order: 1,
    is_active: true
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    name: 'Yamaha NMAX 2019/2020',
    brand: 'Yamaha',
    category: 'Automatique 155cc',
    cc: 155,
    description_fr: 'Compact et économique, parfait pour se faufiler et explorer Phuket au quotidien.',
    description_en: 'Compact and economical, perfect for weaving through traffic and exploring Phuket day to day.',
    prices: {low: 300, high: 350, peak: 400},
    image_url: '/scooters/nmax.jpg',
    sort_order: 2,
    is_active: true
  },
  {
    id: '11111111-1111-1111-1111-111111111108',
    name: 'Yamaha NMAX 2024-2026',
    brand: 'Yamaha',
    category: 'Automatique 155cc',
    cc: 155,
    description_fr: 'La dernière génération du NMAX : design modernisé, plus de technologies et toujours aussi agile.',
    description_en: 'The latest NMAX generation: updated design, more tech and just as nimble.',
    prices: {low: 350, high: 450, peak: 550},
    image_url: '/scooters/nmax.jpg',
    sort_order: 3,
    is_active: true
  },
  {
    id: '11111111-1111-1111-1111-111111111101',
    name: 'Honda ADV160',
    brand: 'Honda',
    category: 'ADV 160cc',
    cc: 160,
    description_fr: 'Le SUV des scooters : look aventure, position haute et agilité en ville comme sur les routes de l’île.',
    description_en: 'The SUV of scooters: adventure looks, an upright ride and agility both in town and on the island’s roads.',
    prices: {low: 350, high: 500, peak: 650},
    image_url: '/scooters/adv160.jpg',
    sort_order: 4,
    is_active: true
  },

  // ── Groupe 2 : XMAX 300 ──────────────────────────────────────────────────
  {
    id: '11111111-1111-1111-1111-111111111106',
    name: 'Yamaha XMAX 300',
    brand: 'Yamaha',
    category: 'Automatique 300cc',
    cc: 300,
    description_fr: 'Confortable et polyvalent, un maxi-scooter accessible pour rouler à deux sur toute l’île.',
    description_en: 'Comfortable and versatile, an accessible maxi-scooter for riding two-up across the island.',
    prices: {low: 700, high: 900, peak: 1300},
    image_url: '/scooters/xmax.jpg',
    sort_order: 5,
    is_active: true
  },

  // ── Groupe 3 : TMAX ──────────────────────────────────────────────────────
  {
    id: '11111111-1111-1111-1111-111111111110',
    name: 'Yamaha TMAX Iron',
    brand: 'Yamaha',
    category: 'Maxi-scooter',
    cc: 530,
    description_fr: 'L’édition Iron Max au look mat et musclé, pour ceux qui veulent se démarquer.',
    description_en: 'The Iron Max edition with a matte, muscular look for riders who want to stand out.',
    prices: {low: 900, high: 1100, peak: 1600},
    image_url: '/scooters/tmax.jpg',
    sort_order: 6,
    is_active: true
  },
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Yamaha TMAX DX',
    brand: 'Yamaha',
    category: 'Maxi-scooter',
    cc: 530,
    description_fr: 'Version haut de gamme du TMAX avec poignées chauffantes, pare-brise électrique et selle premium.',
    description_en: 'Top-spec TMAX with heated grips, electric windscreen and premium seat.',
    prices: {low: 1000, high: 1200, peak: 1800},
    image_url: '/scooters/tmax.jpg',
    sort_order: 7,
    is_active: true
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    name: 'Yamaha TMAX 560 2023',
    brand: 'Yamaha',
    category: 'Maxi-scooter',
    cc: 560,
    description_fr: 'L’icône des maxi-scooters sportifs : puissance, tenue de route et confort sur les longs trajets.',
    description_en: 'The iconic sport maxi-scooter: power, handling and comfort on longer rides.',
    prices: {low: 1200, high: 1400, peak: 2300},
    image_url: '/scooters/tmax.jpg',
    sort_order: 8,
    is_active: true
  },
  {
    id: '11111111-1111-1111-1111-111111111112',
    name: 'Yamaha TMAX 560 2024',
    brand: 'Yamaha',
    category: 'Maxi-scooter',
    cc: 560,
    description_fr: 'Le TMAX 560 millésime 2024 : évolutions esthétiques et connectivité améliorée.',
    description_en: 'The 2024 TMAX 560: refined styling and improved connectivity.',
    prices: {low: 1300, high: 1500, peak: 2400},
    image_url: '/scooters/tmax.jpg',
    sort_order: 9,
    is_active: true
  },
  {
    id: '11111111-1111-1111-1111-111111111113',
    name: 'Yamaha TMAX 560 2026',
    brand: 'Yamaha',
    category: 'Maxi-scooter',
    cc: 560,
    description_fr: 'La toute dernière génération du TMAX 560 : la référence absolue des maxi-scooters sportifs.',
    description_en: 'The very latest TMAX 560 generation: the ultimate benchmark in sport maxi-scooters.',
    prices: {low: 1400, high: 1600, peak: 2500},
    image_url: '/scooters/tmax.jpg',
    sort_order: 10,
    is_active: true
  },

  // ── Groupe 4 : X-ADV ─────────────────────────────────────────────────────
  {
    id: '11111111-1111-1111-1111-111111111114',
    name: 'Honda X-ADV 2020',
    brand: 'Honda',
    category: 'Maxi-scooter',
    cc: 750,
    description_fr: 'Maxi-trail bicylindre à boîte automatique DCT, pour avaler les distances avec caractère.',
    description_en: 'Twin-cylinder maxi-trail with automatic DCT gearbox, built to cover distance with character.',
    prices: {low: 1300, high: 1500, peak: 2500},
    image_url: '/scooters/xadv.jpg',
    sort_order: 11,
    is_active: true
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    name: 'Honda X-ADV 2023',
    brand: 'Honda',
    category: 'Maxi-scooter',
    cc: 750,
    description_fr: 'Le X-ADV millésime 2023 : nouvelles optiques LED et équipements enrichis.',
    description_en: 'The 2023 X-ADV: new LED lighting and richer equipment.',
    prices: {low: 1400, high: 1600, peak: 2600},
    image_url: '/scooters/xadv.jpg',
    sort_order: 12,
    is_active: true
  },
  {
    id: '11111111-1111-1111-1111-111111111115',
    name: 'Honda X-ADV 2024',
    brand: 'Honda',
    category: 'Maxi-scooter',
    cc: 750,
    description_fr: 'X-ADV 2024 : look affiné et technologie de pointe pour les explorateurs exigeants.',
    description_en: '2024 X-ADV: sharper looks and cutting-edge tech for the demanding explorer.',
    prices: {low: 1500, high: 1700, peak: 2700},
    image_url: '/scooters/xadv.jpg',
    sort_order: 13,
    is_active: true
  },
  {
    id: '11111111-1111-1111-1111-111111111116',
    name: 'Honda X-ADV 2026',
    brand: 'Honda',
    category: 'Maxi-scooter',
    cc: 750,
    description_fr: 'La toute dernière génération du X-ADV : le summum de l’aventure en scooter.',
    description_en: 'The very latest X-ADV generation: the pinnacle of scooter adventure.',
    prices: {low: 1600, high: 1800, peak: 2900},
    image_url: '/scooters/xadv.jpg',
    sort_order: 14,
    is_active: true
  }
];
