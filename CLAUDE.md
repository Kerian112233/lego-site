# CLAUDE.md — Site de location (base white-label)

## Ce que c'est
Base produit **white-label** : site vitrine + capture de demande pour opérateurs de location, redéployable par client. **LEXO = client #1.**
Brief complet et contrat d'interface : **`docs/kickoff.md`** — à lire pour tout détail d'archi.
> ⚠️ **Le kickoff décrit la Phase 1 (front-only, sans Supabase) : c'est CADUC.** Le site est branché sur la base depuis la Phase 2 (cf. règle 3). Sont périmés : §1bis « Phase 1 / sans brancher Supabase », le §6 « la RPC est mockée », et les contrats §5.1 (`public_scooter_models`) et §5.2 (`create_booking_request`). En cas de contradiction, **CLAUDE.md fait foi**.

## Stack
Next.js 16 (App Router) · TypeScript · Tailwind v4 + shadcn/ui · i18n `next-intl` (fr défaut + en) · déploiement Vercel.
> ⚠️ **Next 16 a des breaking changes** vs. les versions connues (params async, conventions de layout, Tailwind v4 CSS-first). Voir `@AGENTS.md` et lire les guides dans `node_modules/next/dist/docs/` avant de coder une API Next.

## Règles non négociables
1. **White-label** — aucun élément spécifique à un client en dur dans le code. Tout le spécifique (marque, logo, couleurs, WhatsApp, contact, contenus, FAQ, zones, données) vit dans **`config/client.ts`**. Nouveau client = éditer cette config + déposer un logo, **zéro composant touché**.
2. **Data layer isolé** — les composants n'accèdent JAMAIS aux données en direct. Ils appellent uniquement `getScooterModels()` / `getModelAvailability()` (`lib/data/models.ts`) et `submitBookingRequest()` (`lib/data/booking.ts`). Toute la source de données est derrière ces fonctions.
3. **Phase actuelle = PHASE 2 — le site EST branché sur Supabase.** Plus rien n'est « front-only » : la dispo par dates vient de la base (`get_availability_for_dates`), le formulaire écrit en base (`create_client_lead`) derrière une server action protégée par Turnstile, et la redirection WhatsApp se fait après la réponse de la base. Accès via la clé **ANON uniquement** ; `service_role` reste **interdite**.
   - Seul reste local : le **catalogue** (voir ci-dessous). Un mock qui subsiste sur ce point n'autorise pas à en réintroduire ailleurs.
   - `getScooterModels()` → toujours un **mock local** : la vue `public_scooter_models` du kickoff §5.1 n'a jamais été déployée. Prix, descriptions et photos vivent dans le repo.
   - `getModelAvailability()` → délègue à **`getAvailabilityForRange()`** (`lib/data/availability.ts`), **point de branchement unique** de la dispo. Source réelle : RPC **`get_availability_for_dates(p_start, p_end)`** (déployée, anon), à qui on passe les dates choisies par le client. Elle renvoie une ligne par FAMILLE : `family, total_active, available, sample_photo`. `get_public_availability()` (instant T) est **supprimée** : garder une source non datée à côté d'une source datée ne pouvait que produire de fausses promesses.
   - **Granularité famille ≠ variante** : la base compte par famille (TMAX = 19), le catalogue découpe cette famille en variantes marketing (TMAX Iron, 560 2024…). Toutes les variantes d'une famille portent donc LE MÊME compteur. Il ne s'affiche qu'au niveau **famille** (carte du catalogue, titre du panneau détail), **jamais** à côté du sélecteur de variante — sinon « 19 dispos » se lit comme 19 exemplaires de la variante choisie. Idem pour le grisage : une carte n'est grisée que si TOUTE sa famille est à `available = 0`.
   - Le pont catalogue ↔ base se fait par le NOM via `resolveFamily()` (le mock n'a aucun id partagé avec la base). Un modèle sans famille correspondante n'est jamais grisé et n'affiche aucun compteur : on ne sait rien de lui, on n'affirme rien.
   - **Mode dégradé** (Supabase absent, RPC en erreur, réponse vide) : aucun grisage, aucun compteur, le site reste debout. La règle de fond ne change pas — **on n'affiche un chiffre de dispo que quand la base l'a réellement répondu pour ces dates**. La confirmation finale reste WhatsApp.
   - `submitBookingRequest()` → **server action** (`lib/data/booking.ts`) : validation serveur → vérification Turnstile → RPC **`create_client_lead`**. Le lien WhatsApp est construit APRÈS, côté client, à partir de la référence renvoyée.
   - La RPC réelle ne prend ni dates ni `model_id` : ils sont sérialisés dans `p_message`, le modèle est dupliqué dans `p_scooter_interest`. Le contrat kickoff §5.2 (`create_booking_request(payload jsonb)`) est **caduc**.
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
