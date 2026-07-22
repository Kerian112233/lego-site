'use client';

import {useState} from 'react';
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

  const hasVariants = variants && variants.length > 1;
  const model = hasVariants
    ? (variants.find((v) => v.id === selectedId) ?? initialModel)
    : initialModel;

  const unavailable = new Set(unavailableIds);
  const isAvailable = hasVariants
    ? !unavailable.has(model.id)
    : available;

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
          <div className="flex flex-wrap gap-1.5">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedId(v.id)}
                className={cn(
                  'rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
                  v.id === model.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:border-primary hover:text-primary'
                )}
              >
                {v.variant_label}
              </button>
            ))}
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
