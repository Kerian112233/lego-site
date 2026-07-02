'use client';

import {useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {cn} from '@/lib/utils';
import {submitBookingRequest} from '@/lib/data/booking';
import type {BookingPayload, ScooterModel} from '@/lib/data/types';

type FormState = {
  full_name: string;
  nationality: string;
  email: string;
  phone: string;
  model_id: string;
  start_date: string;
  end_date: string;
  pickup_zone: string;
  pickup_address: string;
  message: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const todayISO = () => new Date().toISOString().slice(0, 10);

const controlClass =
  'flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive';

/**
 * Formulaire de demande de réservation (Phase 1, front-only).
 * Au submit → submitBookingRequest() construit le lien wa.me RÉEL et on redirige.
 * Aucune donnée n'est appelée en direct : modèles & zones arrivent en props
 * (dérivés du data layer / config par la page serveur).
 */
export function BookingForm({
  models,
  zones,
  defaultModelId
}: {
  models: ScooterModel[];
  zones: {name: string}[];
  defaultModelId?: string;
}) {
  const t = useTranslations('form');
  const tw = useTranslations('whatsapp');
  const locale = useLocale();

  const [values, setValues] = useState<FormState>({
    full_name: '',
    nationality: '',
    email: '',
    phone: '',
    model_id:
      defaultModelId && models.some((m) => m.id === defaultModelId)
        ? defaultModelId
        : '',
    start_date: '',
    end_date: '',
    pickup_zone: '',
    pickup_address: '',
    message: ''
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

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
    if (!values.full_name.trim()) e.full_name = required;
    if (!values.phone.trim()) e.phone = required;
    if (!values.model_id) e.model_id = required;
    if (!values.pickup_zone) e.pickup_zone = required;
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

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    const model = models.find((m) => m.id === values.model_id);
    const payload: BookingPayload = {
      full_name: values.full_name.trim(),
      nationality: values.nationality.trim() || null,
      email: values.email.trim() || null,
      phone: values.phone.trim(),
      model_id: values.model_id,
      start_date: values.start_date,
      end_date: values.end_date,
      pickup_zone: values.pickup_zone,
      pickup_address: values.pickup_address.trim() || null,
      message: values.message.trim() || null,
      locale: locale === 'en' ? 'en' : 'fr',
      source: 'website'
    };

    // Message WhatsApp structuré : TOUT ce que le client a saisi, pour que LEXO
    // ait besoin de rien d'autre. Les champs optionnels vides sont omis.
    const composeMessage = (reference: string) => {
      const lines: (string | null)[] = [
        tw('bookingIntro'),
        '',
        `${t('fullName')} : ${payload.full_name}`,
        payload.nationality ? `${t('nationality')} : ${payload.nationality}` : null,
        `${t('model')} : ${model?.name ?? ''}`,
        `${tw('datesLabel')} : ${values.start_date} → ${values.end_date}`,
        `${t('pickupZone')} : ${values.pickup_zone}`,
        payload.pickup_address
          ? `${t('pickupAddress')} : ${payload.pickup_address}`
          : null,
        `${t('phone')} : ${payload.phone}`,
        payload.email ? `${t('email')} : ${payload.email}` : null,
        payload.message ? `${t('message')} : ${payload.message}` : null,
        '',
        `${tw('referenceLabel')} : ${reference}`
      ];
      return lines.filter((line) => line !== null).join('\n');
    };

    const result = await submitBookingRequest(payload, composeMessage);
    // Redirection WhatsApp réelle (fonctionne sans backend).
    window.location.href = result.whatsappUrl;
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mx-auto mt-10 max-w-2xl space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="full_name" label={t('fullName')} error={errors.full_name} required className="sm:col-span-2">
          <Input
            id="full_name"
            value={values.full_name}
            onChange={set('full_name')}
            aria-invalid={!!errors.full_name}
            autoComplete="name"
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
                {m.name}
              </option>
            ))}
          </select>
        </Field>

        <Field id="pickup_zone" label={t('pickupZone')} error={errors.pickup_zone} required>
          <select
            id="pickup_zone"
            value={values.pickup_zone}
            onChange={set('pickup_zone')}
            aria-invalid={!!errors.pickup_zone}
            className={controlClass}
          >
            <option value="" disabled>
              {t('selectZone')}
            </option>
            {zones.map((z) => (
              <option key={z.name} value={z.name}>
                {z.name}
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
          id="pickup_address"
          label={`${t('pickupAddress')} (${t('optional')})`}
        >
          <Input
            id="pickup_address"
            value={values.pickup_address}
            onChange={set('pickup_address')}
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

      <p className="text-sm text-muted-foreground">{t('redirectNote')}</p>

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? t('submitting') : t('submit')}
      </Button>
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
