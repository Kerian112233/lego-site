/**
 * Navigation structurelle du produit (pas de spécifique client) : routes +
 * ancres vers les sections de la page d'accueil.
 *
 * Les ancres sont écrites en absolu (`/#id`) pour rester valides depuis
 * /scooters et /reserver, où le header est aussi monté. Les `id` correspondent
 * à ceux posés par <Section> — voir components/sections/*.
 */
export type NavLink = {
  /** Clé de traduction dans messages/*.json → `nav.<key>`. */
  key: 'scooters' | 'steps' | 'reviews' | 'findUs' | 'book';
  href: string;
  /** Ancre vers une section de l'accueil (vs. route à part entière). */
  anchor?: boolean;
};

export const navLinks: NavLink[] = [
  {key: 'scooters', href: '/scooters'},
  {key: 'steps', href: '/#how-it-works', anchor: true},
  {key: 'reviews', href: '/#reviews', anchor: true},
  {key: 'findUs', href: '/#hours-map', anchor: true},
  {key: 'book', href: '/reserver'}
];
