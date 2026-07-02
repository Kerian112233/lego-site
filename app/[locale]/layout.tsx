import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {routing, type Locale} from '@/i18n/routing';
import {clientConfig} from '@/config/client';
import {buildThemeStyle} from '@/lib/theme';
import {fontVarClassNames} from '@/lib/fonts';
import {SiteHeader} from '@/components/layout/site-header';
import {SiteFooter} from '@/components/layout/site-footer';
import {FloatingWhatsApp} from '@/components/layout/floating-whatsapp';
import '../globals.css';

/**
 * ROOT LAYOUT (le segment [locale] est la racine — pas d'app/layout.tsx).
 * Le thème (CSS vars) est construit CÔTÉ SERVEUR depuis config/client.ts et posé
 * en `style` sur <html> → aucun FOUC.
 */

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const activeLocale: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const description = clientConfig.content[activeLocale].hero.subtitle;

  // hreflang : une entrée par locale + x-default.
  const languages = Object.fromEntries(
    routing.locales.map((loc) => [loc, `/${loc}`])
  );

  return {
    metadataBase: new URL(clientConfig.site.url),
    title: {
      default: `${clientConfig.brand.name} — ${clientConfig.brand.tagline}`,
      template: `%s · ${clientConfig.brand.name}`
    },
    description,
    icons: {icon: clientConfig.brand.favicon},
    alternates: {
      canonical: `/${activeLocale}`,
      languages: {...languages, 'x-default': `/${routing.defaultLocale}`}
    },
    openGraph: {
      type: 'website',
      siteName: clientConfig.brand.name,
      title: clientConfig.brand.name,
      description,
      url: `/${activeLocale}`,
      locale: activeLocale
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // Active le rendu statique pour les composants serveur i18n.
  setRequestLocale(locale);

  const themeStyle = buildThemeStyle(clientConfig.theme);

  return (
    <html
      lang={locale}
      className={fontVarClassNames}
      style={themeStyle}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <NextIntlClientProvider>
          <SiteHeader locale={locale} />
          <main className="flex-1">{children}</main>
          <SiteFooter locale={locale} />
          <FloatingWhatsApp />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
