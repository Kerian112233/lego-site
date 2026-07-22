'use client';

import {useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardFooter} from '@/components/ui/card';
import {cn} from '@/lib/utils';
import {clientConfig} from '@/config/client';
import type {ScooterModel, SeasonKey} from '@/lib/data/types';
import type {Locale} from '@/i18n/routing';

const SEASONS = ['low', 'high', 'peak'] as const satisfies readonly SeasonKey[];

export function ScooterCard({
  model: initialModel,
  variants,
  locale,
  available = true,
  range,
  unavailableIds = []
}: {
  model: ScooterModel;
  variants?: ScooterModel[];
  locale: Locale;
  available?: boolean;
  range?: {start: string; end: string};
  unavailableIds?: string[];
}) {
  const t = useTranslations('catalog');
  const ts = useTranslations('search');
  const seasons = clientConfig.content[locale].seasons;
  const [selectedId, setSelectedId] = useState(initialModel.id);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasVariants = variants && variants.length > 1;
  const model = hasVariants
    ? (variants.find((v) => v.id === selectedId) ?? initialModel)
    : initialModel;

  const unavailable = new Set(unavailableIds);
  const isAvailable = hasVariants ? !unavailable.has(model.id) : available;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const nf = new Intl.NumberFormat(locale);
  const eurFmt = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2
  });
  const thb = (value: number) => `${nf.format(value)} ฿`;
  const eur = (value: number) =>
    eurFmt.format(value / clientConfig.pricing.thbPerEur);

  const description =
    locale === 'fr' ? model.description_fr : model.description_en;

  const reserveHref = range
    ? {
        pathname: '/reserver' as const,
        query: {model: model.id, start: range.start, end: range.end}
      }
    : {pathname: '/reserver' as const, query: {model: model.id}};

  const selectedVariant = hasVariants
    ? variants.find((v) => v.id === selectedId)
    : null;

  return (
    <Card
      className={cn(
        'flex h-full flex-col overflow-hidden pt-0',
        !isAvailable && 'opacity-60'
      )}
    >
      <div className="relative aspect-[4/3] bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={model.image_url || '/scooters/placeholder.svg'}
          alt={model.name}
          loading="lazy"
          className={cn('size-full object-cover', !isAvailable && 'grayscale')}
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium shadow-sm">
          {model.category}
        </span>
      </div>

      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-lg font-semibold">{model.name}</h3>
          <span className="shrink-0 text-sm text-muted-foreground">
            {model.cc} {t('cc')}
          </span>
        </div>

        {hasVariants && (
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2 text-left transition-colors hover:bg-muted/70"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Modèle
              </span>
              <span className="flex flex-1 items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">
                  {selectedVariant?.variant_label}
                </span>
                <svg
                  className={cn(
                    'shrink-0 text-muted-foreground transition-transform duration-200',
                    open && 'rotate-180'
                  )}
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </span>
            </button>

            {open && (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-border bg-background shadow-lg">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(v.id);
                      setOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between px-3 py-2.5 text-sm transition-colors hover:bg-muted/60',
                      v.id === selectedId
                        ? 'font-semibold text-primary'
                        : 'text-foreground'
                    )}
                  >
                    {v.variant_label}
                    {v.id === selectedId && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {description}
        </p>

        <div className="mt-auto divide-y divide-border rounded-lg border border-border">
          {SEASONS.map((key) => (
            <div
              key={key}
              className="flex items-start justify-between gap-3 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium leading-tight">
                  {seasons[key].name}
                </p>
                <p className="text-xs leading-tight text-muted-foreground">
                  {seasons[key].period}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm leading-tight">
                  <span className="text-muted-foreground">{t('from')} </span>
                  <span className="font-bold text-primary">
                    {thb(model.prices[key])}
                  </span>
                </p>
                <p className="text-xs leading-tight text-muted-foreground">
                  = {eur(model.prices[key])}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        {isAvailable ? (
          <Button
            className="w-full"
            nativeButton={false}
            render={<Link href={reserveHref} />}
          >
            {t('bookThisModel')}
          </Button>
        ) : (
          <Button className="w-full" variant="secondary" disabled>
            {ts('unavailable')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
