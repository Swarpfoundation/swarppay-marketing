# SwarpPay PTK SAST Remediation

## Report summary

The uploaded PTK report for `www.swarppay.com` reported:

- Critical: 0
- High: 183
- Medium: 13
- Low: 35
- Total: 231

The report scanned the deployed minified production bundle, primarily `https://www.swarppay.com/assets/main-BcrGzXXI.js`. That caused duplicated and inflated framework-level findings because React, React Router, GSAP, Three.js, and browser rendering code naturally use DOM APIs such as `appendChild`, `insertBefore`, navigation state, and storage.

This remediation focused on real source-level risks in this repository rather than blindly patching each minified-bundle finding.

## Source files reviewed

- `src/sections/HeroSection.tsx`
- `src/components/CookieBanner.tsx`
- `src/components/ui/chart.tsx`
- `src/components/ui/sidebar.tsx`
- `src/components/WebGLRipple.tsx`
- `src/components/TiltButton.tsx`
- `src/components/MagneticElement.tsx`
- `src/send-gift/SendGiftPage.tsx`
- `vercel.json`
- `index.html`
- `send-gift.html`

Search patterns reviewed included:

- `dangerouslySetInnerHTML`
- `innerHTML`
- `outerHTML`
- `insertAdjacentHTML`
- `eval(`
- `new Function`
- `setTimeout(`
- `setInterval(`
- `window.location`
- `location.href`
- `document.cookie`
- `postMessage`
- `import(`
- `appendChild`
- `insertBefore`

## Fixes made

### Central security helpers

Added `src/lib/security.ts` with:

- `safeExternalUrl`
- `safeMailtoHref`
- `setNonSensitiveCookie`
- `expireNonSensitiveCookie`
- `safeCssVariableValue`
- `safeDomId`

These helpers centralize URL, mailto, cookie, CSS value, and DOM id safety rules.

### Mailto navigation hardening

`src/sections/HeroSection.tsx` no longer constructs a `mailto:` URL through direct string assignment to `window.location.href`. It now uses `safeMailtoHref` and `window.location.assign` with encoded subject/body parameters.

### Cookie and localStorage hardening

`src/components/CookieBanner.tsx` now:

- keeps consent storage non-sensitive
- wraps localStorage reads/writes/removals in `try/catch`
- uses centralized cookie helpers for consent and optional cookie expiry
- sets consent cookies with `Path=/`, `SameSite=Lax`, and `Secure` on HTTPS
- does not store personal data, tokens, wallet data, emails, or session identifiers

`src/components/ui/sidebar.tsx` now uses `setNonSensitiveCookie` for the non-sensitive sidebar UI preference.

### Chart CSS injection hardening

`src/components/ui/chart.tsx` no longer uses `dangerouslySetInnerHTML` for chart style generation. CSS text is rendered as a style child after:

- chart ids are constrained with `safeDomId`
- CSS variable keys are constrained
- color values are validated with `safeCssVariableValue`
- unsafe values are dropped instead of rendered

Rejected values include semicolons, braces, angle brackets, `url(`, `expression(`, `@import`, comments, and backslashes.

### WebGL canvas review

`src/components/WebGLRipple.tsx` appends only the canvas element created by Three.js. It does not use user-controlled tag names, ids, raw HTML, script URLs, or event-handler strings. Cleanup removes the mouse listener, resize listener, animation frame, render targets, renderer, and canvas element.

### postMessage review

No source-level `postMessage` or message listener usage was found. PTK findings in this category are considered likely minified-bundle/framework noise unless a future source-level usage is introduced.

### Dynamic import / worker / script URL review

No source-level dynamic `import()`, `Worker()`, or constructed script URL usage was found. PTK findings in this category are considered likely minified-bundle/framework noise unless a future source-level usage is introduced.

### Security headers

`vercel.json` controls deployment headers. The CSP was hardened while preserving existing functionality for inline JSON-LD hashes and Google Fonts:

- `default-src 'self'`
- `object-src 'none'`
- `base-uri 'self'`
- `frame-ancestors 'none'`
- `script-src 'self'` plus existing JSON-LD hashes
- `img-src 'self' data: blob: https:`
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`
- `font-src 'self' data: https://fonts.gstatic.com`
- `connect-src 'self' https:`
- `form-action 'self' mailto:`
- `upgrade-insecure-requests`

Other configured headers include HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, and `Cross-Origin-Resource-Policy`.

## Findings considered likely false positives

Most PTK high findings trace minified framework sources such as `location.pathname`, `location.search`, `location.hash`, `sessionStorage.getItem`, and `document.querySelector` into framework DOM sinks such as `appendChild`, `insertBefore`, `innerHTML`, and navigation internals.

The source-level review did not find corresponding app code that renders route/query/hash values as HTML or executes them as script.

## Remaining risks

- The site is still a browser application and depends on React, React Router, GSAP, Three.js, Recharts, and Vite runtime behavior.
- CSP still permits `'unsafe-inline'` for styles because the current Tailwind/Vite/component styling model and chart style tags require inline style support.
- The JSON-LD inline scripts rely on fixed CSP hashes. If the JSON-LD changes, hashes must be updated.
- Cookie helpers cannot set `HttpOnly` because browser JavaScript cannot set `HttpOnly`; these helpers must only be used for non-sensitive preferences.

## Commands run

- `npm run lint` - passed
- `npm run test` - passed
- `npm run build` - passed
- `npm audit --audit-level=high` - passed for high severity; one moderate `js-yaml` advisory remains available for `npm audit fix`

## Recommended next step

After deployment, rescan both:

1. The source repository with source maps or source-aware SAST if available.
2. The deployed site with PTK or equivalent DAST/SAST tooling.

Compare whether remaining findings map to source-level code or framework/minified-bundle internals.
