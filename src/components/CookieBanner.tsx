import { useEffect, useState } from 'react';

const STORAGE_KEY = 'swarppay-cookie-consent';
const LEGACY_STORAGE_KEY = 'swarppay-cookie-choice';
const CONSENT_CHANGE_EVENT = 'swarppay-cookie-consent-change';
export const COOKIE_PREFERENCES_EVENT = 'swarppay-cookie-preferences-open';

type OptionalCategory = 'functional' | 'analytics' | 'marketing';

type CookieConsent = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  version: 1;
};

type OptionalPreferences = Record<OptionalCategory, boolean>;

const defaultPreferences: OptionalPreferences = {
  functional: false,
  analytics: false,
  marketing: false,
};

declare global {
  interface Window {
    swarppayCookieConsent?: CookieConsent;
  }
}

function createConsent(preferences: OptionalPreferences): CookieConsent {
  return {
    necessary: true,
    ...preferences,
    updatedAt: new Date().toISOString(),
    version: 1,
  };
}

function expireCookie(name: string, domain?: string) {
  const domainPart = domain ? `; domain=${domain}` : '';
  const securePart = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax${securePart}${domainPart}`;
}

function clearOptionalCookies(consent: CookieConsent) {
  const host = window.location.hostname;
  const baseDomain = host.split('.').slice(-2).join('.');
  const domains = ['', host, `.${host}`, baseDomain, `.${baseDomain}`].filter(Boolean);

  const analyticsCookies = ['_ga', '_gid', '_gat', '_gcl_au'];
  const marketingCookies = ['_fbp', '_fbc', 'fr', 'IDE'];

  if (!consent.analytics) {
    analyticsCookies.forEach((name) => {
      expireCookie(name);
      domains.forEach((domain) => expireCookie(name, domain));
    });
  }

  if (!consent.marketing) {
    marketingCookies.forEach((name) => {
      expireCookie(name);
      domains.forEach((domain) => expireCookie(name, domain));
    });
  }
}

function readConsent(): CookieConsent | null {
  const rawConsent = localStorage.getItem(STORAGE_KEY);

  if (rawConsent) {
    try {
      const parsed = JSON.parse(rawConsent) as Partial<CookieConsent>;
      return createConsent({
        functional: Boolean(parsed.functional),
        analytics: Boolean(parsed.analytics),
        marketing: Boolean(parsed.marketing),
      });
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  const legacyChoice = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (legacyChoice === 'all') {
    return createConsent({ functional: true, analytics: true, marketing: true });
  }

  if (legacyChoice === 'necessary') {
    return createConsent(defaultPreferences);
  }

  return null;
}

function writeConsent(consent: CookieConsent) {
  const encodedConsent = encodeURIComponent(JSON.stringify(consent));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  localStorage.removeItem(LEGACY_STORAGE_KEY);
  const securePart = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${STORAGE_KEY}=${encodedConsent}; path=/; max-age=31536000; SameSite=Lax${securePart}`;
  clearOptionalCookies(consent);
  window.swarppayCookieConsent = consent;
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: consent }));
}

export function CookieBanner() {
  const [visible, setVisible] = useState(() => !readConsent());
  const [manageOpen, setManageOpen] = useState(false);
  const [preferences, setPreferences] = useState<OptionalPreferences>(() => {
    const storedConsent = readConsent();

    return storedConsent
      ? {
          functional: storedConsent.functional,
          analytics: storedConsent.analytics,
          marketing: storedConsent.marketing,
        }
      : defaultPreferences;
  });

  useEffect(() => {
    const openPreferences = () => {
      const currentConsent = readConsent();
      if (currentConsent) {
        setPreferences({
          functional: currentConsent.functional,
          analytics: currentConsent.analytics,
          marketing: currentConsent.marketing,
        });
      }
      setVisible(true);
      setManageOpen(true);
    };

    window.addEventListener(COOKIE_PREFERENCES_EVENT, openPreferences);

    const storedConsent = readConsent();

    if (storedConsent) {
      writeConsent(storedConsent);
    }

    return () => {
      window.removeEventListener(COOKIE_PREFERENCES_EVENT, openPreferences);
    };
  }, []);

  const savePreferences = (nextPreferences: OptionalPreferences) => {
    const consent = createConsent(nextPreferences);
    writeConsent(consent);
    setPreferences(nextPreferences);
    setVisible(false);
    setManageOpen(false);
  };

  const updatePreference = (key: OptionalCategory) => {
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-4 bottom-4 z-[80] border border-white/10 bg-black/95 p-5 shadow-2xl backdrop-blur-md md:left-auto md:max-w-xl"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
    >
      <p id="cookie-title" className="text-sm font-semibold text-white">
        We use cookies
      </p>
      {!manageOpen ? (
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          SwarpPay uses necessary cookies to operate the website and optional cookies to
          improve performance, understand usage, and support marketing. You can accept all,
          reject non-essential cookies, or manage your preferences.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="border border-white/10 p-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">Strictly necessary</p>
                <p className="mt-1 text-xs leading-relaxed text-white/45">
                  Required for security, consent storage, and basic website operation.
                </p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                Always on
              </span>
            </div>
          </div>
          {([
            ['functional', 'Functional', 'Remember choices and improve the returning-user experience.'],
            ['analytics', 'Analytics', 'Measure traffic and performance so the website can be improved.'],
            ['marketing', 'Marketing', 'Support campaign measurement and marketing where permitted.'],
          ] as const).map(([key, title, description]) => (
            <label
              key={key}
              className="flex cursor-pointer items-start justify-between gap-4 border border-white/10 p-3"
            >
              <span>
                <span className="block text-sm font-semibold text-white">{title}</span>
                <span className="mt-1 block text-xs leading-relaxed text-white/45">
                  {description}
                </span>
              </span>
              <input
                type="checkbox"
                checked={preferences[key]}
                onChange={() => updatePreference(key)}
                className="mt-1 h-4 w-4 accent-gold"
              />
            </label>
          ))}
        </div>
      )}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={() =>
            savePreferences({ functional: true, analytics: true, marketing: true })
          }
          className="border border-gold bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-black"
        >
          Accept all
        </button>
        <button
          type="button"
          onClick={() => savePreferences(defaultPreferences)}
          className="border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 transition-colors hover:border-gold/40 hover:text-gold"
        >
          Reject non-essential
        </button>
        {manageOpen ? (
          <button
            type="button"
            onClick={() => savePreferences(preferences)}
            className="border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 transition-colors hover:border-gold/40 hover:text-gold"
          >
            Save preferences
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setManageOpen(true)}
            className="border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 transition-colors hover:border-gold/40 hover:text-gold"
          >
            Manage preferences
          </button>
        )}
        <a
          href="/legal.html#cookies"
          className="border border-white/15 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-white/70 transition-colors hover:border-gold/40 hover:text-gold"
        >
          Cookie policy
        </a>
      </div>
    </div>
  );
}
