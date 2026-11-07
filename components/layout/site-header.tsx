import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';
import {Logo} from './logo';
import {AnchorLink} from './anchor-link';
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

        {/* Desktop à partir de lg seulement : en dessous, la barre complète
            déborderait (logo + 5 liens + langue + CTA). UN seul point de bascule
            avec le menu burger (MobileNav, `lg:hidden`) : avant, entre 768 et
            1023 px (iPad portrait), les ancres n'étaient dans AUCUN des deux. */}
        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {navLinks.map((link) => {
            const className =
              'text-muted-foreground transition-colors hover:text-foreground';
            return link.anchor ? (
              <AnchorLink key={link.key} href={link.href} className={className}>
                {t(`nav.${link.key}`)}
              </AnchorLink>
            ) : (
              <Link key={link.key} href={link.href} className={className}>
                {t(`nav.${link.key}`)}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
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
