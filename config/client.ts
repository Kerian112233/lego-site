import type {SiteContent} from '@/content/types';
import {fr} from '@/content/fr';
import {en} from '@/content/en';
import type {FontKey} from '@/lib/fonts';
import type {Locale} from '@/i18n/routing';

/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  SOURCE UNIQUE du spécifique client (CLAUDE.md règle 1).                   │
 * │  Nouveau client = éditer ce fichier + déposer un logo. Zéro composant.    │
 * │  LEXO (client #1) n'est qu'une valeur d'exemple.                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

export interface ThemeConfig {
  /** Couleurs de marque, injectées en CSS vars côté serveur (aucune couleur en dur). */
  colors: {
    primary: string;
    primaryForeground: string;
    accent: string;
    accentForeground: string;
    ring: string;
  };
  /** Typo : clés de polices chargées dans lib/fonts.ts. */
  fonts: {
    body: FontKey;
    heading: FontKey;
  };
  /** Rayon des coins (shadcn --radius). */
  radius: string;
}

export interface ClientConfig {
  /** URL canonique du site (domaine du client) — sert au SEO (metadataBase, sitemap). */
  site: {
    url: string;
  };
  brand: {
    name: string;
    /** Chemins dans /public. */
    logo: string;
    favicon: string;
    tagline: string;
    /** Visuel hero (asset client, /public). Placeholder tant que non fourni. */
    heroImage: string;
  };
  theme: ThemeConfig;
  contact: {
    /** Numéro WhatsApp international SANS `+` (ex: 66XXXXXXXXX). */
    whatsappNumber: string;
    phoneDisplay: string;
    email: string;
    address: string;
    /** Lien vers Google Maps (bouton "itinéraire"). */
    mapUrl: string;
    /** URL d'embed iframe Google Maps. */
    mapEmbedUrl: string;
    /** Lien vers la fiche Google (bouton "voir tous les avis"). */
    googleReviewsUrl: string;
  };
  booking: {
    /** Préfixe des références lisibles, ex: "LEXO" → LEXO-2026-0042. */
    referencePrefix: string;
  };
  pricing: {
    /** ฿ pour 1 € — conversion indicative affichée sous les prix (ajustable). */
    thbPerEur: number;
  };
  /** Contenus éditoriaux par locale (frontière i18n : cf. content/types.ts). */
  content: Record<Locale, SiteContent>;
}

export const clientConfig: ClientConfig = {
  site: {
    // ⚠️ Placeholder — domaine réel du client à confirmer avant mise en ligne.
    url: 'https://lexo.example'
  },
  brand: {
    name: 'LEXO',
    logo: '/brand/logo.svg',
    favicon: '/brand/favicon.svg',
    tagline: 'Location de scooters à Phuket — récents et assurés',
    heroImage: '/brand/image-1784169125499.jpg'
  },
  theme: {
    // Palette LEXO d'exemple : teal océan + accent ambre tropical.
    colors: {
      primary: '#0d9488',
      primaryForeground: '#ffffff',
      accent: '#f59e0b',
      accentForeground: '#1c1917',
      ring: '#0d9488'
    },
    fonts: {
      body: 'inter',
      heading: 'poppins'
    },
    radius: '0.75rem'
  },
  contact: {
    // Numéro WhatsApp international SANS "+".
    whatsappNumber: '33673954147',
    phoneDisplay: '+33 6 73 95 41 47',
    email: 'contact@lexo.example', // placeholder — à fournir par le client
    address: '201/6 Na Nai Road, Kathu, Phuket 83150',
    mapUrl: 'https://maps.google.com/?q=201/6+Na+Nai+Road+Kathu+Phuket+83150',
    mapEmbedUrl:
      'https://www.google.com/maps?q=201/6+Na+Nai+Road+Kathu+Phuket+83150&output=embed',
    googleReviewsUrl: 'https://share.google/qf2A0PPv8qgOvNIeo'
  },
  booking: {
    referencePrefix: 'LEXO'
  },
  pricing: {
    thbPerEur: 38 // indicatif — à ajuster
  },
  content: {fr, en}
};
