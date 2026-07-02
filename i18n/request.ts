import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

/**
 * Config next-intl par requête : résout la locale et charge les messages
 * STRUCTURELS produit (messages/*.json). Les contenus éditables par le client
 * vivent dans content/*.ts (cf. frontière i18n dans CLAUDE.md), pas ici.
 */
export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
