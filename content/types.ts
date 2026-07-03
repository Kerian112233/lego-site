/**
 * Forme des CONTENUS éditables par le client (frontière i18n — cf. CLAUDE.md).
 * Tout ce qui est ici est éditorial et pilotable sans toucher au code :
 * accroches, textes de sections, FAQ, options.
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

export interface OptionItem {
  name: string;
  description: string;
}

export interface ReviewItem {
  author: string;
  /** Badge optionnel affiché sous le nom, ex: "Local Guide". */
  location?: string;
  /** Photo optionnelle jointe à l'avis (chemin /public). */
  photo?: string;
  text: string;
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
  /** Options / accessoires ajoutables au scooter. */
  options: {
    title: string;
    subtitle: string;
    note: string;
    items: OptionItem[];
  };
  faq: {
    title: string;
    subtitle: string;
    items: FaqItem[];
  };
  /** Avis clients (note globale + avis mis en avant). */
  reviews: {
    title: string;
    subtitle: string;
    /** Note moyenne, ex: 4.9. */
    rating: number;
    /** Nombre total d'avis Google. */
    count: number;
    items: ReviewItem[];
  };
  hoursMap: {
    title: string;
    subtitle: string;
  };
  /** Horaires d'ouverture (libellé de jour localisé + plage horaire). */
  openingHours: {
    day: string;
    time: string;
  }[];
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
