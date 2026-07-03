'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {useRouter} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';

const todayISO = () => new Date().toISOString().slice(0, 10);

const controlClass =
  'h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

/**
 * Recherche par dates → redirige vers /scooters?start&end.
 *
 * Inputs `type="date"` NATIFS : sur mobile (iOS/Android) le sélecteur natif
 * s'ouvre au touch de façon fiable, là où un calendrier JS custom échouait.
 * Navigation via router.push (client-side, même origine) — pas de window.open.
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
  const router = useRouter();
  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!start || !end) return;
    router.push({pathname: '/scooters', query: {start, end}});
  }

  return (
    <form onSubmit={onSubmit} className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">
            {t('arrival')}
          </span>
          <input
            type="date"
            min={todayISO()}
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className={controlClass}
          />
        </label>
        <label className="flex-1">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">
            {t('departure')}
          </span>
          <input
            type="date"
            min={start || todayISO()}
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className={controlClass}
          />
        </label>
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={!start || !end}
        className="h-11 w-full"
      >
        {submitLabel ?? t('submit')}
      </Button>
    </form>
  );
}
