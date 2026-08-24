'use client';

import {useEffect, useMemo, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {CalendarIcon, ChevronDownIcon} from 'lucide-react';
import type {DateRange} from 'react-day-picker';
import {enUS, fr} from 'react-day-picker/locale';
import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
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

/**
 * Habillage commun des contrôles (input, select, déclencheur de dates) : une
 * seule ligne à changer pour faire bouger tout le formulaire.
 */
const fieldClass =
  'h-12 w-full rounded-xl border-input bg-background px-4 text-base shadow-none transition-colors focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/15 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/20';

function toISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function parseISO(value?: string): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

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
  const ts = useTranslations('search');
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
    <form onSubmit={onSubmit} noValidate className="mx-auto mt-10 max-w-2xl">
      <div className="space-y-8 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
        <Fieldset title={t('sectionRental')}>
          <Field
            id="model_id"
            label={t('model')}
            error={errors.model_id}
            required
            className="sm:col-span-2"
          >
            <div className="relative">
              <select
                id="model_id"
                value={values.model_id}
                onChange={set('model_id')}
                aria-invalid={!!errors.model_id}
                className={cn(
                  fieldClass,
                  'appearance-none border bg-transparent pr-11 outline-none disabled:cursor-not-allowed disabled:opacity-50',
                  !values.model_id && 'text-muted-foreground'
                )}
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
              <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </Field>

          <Field
            id="dates"
            label={t('dates')}
            error={errors.start_date ?? errors.end_date}
            required
            className="sm:col-span-2"
          >
            <DateRangeField
              start={values.start_date}
              end={values.end_date}
              invalid={!!(errors.start_date || errors.end_date)}
              placeholder={ts('datesPlaceholder')}
              onChange={(start_date, end_date) =>
                setValues((v) => ({...v, start_date, end_date}))
              }
            />
          </Field>
        </Fieldset>

        <Separator />

        <Fieldset title={t('sectionContact')}>
          <Field
            id="first_name"
            label={t('firstName')}
            error={errors.first_name}
            required
          >
            <Input
              id="first_name"
              className={fieldClass}
              value={values.first_name}
              onChange={set('first_name')}
              aria-invalid={!!errors.first_name}
              autoComplete="given-name"
            />
          </Field>

          <Field
            id="last_name"
            label={t('lastName')}
            error={errors.last_name}
            required
          >
            <Input
              id="last_name"
              className={fieldClass}
              value={values.last_name}
              onChange={set('last_name')}
              aria-invalid={!!errors.last_name}
              autoComplete="family-name"
            />
          </Field>

          <Field id="phone" label={t('phone')} error={errors.phone} required>
            <Input
              id="phone"
              type="tel"
              className={fieldClass}
              value={values.phone}
              onChange={set('phone')}
              aria-invalid={!!errors.phone}
              autoComplete="tel"
              placeholder="+66…"
            />
          </Field>

          <Field
            id="email"
            label={t('email')}
            hint={t('optional')}
            error={errors.email}
          >
            <Input
              id="email"
              type="email"
              className={fieldClass}
              value={values.email}
              onChange={set('email')}
              aria-invalid={!!errors.email}
              autoComplete="email"
            />
          </Field>

          <Field
            id="nationality"
            label={t('nationality')}
            hint={t('optional')}
            className="sm:col-span-2"
          >
            <Input
              id="nationality"
              className={fieldClass}
              value={values.nationality}
              onChange={set('nationality')}
              autoComplete="country-name"
            />
          </Field>
        </Fieldset>

        <Separator />

        <Fieldset title={t('sectionExtra')}>
          <Field
            id="message"
            label={t('message')}
            hint={t('optional')}
            className="sm:col-span-2"
          >
            <Textarea
              id="message"
              rows={4}
              className="min-h-28 rounded-xl border-input px-4 py-3 text-base shadow-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/15"
              value={values.message}
              onChange={set('message')}
            />
          </Field>
        </Fieldset>

        <p className="text-xs text-muted-foreground">{t('requiredHint')}</p>
      </div>

      <div className="mt-6 space-y-4">
        {TURNSTILE_SITE_KEY && (
          <TurnstileWidget
            siteKey={TURNSTILE_SITE_KEY}
            locale={locale}
            resetKey={turnstileKey}
            onToken={setTurnstileToken}
          />
        )}

        {formError && (
          <p
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive"
          >
            {formError}
          </p>
        )}

        <Button
          type="submit"
          className="h-12 w-full rounded-xl text-base font-semibold"
          disabled={submitting}
        >
          {submitting ? t('submitting') : t('submit')}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {t('redirectNote')}
        </p>

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
      </div>
    </form>
  );
}

/**
 * Sélecteur de plage arrivée → départ (un seul calendrier, comme la recherche
 * du site). Il ne fait qu'écrire `start_date` / `end_date` dans l'état du
 * formulaire : aucune navigation, aucune logique d'envoi ici.
 */
function DateRangeField({
  start,
  end,
  invalid,
  placeholder,
  onChange
}: {
  start: string;
  end: string;
  invalid: boolean;
  placeholder: string;
  onChange: (start: string, end: string) => void;
}) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [months, setMonths] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setMonths(mq.matches ? 2 : 1);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const range = useMemo<DateRange | undefined>(() => {
    const from = parseISO(start);
    return from ? {from, to: parseISO(end)} : undefined;
  }, [start, end]);

  const fmt = (d: Date) =>
    new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(d);

  const label = range?.from
    ? range.to
      ? `${fmt(range.from)} → ${fmt(range.to)}`
      : fmt(range.from)
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            aria-invalid={invalid}
            className={cn(fieldClass, 'justify-start gap-3 font-normal')}
          />
        }
      >
        <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
        <span className={cn('truncate', !range?.from && 'text-muted-foreground')}>
          {label}
        </span>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto max-w-[calc(100vw-2rem)] p-0"
        align="start"
      >
        <Calendar
          mode="range"
          selected={range}
          onSelect={(next) =>
            onChange(
              next?.from ? toISO(next.from) : '',
              next?.to ? toISO(next.to) : ''
            )
          }
          numberOfMonths={months}
          disabled={{before: new Date()}}
          locale={locale === 'fr' ? fr : enUS}
          className="[--cell-size:2.5rem] p-3"
          autoFocus
        />
        <div className="border-t border-border p-3">
          <Button
            type="button"
            size="lg"
            className="h-11 w-full rounded-xl"
            disabled={!range?.from || !range?.to}
            onClick={() => setOpen(false)}
          >
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** Bloc de champs : un titre, puis une grille 1 → 2 colonnes. */
function Fieldset({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-base font-semibold">{title}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Separator() {
  return <div className="h-px bg-border" />;
}

function Field({
  id,
  label,
  hint,
  error,
  required,
  className,
  children
}: {
  id: string;
  label: string;
  /** Mention discrète à droite du label (ex. « optionnel »). */
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
