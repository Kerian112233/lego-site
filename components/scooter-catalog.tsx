'use client';

import {useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/button';
import {ScooterCard} from '@/components/scooter-card';
import type {ScooterModel} from '@/lib/data/types';
import type {Locale} from '@/i18n/routing';

const ALL = '__all__';

/**
 * Catalogue : filtre par catégorie + grille responsive.
 * Ne suppose RIEN sur le nombre de modèles (grille qui scale, catégories
 * dérivées de la donnée, état vide géré). Les modèles arrivent déjà triés par
 * sort_order depuis getScooterModels().
 */
export function ScooterCatalog({
  models,
  locale
}: {
  models: ScooterModel[];
  locale: Locale;
}) {
  const t = useTranslations('catalog');
  const [category, setCategory] = useState<string>(ALL);

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

  const filtered = useMemo(
    () =>
      category === ALL
        ? models
        : models.filter((m) => m.category === category),
    [models, category]
  );

  return (
    <div className="mt-10">
      {categories.length > 1 && (
        <div
          className="mb-8 flex flex-wrap items-center justify-center gap-2"
          role="group"
          aria-label={t('filterLabel')}
        >
          <FilterPill
            active={category === ALL}
            onClick={() => setCategory(ALL)}
          >
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

      <p className="mb-6 text-center text-sm text-muted-foreground">
        {t('results', {count: filtered.length})}
      </p>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          {t('noResults')}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((model) => (
            <ScooterCard key={model.id} model={model} locale={locale} />
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
