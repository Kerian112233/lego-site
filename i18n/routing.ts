import {defineRouting} from 'next-intl/routing';
import {hasLocale} from 'next-intl';

/**
 * Locales actives du produit. fr = défaut (cf. kickoff §2).
 * Les locales sont structurelles (produit), pas spécifiques client.
 */
export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr'
});

export type Locale = (typeof routing.locales)[number];

/** Restreint une string de segment [locale] au type Locale (fallback = défaut). */
export function resolveLocale(value: string): Locale {
  return hasLocale(routing.locales, value) ? value : routing.defaultLocale;
}
