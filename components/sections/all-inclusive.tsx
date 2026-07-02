import {Section} from '@/components/section';
import {Card, CardContent} from '@/components/ui/card';
import type {SiteContent} from '@/content/types';

export function AllInclusive({
  content
}: {
  content: SiteContent['allInclusive'];
}) {
  return (
    <Section id="all-inclusive" title={content.title} subtitle={content.subtitle}>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {content.items.map((item) => (
          <Card key={item.title} className="h-full">
            <CardContent>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
