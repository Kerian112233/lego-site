import {Link} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';
import {Section} from '@/components/section';
import {ScooterCard} from '@/components/scooter-card';
import type {SiteContent} from '@/content/types';
import type {ScooterModel} from '@/lib/data/types';
import type {Locale} from '@/i18n/routing';

export function ModelsPreview({
  content,
  models,
  locale
}: {
  content: SiteContent['modelsPreview'];
  models: ScooterModel[];
  locale: Locale;
}) {
  // Aperçu : les 3 premiers modèles (déjà triés par sort_order via le data layer).
  const preview = models.slice(0, 3);

  return (
    <Section id="models" title={content.title} subtitle={content.subtitle}>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {preview.map((model) => (
          <ScooterCard key={model.id} model={model} locale={locale} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button
          variant="outline"
          size="lg"
          nativeButton={false}
          render={<Link href="/scooters" />}
        >
          {content.cta}
        </Button>
      </div>
    </Section>
  );
}
