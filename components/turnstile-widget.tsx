'use client';

import {useEffect, useRef} from 'react';

const SCRIPT_ID = 'cf-turnstile-script';
const SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

interface TurnstileApi {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
      language?: string;
      theme?: 'auto' | 'light' | 'dark';
    }
  ) => string;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/** Charge le script Turnstile une seule fois pour toute la page. */
function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  const script = existing ?? document.createElement('script');

  const ready = new Promise<void>((resolve, reject) => {
    script.addEventListener('load', () => resolve(), {once: true});
    script.addEventListener('error', () => reject(new Error('turnstile')), {
      once: true
    });
  });

  if (!existing) {
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  return ready;
}

/**
 * Widget Cloudflare Turnstile (anti-spam) en rendu explicite.
 *
 * Le token produit ici n'est qu'un laissez-passer : il ne prouve rien tant que
 * le serveur ne l'a pas validé auprès de Cloudflare (`lib/security/turnstile`).
 * Ce composant ne bloque donc jamais l'envoi de son propre chef.
 *
 * Remonter `resetKey` (compteur parent) remonte le widget → nouveau challenge
 * après un échec, sans manipuler l'API impérative de Cloudflare.
 */
export function TurnstileWidget({
  siteKey,
  locale,
  resetKey = 0,
  onToken
}: {
  siteKey: string;
  locale: string;
  resetKey?: number;
  onToken: (token: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Le callback est gardé dans un ref pour qu'un re-render du parent ne
  // remonte pas le widget (et ne relance pas un challenge) à chaque frappe.
  const onTokenRef = useRef(onToken);
  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    let widgetId: string | null = null;
    let cancelled = false;
    const container = containerRef.current;

    loadScript()
      .then(() => {
        if (cancelled || !container || !window.turnstile) return;
        widgetId = window.turnstile.render(container, {
          sitekey: siteKey,
          language: locale,
          theme: 'auto',
          callback: (token) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(null),
          'error-callback': () => onTokenRef.current(null)
        });
      })
      .catch(() => {
        // Script injoignable : pas de token → le serveur refusera proprement.
        if (!cancelled) onTokenRef.current(null);
      });

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [siteKey, locale, resetKey]);

  return <div ref={containerRef} className="flex justify-center" />;
}
