/** Photos réelles par famille de modèle. Phase 2 : remplacé par Supabase. */
export const modelGalleryPhotos: Record<string, string[]> = {
  pcx160: [
    '/scooters/PCX160-noir.JPG',
    '/scooters/PCX-GRIS.JPG',
    '/scooters/PCX160-noir-rouge.JPG',
  ],
  nmax: [
    '/scooters/Nmax-noir.JPG',
    '/scooters/NMAX-noir-2.JPG',
    '/scooters/NMAX-noir-5.JPG',
    '/scooters/NMAX-blanc-2.JPG',
    '/scooters/NMAX-bleu.JPG',
    '/scooters/NMAX-bleu-clair.JPG',
    '/scooters/NMAX-gris.JPG',
    '/scooters/NMAX-gris-2.JPG',
  ],
  adv160: [
    '/scooters/ADV160-noir.JPG',
    '/scooters/ADV160-rouge.JPG',
    '/scooters/Adv-160-rouge.JPG',
    '/scooters/ADV160-blanc-2.JPG',
    '/scooters/ADV160-blanc-3.JPG',
    '/scooters/ADV160-blanc-4.JPG',
    '/scooters/ADV160-bleu.JPG',
    '/scooters/ADV160-bleu-2.JPG',
    '/scooters/ADV160-gris.JPG',
    '/scooters/ADV160-gris-2.JPG',
    '/scooters/ADV160-gris-3.JPG',
  ],
  xmax300: [
    '/scooters/xmax.jpg',
  ],
  tmax: [
    '/scooters/TMAX-noir.JPG',
    '/scooters/TMAX-noir-2.JPG',
    '/scooters/TMAX-gris.JPG',
    '/scooters/TMAX-gris-2.JPG',
    '/scooters/TMAX-marron.JPG',
    '/scooters/TMAX530-gris.JPG',
    '/scooters/TMAX560-noir-2.JPG',
    '/scooters/TMAX560-noir-3.JPG',
    '/scooters/TMAX560-noir-4.JPG',
    '/scooters/TMAX560-noir-6.JPG',
    '/scooters/TMAX560-noir-7.JPG',
    '/scooters/TMAX560-noir-8.JPG',
    '/scooters/TMAX560-noir-argent.JPG',
    '/scooters/TMAX560-argent.JPG',
    '/scooters/TMAX560-argent-2.JPG',
    '/scooters/TMAX560-marron.JPG',
  ],
  xadv: [
    '/scooters/XADV-noir.JPG',
    '/scooters/XADV-noir-2.JPG',
    '/scooters/XADV-noir-3.JPG',
    '/scooters/XADV-noir-4.JPG',
    '/scooters/XADV-gris.JPG',
    '/scooters/XADV-gris-2.JPG',
    '/scooters/XADV-gris-3.JPG',
    '/scooters/XADV-gris-4.JPG',
    '/scooters/XADV-gris-5.JPG',
    '/scooters/XADV-argent.JPG',
    '/scooters/XADV-argent-2.JPG',
    '/scooters/XADV-bleu.JPG',
    '/scooters/XADV-rouge.JPG',
  ],
};

export function getGalleryKey(name: string, variantGroup?: string): string {
  if (variantGroup) return variantGroup;
  return name
    .toLowerCase()
    .replace(/^(honda|yamaha)\s+/i, '')
    .replace(/[\s-]+/g, '')
    .replace(/[^a-z0-9]/g, '');
}
