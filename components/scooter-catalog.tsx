'use client';

import {useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/button';
import {ScooterCard} from '@/components/scooter-card';
import {DateSearch} from '@/components/date-search';
import type {ScooterModel} from '@/lib/data/types';
import type {Locale} from '@/i18n/routing';

const ALL = '__all__';

/**
 * Catalogue : recherche par dates + filtre catégorie + grille responsive.
 * Ne suppose RIEN sur le nombre de modèles. Dispo par dates simulée côté serveur
 * (getUnavailableModelIds) : les indispos sont grisés, pas masqués.
 */
export function ScooterCatalog({
  models,
  locale,
  unavailableIds,
  range
}: {
  models: ScooterModel[];
  locale: Locale;
  unavailableIds: string[];
  range?: {start: string; end: string};
}) {
  const t = useTranslations('catalog');
  const ts = useTranslations('search');
  const [category, setCategory] = useState<string>(ALL);
  const unavailable = useMemo(() => new Set(unavailableIds), [unavailableIds]);

  // Catégories uniques dans l'ordre d'apparition (donc trié par sort_order).
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const m of models) {
      if (!seen.has(m.category)) {
        seen.add(m.category);
        list.push(m.category);
      }
    }
    return list;
  }, [models]);

  const filtered = useMemo(() => {
    const list =
      category === ALL
        ? models
        : models.filter((m) => m.category === category);
    if (!range) return list;
    // Dates sélectionnées : on montre tout mais on remonte les disponibles.
    return [...list].sort(
      (a, b) =>
        (unavailable.has(a.id) ? 1 : 0) - (unavailable.has(b.id) ? 1 : 0)
    );
  }, [models, category, range, unavailable]);

  const availableCount = filtered.filter((m) => !unavailable.has(m.id)).length;

  return (
    <div className="mt-8">
      <DateSearch
        defaultStart={range?.start ?? ''}
        defaultEnd={range?.end ?? ''}
        submitLabel={ts('update')}
        className="mx-auto max-w-sm"
      />

      {categories.length > 1 && (
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
          role="group"
          aria-label={t('filterLabel')}
        >
          <FilterPill active={category === ALL} onClick={() => setCategory(ALL)}>
            {t('allCategories')}
          </FilterPill>
          {categories.map((cat) => (
            <FilterPill
              key={cat}
              active={category === cat}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </FilterPill>
          ))}
        </div>
      )}

      <p className="mb-6 mt-6 text-center text-sm text-muted-foreground">
        {range
          ? ts('available', {count: availableCount})
          : t('results', {count: filtered.length})}
      </p>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          {t('noResults')}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((model) => (
            <ScooterCard
              key={model.id}
              model={model}
              locale={locale}
              available={!unavailable.has(model.id)}
              range={range}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={active ? 'default' : 'outline'}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
