import {cn} from '@/lib/utils';

/** Conteneur de section homogène : ancre, largeur max, en-tête titre/sous-titre. */
export function Section({
  id,
  title,
  subtitle,
  className,
  headerClassName,
  children
}: {
  id?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  headerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn('py-16 md:py-24', className)}>
      <div className="mx-auto max-w-6xl px-4">
        {(title || subtitle) && (
          <div className={cn('mx-auto max-w-2xl text-center', headerClassName)}>
            {title && (
              <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
            )}
            {subtitle && (
              <p className="mt-3 text-muted-foreground md:text-lg">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
