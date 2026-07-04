'use client';

import {useEffect, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {CalendarIcon} from 'lucide-react';
import type {DateRange} from 'react-day-picker';
import {enUS, fr} from 'react-day-picker/locale';
import {useRouter} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {cn} from '@/lib/utils';

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
 * Recherche par dates via calendrier de plage (arrivée → départ) → /scooters.
 *
 * Un SEUL calendrier partout (95% des clients sont sur mobile) :
 *  - 1 mois sur mobile (tient dans l'écran), 2 mois sur desktop (responsive).
 *  - Reste ouvert pendant la sélection ; c'est le bouton DANS le panneau qui
 *    valide (fiable au tap, pas de double-clic).
 */
export function DateSearch({
  defaultStart = '',
  defaultEnd = '',
  submitLabel,
  className
}: {
  defaultStart?: string;
  defaultEnd?: string;
  submitLabel?: string;
  className?: string;
}) {
  const t = useTranslations('search');
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [months, setMonths] = useState(1);
  const [range, setRange] = useState<DateRange | undefined>(() => {
    const from = parseISO(defaultStart);
    return from ? {from, to: parseISO(defaultEnd)} : undefined;
  });

  // 2 mois sur desktop, 1 sur mobile (résolu côté client avant l'ouverture).
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setMonths(mq.matches ? 2 : 1);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const fmt = (d: Date) =>
    new Intl.DateTimeFormat(locale, {day: 'numeric', month: 'short'}).format(d);

  const label = range?.from
    ? range.to
      ? `${fmt(range.from)} — ${fmt(range.to)}`
      : fmt(range.from)
    : t('datesPlaceholder');

  function apply() {
    if (!range?.from || !range?.to) return;
    setOpen(false);
    router.push({
      pathname: '/scooters',
      query: {start: toISO(range.from), end: toISO(range.to)}
    });
  }

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full justify-start gap-2 font-normal"
            />
          }
        >
          <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className={cn(!range?.from && 'text-muted-foreground')}>
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
            onSelect={setRange}
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
              className="w-full"
              disabled={!range?.from || !range?.to}
              onClick={apply}
            >
              {submitLabel ?? t('submit')}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
