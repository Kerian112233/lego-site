'use client';

import {useEffect} from 'react';

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
 */
export function HashScroll() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.length < 2) return;

    const scroll = () => {
      document
        .querySelector(hash)
        ?.scrollIntoView({behavior: 'instant', block: 'start'});
    };

    scroll();
    if (document.readyState === 'complete') return;
    window.addEventListener('load', scroll, {once: true});
    return () => window.removeEventListener('load', scroll);
  }, []);

  return null;
}
