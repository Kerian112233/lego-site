import {setRequestLocale} from 'next-intl/server';
import {Section} from '@/components/section';

/**
 * STUB — Étape 3 : formulaire → submitBookingRequest() → redirection WhatsApp.
 * (Structure en place, implémentation détaillée à venir.)
 */
export default async function ReserverPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <Section title="Réserver" subtitle="Étape 3 — formulaire de demande à venir.">
      <div />
    </Section>
  );
}
