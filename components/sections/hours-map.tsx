import {useTranslations} from 'next-intl';
import {Section} from '@/components/section';
import {Button} from '@/components/ui/button';
import {clientConfig} from '@/config/client';
import type {SiteContent} from '@/content/types';

export function HoursMap({
  content,
  hours
}: {
  content: SiteContent['hoursMap'];
  hours: SiteContent['openingHours'];
}) {
  const t = useTranslations();
  const {contact} = clientConfig;

  return (
    <Section id="hours-map" title={content.title} subtitle={content.subtitle}>
      <div className="mt-12 grid gap-8 md:grid-cols-2 md:items-stretch">
        <div className="space-y-6 rounded-xl border border-border p-6">
          <div>
            <p className="text-sm font-semibold">{t('footer.hours')}</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {hours.map((h) => (
                <li key={h.day}>
                  {h.day} · {h.time}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">{t('footer.contact')}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {contact.address}
            </p>
          </div>
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <a
                href={contact.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            Google Maps
          </Button>
        </div>
        <div className="min-h-64 overflow-hidden rounded-xl border border-border">
          <iframe
            title={content.title}
            src={contact.mapEmbedUrl}
            className="size-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </Section>
  );
}
