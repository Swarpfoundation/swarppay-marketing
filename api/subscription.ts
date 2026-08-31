import { z } from 'zod';

export const subscribePayloadSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  consent: z.literal(true),
  website: z.string().max(256).optional().default(''),
});

export type SubscribePayload = z.infer<typeof subscribePayloadSchema>;

export type BrevoConfiguration = {
  apiKey: string;
  listId: number;
  templateId: number;
  redirectionUrl: string;
};

function positiveInteger(value: string | undefined) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

export function resolveBrevoConfiguration(
  environment: NodeJS.ProcessEnv
): BrevoConfiguration | null {
  const apiKey = environment.BREVO_API_KEY?.trim();
  const listId = positiveInteger(environment.BREVO_LIST_ID);
  const templateId = positiveInteger(environment.BREVO_DOI_TEMPLATE_ID);
  const redirectionUrl = environment.BREVO_CONFIRMATION_REDIRECT_URL?.trim();

  if (!apiKey || !listId || !templateId || !redirectionUrl) return null;

  try {
    const url = new URL(redirectionUrl);
    if (url.protocol !== 'https:') return null;
  } catch {
    return null;
  }

  return { apiKey, listId, templateId, redirectionUrl };
}

export function resolveAllowedOrigins(value: string | undefined) {
  const configured = value
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return new Set(
    configured?.length
      ? configured
      : ['https://swarppay.com', 'https://www.swarppay.com']
  );
}

export function isDuplicateBrevoResponse(payload: unknown) {
  if (!payload || typeof payload !== 'object') return false;

  const record = payload as Record<string, unknown>;
  const code = typeof record.code === 'string' ? record.code.toLowerCase() : '';
  const message = typeof record.message === 'string' ? record.message.toLowerCase() : '';

  return code.includes('duplicate') || message.includes('already exists');
}

export function safeBrevoErrorCode(payload: unknown) {
  if (!payload || typeof payload !== 'object') return 'unknown';
  const code = (payload as Record<string, unknown>).code;
  return typeof code === 'string' && /^[a-z0-9_-]{1,64}$/i.test(code) ? code : 'unknown';
}

export function classifyBrevoError(payload: unknown) {
  if (!payload || typeof payload !== 'object') return 'unknown';

  let serialized: string;
  try {
    serialized = JSON.stringify(payload).toLowerCase();
  } catch {
    return 'unknown';
  }

  if (serialized.includes('template')) return 'template';
  if (serialized.includes('list')) return 'list';
  if (serialized.includes('redirect') || serialized.includes('url')) return 'redirection_url';
  if (serialized.includes('sender')) return 'sender';
  if (serialized.includes('email') || serialized.includes('contact')) return 'contact';
  return 'unknown';
}
