/**
 * Fait défiler jusqu'à la section visée par un hash d'URL — SANS JAMAIS LEVER.
 *
 * `document.querySelector(location.hash)` plantait dès que le hash n'était pas
 * un sélecteur CSS valide (`#1`, `#reviews?utm_source=ig`, `#%C3%A9tapes`…) :
 * erreur dans un effet du layout racine → toute la page remplacée par l'écran
 * d'erreur de Next. On résout donc l'ancre par son id, comme le navigateur.
 *
 * Source unique pour le chargement d'une page avec ancre (HashScroll) et le
 * clic sur un lien de section (AnchorLink).
 */
export function scrollToHash(hash: string): void {
  // Ce qui suit un `?` ou un `&` est du suivi collé derrière l'ancre (UTM…).
  const raw = hash.replace(/^#/, '').split(/[?&]/)[0];
  if (!raw) return;

  let id = raw;
  try {
    id = decodeURIComponent(raw);
  } catch {
    // `%` isolé : on garde l'ancre telle quelle.
  }

  // `instant` explicite : `scroll-behavior: smooth` (globals.css) faisait
  // annuler l'animation au bout de quelques pixels sur l'accueil.
  document.getElementById(id)?.scrollIntoView({behavior: 'instant', block: 'start'});
}
