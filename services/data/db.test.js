/**
 * Unit & Security Test Suite for Phase 3 Data Layer & SQL Injection Immunity
 */

import assert from 'node:assert';
import {
  initDatabase,
  insertSubmission,
  getSubmissionById,
  findSubmissionsByEmail,
  verifyShadowDataConsistency
} from './db.js';

console.log('[Phase 3 Test] Running Data Layer & SQL Injection Immunity Test Suite...');

const db = initDatabase(':memory:');

// 1. Normal Insert & Retrieve
{
  const record = insertSubmission(db, {
    name: 'Alice Developer',
    email: 'alice@example.com',
    message: 'Testing modern LTS database engine'
  });
  assert.strictEqual(typeof record.id, 'string');
  assert.strictEqual(record.name, 'Alice Developer');

  const fetched = getSubmissionById(db, record.id);
  assert.strictEqual(fetched.id, record.id);
  assert.strictEqual(fetched.email, 'alice@example.com');
  console.log('[OK] Normal insertion and lookup passed.');
}

// 2. SQL Injection Resistance Test
{
  const maliciousPayload = "'; DROP TABLE submissions; --";
  const record = insertSubmission(db, {
    name: "Malicious Hacker ' OR '1'='1",
    email: "hacker@injection.test",
    message: maliciousPayload
  });

  // Verify that submissions table is STILL intact and record exists as literal string
  const fetched = getSubmissionById(db, record.id);
  assert.strictEqual(fetched.message, maliciousPayload);

  // Searching by SQL injection string should only return the literal matching record
  const injectionSearch = findSubmissionsByEmail(db, "hacker@injection.test' OR '1'='1");
  assert.strictEqual(injectionSearch.length, 0); // No records matching that literal email

  const validSearch = findSubmissionsByEmail(db, "hacker@injection.test");
  assert.strictEqual(validSearch.length, 1);
  console.log('[OK] SQL Injection resistance verified: queries strictly parameterized.');
}

// 3. Shadow Verification Consistency Test
{
  const legacyRecord = { name: 'Bob', email: 'bob@test.com', message: 'Hello' };
  const modernRecord = { name: 'Bob', email: 'bob@test.com', message: 'Hello' };
  const diffRecord = { name: 'Bob', email: 'bob@test.com', message: 'Hello Differing' };

  assert.strictEqual(verifyShadowDataConsistency(legacyRecord, modernRecord).consistent, true);
  assert.strictEqual(verifyShadowDataConsistency(legacyRecord, diffRecord).consistent, false);
  console.log('[OK] Shadow data consistency protocol verified.');
}
