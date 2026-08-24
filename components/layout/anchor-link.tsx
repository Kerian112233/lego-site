'use client';

import {useLocale} from 'next-intl';
import {usePathname} from '@/i18n/navigation';

/**
 * Lien vers une section de la page d'accueil.
 *
 * Pourquoi pas le <Link> next-intl : sur un href à hash, le routeur App Router
 * met bien à jour l'URL mais ne scrolle pas jusqu'à la cible (constaté sur
 * /#reviews → hash posé, scrollY à 0). On gère donc les deux cas nous-mêmes :
 *
 *  - déjà sur l'accueil → scroll fluide vers l'élément, URL mise à jour ;
 *  - depuis une autre page → navigation classique du navigateur, qui sait
 *    résoudre le hash au chargement (et le re-résout quand les images arrivent).
 *
 * Le `scroll-margin-top` posé par <Section> est respecté dans les deux cas :
 * le titre ne passe pas sous le header sticky.
 */
export function AnchorLink({
  href,
  className,
  onNavigate,
  children
}: {
  /** Ancre absolue, ex. `/#reviews`. */
  href: string;
  className?: string;
  /** Appelé au clic (ex. fermer la nav mobile). */
  onNavigate?: () => void;
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const hash = href.slice(href.indexOf('#'));

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    onNavigate?.();
    if (pathname !== '/') return; // autre page : navigation native

    event.preventDefault();
    // On ne touche PAS à l'URL : Next patche history.pushState/replaceState et
    // remet le scroll à zéro juste après (constaté : hash posé, scrollY = 0).
    // Un lien de nav n'a pas besoin de laisser un hash derrière lui.
    //
    // setTimeout et pas requestAnimationFrame : la nav mobile verrouille
    // `body { overflow: hidden }`, il faut laisser React démonter le panneau
    // avant de scroller — et rAF ne se déclenche pas dans un onglet en arrière-plan.
    //
    // `behavior: 'instant'` explicite : la page porte `scroll-behavior: smooth`
    // (globals.css), et sur l'accueil ce scroll animé se fait annuler au bout
    // d'une dizaine de pixels — le lien resterait alors sans effet visible.
    setTimeout(() => {
      document
        .querySelector(hash)
        ?.scrollIntoView({behavior: 'instant', block: 'start'});
    }, 0);
  }

  return (
    <a href={`/${locale}${hash}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
