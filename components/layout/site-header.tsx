import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';
import {Logo} from './logo';
import {LanguageSwitcher} from './language-switcher';
import {MobileNav} from './mobile-nav';
import type {Locale} from '@/i18n/routing';

export function SiteHeader({locale: _locale}: {locale: Locale}) {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />

        {/* Desktop */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            href="/scooters"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('nav.scooters')}
          </Link>
          <Link
            href="/reserver"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('nav.book')}
          </Link>
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher />
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href="/reserver" />}
          >
            {t('actions.bookNow')}
          </Button>
        </div>

        {/* Mobile */}
        <MobileNav />
      </div>
    </header>
  );
}
