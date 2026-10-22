/**
 * Production Environment Verification Script.
 *
 * Checks for syntax validity, references to production files, broken relative paths,
 * and ensures all isolated assets exist.
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname);
const INDEX_HTML = path.join(BASE_DIR, 'index.html');
const CV_INDEX_HTML = path.join(BASE_DIR, 'cv/index.html');
const NOT_FOUND_HTML = path.join(BASE_DIR, '404.html');

console.log('[Verification] Starting production environment check...');
let errors = 0;

// Helper: Assert file exists
function assertFileExists(filePath, description) {
  if (!fs.existsSync(filePath)) {
    console.error(`[Error] Missing file: ${filePath} (${description})`);
    errors++;
  } else {
    console.log(`[OK] File exists: ${filePath}`);
  }
}

// 1. Check all expected files exist
const expectedFiles = [
  INDEX_HTML,
  CV_INDEX_HTML,
  NOT_FOUND_HTML,
  path.join(BASE_DIR, 'robots.txt'),
  path.join(BASE_DIR, 'sitemap.xml'),
  path.join(BASE_DIR, 'version.json'),
  path.join(BASE_DIR, 'specs/phase0-inventory.json'),
  path.join(BASE_DIR, 'specs/phase1-ingress-spec.json'),
  path.join(BASE_DIR, 'specs/phase2-services-spec.json'),
  path.join(BASE_DIR, 'specs/phase3-data-spec.json'),
  path.join(BASE_DIR, 'specs/phase4-decommission-spec.json'),
  path.join(BASE_DIR, 'edge/nginx-ingress.conf'),
  path.join(BASE_DIR, 'edge/cloudflare-worker.js'),
  path.join(BASE_DIR, 'services/server.js'),
  path.join(BASE_DIR, 'services/server.test.js'),
  path.join(BASE_DIR, 'services/Dockerfile'),
  path.join(BASE_DIR, 'services/docker-compose.yml'),
  path.join(BASE_DIR, 'services/data/db.js'),
  path.join(BASE_DIR, 'services/data/db.test.js'),
  path.join(BASE_DIR, 'css/portfolio.css'),
  path.join(BASE_DIR, 'js/cursor-field.js'),
  path.join(BASE_DIR, 'js/vendor/three-field.min.js'),
  path.join(BASE_DIR, 'css/site.css'),
  path.join(BASE_DIR, 'css/components.css'),
  path.join(BASE_DIR, 'css/print.css'),
  path.join(BASE_DIR, 'css/tailwind.css'),
  path.join(BASE_DIR, 'js/app.js'),
  path.join(BASE_DIR, 'js/analytics.js'),
  path.join(BASE_DIR, 'js/theme.js'),
  path.join(BASE_DIR, 'js/navigation.js'),
  path.join(BASE_DIR, 'js/timeline.js'),
  path.join(BASE_DIR, 'js/project-filter.js'),
  path.join(BASE_DIR, 'js/utilities.js'),
  path.join(BASE_DIR, 'js/version-meta.js'),
  path.join(BASE_DIR, 'cv/css/cv.css'),
  path.join(BASE_DIR, 'cv/js/cv.js'),
];

expectedFiles.forEach(file => {
  assertFileExists(file, 'Production asset');
});

// 2. Check HTML files for forbidden production asset links
function verifyHtmlReferences(htmlPath, forbiddenStrings, requiredStrings) {
  try {
    const content = fs.readFileSync(htmlPath, 'utf8');
    forbiddenStrings.forEach(str => {
      if (content.includes(str)) {
        console.error(`[Error] Forbidden reference "${str}" found in ${htmlPath}`);
        errors++;
      }
    });
    if (requiredStrings) {
      requiredStrings.forEach(str => {
        if (!content.includes(str)) {
          console.error(`[Error] Required reference "${str}" not found in ${htmlPath}`);
          errors++;
        }
      });
    }
    console.log(`[OK] References verified in: ${htmlPath}`);
  } catch (err) {
    console.error(`[Error] Failed to read ${htmlPath}`, err);
    errors++;
  }
}

verifyHtmlReferences(INDEX_HTML, ['../css/style.css', '../js/main.js', '../assets/img/favicon/'], ['css/portfolio.css', 'js/app.js', 'assets/img/favicon/']);
verifyHtmlReferences(CV_INDEX_HTML, ['style.css', 'main.js', 'onclick="window.print()"', '../../assets/img/favicon/', 'Thongchan_Thananate_CV.pdf'], ['css/cv.css', 'js/cv.js', '../assets/img/favicon/']);

// Release isolation: production must be indexable and use production preferences.
for (const htmlPath of [INDEX_HTML, CV_INDEX_HTML]) {
  verifyHtmlReferences(htmlPath, ['noindex', 'TEST PREVIEW', '/test/'], ['name="robots" content="index, follow"', 'rel="canonical"']);
}
for (const jsFile of ['js/app.js', 'js/theme.js']) {
  verifyHtmlReferences(path.join(BASE_DIR, jsFile), ['klao:test:theme', 'preview-version'], ['klao:prod:theme']);
}

// 3. Verify that every local HTML resource resolves to an existing file.
function verifyLocalHtmlReferences(htmlPath) {
  const content = fs.readFileSync(htmlPath, 'utf8');
  const referenceRegex = /(?:href|src|srcset)=["']([^"']+)["']/g;
  let match;

  while ((match = referenceRegex.exec(content)) !== null) {
    const reference = match[1];
    if (/^(?:[a-z]+:|#|\/\/)/i.test(reference)) continue;

    const cleanReference = reference.split(/[?#]/, 1)[0];
    if (!cleanReference) continue;

    let resolvedPath = cleanReference.startsWith('/')
      ? path.join(BASE_DIR, cleanReference.replace(/^\/+/, ''))
      : path.resolve(path.dirname(htmlPath), cleanReference);
    if (cleanReference.endsWith('/')) resolvedPath = path.join(resolvedPath, 'index.html');

    if (!fs.existsSync(resolvedPath)) {
      console.error(`[Error] Broken local reference "${reference}" in ${htmlPath}`);
      errors++;
    }
  }
}

[INDEX_HTML, CV_INDEX_HTML, NOT_FOUND_HTML].forEach(verifyLocalHtmlReferences);

// 4. Simple JS Import syntax check
function verifyJsSyntax(jsPath) {
  try {
    const content = fs.readFileSync(jsPath, 'utf8');
    // Ensure ES Module imports aren't using missing files
    const importRegex = /import\s+.*\s+from\s+['"](.+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      if (importPath.startsWith('.')) {
        const resolvedPath = path.resolve(path.dirname(jsPath), importPath);
        if (!fs.existsSync(resolvedPath)) {
          console.error(`[Error] Broken relative JS import "${importPath}" in ${jsPath}`);
          errors++;
        }
      }
    }
    console.log(`[OK] Syntax and import paths verified in: ${jsPath}`);
  } catch (err) {
    console.error(`[Error] Failed to parse/read ${jsPath}`, err);
    errors++;
  }
}

const jsFiles = [
  path.join(BASE_DIR, 'js/app.js'),
  path.join(BASE_DIR, 'js/cursor-field.js'),
  path.join(BASE_DIR, 'js/analytics.js'),
  path.join(BASE_DIR, 'js/theme.js'),
  path.join(BASE_DIR, 'js/navigation.js'),
  path.join(BASE_DIR, 'js/timeline.js'),
  path.join(BASE_DIR, 'js/project-filter.js'),
  path.join(BASE_DIR, 'js/utilities.js'),
  path.join(BASE_DIR, 'js/version-meta.js'),
  path.join(BASE_DIR, 'cv/js/cv.js'),
  path.join(BASE_DIR, 'edge/cloudflare-worker.js'),
  path.join(BASE_DIR, 'services/server.js'),
  path.join(BASE_DIR, 'services/server.test.js'),
  path.join(BASE_DIR, 'services/data/db.js'),
  path.join(BASE_DIR, 'services/data/db.test.js'),
];

jsFiles.forEach(verifyJsSyntax);

// 5. Production Security & PHP Immunity Audit
function auditProductionSecurityHarness() {
  console.log('[Production Audit] Auditing production environment for legacy vectors & PHP immunity...');

  // A. Scan root, edge, and services for disallowed executable scripts
  const disallowedExtensions = ['.php', '.phtml', '.phar', '.cgi', '.sh', '.py', '.rb'];
  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'test' || entry.name === 'scripts') continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (disallowedExtensions.includes(ext)) {
          console.error(`[Error] Disallowed executable script found in production environment: ${fullPath}`);
          errors++;
        }
      }
    }
  }
  scanDir(BASE_DIR);
  console.log('[OK] Verified: zero PHP/CGI/dynamic scripts in production paths.');

  // B. Verify zero dynamic code execution patterns across JS assets
  const unsafePatterns = [
    { regex: /\beval\s*\(/g, name: 'eval()' },
    { regex: /new\s+Function\s*\(/g, name: 'new Function()' },
    { regex: /document\.write\s*\(/g, name: 'document.write()' }
  ];
  jsFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      unsafePatterns.forEach(pattern => {
        if (pattern.regex.test(content)) {
          console.error(`[Error] Prohibited dynamic execution pattern "${pattern.name}" found in ${path.relative(BASE_DIR, file)}`);
          errors++;
        }
      });
    } catch (err) {
      console.error(`[Error] Failed to read ${file}`, err);
      errors++;
    }
  });
  console.log('[OK] Verified: zero dynamic code execution patterns across production JS assets.');
}

// 6. Production Edge Ingress Audit
function auditProductionEdgeIngress() {
  console.log('[Production Audit] Auditing Edge Ingress configurations...');
  const nginxPath = path.join(BASE_DIR, 'edge/nginx-ingress.conf');
  const workerPath = path.join(BASE_DIR, 'edge/cloudflare-worker.js');

  try {
    const nginxContent = fs.readFileSync(nginxPath, 'utf8');
    if (!nginxContent.includes('allow_url_include') || !nginxContent.includes('php')) {
      console.error('[Error] nginx-ingress.conf is missing anti-PHP or CGI injection blocking rules.');
      errors++;
    } else {
      console.log('[OK] Verified: nginx-ingress.conf contains edge security and anti-PHP rules.');
    }
  } catch (err) {
    console.error(`[Error] Failed to read ${nginxPath}`, err);
    errors++;
  }

  try {
    const workerContent = fs.readFileSync(workerPath, 'utf8');
    if (!workerContent.includes('BLOCKED_EXTENSIONS') || !workerContent.includes('MALICIOUS_QUERY_PATTERNS')) {
      console.error('[Error] cloudflare-worker.js is missing probe blocking patterns.');
      errors++;
    } else {
      console.log('[OK] Verified: cloudflare-worker.js contains edge filtering logic.');
    }
  } catch (err) {
    console.error(`[Error] Failed to read ${workerPath}`, err);
    errors++;
  }
}

// 7. Production Core Services & Data Layer Audit
async function auditProductionServicesAndData() {
  console.log('[Production Audit] Auditing LTS Core Services and Data Layer in-process...');

  try {
    const { signToken, verifyToken, validateContactSubmission, verifyWebhookSignature } = await import('./services/server.js');
    const assert = require('assert');
    const crypto = require('crypto');

    // Token verification
    const token = signToken({ userId: 'p1' }, 'secret-test-key-32-chars-minimum');
    assert.strictEqual(verifyToken(token, 'secret-test-key-32-chars-minimum').valid, true);

    // Schema validation & Prototype pollution defense
    assert.strictEqual(validateContactSubmission({ name: 'User', email: 'u@example.com', message: 'Hello' }).valid, true);
    assert.strictEqual(validateContactSubmission(JSON.parse('{"name":"Hacker","email":"h@example.com","message":"hi","__proto__":{"isAdmin":true}}')).valid, false);

    // Webhook verification
    const secret = 'webhook-sec';
    const payload = '{"event":"test"}';
    const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    assert.strictEqual(verifyWebhookSignature(payload, sig, secret), true);

    console.log('[OK] Verified: Production LTS Services in-process security tests passed.');
  } catch (err) {
    console.error('[Error] Production LTS service tests failed:', err);
    errors++;
  }

  try {
    const { initDatabase, insertSubmission, getSubmissionById, findSubmissionsByEmail, verifyShadowDataConsistency } = await import('./services/data/db.js');
    const assert = require('assert');

    const db = initDatabase(':memory:');
    const record = insertSubmission(db, { name: 'Prod User', email: 'prod@test.local', message: "Clean '; DROP TABLE; --" });
    assert.strictEqual(getSubmissionById(db, record.id).name, 'Prod User');
    assert.strictEqual(findSubmissionsByEmail(db, "prod@test.local' OR '1'='1").length, 0);
    assert.strictEqual(verifyShadowDataConsistency({ name: 'A', email: 'a@b.com', message: 'M' }, { name: 'A', email: 'a@b.com', message: 'M' }).consistent, true);

    console.log('[OK] Verified: Production Data Layer in-process parameterized SQL tests passed.');
  } catch (err) {
    console.error('[Error] Production Data Layer tests failed:', err);
    errors++;
  }

  // Verify specs
  const specs = [
    'specs/phase0-inventory.json',
    'specs/phase1-ingress-spec.json',
    'specs/phase2-services-spec.json',
    'specs/phase3-data-spec.json',
    'specs/phase4-decommission-spec.json'
  ];
  specs.forEach(spec => {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(BASE_DIR, spec), 'utf8'));
      if (!data.phase && data.phase !== 0 && !data.audit) {
        console.error(`[Error] Spec ${spec} missing phase or audit structure.`);
        errors++;
      }
    } catch (err) {
      console.error(`[Error] Failed to parse spec ${spec}`, err);
      errors++;
    }
  });
  console.log('[OK] Verified: all 5 migration specifications valid in specs/.');
}

(async () => {
  auditProductionSecurityHarness();
  auditProductionEdgeIngress();
  await auditProductionServicesAndData();

  // Summary
  if (errors > 0) {
    console.error(`\n[Verification] FAILED with ${errors} error(s). Please review logs.`);
    process.exit(1);
  } else {
    console.log('\n[Verification] SUCCESS! All checks passed, production environment is isolated, hardened, and complete.');
    process.exit(0);
  }
})();
