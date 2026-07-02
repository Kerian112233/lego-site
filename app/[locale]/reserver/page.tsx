import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {resolveLocale} from '@/i18n/routing';
import {clientConfig} from '@/config/client';
import {getScooterModels} from '@/lib/data/models';
import {buildPageMetadata} from '@/lib/seo';
import {Section} from '@/components/section';
import {BookingForm} from '@/components/booking-form';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const {reserve} = clientConfig.content[locale];
  return buildPageMetadata({
    locale,
    path: '/reserver',
    title: reserve.title,
    description: reserve.subtitle
  });
}

export default async function ReserverPage({
  params,
  searchParams
}: {
  params: Promise<{locale: string}>;
  searchParams: Promise<{model?: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const activeLocale = resolveLocale(locale);
  const content = clientConfig.content[activeLocale];
  const models = await getScooterModels();
  const {model} = await searchParams;

  return (
    <Section title={content.reserve.title} subtitle={content.reserve.subtitle}>
      <BookingForm
        models={models}
        zones={content.deliveryZones.zones}
        defaultModelId={model}
      />
    </Section>
  );
}
