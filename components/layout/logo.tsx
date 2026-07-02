import {clientConfig} from '@/config/client';
import {Link} from '@/i18n/navigation';

/** Marque, pilotée par la config. Aucun nom client en dur. */
export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight text-foreground"
    >
      <span className="inline-flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        {clientConfig.brand.name.charAt(0)}
      </span>
      {clientConfig.brand.name}
    </Link>
  );
}
