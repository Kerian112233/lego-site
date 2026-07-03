import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/button';
import {Section} from '@/components/section';
import {cn} from '@/lib/utils';
import {clientConfig} from '@/config/client';
import type {SiteContent} from '@/content/types';

function Stars({filled = 5}: {filled?: number}) {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {Array.from({length: 5}).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={cn('size-4', i < filled ? 'fill-accent' : 'fill-muted')}
        >
          <path d="M10 1.6l2.6 5.27 5.82.85-4.21 4.1.99 5.8L10 14.9l-5.2 2.72.99-5.8L1.6 7.72l5.82-.85L10 1.6z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewAvatar({author}: {author: string}) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
      {author.charAt(0)}
    </span>
  );
}

export function Reviews({content}: {content: SiteContent['reviews']}) {
  const t = useTranslations('reviews');

  return (
    <Section id="reviews" title={content.title} subtitle={content.subtitle}>
      <div className="mt-8 flex items-center justify-center gap-3">
        <span className="text-4xl font-bold">{content.rating}</span>
        <div>
          <Stars filled={Math.round(content.rating)} />
          <p className="mt-1 text-sm text-muted-foreground">
            {t('count', {count: content.count})}
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {content.items.map((review) => (
          <figure
            key={review.author + review.text}
            className="flex h-full flex-col rounded-xl border border-border bg-background p-6"
          >
            <Stars filled={5} />
            <blockquote className="mt-3 flex-1 text-sm">
              “{review.text}”
            </blockquote>
            {review.photo && (
              // Cliquable (ouvre la photo) sur mobile uniquement — désactivé ≥ md.
              <a
                href={review.photo}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block overflow-hidden rounded-lg bg-muted pointer-events-auto md:pointer-events-none"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={review.photo}
                  alt=""
                  loading="lazy"
                  className="h-40 w-full object-cover"
                />
              </a>
            )}
            <figcaption className="mt-4 flex items-center gap-3">
              <ReviewAvatar author={review.author} />
              <div className="text-sm leading-tight">
                <p className="font-medium">{review.author}</p>
                {review.location && (
                  <p className="text-xs text-muted-foreground">
                    {review.location}
                  </p>
                )}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button
          variant="outline"
          size="lg"
          nativeButton={false}
          render={
            <a
              href={clientConfig.contact.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          {t('cta')}
        </Button>
      </div>
    </Section>
  );
}
