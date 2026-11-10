import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCommands, runPagesBuild } from './build-cloudflare.mjs';
import { compareDns, verifyKnownRecords } from './compare-dns.mjs';

test('production always ends with npm run build:production, after checks', () => {
  assert.deepEqual(buildCommands({ CF_PAGES: '1', CF_PAGES_BRANCH: 'main', INDEX_DEPLOYMENT_CONTEXT: 'production' }), [['npm', 'run', 'check'], ['npm', 'run', 'build:production']]);
  for (const branch of ['draft-preview', 'fix/translation', 'main; echo bad']) {
    assert.deepEqual(buildCommands({ CF_PAGES: '1', CF_PAGES_BRANCH: branch, INDEX_DEPLOYMENT_CONTEXT: 'preview' }).at(-1), ['npm', 'run', 'build']);
  }
  assert.throws(() => buildCommands({ CF_PAGES_BRANCH: 'main' }), /requires/);
  assert.throws(() => buildCommands({ CF_PAGES: '1' }), /requires/);
  assert.throws(() => buildCommands({ CF_PAGES: '1', CF_PAGES_BRANCH: 'main', INDEX_DEPLOYMENT_CONTEXT: 'preview' }), /mismatch/);
  assert.throws(() => buildCommands({ CF_PAGES: '1', CF_PAGES_BRANCH: 'draft-preview', INDEX_DEPLOYMENT_CONTEXT: 'production' }), /mismatch/);
});

test('failed checks stop the build and a failed production gate never falls back to draft', () => {
  for (const failAt of [0, 1]) {
    const calls = [];
    const status = runPagesBuild({ CF_PAGES: '1', CF_PAGES_BRANCH: 'main', INDEX_DEPLOYMENT_CONTEXT: 'production' }, (command, args, options) => {
      assert.equal(options.shell, false);
      calls.push([command, ...args]);
      return { status: calls.length - 1 === failAt ? 1 : 0 };
    });
    assert.equal(status, 1);
    assert.equal(calls.length, failAt + 1);
    assert.ok(!calls.some((call) => call.at(-1) === 'build'));
  }
});

// Fictional fixtures, never a proposed zone or Zoho account configuration.
const baseline = [
  { name: 'indextennis.com', type: 'MX', content: 'mx.example.test.', priority: 10 },
  { name: 'indextennis.com', type: 'TXT', content: 'v=spf1 include:mail.example.test -all' },
  { name: 'indextennis.com', type: 'TXT', content: 'zoho-verification=fixture' },
  { name: 'selector._domainkey.indextennis.com', type: 'TXT', content: 'v=DKIM1; p=fixture' },
  { name: '_dmarc.indextennis.com', type: 'TXT', content: 'v=DMARC1; p=none' },
  { name: 'autodiscover.indextennis.com', type: 'CNAME', content: 'discover.example.test.' },
  { name: 'indextennis.com', type: 'A', content: '192.0.2.1' },
];

test('DNS comparison permits website changes but preserves all mail/verification records', () => {
  const next = baseline.filter((record) => record.type !== 'A').concat({ name: 'indextennis.com', type: 'CNAME', content: 'fixture.pages.dev', proxied: true });
  assert.ok(compareDns(baseline, { result: next }).ok);
  for (const record of baseline.filter((record) => record.type !== 'A')) {
    assert.ok(!compareDns(baseline, next.filter((item) => item !== record)).ok, `Must preserve ${record.type} ${record.name}`);
  }
});

test('DNS comparison rejects priority changes, duplicate SPF and proxied mail hostnames', () => {
  assert.ok(!compareDns(baseline, baseline.map((record) => record.type === 'MX' ? { ...record, priority: 20 } : record)).ok);
  assert.ok(!compareDns(baseline, baseline.concat(baseline[1])).ok);
  assert.ok(!compareDns(baseline, baseline.map((record) => record.type === 'CNAME' ? { ...record, proxied: true } : record)).ok);
  assert.ok(!compareDns(baseline.filter((record) => record.type !== 'MX'), baseline).ok);
  assert.throws(() => compareDns([], []), /inventory/);
});

test('known owner-supplied DNS values must be present exactly, not inferred from a selector name', () => {
  const known = { records: [baseline[3]] };
  assert.ok(verifyKnownRecords(baseline, known));
  assert.ok(!verifyKnownRecords(baseline.map((record) => record.type === 'TXT' ? { ...record, content: 'changed' } : record), known));
});
