'use client';

import {useEffect, useRef, useState} from 'react';
import {Section} from '@/components/section';
import {cn} from '@/lib/utils';
import type {SiteContent} from '@/content/types';

function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      // start animating when element enters, finish when it's fully visible
      const start = windowH * 0.9;
      const end = windowH * 0.1;
      const raw = (start - rect.top) / (start - end + rect.height);
      setProgress(Math.min(1, Math.max(0, raw)));
    };

    window.addEventListener('scroll', update, {passive: true});
    update();
    return () => window.removeEventListener('scroll', update);
  }, [ref]);

  return progress;
}

export function HowItWorks({content}: {content: SiteContent['howItWorks']}) {
  const containerRef = useRef<HTMLOListElement>(null);
  const progress = useScrollProgress(containerRef as React.RefObject<HTMLElement>);

  return (
    <Section
      id="how-it-works"
      title={content.title}
      subtitle={content.subtitle}
      className="bg-muted/30"
    >
      {/* ── Mobile : layout vertical avec ligne de trajet animée ── */}
      <ol ref={containerRef} className="relative mt-12 flex flex-col gap-0 md:hidden">
        {/* Ligne de fond (grise) */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 -translate-x-1/2 bg-border" />
        {/* Ligne animée (couleur primaire) */}
        <div
          className="absolute left-6 top-6 w-0.5 -translate-x-1/2 bg-primary transition-none origin-top"
          style={{
            height: `calc((100% - 3rem) * ${progress})`,
          }}
        />

        {content.steps.map((step, i) => (
          <li key={step.title} className="relative flex gap-5 pb-10 last:pb-0">
            {/* Bulle numérotée */}
            <div className="relative z-10 shrink-0">
              <span
                className={cn(
                  'flex size-12 items-center justify-center rounded-full text-lg font-bold transition-all duration-500',
                  progress > i / content.steps.length
                    ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                    : 'bg-background border-2 border-border text-muted-foreground'
                )}
              >
                {i + 1}
              </span>
            </div>
            {/* Texte */}
            <div
              className={cn(
                'pt-2.5 transition-all duration-500',
                progress > i / content.steps.length
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-40 translate-y-2'
              )}
            >
              <h3 className="text-base font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* ── Desktop : grille horizontale classique ── */}
      <ol className="relative mt-12 hidden gap-8 md:grid md:grid-cols-3">
        {/* Ligne reliant les étapes */}
        <div className="absolute top-6 left-[16.67%] right-[16.67%] h-0.5 bg-border" />
        <div
          className="absolute top-6 left-[16.67%] h-0.5 bg-primary transition-none origin-left"
          style={{width: `calc(66.67% * ${progress})`}}
        />
        {content.steps.map((step, i) => (
          <li key={step.title} className="relative text-center">
            <span
              className={cn(
                'mx-auto flex size-12 items-center justify-center rounded-full text-lg font-bold transition-all duration-500',
                progress > i / content.steps.length
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-background border-2 border-border text-muted-foreground'
              )}
            >
              {i + 1}
            </span>
            <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
