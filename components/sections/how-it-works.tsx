import {Section} from '@/components/section';
import type {SiteContent} from '@/content/types';

export function HowItWorks({content}: {content: SiteContent['howItWorks']}) {
  return (
    <Section
      id="how-it-works"
      title={content.title}
      subtitle={content.subtitle}
      className="bg-muted/30"
    >
      <ol className="mt-12 grid gap-8 md:grid-cols-3">
        {content.steps.map((step, i) => (
          <li key={step.title} className="relative text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {i + 1}
            </span>
            <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
