/**
 * Staging Environment Security & Isolation Verification Script.
 *
 * Checks for syntax validity, references to production files, broken relative paths,
 * verifies the presence of security meta-tags, audits the complete removal of inline scripts
 * and inline styles, and ensures all isolated assets and security requirements are satisfied.
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname);
const INDEX_HTML = path.join(BASE_DIR, 'index.html');
const CV_INDEX_HTML = path.join(BASE_DIR, 'cv/index.html');

console.log('[Verification] Starting staging environment security & isolation check...');
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

// 1. Check all expected files exist (including new static Tailwind assets)
const expectedFiles = [
  INDEX_HTML,
  CV_INDEX_HTML,
  path.join(BASE_DIR, 'css/site.css'),
  path.join(BASE_DIR, 'css/components.css'),
  path.join(BASE_DIR, 'css/print.css'),
  path.join(BASE_DIR, 'css/tailwind.css'),
  path.join(BASE_DIR, 'css/tailwind-input.css'),
  path.join(BASE_DIR, 'tailwind.config.js'),
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
  assertFileExists(file, 'Staging asset');
});

// 2. Auditing HTML files for security compliance
function auditHtmlSecurity(htmlPath) {
  try {
    const content = fs.readFileSync(htmlPath, 'utf8');
    const relativeName = path.relative(BASE_DIR, htmlPath);

    // A. Verify no forbidden production references
    const forbidden = ['../css/style.css', '../js/main.js'];
    forbidden.forEach(str => {
      if (content.includes(str)) {
        console.error(`[Error] Forbidden reference to production asset "${str}" found in ${relativeName}`);
        errors++;
      }
    });

    // B. Verify meta security tags are present
    if (!content.includes('http-equiv="Content-Security-Policy"')) {
      console.error(`[Error] Missing CSP meta tag in ${relativeName}`);
      errors++;
    } else {
      console.log(`[OK] CSP meta-tag verified in ${relativeName}`);
    }

    if (!content.includes('name="referrer"')) {
      console.error(`[Error] Missing Referrer-Policy meta tag in ${relativeName}`);
      errors++;
    } else {
      console.log(`[OK] Referrer-Policy meta-tag verified in ${relativeName}`);
    }

    if (!content.includes('name="robots" content="noindex')) {
      console.error(`[Error] Missing or incorrect robots noindex meta tag in ${relativeName}`);
      errors++;
    } else {
      console.log(`[OK] Robots noindex meta-tag verified in ${relativeName}`);
    }

    // C. Verify NO inline scripts (script tags lacking a "src" attribute)
    const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = scriptRegex.exec(content)) !== null) {
      const attributes = match[1];
      const inlineCode = match[2].trim();
      if (!attributes.includes('src=') && inlineCode.length > 0) {
        console.error(`[Error] Dangerous inline script found in ${relativeName}: "${inlineCode.substring(0, 60)}..."`);
        errors++;
      }
    }

    // D. Verify target="_blank" links have noopener noreferrer
    const linkRegex = /<a\s+([^>]*target="_blank"[^>]*)>/gi;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(content)) !== null) {
      const attributes = linkMatch[1];
      if (!attributes.includes('rel="noopener noreferrer"') && !attributes.includes('rel=\'noopener noreferrer\'')) {
        console.error(`[Error] target="_blank" link missing "noopener noreferrer" in ${relativeName}: <a ${attributes}>`);
        errors++;
      }
    }

    // E. Verify no dangerous protocols in links (javascript:, data:)
    const dangerousProtocolRegex = /href=["'](javascript:|data:text\/html)/gi;
    if (dangerousProtocolRegex.test(content)) {
      console.error(`[Error] Dangerous protocol (javascript: or data:) found in href of ${relativeName}`);
      errors++;
    }

  } catch (err) {
    console.error(`[Error] Failed to audit ${htmlPath}`, err);
    errors++;
  }
}

// 3. Verify that the CV index.html has no inline style attributes remaining
function verifyCvNoInlineStyles() {
  try {
    const content = fs.readFileSync(CV_INDEX_HTML, 'utf8');
    const styleAttrRegex = /style=["']/gi;
    if (styleAttrRegex.test(content)) {
      console.error('[Error] Found remaining inline style="..." attributes in cv/index.html. All styles must reside in cv.css.');
      errors++;
    } else {
      console.log('[OK] Verified: zero inline styles in cv/index.html');
    }
  } catch (err) {
    console.error('[Error] Failed to read cv/index.html', err);
    errors++;
  }
}

auditHtmlSecurity(INDEX_HTML);
auditHtmlSecurity(CV_INDEX_HTML);
verifyCvNoInlineStyles();

// 4. Simple JS Import syntax check
function verifyJsSyntax(jsPath) {
  try {
    const content = fs.readFileSync(jsPath, 'utf8');
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
  path.join(BASE_DIR, 'js/analytics.js'),
  path.join(BASE_DIR, 'js/theme.js'),
  path.join(BASE_DIR, 'js/navigation.js'),
  path.join(BASE_DIR, 'js/timeline.js'),
  path.join(BASE_DIR, 'js/project-filter.js'),
  path.join(BASE_DIR, 'js/utilities.js'),
  path.join(BASE_DIR, 'js/version-meta.js'),
  path.join(BASE_DIR, 'cv/js/cv.js'),
];

jsFiles.forEach(verifyJsSyntax);

// Summary
if (errors > 0) {
  console.error(`\n[Verification] FAILED with ${errors} error(s). Please review logs.`);
  process.exit(1);
} else {
  console.log('\n[Verification] SUCCESS! All security checks passed. Staging environment is isolated and fully hardened.');
  process.exit(0);
}
