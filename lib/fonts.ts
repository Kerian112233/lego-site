import {Inter, Poppins} from 'next/font/google';

/**
 * Polices disponibles dans la base white-label. La config client choisit
 * lesquelles utiliser pour le corps et les titres (thème piloté par la config).
 * Ajouter une police = l'importer ici + l'ajouter à FontKey/fontCssVar.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap'
});

export type FontKey = 'inter' | 'poppins';

/** À poser sur <html> pour rendre les variables de police disponibles. */
export const fontVarClassNames = `${inter.variable} ${poppins.variable}`;

/** Résout une FontKey vers la CSS var correspondante. */
export const fontCssVar: Record<FontKey, string> = {
  inter: 'var(--font-inter)',
  poppins: 'var(--font-poppins)'
};
