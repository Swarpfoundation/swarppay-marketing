import assert from 'node:assert/strict';
import test from 'node:test';
import {
  classifyBrevoError,
  isDuplicateBrevoResponse,
  resolveAllowedOrigins,
  resolveBrevoConfiguration,
  safeBrevoErrorCode,
  subscribePayloadSchema,
} from '../api/subscription.js';

test('subscription payload normalizes valid email and requires consent', () => {
  const result = subscribePayloadSchema.safeParse({
    email: '  HELLO@EXAMPLE.COM ',
    consent: true,
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.email, 'hello@example.com');
    assert.equal(result.data.website, '');
  }

  assert.equal(
    subscribePayloadSchema.safeParse({ email: 'hello@example.com', consent: false }).success,
    false
  );
});

test('Brevo configuration requires complete HTTPS settings', () => {
  const valid = resolveBrevoConfiguration({
    BREVO_API_KEY: 'test-key',
    BREVO_LIST_ID: '12',
    BREVO_DOI_TEMPLATE_ID: '34',
    BREVO_CONFIRMATION_REDIRECT_URL: 'https://swarppay.com/subscribe?confirmed=true',
  });

  assert.deepEqual(valid, {
    apiKey: 'test-key',
    listId: 12,
    templateId: 34,
    redirectionUrl: 'https://swarppay.com/subscribe?confirmed=true',
  });

  assert.equal(
    resolveBrevoConfiguration({
      BREVO_API_KEY: 'test-key',
      BREVO_LIST_ID: '12',
      BREVO_DOI_TEMPLATE_ID: '34',
      BREVO_CONFIRMATION_REDIRECT_URL: 'http://localhost/confirmed',
    }),
    null
  );
});

test('origin and Brevo error helpers fail closed without exposing provider messages', () => {
  const origins = resolveAllowedOrigins(undefined);
  assert.equal(origins.has('https://swarppay.com'), true);
  assert.equal(origins.has('https://evil.example'), false);
  assert.equal(isDuplicateBrevoResponse({ code: 'duplicate_parameter' }), true);
  assert.equal(isDuplicateBrevoResponse({ message: 'Contact already exists' }), true);
  assert.equal(safeBrevoErrorCode({ code: 'invalid_parameter' }), 'invalid_parameter');
  assert.equal(safeBrevoErrorCode({ code: '<script>' }), 'unknown');
});

test('Brevo error classifier exposes only a bounded configuration category', () => {
  assert.equal(
    classifyBrevoError({ code: 'invalid_parameter', message: 'Template is not a DOI template' }),
    'template_confirmation_link'
  );
  assert.equal(
    classifyBrevoError({ code: 'invalid_parameter', message: 'Template is inactive' }),
    'template_inactive'
  );
  assert.equal(
    classifyBrevoError({ code: 'invalid_parameter', message: 'Template does not exist' }),
    'template_not_found'
  );
  assert.equal(
    classifyBrevoError({ code: 'invalid_parameter', details: { field: 'redirectionUrl' } }),
    'redirection_url'
  );
  assert.equal(classifyBrevoError({ code: 'invalid_parameter', message: 'Something else' }), 'unknown');
});
