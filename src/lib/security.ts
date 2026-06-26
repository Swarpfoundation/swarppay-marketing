const SAFE_COOKIE_NAME_PATTERN = /^[A-Za-z0-9!#$%&'*+\-.^_`|~]+$/;
const SAFE_EMAIL_PATTERN = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;
const SAFE_DOM_ID_PATTERN = /^[A-Za-z0-9_:-]+$/;
const SAFE_CSS_VAR_TOKEN_PATTERN = /^var\(--[A-Za-z0-9_-]+\)$/;
const HEX_COLOR_PATTERN = /^#(?:[0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
const CSS_NUMBER = String.raw`(?:\d+|\d*\.\d+)`;
const CSS_PERCENT = String.raw`${CSS_NUMBER}%`;
const CSS_ANGLE = String.raw`${CSS_NUMBER}(?:deg|rad|turn)`;
const RGB_PATTERN = new RegExp(
  String.raw`^rgba?\(\s*(?:${CSS_NUMBER}|${CSS_PERCENT})\s*,\s*(?:${CSS_NUMBER}|${CSS_PERCENT})\s*,\s*(?:${CSS_NUMBER}|${CSS_PERCENT})(?:\s*,\s*(?:${CSS_NUMBER}|0?\.\d+|1(?:\.0+)?|${CSS_PERCENT}))?\s*\)$`,
  'i'
);
const HSL_PATTERN = new RegExp(
  String.raw`^hsla?\(\s*(?:${CSS_NUMBER}|${CSS_ANGLE})\s*,\s*${CSS_PERCENT}\s*,\s*${CSS_PERCENT}(?:\s*,\s*(?:${CSS_NUMBER}|0?\.\d+|1(?:\.0+)?|${CSS_PERCENT}))?\s*\)$`,
  'i'
);
const UNSAFE_CSS_TOKENS = /[;{}<>\\]|url\s*\(|expression\s*\(|@import|\/\*|\*\//i;

function getBrowserWindow(): Window | undefined {
  return typeof window === 'undefined' ? undefined : window;
}

export function safeExternalUrl(
  input: string,
  options: { allowedHosts?: string[]; allowMailto?: boolean; allowTel?: boolean } = {}
): string | null {
  const trimmed = input.trim();

  if (!trimmed || trimmed.startsWith('//')) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    const protocol = parsed.protocol.toLowerCase();

    if (protocol === 'https:') {
      if (options.allowedHosts?.length) {
        const hostname = parsed.hostname.toLowerCase();
        const allowed = options.allowedHosts.some((host) => host.toLowerCase() === hostname);
        if (!allowed) return null;
      }

      return parsed.toString();
    }

    if (protocol === 'mailto:' && options.allowMailto) {
      return parsed.toString();
    }

    if (protocol === 'tel:' && options.allowTel) {
      return parsed.toString();
    }

    return null;
  } catch {
    return null;
  }
}

export function safeMailtoHref(
  email: string,
  params: { subject?: string; body?: string } = {}
): string {
  const normalizedEmail = email.trim();

  if (
    !SAFE_EMAIL_PATTERN.test(normalizedEmail) ||
    normalizedEmail.includes('\r') ||
    normalizedEmail.includes('\n')
  ) {
    throw new Error('Invalid email address for mailto URL.');
  }

  const searchParams = new URLSearchParams();
  if (params.subject) searchParams.set('subject', params.subject);
  if (params.body) searchParams.set('body', params.body);

  const query = searchParams.toString();
  return `mailto:${normalizedEmail}${query ? `?${query}` : ''}`;
}

export function setNonSensitiveCookie(
  name: string,
  value: string,
  maxAgeSeconds: number
): void {
  if (!SAFE_COOKIE_NAME_PATTERN.test(name)) {
    throw new Error('Invalid cookie name.');
  }

  if (!Number.isFinite(maxAgeSeconds) || maxAgeSeconds < 0) {
    throw new Error('Invalid cookie max-age.');
  }

  const browserWindow = getBrowserWindow();
  if (!browserWindow?.document) return;

  const securePart = browserWindow.location.protocol === 'https:' ? '; Secure' : '';
  browserWindow.document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${Math.floor(
    maxAgeSeconds
  )}; SameSite=Lax${securePart}`;
}

export function expireNonSensitiveCookie(name: string, domain?: string): void {
  if (!SAFE_COOKIE_NAME_PATTERN.test(name)) {
    throw new Error('Invalid cookie name.');
  }

  const browserWindow = getBrowserWindow();
  if (!browserWindow?.document) return;

  const safeDomain = domain && /^[A-Za-z0-9.-]+$/.test(domain) ? `; Domain=${domain}` : '';
  const securePart = browserWindow.location.protocol === 'https:' ? '; Secure' : '';
  browserWindow.document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${securePart}${safeDomain}`;
}

export function safeCssVariableValue(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed || UNSAFE_CSS_TOKENS.test(trimmed)) {
    return null;
  }

  if (
    HEX_COLOR_PATTERN.test(trimmed) ||
    RGB_PATTERN.test(trimmed) ||
    HSL_PATTERN.test(trimmed) ||
    SAFE_CSS_VAR_TOKEN_PATTERN.test(trimmed)
  ) {
    return trimmed;
  }

  return null;
}

export function safeDomId(input: string, fallback: string): string {
  const trimmed = input.trim();
  const fallbackValue = SAFE_DOM_ID_PATTERN.test(fallback) ? fallback : 'safe-id';

  return SAFE_DOM_ID_PATTERN.test(trimmed) ? trimmed : fallbackValue;
}
