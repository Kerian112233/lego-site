'use client';

import {useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import {useRouter} from '@/i18n/navigation';
import {DateSearch} from '@/components/date-search';
import {ModelDetailPanel} from '@/components/model-detail-panel';
import {modelGalleryPhotos, getGalleryKey} from '@/lib/data/gallery';
import {cn} from '@/lib/utils';
import type {ScooterModel} from '@/lib/data/types';
import type {Locale} from '@/i18n/routing';

type ModelOrGroup =
  | {type: 'single'; model: ScooterModel}
  | {type: 'group'; variants: ScooterModel[]};

function groupKey(item: ModelOrGroup): string {
  return item.type === 'group'
    ? 'group:' + item.variants[0].variant_group
    : 'single:' + item.model.id;
}

/** Clé de la carte contenant ce modèle (une famille peut avoir des variantes). */
function keyOfModel(
  grouped: ModelOrGroup[],
  modelId?: string
): string | null {
  if (!modelId) return null;
  const item = grouped.find((g) =>
    g.type === 'group'
      ? g.variants.some((v) => v.id === modelId)
      : g.model.id === modelId
  );
  return item ? groupKey(item) : null;
}

function groupModels(models: ScooterModel[]): ModelOrGroup[] {
  const result: ModelOrGroup[] = [];
  const groupMap = new Map<string, ScooterModel[]>();
  const seen = new Set<string>();

  for (const m of models) {
    if (m.variant_group) {
      if (!groupMap.has(m.variant_group)) {
        groupMap.set(m.variant_group, []);
      }
      groupMap.get(m.variant_group)!.push(m);
    }
  }

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

function FamilyCard({
  item,
  locale,
  availableCount,
  unavailable,
  onClick
}: {
  item: ModelOrGroup;
  locale: Locale;
  /**
   * Nb de scooters de la FAMILLE libres sur la période, ou undefined quand on
   * n'a pas de dates / pas de correspondance au parc (on n'affirme rien).
   */
  availableCount?: number;
  unavailable: boolean;
  onClick: () => void;
}) {
  const ts = useTranslations('search');
  const tc = useTranslations('catalog');
  const rep = item.type === 'group' ? item.variants[0] : item.model;
  const cover = rep.image_url ?? '/scooters/placeholder.svg';

  const minPrice =
    item.type === 'group'
      ? Math.min(...item.variants.map((v) => v.prices.low))
      : item.model.prices.low;

  const nf = new Intl.NumberFormat(locale);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-muted text-left transition-transform duration-200 active:scale-95',
        unavailable && 'opacity-50 grayscale'
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cover}
        alt={rep.name}
        loading="lazy"
        className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-sm font-bold leading-tight text-white">{rep.name}</p>
        <p className="mt-0.5 text-xs text-white/75">
          {/* Prix/JOUR (basse saison) : l'ancien libellé « / mois » trompait le client. */}
          {tc('fromShort')}{' '}
          <span className="font-semibold text-white">{nf.format(minPrice)} ฿</span>{' '}
          {tc('perDay')}
        </p>
      </div>
      {/* Pastilles du haut dans UNE rangée qui passe à la ligne : sur mobile
          (2 cartes par ligne), « 14 dispos » et « 2 modèles » positionnées
          séparément se chevauchaient. */}
      {(availableCount !== undefined || item.type === 'group') && (
        <div className="absolute left-2 right-2 top-2 flex flex-wrap items-start justify-between gap-1">
          {availableCount !== undefined && (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium text-white',
                availableCount === 0 ? 'bg-black/60' : 'bg-primary'
              )}
            >
              {ts('availableBadge', {count: availableCount})}
            </span>
          )}
          {item.type === 'group' && (
            <span className="ml-auto rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
              {tc('variantsCount', {count: item.variants.length})}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

export function ScooterCatalog({
  models,
  locale,
  unavailableIds,
  availableByModelId,
  range,
  openModelId
}: {
  models: ScooterModel[];
  locale: Locale;
  unavailableIds: string[];
  /** Dispo sur la période, par id de modèle (valeur de la FAMILLE en base). */
  availableByModelId: Record<string, number>;
  range?: {start: string; end: string};
  /**
   * `?model=` : modèle à rouvrir au chargement. Posé par le CTA « Voir la
   * disponibilité » d'une carte, qui passe d'abord par le calendrier — le
   * visiteur retrouve son modèle, cette fois daté.
   */
  openModelId?: string;
}) {
  const t = useTranslations('catalog');
  const ts = useTranslations('search');
  const router = useRouter();

  const grouped = useMemo(() => groupModels(models), [models]);
  const unavailable = useMemo(() => new Set(unavailableIds), [unavailableIds]);

  const [selectedKey, setSelectedKey] = useState<string | null>(() =>
    keyOfModel(grouped, openModelId)
  );

  // Le composant peut rester monté d'une navigation à l'autre (seuls les
  // searchParams changent) : on suit la prop, pas seulement l'init. Ajustement
  // pendant le rendu plutôt qu'en effet — pas de rendu en cascade.
  // Dans LES DEUX SENS : `?model=` retiré (lien « Scooters » du header) referme
  // le panneau ; avant, il restait ouvert sur une URL sans dates. Un panneau
  // ouvert d'un clic sur une carte ne touche pas à l'URL → non concerné.
  const [lastOpenModelId, setLastOpenModelId] = useState(openModelId);
  if (openModelId !== lastOpenModelId) {
    setLastOpenModelId(openModelId);
    setSelectedKey(keyOfModel(grouped, openModelId));
  }

  const selected = useMemo(
    () => grouped.find((item) => groupKey(item) === selectedKey) ?? null,
    [grouped, selectedKey]
  );

  /** Retour à la grille : on retire aussi `?model=` pour que l'URL ne rouvre
      pas le panneau au rafraîchissement. */
  function closePanel() {
    setSelectedKey(null);
    if (openModelId) {
      router.replace({
        pathname: '/scooters',
        query: range ? {start: range.start, end: range.end} : {}
      });
    }
  }

  /**
   * Le compteur base est un compteur de FAMILLE : toutes les variantes d'une
   * carte partagent la même valeur. On la lit sur les variantes connues du parc
   * (undefined = modèle sans équivalent en base → aucun compteur affiché).
   */
  const cardAvailability = (item: ModelOrGroup) => {
    const variants = item.type === 'group' ? item.variants : [item.model];
    const counts = variants
      .map((v) => availableByModelId[v.id])
      .filter((c): c is number => typeof c === 'number');
    if (counts.length === 0) return undefined;
    return Math.max(...counts);
  };

  if (selected) {
    const rep = selected.type === 'group' ? selected.variants[0] : selected.model;
    const galleryKey = getGalleryKey(rep.name, rep.variant_group);
    const photos = modelGalleryPhotos[galleryKey] ?? [rep.image_url ?? ''];
    const variantModels =
      selected.type === 'group' ? selected.variants : [selected.model];

    return (
      <div className="mt-8">
        <ModelDetailPanel
          /* Remonte le panneau d'une famille à l'autre : variante choisie et
             index photo ne doivent pas survivre au changement de modèle. */
          key={groupKey(selected)}
          models={variantModels}
          galleryPhotos={photos}
          locale={locale}
          unavailableIds={unavailableIds}
          availableCount={cardAvailability(selected)}
          range={range}
          initialModelId={openModelId}
          onBack={closePanel}
        />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <DateSearch
        defaultStart={range?.start ?? ''}
        defaultEnd={range?.end ?? ''}
        submitLabel={ts('update')}
        className="mx-auto max-w-sm"
      />

      {/*
        Le compteur par carte vient de `get_availability_for_dates` (dispo réelle
        sur la période demandée). Ici on n'annonce que la taille du catalogue.
      */}
      <p className="mb-6 mt-6 text-center text-sm text-muted-foreground">
        {t('results', {count: models.length})}
      </p>

      {range && (
        <p className="mb-6 -mt-4 text-center text-sm text-muted-foreground">
          {ts('availabilityOnRequest')}
        </p>
      )}

      {grouped.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          {t('noResults')}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {grouped.map((item) => {
            const key = groupKey(item);
            const variants = item.type === 'group' ? item.variants : [item.model];
            return (
              <FamilyCard
                key={key}
                item={item}
                locale={locale}
                availableCount={cardAvailability(item)}
                unavailable={variants.every((v) => unavailable.has(v.id))}
                onClick={() => setSelectedKey(key)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
