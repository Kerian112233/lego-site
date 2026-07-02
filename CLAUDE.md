# CLAUDE.md — Site de location (base white-label)

## Ce que c'est
Base produit **white-label** : site vitrine + capture de demande pour opérateurs de location, redéployable par client. **LEXO = client #1.**
Brief complet et contrat d'interface : **`docs/kickoff.md`** — à lire pour tout détail d'archi.

## Stack
Next.js 16 (App Router) · TypeScript · Tailwind v4 + shadcn/ui · i18n `next-intl` (fr défaut + en) · déploiement Vercel.
> ⚠️ **Next 16 a des breaking changes** vs. les versions connues (params async, conventions de layout, Tailwind v4 CSS-first). Voir `@AGENTS.md` et lire les guides dans `node_modules/next/dist/docs/` avant de coder une API Next.

## Règles non négociables
1. **White-label** — aucun élément spécifique à un client en dur dans le code. Tout le spécifique (marque, logo, couleurs, WhatsApp, contact, contenus, FAQ, zones, données) vit dans **`config/client.ts`**. Nouveau client = éditer cette config + déposer un logo, **zéro composant touché**.
2. **Data layer isolé** — les composants n'accèdent JAMAIS aux données en direct. Ils appellent uniquement `getScooterModels()` (`lib/data/models.ts`) et `submitBookingRequest()` (`lib/data/booking.ts`). Toute la source de données est derrière ces deux fonctions.
3. **Phase actuelle = FRONT-ONLY** — PAS de Supabase, PAS de server action, PAS de Turnstile, JAMAIS de `service_role`.
   - `getScooterModels()` → renvoie un **mock local**, typé exactement comme la future vue `public_scooter_models` (voir `docs/kickoff.md` §5.1).
   - `submitBookingRequest(payload)` → construit le **lien WhatsApp** (client-side, fonctionne pour de vrai) et renvoie une réf mock (signature = §5.2).
   - Le branchement Supabase = **Phase 2**, en remplaçant seulement l'intérieur de ces deux fichiers.
4. **Thème piloté par la config** — couleurs/typo via tokens CSS/Tailwind alimentés par `config/client.ts`. Aucune couleur en dur.
5. **i18n** — tout texte visible passe par `next-intl` (fr + en). Aucun string en dur dans les composants.
   - **Frontière i18n (importante) :** tout texte **éditable / piloté par le client** (accroche hero, textes des sections, FAQ, zones + tarifs, contact) vit dans **`content/{fr,en}.ts`** (référencé via `config/client.ts`). Tout ce qui est **structurel au produit** et ne change pas d'un client à l'autre (nav, libellés de boutons, labels de formulaire, messages d'état) vit dans **`messages/{fr,en}.json`** (`next-intl`). En cas de doute : « le client voudrait-il l'éditer sans toucher au code ? » → oui = `content/`, non = `messages/`.

## Conventions
- TypeScript strict, pas de `any`.
- Composants serveur par défaut ; `use client` seulement si nécessaire (ex. formulaire).
- `config/client.ts` + les fichiers de contenu = **source unique** du spécifique client.
- `.env.local` jamais commité ; rien de sensible dans le repo.

## Avant de coder
Lire `docs/kickoff.md`. En cas de doute entre deux approches, choisir celle qui **préserve le white-label et le data layer**. Montrer la structure avant d'implémenter en profondeur.
