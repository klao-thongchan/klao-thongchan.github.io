/**
 * Phase 2: Modern LTS Core Service (Node.js 22 LTS / ES Modules)
 *
 * Replaces legacy PHP dynamic backend scripts with a secure, type-checked,
 * memory-safe microservice.
 *
 * Replaced Legacy PHP Systems:
 * 1. session_start() & PHPSESSID -> Stateless HMAC-SHA256 Token Validation
 * 2. mail.php / send_form.php    -> Schema-validated Contact Ingestion
 * 3. ipn.php / payment_hook.php  -> Cryptographically verified Webhook Handler
 */

import http from 'node:http';
import crypto from 'node:crypto';

// Server Configuration
export const CONFIG = {
  port: parseInt(process.env.PORT || '8080', 10),
  jwtSecret: process.env.JWT_SECRET || 'test-lts-hmac-secret-at-least-32-chars-long',
  tokenTtlSeconds: 3600
};

/**
 * Creates a signed base64url token (HMAC-SHA256).
 * Replaces PHP's unencrypted, file-based session stores and serialize()/unserialize().
 *
 * @param {Record<string, unknown>} payload
 * @param {string} secret
 * @returns {string}
 */
export function signToken(payload, secret = CONFIG.jwtSecret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claims = { ...payload, iat: now, exp: now + CONFIG.tokenTtlSeconds };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  const data = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  return `${data}.${signature}`;
}

/**
 * Verifies and decodes a signed base64url token.
 * Prevents tampering, timing attacks, and token forgery.
 *
 * @param {string} token
 * @param {string} secret
 * @returns {{ valid: boolean, payload?: Record<string, unknown>, error?: string }}
 */
export function verifyToken(token, secret = CONFIG.jwtSecret) {
  if (typeof token !== 'string') return { valid: false, error: 'Token must be a string' };
  const parts = token.split('.');
  if (parts.length !== 3) return { valid: false, error: 'Malformed token structure' };

  const [encodedHeader, encodedPayload, signature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;
  const expectedSig = crypto.createHmac('sha256', secret).update(data).digest('base64url');

  // Constant-time comparison to prevent timing attacks
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return { valid: false, error: 'Invalid signature' };
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false, error: 'Token has expired' };
    }
    return { valid: true, payload };
  } catch {
    return { valid: false, error: 'Unparseable payload' };
  }
}

/**
 * Validates inbound contact form submissions against strict schema.
 * Replaces unvalidated PHP $_POST handling.
 * Protects against Prototype Pollution, Parameter Injection, and Buffer Overflows.
 *
 * @param {unknown} body
 * @returns {{ valid: boolean, sanitized?: { name: string, email: string, message: string }, error?: string }}
 */
export function validateContactSubmission(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { valid: false, error: 'Request body must be a JSON object' };
  }

  // Guard against prototype pollution
  const keys = Object.keys(body);
  const allowedKeys = ['name', 'email', 'message'];
  for (const key of keys) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return { valid: false, error: 'Prohibited property detected' };
    }
    if (!allowedKeys.includes(key)) {
      return { valid: false, error: `Unexpected parameter: ${key}` };
    }
  }

  const { name, email, message } = body;

  if (typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
    return { valid: false, error: 'Name must be a string between 1 and 100 characters' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof email !== 'string' || !emailRegex.test(email) || email.length > 254) {
    return { valid: false, error: 'A valid email address is required' };
  }
  if (typeof message !== 'string' || message.trim().length === 0 || message.length > 2000) {
    return { valid: false, error: 'Message must be a string between 1 and 2000 characters' };
  }

  return {
    valid: true,
    sanitized: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim()
    }
  };
}

/**
 * Validates cryptographically signed webhook callbacks (e.g. payment gateway or deployment).
 *
 * @param {string} rawBody
 * @param {string} signatureHeader
 * @param {string} webhookSecret
 * @returns {boolean}
 */
export function verifyWebhookSignature(rawBody, signatureHeader, webhookSecret) {
  if (!rawBody || !signatureHeader || !webhookSecret) return false;
  const expectedSignature = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
  const sigBuf = Buffer.from(signatureHeader);
  const expBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expBuf);
}

/**
 * Creates and returns the Node.js LTS HTTP Server instance.
 *
 * @returns {http.Server}
 */
export function createServer() {
  return http.createServer(async (req, res) => {
    // Zero-Trust Security Response Headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');

    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

    // Helper: Read request body
    const readBody = () => new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => {
        data += chunk;
        if (data.length > 100_000) { // 100KB limit
          req.destroy();
          reject(new Error('Payload too large'));
        }
      });
      req.on('end', () => resolve(data));
      req.on('error', reject);
    });

    // 1. Health & LTS Runtime Telemetry
    if (req.method === 'GET' && url.pathname === '/api/health') {
      res.statusCode = 200;
      return res.end(JSON.stringify({
        status: 'healthy',
        runtime: 'Node.js',
        node_version: process.version,
        lts_target: 'v22-LTS',
        php_status: 'ELIMINATED',
        timestamp: new Date().toISOString()
      }));
    }

    // 2. Stateless Auth Token Issuance (Replaces session_start())
    if (req.method === 'POST' && url.pathname === '/api/auth/token') {
      try {
        const bodyStr = await readBody();
        const body = JSON.parse(bodyStr || '{}');
        if (!body.userId) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: 'userId required' }));
        }
        const token = signToken({ sub: body.userId, role: body.role || 'user' });
        res.statusCode = 200;
        return res.end(JSON.stringify({ token, token_type: 'Bearer', expires_in: CONFIG.tokenTtlSeconds }));
      } catch (err) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: err.message }));
      }
    }

    // 3. Stateless Auth Token Verification
    if (req.method === 'POST' && url.pathname === '/api/auth/verify') {
      try {
        const bodyStr = await readBody();
        const { token } = JSON.parse(bodyStr || '{}');
        const result = verifyToken(token);
        if (!result.valid) {
          res.statusCode = 401;
          return res.end(JSON.stringify({ valid: false, error: result.error }));
        }
        res.statusCode = 200;
        return res.end(JSON.stringify({ valid: true, claims: result.payload }));
      } catch (err) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: err.message }));
      }
    }

    // 4. Schema-Validated Contact Form Ingestion (Replaces legacy PHP mailers)
    if (req.method === 'POST' && url.pathname === '/api/ingest/contact') {
      try {
        const bodyStr = await readBody();
        const body = JSON.parse(bodyStr || '{}');
        const validation = validateContactSubmission(body);
        if (!validation.valid) {
          res.statusCode = 422;
          return res.end(JSON.stringify({ error: validation.error }));
        }
        res.statusCode = 200;
        return res.end(JSON.stringify({
          status: 'accepted',
          receipt_id: crypto.randomUUID(),
          data: validation.sanitized
        }));
      } catch (err) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    }

    // 404 for unmapped endpoints
    res.statusCode = 404;
    return res.end(JSON.stringify({ error: 'Endpoint not found' }));
  });
}
