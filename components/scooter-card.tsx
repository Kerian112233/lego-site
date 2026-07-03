import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardFooter} from '@/components/ui/card';
import {cn} from '@/lib/utils';
import type {ScooterModel} from '@/lib/data/types';
import type {Locale} from '@/i18n/routing';

/** Carte modèle, alimentée par le contrat ScooterModel (§5.1). */
export function ScooterCard({
  model,
  locale,
  available = true,
  range
}: {
  model: ScooterModel;
  locale: Locale;
  /** Disponible pour les dates sélectionnées (défaut true = pas de recherche par dates). */
  available?: boolean;
  /** Dates sélectionnées, reportées dans le lien de réservation. */
  range?: {start: string; end: string};
}) {
  const t = useTranslations('catalog');
  const ts = useTranslations('search');
  const nf = new Intl.NumberFormat(locale);
  const price = (value: number) => `${nf.format(value)} ฿`;
  const description =
    locale === 'fr' ? model.description_fr : model.description_en;

  const reserveHref = range
    ? {
        pathname: '/reserver' as const,
        query: {model: model.id, start: range.start, end: range.end}
      }
    : {pathname: '/reserver' as const, query: {model: model.id}};

  return (
    <Card
      className={cn(
        'flex h-full flex-col overflow-hidden pt-0',
        !available && 'opacity-60'
      )}
    >
      <div className="relative aspect-[4/3] bg-muted">
        {/* image_url peut être vide (photo pas encore fournie) → placeholder neutre. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={model.image_url || '/scooters/placeholder.svg'}
          alt={model.name}
          loading="lazy"
          className={cn('size-full object-cover', !available && 'grayscale')}
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium shadow-sm">
          {model.category}
        </span>
      </div>

      <CardContent className="flex flex-1 flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-lg font-semibold">{model.name}</h3>
          <span className="shrink-0 text-sm text-muted-foreground">
            {model.cc} {t('cc')}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {description}
        </p>

        <div className="mt-auto pt-2">
          <p>
            <span className="text-sm text-muted-foreground">{t('from')} </span>
            <span className="text-xl font-bold text-primary">
              {price(model.price_per_day)}
            </span>
            <span className="text-sm text-muted-foreground">
              {' '}
              {t('perDay')}
            </span>
          </p>
          {(model.price_per_week || model.price_per_month) && (
            <p className="mt-1 text-xs text-muted-foreground">
              {model.price_per_week && (
                <span>
                  {price(model.price_per_week)} {t('perWeek')}
                </span>
              )}
              {model.price_per_week && model.price_per_month && ' · '}
              {model.price_per_month && (
                <span>
                  {price(model.price_per_month)} {t('perMonth')}
                </span>
              )}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter>
        {available ? (
          <Button
            className="w-full"
            nativeButton={false}
            render={<Link href={reserveHref} />}
          >
            {t('bookThisModel')}
          </Button>
        ) : (
          <Button className="w-full" variant="secondary" disabled>
            {ts('unavailable')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
