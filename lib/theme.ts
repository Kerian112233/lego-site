import type {CSSProperties} from 'react';
import type {ThemeConfig} from '@/config/client';
import {fontCssVar} from './fonts';

/**
 * Construit les CSS variables de thème depuis la config, à poser en `style`
 * sur <html> DANS LE ROOT LAYOUT (côté serveur).
 *
 * Pourquoi côté serveur et pas en useEffect : injecter les vars au rendu HTML
 * évite tout flash de couleurs par défaut à l'hydratation (FOUC). Les valeurs
 * inline sur <html> priment sur les défauts shadcn définis dans :root.
 */
export function buildThemeStyle(theme: ThemeConfig): CSSProperties {
  const vars: Record<string, string> = {
    '--primary': theme.colors.primary,
    '--primary-foreground': theme.colors.primaryForeground,
    '--accent': theme.colors.accent,
    '--accent-foreground': theme.colors.accentForeground,
    '--ring': theme.colors.ring,
    '--radius': theme.radius,
    '--font-sans': fontCssVar[theme.fonts.body],
    '--font-heading': fontCssVar[theme.fonts.heading]
  };

  return vars as CSSProperties;
}
