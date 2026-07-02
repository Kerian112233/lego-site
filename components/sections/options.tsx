import {Section} from '@/components/section';
import type {SiteContent} from '@/content/types';

export function Options({content}: {content: SiteContent['options']}) {
  return (
    <Section
      id="options"
      title={content.title}
      subtitle={content.subtitle}
      className="bg-muted/30"
    >
      <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
        {content.items.map((item) => (
          <div
            key={item.name}
            className="rounded-xl border border-border bg-background p-5"
          >
            <p className="font-semibold">{item.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {content.note}
      </p>
    </Section>
  );
}
