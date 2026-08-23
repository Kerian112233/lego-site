'use client';

import {useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {TurnstileWidget} from '@/components/turnstile-widget';
import {cn} from '@/lib/utils';
import {clientConfig} from '@/config/client';
import {submitBookingRequest} from '@/lib/data/booking';
import {buildWhatsAppUrl} from '@/lib/data/whatsapp';
import type {BookingPayload, ScooterModel} from '@/lib/data/types';

type FormState = {
  first_name: string;
  last_name: string;
  nationality: string;
  email: string;
  phone: string;
  model_id: string;
  start_date: string;
  end_date: string;
  message: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const todayISO = () => new Date().toISOString().slice(0, 10);

/** Vide en dev / Phase 1 → widget non rendu et vérification serveur désactivée. */
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

const controlClass =
  'flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive';

/**
 * Formulaire de demande de réservation (Phase 2, branché base).
 *
 * Séquence au submit : validation locale → server action
 * (`submitBookingRequest` : Turnstile vérifié côté serveur, puis RPC
 * `create_client_lead`) → SEULEMENT ensuite ouverture de wa.me avec la
 * référence renvoyée par la base.
 *
 * Le lien WhatsApp est aussi affiché en clair après l'envoi : si iOS Safari
 * bloque la navigation automatique (geste utilisateur consommé par l'attente
 * réseau), le visiteur garde un bouton à taper. Le lead, lui, est déjà en base.
 *
 * Aucune donnée n'est appelée en direct : les modèles arrivent en props
 * (dérivés du data layer par la page serveur).
 */
export function BookingForm({
  models,
  defaultModelId,
  defaultStart,
  defaultEnd
}: {
  models: ScooterModel[];
  defaultModelId?: string;
  defaultStart?: string;
  defaultEnd?: string;
}) {
  const t = useTranslations('form');
  const tw = useTranslations('whatsapp');
  const locale = useLocale();

  const [values, setValues] = useState<FormState>({
    first_name: '',
    last_name: '',
    nationality: '',
    email: '',
    phone: '',
    model_id:
      defaultModelId && models.some((m) => m.id === defaultModelId)
        ? defaultModelId
        : '',
    start_date: defaultStart ?? '',
    end_date: defaultEnd ?? '',
    message: ''
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);

  const set =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) =>
      setValues((v) => ({...v, [key]: e.target.value}));

  function validate(): Errors {
    const e: Errors = {};
    const required = t('errors.required');
    if (!values.first_name.trim()) e.first_name = required;
    if (!values.last_name.trim()) e.last_name = required;
    if (!values.phone.trim()) e.phone = required;
    if (!values.model_id) e.model_id = required;
    if (!values.start_date) e.start_date = required;
    if (!values.end_date) e.end_date = required;

    if (values.start_date && values.start_date < todayISO())
      e.start_date = t('errors.datePast');
    if (
      values.start_date &&
      values.end_date &&
      values.end_date < values.start_date
    )
      e.end_date = t('errors.dateOrder');
    if (
      values.email.trim() &&
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email.trim())
    )
      e.email = t('errors.email');

    return e;
  }

  /** Libellé lisible du modèle, envoyé tel quel en base (`scooter_interest`). */
  function modelLabel(model: ScooterModel | undefined): string {
    if (!model) return '';
    return model.variant_label
      ? `${model.name} (${model.variant_label})`
      : model.name;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const model = models.find((m) => m.id === values.model_id);
    const label = modelLabel(model);

    const payload: BookingPayload = {
      first_name: values.first_name.trim(),
      last_name: values.last_name.trim(),
      nationality: values.nationality.trim() || null,
      email: values.email.trim() || null,
      phone: values.phone.trim(),
      model_id: values.model_id,
      model_label: label,
      start_date: values.start_date,
      end_date: values.end_date,
      message: values.message.trim() || null,
      locale: locale === 'en' ? 'en' : 'fr',
      source: 'website'
    };

    setSubmitting(true);
    setFormError(null);

    const result = await submitBookingRequest(payload, turnstileToken);

    if (!result.ok) {
      setSubmitting(false);
      // Un token Turnstile est à usage unique : on relance un challenge.
      setTurnstileToken(null);
      setTurnstileKey((k) => k + 1);
      setFormError(t(`errors.${result.error}`));
      return;
    }

    // Message WhatsApp structuré : TOUT ce que le client a saisi, pour que LEXO
    // ait besoin de rien d'autre. Les champs optionnels vides sont omis.
    const lines: (string | null)[] = [
      tw('bookingIntro'),
      '',
      `${t('fullName')} : ${payload.first_name} ${payload.last_name}`,
      payload.nationality ? `${t('nationality')} : ${payload.nationality}` : null,
      `${t('model')} : ${label}`,
      `${tw('datesLabel')} : ${values.start_date} → ${values.end_date}`,
      `${t('phone')} : ${payload.phone}`,
      payload.email ? `${t('email')} : ${payload.email}` : null,
      payload.message ? `${t('message')} : ${payload.message}` : null,
      '',
      `${tw('referenceLabel')} : ${result.reference}`
    ];

    const url = buildWhatsAppUrl(
      clientConfig.contact.whatsappNumber,
      lines.filter((line) => line !== null).join('\n')
    );

    // Le lead est enregistré : on garde le lien à l'écran AVANT de naviguer,
    // pour qu'un blocage de navigation ne laisse jamais le visiteur sans issue.
    setFallbackUrl(url);
    window.location.href = url;
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mx-auto mt-10 max-w-2xl space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="first_name" label={t('firstName')} error={errors.first_name} required>
          <Input
            id="first_name"
            value={values.first_name}
            onChange={set('first_name')}
            aria-invalid={!!errors.first_name}
            autoComplete="given-name"
          />
        </Field>

        <Field id="last_name" label={t('lastName')} error={errors.last_name} required>
          <Input
            id="last_name"
            value={values.last_name}
            onChange={set('last_name')}
            aria-invalid={!!errors.last_name}
            autoComplete="family-name"
          />
        </Field>

        <Field id="model_id" label={t('model')} error={errors.model_id} required>
          <select
            id="model_id"
            value={values.model_id}
            onChange={set('model_id')}
            aria-invalid={!!errors.model_id}
            className={controlClass}
          >
            <option value="" disabled>
              {t('selectModel')}
            </option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {modelLabel(m)}
              </option>
            ))}
          </select>
        </Field>

        <Field id="start_date" label={t('startDate')} error={errors.start_date} required>
          <Input
            id="start_date"
            type="date"
            min={todayISO()}
            value={values.start_date}
            onChange={set('start_date')}
            aria-invalid={!!errors.start_date}
          />
        </Field>

        <Field id="end_date" label={t('endDate')} error={errors.end_date} required>
          <Input
            id="end_date"
            type="date"
            min={values.start_date || todayISO()}
            value={values.end_date}
            onChange={set('end_date')}
            aria-invalid={!!errors.end_date}
          />
        </Field>

        <Field id="phone" label={t('phone')} error={errors.phone} required>
          <Input
            id="phone"
            type="tel"
            value={values.phone}
            onChange={set('phone')}
            aria-invalid={!!errors.phone}
            autoComplete="tel"
            placeholder="+66…"
          />
        </Field>

        <Field id="email" label={`${t('email')} (${t('optional')})`} error={errors.email}>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={set('email')}
            aria-invalid={!!errors.email}
            autoComplete="email"
          />
        </Field>

        <Field id="nationality" label={`${t('nationality')} (${t('optional')})`}>
          <Input
            id="nationality"
            value={values.nationality}
            onChange={set('nationality')}
          />
        </Field>

        <Field
          id="message"
          label={`${t('message')} (${t('optional')})`}
          className="sm:col-span-2"
        >
          <Textarea
            id="message"
            rows={4}
            value={values.message}
            onChange={set('message')}
          />
        </Field>
      </div>

      {TURNSTILE_SITE_KEY && (
        <TurnstileWidget
          siteKey={TURNSTILE_SITE_KEY}
          locale={locale}
          resetKey={turnstileKey}
          onToken={setTurnstileToken}
        />
      )}

      <p className="text-sm text-muted-foreground">{t('redirectNote')}</p>

      {formError && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {formError}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? t('submitting') : t('submit')}
      </Button>

      {fallbackUrl && (
        <p className="text-center text-sm text-muted-foreground">
          {t('fallbackNote')}{' '}
          <a
            href={fallbackUrl}
            className="font-medium text-primary underline underline-offset-4"
          >
            {t('openWhatsApp')}
          </a>
        </p>
      )}
    </form>
  );
}

function Field({
  id,
  label,
  error,
  required,
  className,
  children
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
