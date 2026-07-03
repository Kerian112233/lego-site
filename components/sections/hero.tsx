import {Link} from '@/i18n/navigation';
import {clientConfig} from '@/config/client';
import {DateSearch} from '@/components/date-search';
import type {SiteContent} from '@/content/types';

export function Hero({content}: {content: SiteContent['hero']}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground md:mx-0">
            {content.subtitle}
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-background/70 p-4 text-left shadow-sm backdrop-blur">
            <DateSearch />
          </div>

          <Link
            href="/scooters"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            {content.ctaSecondary} →
          </Link>
        </div>

        <div className="relative order-first aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-border md:order-last">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={clientConfig.brand.heroImage}
            alt={content.title}
            className="size-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
