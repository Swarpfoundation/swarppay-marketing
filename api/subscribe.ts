import { createHash } from 'node:crypto';
import {
  isDuplicateBrevoResponse,
  resolveAllowedOrigins,
  resolveBrevoConfiguration,
  safeBrevoErrorCode,
  subscribePayloadSchema,
} from './subscription.js';

type HeaderValue = string | string[] | undefined;

type VercelRequest = {
  method?: string;
  headers: Record<string, HeaderValue>;
  body?: unknown;
};

type VercelResponse = {
  setHeader(name: string, value: string): void;
  status(statusCode: number): VercelResponse;
  json(payload: Record<string, unknown>): unknown;
};

const MAX_BODY_BYTES = 8_192;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const GENERIC_SUCCESS_MESSAGE =
  'Check your inbox and confirm your email address to complete your subscription.';

type RateLimitEntry = { count: number; resetAt: number };
const rateLimits = new Map<string, RateLimitEntry>();

function sendJson(response: VercelResponse, status: number, payload: Record<string, unknown>) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  return response.status(status).json(payload);
}

function parseBody(body: unknown) {
  if (typeof body === 'string') return JSON.parse(body) as unknown;
  return body;
}

function clientRateLimitKey(request: VercelRequest) {
  const forwarded = request.headers['x-forwarded-for'];
  const rawAddress = Array.isArray(forwarded)
    ? forwarded[0]
    : forwarded?.split(',')[0] || request.headers['x-real-ip'] || 'unknown';
  const address = Array.isArray(rawAddress) ? rawAddress[0] : rawAddress;
  const salt = process.env.SUBSCRIBE_RATE_LIMIT_SALT || 'swarppay-subscribe-rate-limit';

  return createHash('sha256').update(`${salt}:${address}`).digest('hex');
}

function isRateLimited(request: VercelRequest) {
  const now = Date.now();

  if (rateLimits.size > 1_000) {
    for (const [storedKey, entry] of rateLimits) {
      if (entry.resetAt <= now) rateLimits.delete(storedKey);
    }
  }

  const key = clientRateLimitKey(request);
  const current = rateLimits.get(key);

  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { limited: false, retryAfter: 0 };
  }

  current.count += 1;

  if (current.count > RATE_LIMIT_MAX_REQUESTS) {
    return {
      limited: true,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1_000)),
    };
  }

  return { limited: false, retryAfter: 0 };
}

async function readProviderResponse(response: Response) {
  try {
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { message: 'Method not allowed.' });
  }

  const contentType = request.headers['content-type'];
  if (typeof contentType !== 'string' || !contentType.toLowerCase().startsWith('application/json')) {
    return sendJson(response, 415, { message: 'Content type must be application/json.' });
  }

  const contentLength = Number(request.headers['content-length'] || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return sendJson(response, 413, { message: 'Request is too large.' });
  }

  const rawOrigin = request.headers.origin;
  const origin = Array.isArray(rawOrigin) ? rawOrigin[0] : rawOrigin;
  const allowedOrigins = resolveAllowedOrigins(process.env.SUBSCRIBE_ALLOWED_ORIGINS);
  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (process.env.VERCEL_ENV !== 'production' && vercelUrl && !vercelUrl.includes('/')) {
    allowedOrigins.add(`https://${vercelUrl}`);
  }
  if (origin && !allowedOrigins.has(origin)) {
    return sendJson(response, 403, { message: 'Request origin is not allowed.' });
  }

  let parsedBody: unknown;
  try {
    parsedBody = parseBody(request.body);
  } catch {
    return sendJson(response, 400, { message: 'Enter a valid email address.' });
  }

  const parsed = subscribePayloadSchema.safeParse(parsedBody);
  if (!parsed.success) {
    return sendJson(response, 400, {
      message: 'Enter a valid email address and confirm your subscription.',
    });
  }

  if (parsed.data.website) {
    return sendJson(response, 202, { message: GENERIC_SUCCESS_MESSAGE });
  }

  const rateLimit = isRateLimited(request);
  if (rateLimit.limited) {
    response.setHeader('Retry-After', String(rateLimit.retryAfter));
    return sendJson(response, 429, {
      message: 'Too many attempts. Please wait a few minutes and try again.',
    });
  }

  const configuration = resolveBrevoConfiguration(process.env);
  if (!configuration) {
    console.error('Subscription service is missing required Brevo configuration.');
    return sendJson(response, 503, {
      message: 'Subscriptions are temporarily unavailable. Please try again later.',
    });
  }

  let providerResponse: Response;
  try {
    providerResponse = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': configuration.apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: parsed.data.email,
        includeListIds: [configuration.listId],
        redirectionUrl: configuration.redirectionUrl,
        templateId: configuration.templateId,
      }),
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    console.error('Brevo subscription request failed before receiving a response.');
    return sendJson(response, 503, {
      message: 'Subscriptions are temporarily unavailable. Please try again later.',
    });
  }

  const providerPayload = await readProviderResponse(providerResponse);

  if (providerResponse.ok || isDuplicateBrevoResponse(providerPayload)) {
    return sendJson(response, 202, { message: GENERIC_SUCCESS_MESSAGE });
  }

  console.error('Brevo subscription request failed.', {
    status: providerResponse.status,
    code: safeBrevoErrorCode(providerPayload),
  });

  return sendJson(response, 503, {
    message: 'Subscriptions are temporarily unavailable. Please try again later.',
  });
}
