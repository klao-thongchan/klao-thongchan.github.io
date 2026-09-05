const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const rootDir = path.resolve(__dirname, '..');

// 1. Read release version from version.json
const versionJsonPath = path.join(rootDir, 'version.json');
let version = '1.0.0';
try {
  const versionData = JSON.parse(fs.readFileSync(versionJsonPath, 'utf8'));
  version = versionData.version || '1.0.0';
} catch (err) {
  console.warn('[Version Gen] Could not read version.json, defaulting to 1.0.0');
}

// The test environment can preview a release independently of production.
const testVersionPath = path.join(rootDir, 'test/version.json');
const testVersion = fs.existsSync(testVersionPath)
  ? JSON.parse(fs.readFileSync(testVersionPath, 'utf8')).version
  : version;
const testOnly = process.argv.includes('--test-only');

// 2. Get git commit SHA
let commitSha = 'unknown';
try {
  commitSha = cp.execSync('git rev-parse --short=7 HEAD').toString().trim();
} catch (err) {
  if (process.env.GITHUB_SHA) {
    commitSha = process.env.GITHUB_SHA.substring(0, 7);
  } else {
    console.warn('[Version Gen] Git commit SHA could not be retrieved, defaulting to unknown');
  }
}

// 3. Get current UTC date in YYYY.MM.DD format
const now = new Date();
const year = now.getUTCFullYear();
const month = String(now.getUTCMonth() + 1).padStart(2, '0');
const day = String(now.getUTCDate()).padStart(2, '0');
const dateString = `${year}.${month}.${day}`;

// 4. Generate file contents
const testMetaContent = `/**
 * Automatically generated build metadata for Test environment.
 * Do not manually edit.
 */
export const BUILD_META = {
  version: "${testVersion}",
  environment: "Test",
  date: "${dateString}",
  commit: "${commitSha}"
};
`;

const prodMetaContent = `/**
 * Automatically generated build metadata for Production environment.
 * Do not manually edit.
 */
export const BUILD_META = {
  version: "${version}",
  environment: "Production",
  date: "${dateString}",
  commit: "${commitSha}"
};
`;

// 5. Write files
const testDest = path.join(rootDir, 'test/js/version-meta.js');
const prodDest = path.join(rootDir, 'js/version-meta.js');

// Ensure destination directories exist
fs.mkdirSync(path.dirname(testDest), { recursive: true });
fs.mkdirSync(path.dirname(prodDest), { recursive: true });

fs.writeFileSync(testDest, testMetaContent, 'utf8');
console.log(`[Version Gen] Generated Test build metadata at ${testDest}`);

if (!testOnly) {
  fs.writeFileSync(prodDest, prodMetaContent, 'utf8');
  console.log(`[Version Gen] Generated Production build metadata at ${prodDest}`);
}
