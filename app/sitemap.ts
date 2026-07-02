import type {MetadataRoute} from 'next';
import {clientConfig} from '@/config/client';
import {routing} from '@/i18n/routing';

/** Routes du produit (mêmes pour tout client) — préfixées par locale. */
const ROUTES = ['', '/scooters', '/reserver'];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = clientConfig.site.url;

  return routing.locales.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: `${base}/${locale}${route}`,
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${base}/${l}${route}`])
        )
      }
    }))
  );
}
