/**
 * Unit & Security Test Suite for Phase 2 LTS Core Services
 */

import assert from 'node:assert';
import crypto from 'node:crypto';
import {
  signToken,
  verifyToken,
  validateContactSubmission,
  verifyWebhookSignature
} from './server.js';

console.log('[Phase 2 Test] Running LTS Service Unit & Security Test Suite...');

// 1. Auth: Sign & Verify Token
{
  const token = signToken({ userId: 'user-123', role: 'admin' }, 'secret-test-key-32-chars-minimum');
  assert.strictEqual(typeof token, 'string');
  const result = verifyToken(token, 'secret-test-key-32-chars-minimum');
  assert.strictEqual(result.valid, true);
  assert.strictEqual(result.payload.userId, 'user-123');
  assert.strictEqual(result.payload.role, 'admin');
  console.log('[OK] Token signing and verification passed.');
}

// 2. Auth: Reject Forged Token & Unsupported Algorithm
{
  const secret = 'secret-test-key-32-chars-minimum';
  const token = signToken({ userId: 'user-123' }, secret);
  const forgedToken = token.slice(0, -4) + 'abcd';
  const result = verifyToken(forgedToken, secret);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.error, 'Invalid signature');

  // Even if signed with the secret, alg: "none" must be rejected
  const noneHeader = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const payloadPart = token.split('.')[1];
  const unsignedData = `${noneHeader}.${payloadPart}`;
  const noneSig = crypto.createHmac('sha256', secret).update(unsignedData).digest('base64url');
  const algNoneResult = verifyToken(`${unsignedData}.${noneSig}`, secret);
  assert.strictEqual(algNoneResult.valid, false);
  assert.strictEqual(algNoneResult.error, 'Unsupported token algorithm');
  console.log('[OK] Forged token signature & unsupported algorithm rejection passed.');
}

// 3. Contact: Strict Input Validation & Prototype Pollution Defense
{
  // Valid payload
  const valid = validateContactSubmission({
    name: 'Test User',
    email: 'user@example.com',
    message: 'Hello from modern LTS stack'
  });
  assert.strictEqual(valid.valid, true);
  assert.strictEqual(valid.sanitized.name, 'Test User');

  // Prototype pollution attempt via parsed JSON payload
  const pollution = validateContactSubmission(JSON.parse('{"name":"Hacker","email":"hacker@example.com","message":"payload","__proto__":{"isAdmin":true}}'));
  assert.strictEqual(pollution.valid, false);
  assert.strictEqual(pollution.error, 'Prohibited property detected');

  // Constructor pollution attempt
  const constructorPollution = validateContactSubmission(JSON.parse('{"name":"Hacker","email":"hacker@example.com","message":"payload","constructor":{"prototype":{"isAdmin":true}}}'));
  assert.strictEqual(constructorPollution.valid, false);
  assert.strictEqual(constructorPollution.error, 'Prohibited property detected');

  // Parameter injection attempt (extra unexpected parameters)
  const extraParam = validateContactSubmission({
    name: 'Test',
    email: 'test@example.com',
    message: 'msg',
    php_flag: 'auto_prepend_file'
  });
  assert.strictEqual(extraParam.valid, false);
  assert.strictEqual(extraParam.error.includes('Unexpected parameter'), true);

  // Invalid email
  const badEmail = validateContactSubmission({
    name: 'Test',
    email: 'not-an-email',
    message: 'msg'
  });
  assert.strictEqual(badEmail.valid, false);
  console.log('[OK] Schema validation & prototype pollution defense passed.');
}

// 4. Webhook: Cryptographic HMAC Signature Verification
{
  const secret = 'webhook-super-secret-key';
  const payload = JSON.stringify({ event: 'payment.success', amount: 5000 });
  const validSig = 'e2b34a94628f4bc9242a3a5f0e30aaecdafc4979e95dfcf97d62057630718610'; // calculated
  // Test genuine HMAC calculation
  import('node:crypto').then(crypto => {
    const computedSig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    assert.strictEqual(verifyWebhookSignature(payload, computedSig, secret), true);
    assert.strictEqual(verifyWebhookSignature(payload, 'wrong-signature', secret), false);
    console.log('[OK] Webhook cryptographic signature verification passed.');
  });
}
