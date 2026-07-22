'use client';

import {useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/button';
import {ScooterCard} from '@/components/scooter-card';
import {DateSearch} from '@/components/date-search';
import type {ScooterModel} from '@/lib/data/types';
import type {Locale} from '@/i18n/routing';

const ALL = '__all__';

type ModelOrGroup =
  | {type: 'single'; model: ScooterModel}
  | {type: 'group'; variants: ScooterModel[]};

function groupModels(models: ScooterModel[]): ModelOrGroup[] {
  const result: ModelOrGroup[] = [];
  const groupMap = new Map<string, ScooterModel[]>();
  const order: string[] = [];

  for (const m of models) {
    if (m.variant_group) {
      if (!groupMap.has(m.variant_group)) {
        groupMap.set(m.variant_group, []);
        order.push('group:' + m.variant_group);
      }
      groupMap.get(m.variant_group)!.push(m);
    } else {
      order.push('single:' + m.id);
    }
  }

  const seen = new Set<string>();
  for (const m of models) {
    const key = m.variant_group ? 'group:' + m.variant_group : 'single:' + m.id;
    if (seen.has(key)) continue;
    seen.add(key);
    if (m.variant_group) {
      result.push({type: 'group', variants: groupMap.get(m.variant_group)!});
    } else {
      result.push({type: 'single', model: m});
    }
  }
  return result;
}

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
    return [...list].sort(
      (a, b) =>
        (unavailable.has(a.id) ? 1 : 0) - (unavailable.has(b.id) ? 1 : 0)
    );
  }, [models, category, range, unavailable]);

  const grouped = useMemo(() => groupModels(filtered), [filtered]);

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

      {grouped.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          {t('noResults')}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {grouped.map((item) =>
            item.type === 'single' ? (
              <ScooterCard
                key={item.model.id}
                model={item.model}
                locale={locale}
                available={!unavailable.has(item.model.id)}
                range={range}
              />
            ) : (
              <ScooterCard
                key={item.variants[0].variant_group}
                model={item.variants[0]}
                variants={item.variants}
                locale={locale}
                available={item.variants.some((v) => !unavailable.has(v.id))}
                range={range}
                unavailableIds={unavailableIds}
              />
            )
          )}
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
