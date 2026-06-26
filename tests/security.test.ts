import assert from 'node:assert/strict';
import test from 'node:test';
import {
  safeCssVariableValue,
  safeExternalUrl,
  safeMailtoHref,
  setNonSensitiveCookie,
} from '../src/lib/security.js';

function mockBrowser(protocol: 'http:' | 'https:') {
  let cookieValue = '';
  const documentMock = {
    get cookie() {
      return cookieValue;
    },
    set cookie(value: string) {
      cookieValue = value;
    },
  };

  Object.defineProperty(globalThis, 'window', {
    value: {
      location: { protocol },
      document: documentMock,
    },
    configurable: true,
  });

  return documentMock;
}

test('safeExternalUrl rejects dangerous protocols and protocol-relative URLs', () => {
  assert.equal(safeExternalUrl('javascript:alert(1)'), null);
  assert.equal(safeExternalUrl('data:text/html,<script>alert(1)</script>'), null);
  assert.equal(safeExternalUrl('blob:https://evil.example/id'), null);
  assert.equal(safeExternalUrl('//evil.example/path'), null);
  assert.equal(safeExternalUrl('https://evil.example/path', { allowedHosts: ['swarppay.com'] }), null);
});

test('safeExternalUrl accepts https URLs for allowed hosts', () => {
  assert.equal(
    safeExternalUrl('https://giftcard.swarppay.com/', {
      allowedHosts: ['giftcard.swarppay.com'],
    }),
    'https://giftcard.swarppay.com/'
  );
});

test('safeMailtoHref encodes subject and body and rejects invalid email input', () => {
  const href = safeMailtoHref('info@swarppay.com', {
    subject: 'SwarpPay newsletter and early access',
    body: 'Line 1\nLine 2 & more',
  });

  assert.equal(
    href,
    'mailto:info@swarppay.com?subject=SwarpPay+newsletter+and+early+access&body=Line+1%0ALine+2+%26+more'
  );
  assert.throws(() => safeMailtoHref('info@swarppay.com\r\nbcc:evil@example.com'));
});

test('setNonSensitiveCookie writes encoded non-sensitive cookie syntax', () => {
  const documentMock = mockBrowser('https:');

  setNonSensitiveCookie('swarppay-cookie-consent', '{"analytics":false}', 3600);

  assert.equal(
    documentMock.cookie,
    'swarppay-cookie-consent=%7B%22analytics%22%3Afalse%7D; Path=/; Max-Age=3600; SameSite=Lax; Secure'
  );
});

test('setNonSensitiveCookie rejects unsafe cookie names', () => {
  mockBrowser('http:');

  assert.throws(() => setNonSensitiveCookie('bad name', 'value', 60));
});

test('safeCssVariableValue rejects CSS injection payloads', () => {
  assert.equal(safeCssVariableValue('red;body{display:none}'), null);
  assert.equal(safeCssVariableValue('url(javascript:alert(1))'), null);
  assert.equal(safeCssVariableValue('</style><script>alert(1)</script>'), null);
  assert.equal(safeCssVariableValue('@import url(https://evil.example/x.css)'), null);
  assert.equal(safeCssVariableValue('expression(alert(1))'), null);
});

test('safeCssVariableValue accepts chart color values', () => {
  assert.equal(safeCssVariableValue('#35d8d0'), '#35d8d0');
  assert.equal(safeCssVariableValue('rgb(53, 216, 208)'), 'rgb(53, 216, 208)');
  assert.equal(safeCssVariableValue('rgba(53, 216, 208, 0.5)'), 'rgba(53, 216, 208, 0.5)');
  assert.equal(safeCssVariableValue('hsl(177, 67%, 53%)'), 'hsl(177, 67%, 53%)');
  assert.equal(safeCssVariableValue('var(--chart-primary)'), 'var(--chart-primary)');
});
