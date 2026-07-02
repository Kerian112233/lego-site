'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {MenuIcon} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {clientConfig} from '@/config/client';
import {LanguageSwitcher} from './language-switcher';

/** Navigation mobile (burger → panneau latéral). Visible < md uniquement. */
export function MobileNav() {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Ferme le panneau à chaque changement de route (laisse le Link naviguer
  // librement — fermer dans l'onClick annulerait la navigation).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={t('nav.menu')}
          />
        }
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="right" className="w-4/5 max-w-xs">
        <SheetHeader>
          <SheetTitle>{clientConfig.brand.name}</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-4 text-base font-medium">
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
      </SheetContent>
    </Sheet>
  );
}
