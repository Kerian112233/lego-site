'use client';

import {useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';
import {DateSearch} from '@/components/date-search';
import {cn} from '@/lib/utils';
import {clientConfig} from '@/config/client';
import type {ScooterModel, SeasonKey} from '@/lib/data/types';
import type {Locale} from '@/i18n/routing';

const SEASONS = ['low', 'high', 'peak'] as const satisfies readonly SeasonKey[];

export function ModelDetailPanel({
  models,
  galleryPhotos,
  locale,
  unavailableIds,
  availableCount,
  range,
  initialModelId,
  onBack
}: {
  models: ScooterModel[];
  galleryPhotos: string[];
  locale: Locale;
  unavailableIds: string[];
  /**
   * Nb de scooters libres sur la période pour la FAMILLE affichée (la base ne
   * compte pas par variante) — d'où l'affichage collé au titre de famille, et
   * jamais au sélecteur de variante. `undefined` = pas de dates ou modèle sans
   * équivalent au parc : on n'affiche rien.
   */
  availableCount?: number;
  range?: {start: string; end: string};
  /** Variante à présélectionner (retour depuis le calendrier avec `?model=`). */
  initialModelId?: string;
  onBack: () => void;
}) {
  const t = useTranslations('catalog');
  const ts = useTranslations('search');
  const seasons = clientConfig.content[locale].seasons;

  const hasVariants = models.length > 1;
  const [selectedId, setSelectedId] = useState(
    initialModelId && models.some((m) => m.id === initialModelId)
      ? initialModelId
      : models[0].id
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const model = hasVariants
    ? (models.find((v) => v.id === selectedId) ?? models[0])
    : models[0];

  const unavailable = new Set(unavailableIds);
  const isAvailable = !unavailable.has(model.id);

  const nf = new Intl.NumberFormat(locale);
  const eurFmt = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2
  });
  const thb = (v: number) => `${nf.format(v)} ฿`;
  const eur = (v: number) =>
    eurFmt.format(v / clientConfig.pricing.thbPerEur);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  // Sync dot indicator when user swipes
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || galleryPhotos.length <= 1) return;
    const handler = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setPhotoIdx(idx);
    };
    el.addEventListener('scroll', handler, {passive: true});
    return () => el.removeEventListener('scroll', handler);
  }, [galleryPhotos.length]);

  const reserveHref = range
    ? {
        pathname: '/reserver' as const,
        query: {model: model.id, start: range.start, end: range.end}
      }
    : {pathname: '/reserver' as const, query: {model: model.id}};

  const selectedVariant = hasVariants ? models.find((v) => v.id === selectedId) : null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6"/>
        </svg>
        {locale === 'fr' ? 'Retour' : 'Back'}
      </button>

      <h2
        className={cn(
          'text-xl font-bold',
          range && availableCount !== undefined ? 'mb-1' : 'mb-4'
        )}
      >
        {models[0].name}
      </h2>

      {range && availableCount !== undefined && (
        <p
          className={cn(
            'mb-4 text-sm font-medium',
            availableCount === 0 ? 'text-muted-foreground' : 'text-primary'
          )}
        >
          {ts('available', {count: availableCount})}
        </p>
      )}

      {/* Photo gallery — horizontal snap scroll */}
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide"
          style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
        >
          {galleryPhotos.map((src, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={i}
              src={src}
              alt={`${models[0].name} — photo ${i + 1}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              className="aspect-[4/3] w-full shrink-0 snap-center object-cover"
            />
          ))}
        </div>

        {/* Photo counter */}
        {galleryPhotos.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {galleryPhotos.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Photo ${i + 1}`}
                onClick={() => {
                  scrollRef.current?.scrollTo({
                    left: i * (scrollRef.current.clientWidth),
                    behavior: 'smooth'
                  });
                  setPhotoIdx(i);
                }}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === photoIdx
                    ? 'w-5 bg-white'
                    : 'w-1.5 bg-white/50 hover:bg-white/75'
                )}
              />
            ))}
          </div>
        )}

        {/* Photo count badge */}
        <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
          {photoIdx + 1} / {galleryPhotos.length}
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {/* Variant dropdown */}
        {hasVariants && (
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 text-left transition-colors hover:bg-muted/70"
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
                    dropdownOpen && 'rotate-180'
                  )}
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
                {models.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(v.id);
                      setDropdownOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-muted/60',
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

        {/* Price table */}
        <div className="divide-y divide-border rounded-xl border border-border">
          {SEASONS.map((key) => (
            <div
              key={key}
              className="flex items-start justify-between gap-3 px-4 py-3"
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

        {/* CTA — flux « dates d'abord » : sans période choisie, on ne propose
            pas de réserver, on propose de regarder la dispo. */}
        {!range ? (
          <div className="space-y-2">
            <DateSearch
              variant="cta"
              triggerLabel={ts('checkAvailability')}
              submitLabel={ts('checkAvailability')}
              extraQuery={{model: model.id}}
            />
            <p className="text-center text-xs text-muted-foreground">
              {ts('pickDatesFirst')}
            </p>
          </div>
        ) : isAvailable ? (
          <div className="space-y-2">
            <Button
              className="w-full"
              nativeButton={false}
              render={<Link href={reserveHref} />}
            >
              {t('bookThisModel')}
            </Button>
            {/* La base n'a rien répondu pour ce modèle (mode dégradé ou modèle
                sans équivalent au parc) : on ne prétend pas qu'il est libre. */}
            {availableCount === undefined && (
              <p className="text-center text-xs text-muted-foreground">
                {ts('availabilityOnRequest')}
              </p>
            )}
          </div>
        ) : (
          <Button className="w-full" variant="secondary" disabled>
            {ts('unavailable')}
          </Button>
        )}
      </div>
    </div>
  );
}
