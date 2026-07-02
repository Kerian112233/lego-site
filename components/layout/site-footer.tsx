import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {clientConfig} from '@/config/client';
import type {Locale} from '@/i18n/routing';

export function SiteFooter({locale: _locale}: {locale: Locale}) {
  const t = useTranslations();
  const {brand, contact} = clientConfig;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <p className="font-heading text-lg font-bold">{brand.name}</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            {brand.tagline}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">{t('footer.navigation')}</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/scooters" className="hover:text-foreground">
                {t('nav.scooters')}
              </Link>
            </li>
            <li>
              <Link href="/reserver" className="hover:text-foreground">
                {t('nav.book')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">{t('footer.contact')}</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>{contact.address}</li>
            <li>
              <a href={`mailto:${contact.email}`} className="hover:text-foreground">
                {contact.email}
              </a>
            </li>
            <li>{contact.phoneDisplay}</li>
          </ul>
          <p className="mt-4 text-sm font-semibold">{t('footer.hours')}</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {contact.hours.map((h) => (
              <li key={h.day}>
                {h.day} · {h.time}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-4">
        <p className="mx-auto max-w-6xl px-4 text-xs text-muted-foreground">
          © {year} {brand.name}. {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}
