/**
 * Forme des CONTENUS éditables par le client (frontière i18n — cf. CLAUDE.md).
 * Tout ce qui est ici est éditorial et pilotable sans toucher au code :
 * accroches, textes de sections, FAQ, zones de livraison.
 * Le chrome produit (nav, boutons, labels de formulaire) vit dans messages/*.json.
 *
 * content/fr.ts et content/en.ts doivent tous deux satisfaire `SiteContent`.
 */

export interface ContentItem {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface DeliveryZone {
  name: string;
  /** Prix affiché tel quel, ex: "Gratuit" / "100 ฿". */
  price: string;
}

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  modelsPreview: {
    title: string;
    subtitle: string;
    cta: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: ContentItem[];
  };
  allInclusive: {
    title: string;
    subtitle: string;
    items: ContentItem[];
  };
  whyUs: {
    title: string;
    subtitle: string;
    items: ContentItem[];
  };
  deliveryZones: {
    title: string;
    subtitle: string;
    note: string;
    zones: DeliveryZone[];
  };
  faq: {
    title: string;
    subtitle: string;
    items: FaqItem[];
  };
  hoursMap: {
    title: string;
    subtitle: string;
  };
  /** En-tête de la page catalogue /scooters. */
  catalog: {
    title: string;
    subtitle: string;
  };
  /** En-tête de la page /reserver. */
  reserve: {
    title: string;
    subtitle: string;
  };
}
