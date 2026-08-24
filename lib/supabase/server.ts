import 'server-only';
import {createClient, type SupabaseClient} from '@supabase/supabase-js';

/**
 * Client Supabase unique du site public (Phase 2).
 *
 * Clé ANON uniquement — le site ne lit et n'écrit QUE via des RPC
 * `SECURITY DEFINER` ouvertes au rôle `anon` (`get_public_availability`,
 * `create_client_lead`). Aucune `service_role` ici, jamais (CLAUDE.md règle 3).
 *
 * Marqué `server-only` : les appels partent du serveur Next (server component
 * ou server action), pas du navigateur. La clé reste `NEXT_PUBLIC_*` parce
 * qu'elle est publique par nature, mais rien n'oblige à l'exposer au bundle.
 */
let cached: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Supabase non configuré : renseigner NEXT_PUBLIC_SUPABASE_URL et ' +
        'NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local (cf. .env.local.example).'
    );
  }

  cached = createClient(url, anonKey, {
    auth: {persistSession: false, autoRefreshToken: false},
    global: {
      // Dispo et leads sont des données vivantes : jamais de cache Next.
      fetch: (input, init) => fetch(input, {...init, cache: 'no-store'})
    }
  });

  return cached;
}

/** `true` si les deux variables Supabase sont présentes (sinon : mode dégradé). */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
