'use client';

import {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import {useLocale, useTranslations} from 'next-intl';
import {MenuIcon, XIcon} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';
import {clientConfig} from '@/config/client';
import {buildWhatsAppUrl} from '@/lib/data/booking';
import type {Locale} from '@/i18n/routing';
import {LanguageSwitcher} from './language-switcher';

/**
 * Navigation mobile (burger → panneau latéral). Visible < md uniquement.
 * Overlay CUSTOM (pas de portal Base UI) — robuste au touch iOS.
 * Contient : liens, langue, FAQ complète (natif <details>) + contact WhatsApp.
 */
export function MobileNav() {
  const t = useTranslations();
  const tw = useTranslations('whatsapp');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const faq = clientConfig.content[locale].faq;
  const waHref = buildWhatsAppUrl(
    clientConfig.contact.whatsappNumber,
    tw('contactMessage')
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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

      {/* Portal vers <body> : le header a un backdrop-blur qui, sinon, ferait
          résoudre le `fixed` par rapport au header (64px) au lieu du viewport. */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setOpen(false)}
            />
          <div className="absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col bg-background shadow-xl">
            <div className="flex shrink-0 items-center justify-between border-b border-border p-4">
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

            <div className="flex-1 overflow-y-auto overscroll-contain">
              <nav className="flex flex-col px-4 pt-3 text-base font-medium">
                <Link
                  href="/scooters"
                  className="rounded-md py-2.5 text-foreground hover:text-primary"
                >
                  {t('nav.scooters')}
                </Link>
                <Link
                  href="/reserver"
                  className="rounded-md py-2.5 text-foreground hover:text-primary"
                >
                  {t('nav.book')}
                </Link>
              </nav>

              <div className="px-4 py-3">
                <Button
                  className="w-full"
                  nativeButton={false}
                  render={<Link href="/reserver" />}
                >
                  {t('actions.bookNow')}
                </Button>
              </div>

              <div className="border-t border-border px-4 py-3">
                <LanguageSwitcher />
              </div>

              <div className="border-t border-border p-4">
                <p className="mb-2 text-sm font-semibold">{faq.title}</p>
                <div className="space-y-1.5">
                  {faq.items.map((item) => (
                    <details
                      key={item.question}
                      className="group rounded-lg border border-border"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-sm font-medium [&::-webkit-details-marker]:hidden">
                        {item.question}
                        <span className="text-muted-foreground transition-transform group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="px-3 pb-3 text-sm text-muted-foreground">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>

              <div className="border-t border-border p-4">
                <p className="text-sm text-muted-foreground">
                  {tw('otherQuestion')}
                </p>
                <a
                  href={waHref}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5"
                    aria-hidden="true"
                  >
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.87 9.87 0 001.517 5.26l-.999 3.648 3.971-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  {clientConfig.contact.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>,
          document.body
        )}
    </>
  );
}
