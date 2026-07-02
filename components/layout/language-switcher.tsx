'use client';

import {useTransition} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';

/** Bascule de locale en conservant le chemin courant. */
export function LanguageSwitcher() {
  const t = useTranslations('language');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1 text-sm" aria-label={t('label')}>
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          disabled={isPending || loc === locale}
          onClick={() =>
            startTransition(() => router.replace(pathname, {locale: loc}))
          }
          className={
            loc === locale
              ? 'font-semibold text-foreground'
              : 'text-muted-foreground transition-colors hover:text-foreground'
          }
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
