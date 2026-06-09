# SwarpPay Marketing Website Security Audit Report

Date: 9 June 2026

## 1. Executive summary

Overall risk level before fixes: Medium to High. The site is a static Vite/React marketing site with no backend API routes in this repository, which limits server-side attack surface. Before remediation, practical risk came from missing production security headers, high-severity dependency advisories, a production inspection plugin, weaker cookie defaults, and loose repository ignore rules.

Overall risk level after fixes: Low for this repository-level review.

Critical/high issues remaining: None found in repository-level review after remediation. `npm audit --audit-level=high` reports zero vulnerabilities.

Deployment security status: Ready for deployment from a repository security standpoint, assuming Vercel applies `vercel.json` headers and the linked product subdomains are reviewed separately.

## 2. Scope reviewed

Framework and package manager:
- Vite 7 React 19 TypeScript static frontend.
- npm with `package-lock.json`.

Files and directories reviewed:
- `src/`
- `public/`
- `index.html`
- `package.json`
- `package-lock.json`
- `vite.config.ts`
- `eslint.config.js`
- `tailwind.config.js`
- `postcss.config.js`
- `.gitignore`
- `README.md`
- `info.md`
- built `dist/` output after production build

Routes reviewed:
- `/`
- `/legal.html`
- section anchors for Terms, Privacy, Cookies, products, merchants, team, and CTA

API routes/server actions reviewed:
- None present in this repository.

Config files reviewed:
- Vite config
- ESLint config
- Tailwind/PostCSS config
- npm package and lockfile
- new Vercel deployment header config
- robots and sitemap files

Third-party scripts reviewed:
- No analytics, tracking pixels, tag managers, or marketing scripts are installed.
- Google Fonts stylesheet is the only external frontend resource in `index.html`.

## 3. Threat model

Main realistic attackers:
- Opportunistic web attackers probing public marketing sites.
- Competitors or scrapers inspecting public assets and metadata.
- Supply-chain attackers relying on vulnerable transitive npm packages.
- Spam or phishing actors abusing public links/contact channels.
- Clickjacking and framing attempts against the public site.

Main realistic abuse paths:
- Browser exploitation from missing CSP or frame restrictions.
- Reverse tabnabbing through unsafe external links.
- Dependency vulnerabilities in build/dev tooling.
- Accidental secret or local artifact commits.
- Cookie consent bypass or weak consent persistence.
- Public metadata or sitemap leaking internal/investor-only information.

## 4. Findings table

| ID | Severity | Category | File/path | Issue | Impact | Fix status |
|---|---|---|---|---|---|---|
| F-001 | High | HTTP security headers | `vercel.json` absent | No production security headers were configured. | Higher exposure to XSS, clickjacking, MIME sniffing, referrer leakage, and missing HSTS. | Fixed |
| F-002 | High | Dependency security | `package-lock.json` | `npm audit` reported high advisories in Vite, Rollup, React Router, lodash, flatted, minimatch, and picomatch. | Potential development/build-time or library-level DoS, traversal, prototype pollution, or arbitrary file write exposure. | Fixed |
| F-003 | Medium | Supply chain / production surface | `vite.config.ts`, `package.json` | `kimi-plugin-inspect-react` was enabled in Vite plugins. | Unnecessary production build surface and extra transitive dependency footprint. | Fixed |
| F-004 | Medium | Cookie security and consent | `src/components/CookieBanner.tsx`, `src/components/ui/sidebar.tsx` | Consent and scaffold preference cookies lacked Secure-on-HTTPS behavior; consent panel had already been functional but needed stronger defaults. | Weaker cookie transport defaults and poorer future-proofing. | Fixed |
| F-005 | Medium | Repository hygiene | `.gitignore` | `.env*`, deployment state, key files, coverage, and TypeScript build-info were not explicitly ignored. | Increased risk of accidental secret or local artifact commits. | Fixed |
| F-006 | Low | Debug/demo code | `src/pages/Home.tsx` | Unused Vite demo counter page remained in source. | Low risk, but unnecessary public-app code surface. | Fixed |
| F-007 | Low | Public contact consistency | `src/sections/CTASection.tsx` | Final CTA used a personal partnership email while legal/footer used `info@swarppay.com`. | Inconsistent public contact routing and privacy process. | Fixed |
| F-008 | Info | Forms/API attack surface | N/A | No forms, API routes, server actions, CORS config, or server-side fetches are present. | CSRF, SSRF, email header injection, and rate limiting are not applicable in this repo. | Not applicable |
| F-009 | Info | Unsafe rendering review | `src/components/ui/chart.tsx` | shadcn chart component uses `dangerouslySetInnerHTML` for CSS variable style generation. | Low residual risk because it is typed local config, not user input, and not used for public user-generated content. | Accepted |

## 5. Detailed findings

### F-001: Missing production security headers

What was wrong:
The repository did not contain Vercel or equivalent deployment headers for CSP, HSTS, clickjacking protection, MIME sniffing protection, referrer policy, permissions policy, or cross-origin isolation/resource policy.

Why it mattered:
Marketing sites are frequently framed, scraped, and probed. Without headers, a browser has fewer restrictions against injected scripts, framing, mixed content, and overly broad browser feature access.

How it was fixed:
Added `vercel.json` with a production header baseline:
- Content-Security-Policy
- Strict-Transport-Security
- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy
- Permissions-Policy
- Cross-Origin-Opener-Policy
- Cross-Origin-Resource-Policy

Residual risk:
The CSP allows inline styles because the app and legal page use inline styles/style attributes. Script inline execution is not broadly allowed; the two inline JSON-LD blocks are authorized by SHA-256 hashes. Vercel must deploy this config for the headers to be effective.

### F-002: Dependency vulnerabilities

What was wrong:
`npm audit --audit-level=high` initially reported 10 total vulnerabilities, including 7 high severity advisories.

Why it mattered:
Even for static frontend sites, Vite/Rollup and library advisories can affect dev server safety, build integrity, or future runtime behavior.

How it was fixed:
Ran `npm audit fix`, which updated the lockfile and dependency tree without forced breaking changes. Re-ran audit and confirmed zero vulnerabilities.

Residual risk:
Dependency risk can change over time. Run `npm audit --audit-level=high` in CI before deployment.

### F-003: Unnecessary production inspection plugin

What was wrong:
`vite.config.ts` imported and enabled `kimi-plugin-inspect-react`.

Why it mattered:
Inspection/debug tooling is unnecessary for a public production marketing site and adds avoidable dependency and build surface.

How it was fixed:
Removed the plugin from `vite.config.ts` and uninstalled `kimi-plugin-inspect-react`.

Residual risk:
None identified.

### F-004: Cookie security and consent defaults

What was wrong:
Client-created preference cookies did not add `Secure` when served over HTTPS. The cookie banner stores non-sensitive consent preferences in localStorage and a consent cookie, and future optional cookies needed cleanup behavior when rejected.

Why it mattered:
Consent state is not secret, but production cookies should use conservative transport defaults. Revocation should also remove known optional analytics/marketing cookies if future scripts are added.

How it was fixed:
Updated consent cookie handling to:
- Store category-level consent.
- Use `SameSite=Lax`.
- Add `Secure` automatically on HTTPS.
- Clear common analytics/marketing cookie names when those categories are disabled.
- Allow footer Cookies link to reopen preferences.

Updated the scaffold sidebar preference cookie to add `SameSite=Lax` and `Secure` on HTTPS if that component is ever used.

Residual risk:
JavaScript-created cookies cannot be `HttpOnly`. This is acceptable here because these are non-sensitive preference cookies, not auth/session cookies. No analytics scripts are currently installed.

### F-005: Git ignore hardening

What was wrong:
`.gitignore` did not explicitly ignore `.env`, `.env.*`, `.vercel`, `.netlify`, key files, coverage, or TypeScript build-info files.

Why it mattered:
Accidental commits of secrets or local deployment state are common production launch risks.

How it was fixed:
Expanded `.gitignore` to cover environment files, local deployment metadata, private key-like files, coverage, and build-info output while preserving `.env.example` and `.env.sample`.

Residual risk:
No committed `.env` files were found. Continue using secret scanning in GitHub.

### F-006: Unused demo page

What was wrong:
`src/pages/Home.tsx` contained an unused demo counter page.

Why it mattered:
Unused demo code is not directly exploitable here, but it increases noise and future accidental routing risk.

How it was fixed:
Deleted `src/pages/Home.tsx`.

Residual risk:
None identified.

### F-007: Public contact consistency

What was wrong:
The final CTA used a personal partnership email while legal/footer pages used `info@swarppay.com`.

Why it mattered:
Privacy rights, support requests, and public contact flows should route consistently to the official address.

How it was fixed:
Updated the final CTA mailto link and text to `info@swarppay.com`.

Residual risk:
None identified.

### F-008: Forms/API/server attack surface

What was wrong:
No forms, API routes, server actions, backend route handlers, CORS config, or server-side fetches exist in this repository.

Why it mattered:
This means common backend issues such as CSRF, SSRF, email header injection, request validation, and rate limiting are not currently exposed by this repo.

How it was fixed:
No code fix required.

Residual risk:
If future contact forms, merchant applications, analytics endpoints, or backend routes are added, they must include schema validation, rate limiting, spam protection, method restrictions, CSRF protections where applicable, and safe error handling.

### F-009: shadcn chart style injection

What was wrong:
`src/components/ui/chart.tsx` uses `dangerouslySetInnerHTML` to inject generated CSS variables.

Why it mattered:
`dangerouslySetInnerHTML` can be an XSS sink if fed user-controlled content.

How it was handled:
Accepted as low residual risk. The component is generated shadcn code, the injected content is derived from typed local chart config, and no user input reaches this path in the current marketing site.

Residual risk:
If charts are later configured from CMS/user data, validate color strings against a strict allowlist before passing them into this component.

## 6. Security headers summary

Final configured headers in `vercel.json`:

- `Content-Security-Policy`: restricts scripts to self plus hashes for JSON-LD, styles to self/Google Fonts/inline style attributes, images to self/data/blob/HTTPS, fonts to self/data/Google Fonts, media to self, blocks objects, denies framing, restricts base URI and form action, and upgrades insecure requests.
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`: enforces HTTPS after first secure visit.
- `X-Content-Type-Options: nosniff`: prevents MIME sniffing.
- `X-Frame-Options: DENY`: legacy clickjacking protection alongside CSP `frame-ancestors 'none'`.
- `Referrer-Policy: strict-origin-when-cross-origin`: reduces URL leakage while preserving useful origin analytics.
- `Permissions-Policy`: disables camera, microphone, geolocation, payment, USB, Bluetooth, motion sensors, and FLoC/Topics-style interest cohort access.
- `Cross-Origin-Opener-Policy: same-origin`: isolates browsing context where compatible.
- `Cross-Origin-Resource-Policy: cross-origin`: intentionally permissive for static public assets so social networks and search crawlers can fetch logo/OG images.

## 7. Secrets review

Secrets found: No committed `.env` files, API keys, tokens, passwords, private keys, database URLs, webhook secrets, or credential-like values were found in repository source/config/public files during review.

Secret handling changes:
- `.gitignore` now blocks `.env`, `.env.*`, `.vercel`, `.netlify`, `*.pem`, and `*.key`.

Rotation recommendation:
- No rotation required based on this repository review.

Note:
- Untracked local image uploads remain in the working tree. They were not committed and were not treated as deployable source.

## 8. Dependency audit summary

Initial audit:
- `npm audit --audit-level=high` initially reported 10 vulnerabilities: 3 moderate and 7 high.
- High advisories included Vite, Rollup, React Router, lodash, flatted, minimatch, and picomatch related issues.

Remediation:
- Ran `npm audit fix`.
- Removed `kimi-plugin-inspect-react`.
- Re-ran `npm ci`, `npm audit --audit-level=high`, `npm run lint`, and `npm run build`.

Final audit:
- `npm audit --audit-level=high`: `found 0 vulnerabilities`.

Unresolved vulnerabilities:
- None.

## 9. Compliance/privacy notes

Terms, Privacy, and Cookie pages:
- `public/legal.html` exists and includes Terms, Privacy, and Cookie sections.
- Footer links point to Terms, Privacy, Cookies, and `Contact: info@swarppay.com`.
- Sitemap includes only public pages: `/` and `/legal.html`.
- `robots.txt` does not reveal private paths.

Cookie consent behavior:
- Necessary-only, accept-all, and category preference flows are functional.
- Consent is stored as non-sensitive preference data.
- Optional analytics/marketing cookies are not set because no analytics/marketing scripts are installed.
- Known analytics/marketing cookie names are cleared if corresponding categories are rejected or disabled.

Regulatory/public claims:
- Legal text describes cards, wallets, diaspora-linked spending, payment services, or regulated financial infrastructure as future/roadmap unless expressly launched.
- No investor-only valuation, use-of-funds, fundraising, KPI, or internal strategy pages were found in public routes or sitemap.

## 10. Commands run

- `find . -maxdepth 3 -type f -not -path './.git/*' -not -path './node_modules/*' -not -path './dist/*'`: Passed.
- `find . -maxdepth 2 -type f -name '.env*' -o -name 'vercel.json' -o -name 'netlify.toml' -o -name 'next.config.*' -o -name 'vite.config.*' -o -name '.gitignore'`: Passed.
- `grep -RIn "dangerouslySetInnerHTML|eval(|new Function|window.location|location.href|URLSearchParams|innerHTML|outerHTML|target=\"_blank\"|target='_blank'|console.log|process.env|import.meta.env|fetch(|axios|localStorage|sessionStorage|document.cookie" --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=dist .`: Passed; reviewed matches.
- `grep -RInE "(api[_-]?key|secret|token|password|passwd|private[_-]?key|client[_-]?secret|bearer|authorization|webhook|database_url|mongodb|postgres|mysql|redis|sk_live|sk_test|pk_live|ghp_|vercel|supabase|firebase|stripe|valuation|seed|fundraising|use of funds|KPI|deck|internal|confidential|admin)" --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=dist .`: Passed; no secrets found.
- `npm audit --audit-level=high`: Initially failed once due DNS, then ran successfully and found vulnerabilities.
- `npm audit fix`: Passed; fixed dependency advisories.
- `env NPM_CONFIG_CACHE=/tmp/npm-cache npm ci`: Passed; found 0 vulnerabilities.
- `npm run lint`: Passed after fixes.
- `npm run build`: Passed after fixes.
- `npm audit --audit-level=high`: Passed after fixes; found 0 vulnerabilities.
- `node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8')); console.log('vercel.json valid')"`: Passed.
- `find dist -type f \( -name '*.map' -o -name '.env*' -o -name '*.tsbuildinfo' \)`: Passed; no matching files.

Commands not available:
- `npm run typecheck`: no script present. TypeScript checking is included in `npm run build` via `tsc -b`.
- `npm run test`: no test script present.

## 11. Remaining recommendations

- Configure Vercel to deploy from the committed `main` branch and verify response headers with `curl -I https://swarppay.com/` after deployment.
- Add GitHub secret scanning and Dependabot/npm audit checks if not already enabled.
- Review and harden the separate `giftcard.swarppay.com`, `merchant.swarppay.com`, and `master.swarppay.com` codebases independently; they are out of scope for this repository.
- If future forms are added, implement schema validation, rate limiting, honeypot or CAPTCHA alternatives, generic user-facing errors, structured server-side logs without PII/secrets, and email header injection defenses.
- If analytics or pixels are added, load them only after explicit consent for the relevant category and update the Cookie Policy with exact providers.
