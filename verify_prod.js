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

verifyHtmlReferences(INDEX_HTML, ['../css/style.css', '../js/main.js', '../assets/img/favicon/'], ['css/site.css', 'js/app.js', 'assets/img/favicon/']);
verifyHtmlReferences(CV_INDEX_HTML, ['style.css', 'main.js', 'onclick="window.print()"', '../../assets/img/favicon/', 'Thongchan_Thananate_CV.pdf'], ['css/cv.css', 'js/cv.js', '../assets/img/favicon/']);

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
  console.log('\n[Verification] SUCCESS! All checks passed, production environment is isolated and complete.');
  process.exit(0);
}
