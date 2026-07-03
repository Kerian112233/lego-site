'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {MenuIcon, XIcon} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';
import {clientConfig} from '@/config/client';
import {LanguageSwitcher} from './language-switcher';

/**
 * Navigation mobile (burger → panneau latéral). Visible < md uniquement.
 *
 * Overlay CUSTOM (pas de Dialog/portal Base UI) : trigger = vrai <button onClick>,
 * panneau rendu conditionnellement en fixed. Plus robuste au touch sur iOS Safari
 * qu'un portal Base UI qui peut mal se positionner / ne pas s'ouvrir.
 */
export function MobileNav() {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Ferme le panneau à chaque changement de route.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Bloque le scroll de fond quand le panneau est ouvert.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={t('nav.menu')}
        onClick={() => setOpen(true)}
        className="inline-flex size-9 items-center justify-center rounded-md text-foreground md:hidden"
      >
        <MenuIcon className="size-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-4/5 max-w-xs flex-col bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <span className="font-heading text-lg font-semibold">
                {clientConfig.brand.name}
              </span>
              <button
                type="button"
                aria-label={t('actions.close')}
                onClick={() => setOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-md text-foreground"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 p-4 text-base font-medium">
              <Link
                href="/scooters"
                className="rounded-md py-2.5 text-foreground transition-colors hover:text-primary"
              >
                {t('nav.scooters')}
              </Link>
              <Link
                href="/reserver"
                className="rounded-md py-2.5 text-foreground transition-colors hover:text-primary"
              >
                {t('nav.book')}
              </Link>
            </nav>

            <div className="mt-auto flex flex-col gap-4 p-4">
              <LanguageSwitcher />
              <Button
                className="w-full"
                nativeButton={false}
                render={<Link href="/reserver" />}
              >
                {t('actions.bookNow')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
