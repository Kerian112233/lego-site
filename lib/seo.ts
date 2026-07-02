import type {Metadata} from 'next';
import {routing, type Locale} from '@/i18n/routing';
import {clientConfig} from '@/config/client';

/**
 * Métadonnées d'une page localisée : canonical correct + hreflang + OpenGraph.
 * `path` = chemin sans locale (ex: '/scooters', '' pour la home).
 * `metadataBase` est hérité du root layout.
 */
export function buildPageMetadata({
  locale,
  path,
  title,
  description
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const languages = Object.fromEntries(
    routing.locales.map((loc) => [loc, `/${loc}${path}`])
  );

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {...languages, 'x-default': `/${routing.defaultLocale}${path}`}
    },
    openGraph: {
      type: 'website',
      siteName: clientConfig.brand.name,
      title,
      description,
      url: `/${locale}${path}`,
      locale
    }
  };
}
