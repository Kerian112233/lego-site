import {Section} from '@/components/section';
import type {SiteContent} from '@/content/types';

export function DeliveryZones({
  content
}: {
  content: SiteContent['deliveryZones'];
}) {
  return (
    <Section
      id="delivery-zones"
      title={content.title}
      subtitle={content.subtitle}
    >
      <div className="mx-auto mt-12 max-w-2xl divide-y divide-border rounded-xl border border-border">
        {content.zones.map((zone) => (
          <div
            key={zone.name}
            className="flex items-center justify-between px-5 py-4"
          >
            <span className="font-medium">{zone.name}</span>
            <span className="text-sm font-semibold text-primary">
              {zone.price}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        {content.note}
      </p>
    </Section>
  );
}
