'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {useRouter} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';

const todayISO = () => new Date().toISOString().slice(0, 10);

const controlClass =
  'h-10 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

/**
 * Recherche par dates → redirige vers /scooters?start&end.
 * Utilisé dans le hero (recherche) et en haut du catalogue (mise à jour).
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
    router.push({pathname: '/scooters', query: {start, end}});
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn('flex flex-col gap-3 sm:flex-row sm:items-end', className)}
    >
      <div className="flex-1">
        <label
          htmlFor="search-start"
          className="mb-1 block text-xs font-medium text-muted-foreground"
        >
          {t('arrival')}
        </label>
        <input
          id="search-start"
          type="date"
          min={todayISO()}
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className={controlClass}
        />
      </div>
      <div className="flex-1">
        <label
          htmlFor="search-end"
          className="mb-1 block text-xs font-medium text-muted-foreground"
        >
          {t('departure')}
        </label>
        <input
          id="search-end"
          type="date"
          min={start || todayISO()}
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className={controlClass}
        />
      </div>
      <Button
        type="submit"
        disabled={!start || !end}
        className="h-10 w-full sm:w-auto"
      >
        {submitLabel ?? t('submit')}
      </Button>
    </form>
  );
}
