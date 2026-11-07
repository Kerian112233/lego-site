import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {redirect} from '@/i18n/navigation';
import {resolveLocale} from '@/i18n/routing';
import {clientConfig} from '@/config/client';
import {getScooterModels} from '@/lib/data/models';
import {buildPageMetadata} from '@/lib/seo';
import {Section} from '@/components/section';
import {BookingForm} from '@/components/booking-form';
import {dateParam} from '@/lib/dates';

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
  /** Next renvoie un tableau pour une clé répétée : jamais de `string` supposé. */
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const activeLocale = resolveLocale(locale);
  const content = clientConfig.content[activeLocale];
  const query = await searchParams;
  // Paramètres d'URL nettoyés : clé répétée ou date impossible (2026-11-31)
  // → ignorés, au lieu de faire planter le rendu ou d'envoyer une date fausse.
  const model = typeof query.model === 'string' ? query.model : undefined;
  const start = dateParam(query.start);
  const end = dateParam(query.end);

  /**
   * Garde-fou du flux « dates d'abord » : un lien vers un MODÈLE précis sans
   * période (URL partagée, favori, ancien lien) repasse par le catalogue daté.
   * Plus aucune UI ne produit ce cas — c'est la ceinture de sécurité.
   * L'accès générique à /reserver (sans `model`) reste ouvert : le visiteur y
   * choisit modèle ET dates dans le formulaire.
   */
  if (model && !(start && end)) {
    redirect({href: {pathname: '/scooters', query: {model}}, locale});
  }

  const models = await getScooterModels();

  return (
    <Section title={content.reserve.title} subtitle={content.reserve.subtitle}>
      <BookingForm
        models={models}
        defaultModelId={model}
        defaultStart={start}
        defaultEnd={end}
      />
    </Section>
  );
}
