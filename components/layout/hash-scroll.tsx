'use client';

import {useEffect} from 'react';
import {scrollToHash} from './scroll-to-hash';

/**
 * Positionne la page sur l'ancre de l'URL après un chargement complet.
 *
 * Le navigateur le fait déjà nativement, mais deux choses le mettent en échec
 * ici : `scroll-behavior: smooth` (globals.css), dont l'animation se fait
 * annuler au bout de quelques pixels sur l'accueil, et les images du catalogue
 * qui arrivent après coup et décalent la cible. Résultat sans ce garde-fou :
 * `/fr#hours-map` ouvre la page… tout en haut.
 *
 * On repositionne donc explicitement, et une seconde fois au `load` pour tenir
 * compte des images. Aucun effet sur une URL sans ancre.
 *
 * Ce second passage est ANNULÉ dès que le visiteur interagit (défilement, tap,
 * touche) : sur mobile lent, le `load` arrive tard et ramenait sinon le visiteur
 * en arrière alors qu'il avait déjà bougé.
 */
const USER_INPUT = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;

export function HashScroll() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.length < 2) return;

    scrollToHash(hash);
    if (document.readyState === 'complete') return;

    const cancel = () => {
      window.removeEventListener('load', onLoad);
      USER_INPUT.forEach((type) => window.removeEventListener(type, cancel));
    };
    const onLoad = () => {
      cancel();
      scrollToHash(hash);
    };

    window.addEventListener('load', onLoad, {once: true});
    USER_INPUT.forEach((type) =>
      window.addEventListener(type, cancel, {passive: true, once: true})
    );
    return cancel;
  }, []);

  return null;
}
