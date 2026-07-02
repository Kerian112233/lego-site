import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

/**
 * Next 16 a renommé `middleware` → `proxy` (runtime nodejs, edge non supporté).
 * next-intl fournit le handler ; on l'expose sous le nom `proxy`.
 */
export const proxy = createMiddleware(routing);
export default proxy;

export const config = {
  // Intercepte tout sauf les internes Next/Vercel, l'API et les fichiers statiques.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)'
};
