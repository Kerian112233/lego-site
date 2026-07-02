import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

/**
 * Wrappers de navigation locale-aware (Link, redirect, usePathname, useRouter).
 * À utiliser partout à la place de next/link pour préserver le préfixe de locale.
 */
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
