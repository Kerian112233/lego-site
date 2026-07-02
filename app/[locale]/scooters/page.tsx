import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {resolveLocale} from '@/i18n/routing';
import {clientConfig} from '@/config/client';
import {getScooterModels} from '@/lib/data/models';
import {buildPageMetadata} from '@/lib/seo';
import {Section} from '@/components/section';
import {ScooterCatalog} from '@/components/scooter-catalog';

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
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const activeLocale = resolveLocale(locale);
  const content = clientConfig.content[activeLocale];
  const models = await getScooterModels();

  return (
    <Section title={content.catalog.title} subtitle={content.catalog.subtitle}>
      <ScooterCatalog models={models} locale={activeLocale} />
    </Section>
  );
}
