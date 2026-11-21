/**
 * Production Cloudflare Edge Worker - Zero-Trust Ingress & Anti-PHP Probing Façade
 *
 * Inspects incoming requests globally at the edge:
 * 1. Blocks PHP2Shell and CGI argument injection attempts (CVE-2024-4577 / CVE-2026-109618).
 * 2. Intercepts and drops automated scans for .php, CMS (incl. Drupal CVE-2026-132165), and admin endpoints.
 * 3. Enforces zero-trust security headers on all responses.
 */

const BLOCKED_EXTENSIONS = /\.(php[0-9]?|phtml|phar|cgi|pl|asp|aspx|jsp)$/i;
const BLOCKED_CMS_PATHS = /^\/(wp-admin|wp-content|wp-includes|xmlrpc\.php|core\/install\.php|phpmyadmin|pma|adminer|\.env|\.git)/i;
const MALICIOUS_QUERY_PATTERNS = /(-d\+allow_url_include|-d\+auto_prepend_file|allow_url_include|auto_prepend_file|php:\/\/input|php:\/\/filter)/i;

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
};

export default {
  /**
   * Main fetch handler for edge requests.
   *
   * @param {Request} request
   * @param {Record<string, unknown>} env
   * @param {ExecutionContext} ctx
   * @returns {Promise<Response>}
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Detect and reject CGI Argument Injection / PHP2Shell payload vectors
    if (url.search && MALICIOUS_QUERY_PATTERNS.test(url.search)) {
      return new Response('403 Forbidden: Malicious argument signature detected by Edge Ingress.', {
        status: 403,
        headers: { 'Content-Type': 'text/plain', ...SECURITY_HEADERS }
      });
    }

    // 2. Intercept and terminate legacy PHP or CMS scanning probes at the edge
    if (BLOCKED_EXTENSIONS.test(url.pathname) || BLOCKED_CMS_PATHS.test(url.pathname)) {
      return new Response('404 Not Found: Legacy PHP runtimes and CMS endpoints are disabled.', {
        status: 404,
        headers: { 'Content-Type': 'text/plain', ...SECURITY_HEADERS }
      });
    }

    // 3. Delegate to origin / static asset storage
    const response = await fetch(request);

    // 4. Inject Zero-Trust Security Headers on outbound response
    const newHeaders = new Headers(response.headers);
    for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
      newHeaders.set(header, value);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }
};
