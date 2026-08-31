# SwarpPay marketing website

Public marketing website for [swarppay.com](https://swarppay.com), built with React, TypeScript, Vite, and Tailwind CSS.

## Local development

```bash
npm ci
npm run dev
```

Production checks:

```bash
npm run lint
npm test
npm run build
```

## Subscription page

`/subscribe` provides a custom SwarpPay newsletter form backed by Brevo's double-opt-in API. The browser sends subscription requests only to the same-origin `/api/subscribe` serverless endpoint. The Brevo API key is never included in browser code.

Copy `.env.example` to a local `.env` or configure the same values in the Vercel project:

- `BREVO_API_KEY`: server-side Brevo API key.
- `BREVO_LIST_ID`: numeric ID of the confirmed newsletter contact list.
- `BREVO_DOI_TEMPLATE_ID`: numeric ID of the active double-opt-in confirmation template.
- `BREVO_CONFIRMATION_REDIRECT_URL`: HTTPS URL opened after confirmation.
- `SUBSCRIBE_ALLOWED_ORIGINS`: comma-separated production origins allowed to submit the form.
- `SUBSCRIBE_RATE_LIMIT_SALT`: long random server-side value used when hashing rate-limit identifiers.

The endpoint validates and normalizes addresses, requires explicit consent, checks request origin, includes a honeypot, applies a best-effort rate limit, avoids logging email addresses, and returns generic duplicate-safe responses.

## Routes

- `/` — main marketing website
- `/send-gift` — digital gift landing page
- `/subscribe` — SwarpPay updates subscription
- `/legal.html` — terms, privacy, and cookies
