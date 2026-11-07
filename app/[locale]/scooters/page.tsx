import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {resolveLocale} from '@/i18n/routing';
import {clientConfig} from '@/config/client';
import {getScooterModels, getModelAvailability} from '@/lib/data/models';
import {buildPageMetadata} from '@/lib/seo';
import {Section} from '@/components/section';
import {ScooterCatalog} from '@/components/scooter-catalog';
import {dateParam} from '@/lib/dates';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const {catalog} = clientConfig.content[locale];
  return buildPageMetadata({
    locale,
    path: '/scooters',
    title: catalog.title,
    description: catalog.subtitle
  });
}

export default async function ScootersPage({
  params,
  searchParams
}: {
  params: Promise<{locale: string}>;
  /** Next renvoie un tableau pour une clé répétée : jamais de `string` supposé. */
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const activeLocale = resolveLocale(locale);
  const content = clientConfig.content[activeLocale];
  const models = await getScooterModels();

  const query = await searchParams;
  // Paramètres d'URL nettoyés (clé répétée, date impossible → ignorés).
  const start = dateParam(query.start);
  const end = dateParam(query.end);
  const model = typeof query.model === 'string' ? query.model : undefined;
  const range = start && end ? {start, end} : undefined;
  const {unavailableIds, availableByModelId} = range
    ? await getModelAvailability(models, range.start, range.end)
    : {unavailableIds: [], availableByModelId: {}};

  return (
    <Section title={content.catalog.title} subtitle={content.catalog.subtitle}>
      <ScooterCatalog
        models={models}
        locale={activeLocale}
        unavailableIds={unavailableIds}
        availableByModelId={availableByModelId}
        range={range}
        openModelId={model}
      />
    </Section>
  );
}
