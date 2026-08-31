import assert from 'node:assert/strict';
import test from 'node:test';
import subscribeHandler from '../api/subscribe.js';

type MockResponse = {
  headers: Map<string, string>;
  statusCode: number;
  payload: Record<string, unknown> | null;
  setHeader(name: string, value: string): void;
  status(statusCode: number): MockResponse;
  json(payload: Record<string, unknown>): Record<string, unknown>;
};

function createResponse(): MockResponse {
  return {
    headers: new Map(),
    statusCode: 200,
    payload: null,
    setHeader(name, value) {
      this.headers.set(name, value);
    },
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return payload;
    },
  };
}

function configuredEnvironment() {
  process.env.BREVO_API_KEY = 'test-api-key';
  process.env.BREVO_LIST_ID = '12';
  process.env.BREVO_DOI_TEMPLATE_ID = '34';
  process.env.BREVO_CONFIRMATION_REDIRECT_URL =
    'https://swarppay.com/subscribe?confirmed=true';
  process.env.SUBSCRIBE_ALLOWED_ORIGINS = 'https://swarppay.com';
  process.env.SUBSCRIBE_RATE_LIMIT_SALT = 'unit-test-rate-limit-salt';
}

test('subscribe handler rejects unsupported methods', async () => {
  const response = createResponse();

  await subscribeHandler(
    { method: 'GET', headers: {} },
    response
  );

  assert.equal(response.statusCode, 405);
  assert.equal(response.headers.get('Allow'), 'POST');
});

test('subscribe handler sends a valid double-opt-in request without exposing the API key', async () => {
  configuredEnvironment();
  const originalFetch = globalThis.fetch;
  let providerRequestBody: Record<string, unknown> | null = null;

  globalThis.fetch = async (input, init) => {
    assert.equal(String(input), 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation');
    assert.equal(init?.method, 'POST');
    assert.equal((init?.headers as Record<string, string>)['api-key'], 'test-api-key');
    providerRequestBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
    return new Response(null, { status: 201 });
  };

  try {
    const response = createResponse();
    await subscribeHandler(
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          origin: 'https://swarppay.com',
          'x-forwarded-for': '203.0.113.10',
        },
        body: { email: 'HELLO@EXAMPLE.COM', consent: true, website: '' },
      },
      response
    );

    assert.equal(response.statusCode, 202);
    assert.deepEqual(providerRequestBody, {
      email: 'hello@example.com',
      includeListIds: [12],
      redirectionUrl: 'https://swarppay.com/subscribe?confirmed=true',
      templateId: 34,
    });
    assert.equal(JSON.stringify(response.payload).includes('test-api-key'), false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('subscribe handler rejects unknown browser origins before calling Brevo', async () => {
  configuredEnvironment();
  const originalFetch = globalThis.fetch;
  let providerWasCalled = false;
  globalThis.fetch = async () => {
    providerWasCalled = true;
    return new Response(null, { status: 201 });
  };

  try {
    const response = createResponse();
    await subscribeHandler(
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          origin: 'https://evil.example',
        },
        body: { email: 'hello@example.com', consent: true, website: '' },
      },
      response
    );

    assert.equal(response.statusCode, 403);
    assert.equal(providerWasCalled, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
