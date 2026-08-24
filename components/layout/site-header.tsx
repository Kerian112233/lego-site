import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {Logo} from './logo';
import {navLinks} from './nav-links';
import {LanguageSwitcher} from './language-switcher';
import {MobileNav} from './mobile-nav';
import type {Locale} from '@/i18n/routing';

export function SiteHeader({locale: _locale}: {locale: Locale}) {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />

        {/* Desktop — les ancres n'apparaissent qu'à partir de lg : en dessous,
            la barre déborderait (logo + 5 liens + langue + CTA). */}
        <nav className="hidden items-center gap-5 text-sm font-medium md:flex lg:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={cn(
                'text-muted-foreground transition-colors hover:text-foreground',
                link.anchor && 'hidden lg:inline'
              )}
            >
              {t(`nav.${link.key}`)}
            </Link>
          ))}
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
