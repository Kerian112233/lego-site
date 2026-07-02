# LEXO — Site de location (V1) · Brief de kickoff Claude Code

> Site vitrine + capture de demande, relié au dashboard LEXO via Supabase.
> Référence d'inspiration : bike-it-thailand.com (mais on va plus loin : catalogue connecté au dashboard + enregistrement auto du client).

---

## 0. Produit : base blanche réutilisable (white-label)

Cette base n'est **pas** le site d'un seul client, c'est une **base produit** redéployée pour plusieurs opérateurs de location (SaaS, revenu récurrent). **LEXO = client #1** (premier opérateur à prendre dashboard + site connecté).

Objectif : **nouveau client = ~1 jour de travail**, jamais de code spécifique client. Le codebase est **partagé et unique** (une correction/feature profite à tous — pas de forks divergents).

Règle d'or : **rien de spécifique à un client en dur dans le code.** Tout le spécifique vit dans **une config unique** `config/client.ts` :
- **marque** : nom, logo, favicon, couleurs + typo (→ tokens CSS/Tailwind, thème piloté par la config)
- **contact** : numéro WhatsApp, email, adresse, horaires, lien Google Maps
- **contenu** : accroche hero, textes des sections, FAQ, zones de livraison + tarifs
- **données** : source du catalogue (mock en Phase 1)
- **i18n** : locales actives + textes FR/EN

Le catalogue et le parcours ne changent jamais entre clients ; seuls **config + logo + contenu + données** changent. Rebrander = éditer la config, pas les composants.

**Checklist onboarding (« le 1 jour ») :** dupliquer la config → déposer logo/couleurs → remplir contenus + FAQ + zones → seed des scooters du client → brancher son WhatsApp → pointer le domaine → déployer.

> **Tenancy (base de données) :** le choix instance-isolée-par-client vs multi-tenant est **hors périmètre Phase 1** (le front-only config-driven est identique dans les deux cas). Il sera tranché pour le dashboard + la Phase 2.

---

## 1. Objectif

Site public qui :
1. présente les scooters (catalogue **lu depuis le dashboard**),
2. capture une demande de location (client enregistré **automatiquement** dans le dashboard),
3. bascule le client vers **WhatsApp** avec un message pré-rempli pour finaliser à la main.

Pas de paiement en ligne, pas de calcul de disponibilité par dates (V2). La dispo se règle sur WhatsApp.

---

## 1bis. Phasage (important)

**Phase 1 — MAINTENANT :** structure complète du site en **front-only**, **sans brancher Supabase** (le dashboard n'est pas fini). Catalogue en **mock local** typé exactement comme la future vue `public_scooter_models` (§5.1). Le flow WhatsApp fonctionne **déjà à 100%** (le lien `wa.me` est client-side, aucun backend requis). Seul l'enregistrement auto du client est différé.

**Phase 2 — PLUS TARD :** brancher Supabase en remplaçant l'implémentation du data layer, sans toucher aux composants.

**Clé du swap trivial — un data layer isolé :**
- `lib/data/models.ts` → `getScooterModels()` : renvoie le mock aujourd'hui, appellera la vue Supabase en Phase 2. Type de retour = contrat §5.1.
- `lib/data/booking.ts` → `submitBookingRequest(payload)` : aujourd'hui construit le lien WhatsApp et renvoie une réf mock ; en Phase 2 appellera aussi `create_booking_request` avant de rediriger. Signature = contrat §5.2.

Les composants n'appellent QUE ces deux fonctions. Brancher Supabase = éditer 2 fichiers, zéro refacto.

---

## 2. Stack

- **Next.js 15** (App Router, SSR/SSG — SEO essentiel pour un site de location)
- **Tailwind + shadcn/ui** (cohérence avec le dashboard LEXO)
- **TypeScript**
- **Supabase** (le MÊME projet que le dashboard) — client `@supabase/supabase-js`, **anon key uniquement**
- **i18n** : `next-intl`, segment `[locale]` → `fr` (défaut) + `en`
- Déploiement **Vercel** (compte de Kerian)

---

## 3. Périmètre V1

**Inclus :**
- Home (hero, aperçu modèles, « comment réserver en 3 étapes », formule tout-compris, pourquoi nous, FAQ, zones de livraison, horaires + carte, footer)
- Page catalogue (grille des modèles, lue depuis Supabase)
- Page/section « Réserver » : formulaire → écrit la demande → redirige WhatsApp
- FR + EN

**Exclu (V2) :**
- Calcul de disponibilité réelle par dates
- Paiement en ligne
- Détail par modèle avec galerie complète (une carte détaillée suffit en V1)
- RU
- Blog / actus

---

## 4. Architecture & sécurité — LE point à ne pas rater

Le site est **public** et partage la base du dashboard. Il n'y accède que par **deux points**, jamais en direct sur les tables.

**Règles dures :**
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` uniquement côté site. **Jamais** la `service_role` sur le site.
- RLS activé sur toutes les tables. L'`anon` n'a **aucun** grant direct sur les tables métier.
- Lecture catalogue = via une **vue publique** (grant SELECT à `anon`) qui n'expose que des champs marketing.
- Écriture = via une **RPC `SECURITY DEFINER`** (grant EXECUTE à `anon`) qui valide et écrit elle-même. L'`anon` ne voit jamais les clients/résas des autres.
- L'appel à la RPC se fait depuis une **server action / route handler** Next.js (pas depuis le navigateur) → permet d'ajouter la vérif captcha + un garde-fou anti-spam avant d'écrire.
- Formulaire protégé par **Cloudflare Turnstile** (anti-bot) — sinon le dashboard du client se remplit de spam.

---

## 5. Contrat d'interface (les 2 endpoints)

> À implémenter **côté dashboard** (le Mac qui a le schéma). Le site ne dépend que de ces signatures.

### 5.1 Lecture — vue `public_scooter_models`
Exposée en SELECT à `anon`. Champs suggérés :

```
id              uuid
name            text        -- ex: "Yamaha NMAX 155"
brand           text
category        text        -- ex: "Automatique 155cc" | "Maxi-scooter" | "ADV"
cc              int
description_fr  text
description_en  text
price_per_day   numeric     -- tarif de base
price_per_week  numeric     -- dégressif (nullable)
price_per_month numeric     -- dégressif (nullable)
image_url       text        -- ou image_urls text[]
sort_order      int
is_active       bool        -- ne montrer que true
```

### 5.2 Écriture — RPC `create_booking_request(payload jsonb)`
`SECURITY DEFINER`, EXECUTE accordé à `anon`. Retourne `{ request_id, reference }`.

Payload attendu :
```json
{
  "full_name": "string",
  "nationality": "string | null",
  "email": "string | null",
  "phone": "string (WhatsApp)",
  "model_id": "uuid",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "pickup_zone": "string (ex: Patong)",
  "pickup_address": "string | null (hôtel)",
  "message": "string | null",
  "locale": "fr | en",
  "source": "website"
}
```

Comportement de la RPC :
1. valide les entrées (dates cohérentes, `end >= start`, pas dans le passé, champs requis, longueurs raisonnables) ;
2. **upsert** du client (clé = email ou téléphone) → `client_id` ;
3. insert d'une **demande de réservation** liée au client + modèle + dates, `status = 'new'`, `source = 'website'` ;
4. génère une **référence lisible** (ex: `LEXO-2026-0042`) ;
5. retourne `{ request_id, reference }`.

> ⚠️ Adapter les noms de tables/colonnes au schéma réel du dashboard. Kerian peut fournir les tables `clients` / `reservations` (ou équivalents) pour écrire le SQL exact.

---

## 6. Flow de réservation + WhatsApp

1. L'utilisateur remplit le formulaire (nom, nationalité, dates, modèle, zone/hôtel, WhatsApp, message).
2. Turnstile validé → **server action** appelle `create_booking_request`.
3. Sur succès → on récupère `reference` et on ouvre WhatsApp :

```
https://wa.me/{NUMERO_CLIENT}?text={message encodé}
```

Message pré-rempli (locale FR) :
```
Bonjour, je souhaite louer un {modèle} du {date_début} au {date_fin}.
Livraison : {zone}. Nom : {nom}. Réf : {reference}.
```

- `{NUMERO_CLIENT}` = numéro WhatsApp business de l'opérateur (défini dans `config/client.ts`) au format international sans `+` (ex: `66XXXXXXXXX`). **À confirmer avant mise en ligne** — placeholder en attendant.
- Prévoir aussi un bouton WhatsApp « contact direct » flottant sur tout le site (comme Bike It).

> **Phase 1 :** l'étape 2 (RPC) est mockée — `submitBookingRequest` renvoie une réf locale et on passe direct au lien WhatsApp, qui lui fonctionne pour de vrai. Server action + Turnstile + RPC arrivent en Phase 2.

---

## 7. Arborescence

```
/[locale]                 → home
/[locale]/scooters        → catalogue (vue publique)
/[locale]/reserver        → formulaire de demande
```

Contenu **statique** en V1 (dans la config du site, pas en base) :
- grille des **zones de livraison** + tarifs (Patong gratuit, Karon 100฿, etc. — repartir du modèle Bike It, à ajuster avec le client)
- FAQ
- horaires + adresse + lien Google Maps

---

## 8. Variables d'environnement

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=66XXXXXXXXX
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=        # server only
```
`.env.local` dans `.gitignore`. **Rien de sensible commité.**

---

## 9. Répartition des 2 Macs (travail en parallèle)

**Mac dashboard** (a le schéma + accès Supabase) :
- crée la vue `public_scooter_models` + grant SELECT `anon`
- crée la RPC `create_booking_request` (`SECURITY DEFINER`) + grant EXECUTE `anon`
- vérifie que le dashboard affiche bien les demandes `source = 'website'`, `status = 'new'`
- **seul** à toucher aux migrations Supabase

**Mac emprunté** (ce projet, le site) :
- build Next.js, consomme les 2 endpoints
- **aucune migration**, ne touche pas au schéma

**Propriété / récupération :** dès le départ → repo privé sur le GitHub de Kerian, déploiement sur son Vercel. Quand le Mac est rendu : `git clone` sur son MacBook et on continue. La machine n'est qu'un poste de travail.

---

## 10. Prompt de kickoff (à coller dans Claude Code app)

> Tu vas construire la **Phase 1** de la V1 du site de location de scooters **LEXO** (Phuket) : structure complète **front-only**, **sans Supabase** pour l'instant (le dashboard n'est pas fini). On branchera Supabase plus tard sans toucher aux composants.
>
> **C'est une base produit white-label** (voir §0) : aucun élément spécifique à un client en dur. Tout le spécifique — marque, logo, couleurs, contact, WhatsApp, contenus, FAQ, zones, données — vit dans une **config unique `config/client.ts`**. Les couleurs/typo pilotent le thème via des tokens CSS/Tailwind. Nouveau client = éditer cette config + déposer un logo, zéro code touché. LEXO (client #1) n'est qu'une valeur de config d'exemple.
>
> Stack : Next.js 15 (App Router), TypeScript, Tailwind + shadcn/ui, i18n `next-intl` (fr défaut + en), déploiement Vercel.
>
> Architecture clé : un **data layer** isolé. `lib/data/models.ts` → `getScooterModels()` renvoie un **mock local** typé comme la future vue `public_scooter_models` (§5.1). `lib/data/booking.ts` → `submitBookingRequest(payload)` construit le **lien WhatsApp** (client-side, fonctionne pour de vrai) et renvoie une réf mock (signature = §5.2). Les composants n'appellent QUE ces deux fonctions ; en Phase 2 on remplacera leur intérieur par Supabase, zéro refacto.
>
> Étape 1 : scaffold + structure i18n `[locale]` + home avec toutes les sections (hero, aperçu modèles, 3 étapes, tout-compris, pourquoi nous, FAQ, zones de livraison, horaires+carte, footer + bouton WhatsApp flottant).
> Étape 2 : page catalogue qui consomme `getScooterModels()` (mock).
> Étape 3 : page « réserver » — formulaire → `submitBookingRequest()` → redirection WhatsApp pré-remplie (§6).
>
> **Pas de Supabase, pas de server action, pas de Turnstile en Phase 1** (Phase 2). Commence par l'étape 1 et montre-moi la structure avant de continuer. Design moderne, épuré, orienté tourisme Phuket, mobile-first.
