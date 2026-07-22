import {clientConfig} from '@/config/client';
import {Link} from '@/i18n/navigation';

export function Logo() {
  return (
    <Link href="/" className="flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={clientConfig.brand.logo}
        alt={clientConfig.brand.name}
        className="h-10 w-auto object-contain"
      />
    </Link>
  );
}
