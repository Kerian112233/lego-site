import {Section} from '@/components/section';
import type {SiteContent} from '@/content/types';

export function WhyUs({content}: {content: SiteContent['whyUs']}) {
  return (
    <Section
      id="why-us"
      title={content.title}
      subtitle={content.subtitle}
      className="bg-muted/30"
    >
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {content.items.map((item) => (
          <div key={item.title} className="rounded-xl border border-border bg-background p-6">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
