import {Link} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';
import {clientConfig} from '@/config/client';
import type {SiteContent} from '@/content/types';

export function Hero({content}: {content: SiteContent['hero']}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:py-28">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground md:mx-0">
            {content.subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/reserver" />}
            >
              {content.ctaPrimary}
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="/scooters" />}
            >
              {content.ctaSecondary}
            </Button>
          </div>
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
