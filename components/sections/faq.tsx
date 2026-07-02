import {Section} from '@/components/section';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import type {SiteContent} from '@/content/types';

export function Faq({content}: {content: SiteContent['faq']}) {
  return (
    <Section
      id="faq"
      title={content.title}
      subtitle={content.subtitle}
      className="bg-muted/30"
    >
      <Accordion className="mx-auto mt-10 max-w-2xl">
        {content.items.map((item, i) => (
          <AccordionItem key={item.question} value={`item-${i}`}>
            <AccordionTrigger className="text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
