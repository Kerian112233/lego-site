'use client';

import {useState} from 'react';
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

/** Date locale (YYYY-MM-DD) sans décalage de fuseau. */
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
 * Recherche par dates via calendrier de plage (arrivée → départ) →
 * redirige vers /scooters?start&end. Utilisé dans le hero et le catalogue.
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
  const [range, setRange] = useState<DateRange | undefined>(() => {
    const from = parseISO(defaultStart);
    return from ? {from, to: parseISO(defaultEnd)} : undefined;
  });

  const fmt = (d: Date) =>
    new Intl.DateTimeFormat(locale, {day: 'numeric', month: 'short'}).format(d);

  const label = range?.from
    ? range.to
      ? `${fmt(range.from)} — ${fmt(range.to)}`
      : fmt(range.from)
    : t('datesPlaceholder');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!range?.from || !range?.to) return;
    router.push({
      pathname: '/scooters',
      query: {start: toISO(range.from), end: toISO(range.to)}
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn('flex flex-col gap-3 sm:flex-row sm:items-center', className)}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full justify-start gap-2 font-normal sm:flex-1"
            />
          }
        >
          <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className={cn(!range?.from && 'text-muted-foreground')}>
            {label}
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={range}
            onSelect={(next) => {
              setRange(next);
              if (next?.from && next?.to) setOpen(false);
            }}
            numberOfMonths={1}
            disabled={{before: new Date()}}
            locale={locale === 'fr' ? fr : enUS}
            autoFocus
          />
        </PopoverContent>
      </Popover>

      <Button
        type="submit"
        disabled={!range?.from || !range?.to}
        className="h-11 w-full sm:w-auto"
      >
        {submitLabel ?? t('submit')}
      </Button>
    </form>
  );
}
