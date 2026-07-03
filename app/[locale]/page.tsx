import {setRequestLocale} from 'next-intl/server';
import {clientConfig} from '@/config/client';
import {getScooterModels} from '@/lib/data/models';
import type {Locale} from '@/i18n/routing';
import {Hero} from '@/components/sections/hero';
import {ModelsPreview} from '@/components/sections/models-preview';
import {HowItWorks} from '@/components/sections/how-it-works';
import {AllInclusive} from '@/components/sections/all-inclusive';
import {Options} from '@/components/sections/options';
import {Reviews} from '@/components/sections/reviews';
import {Faq} from '@/components/sections/faq';
import {HoursMap} from '@/components/sections/hours-map';

export default async function HomePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const content = clientConfig.content[locale as Locale];
  const models = await getScooterModels();

  return (
    <>
      <Hero content={content.hero} />
      <ModelsPreview
        content={content.modelsPreview}
        models={models}
        locale={locale as Locale}
      />
      <HowItWorks content={content.howItWorks} />
      <AllInclusive content={content.allInclusive} />
      <Options content={content.options} />
      <Reviews content={content.reviews} />
      <Faq content={content.faq} />
      <HoursMap content={content.hoursMap} hours={content.openingHours} />
    </>
  );
}
