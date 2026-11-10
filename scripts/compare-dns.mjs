import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const dnsName = (value) => String(value).replace(/\.$/, '').toLowerCase();
function records(snapshot) {
  const list = Array.isArray(snapshot) ? snapshot : snapshot.records || snapshot.result;
  if (!Array.isArray(list) || !list.length) throw new Error('A non-empty complete DNS inventory is required (array, records array, or Cloudflare result array).');
  return list.map((record) => {
    if (!record.name || !record.type || typeof record.content !== 'string') throw new Error('DNS records require name, type and content; use fully qualified names.');
    return { ...record, name: dnsName(record.name), type: record.type.toUpperCase() };
  });
}

export function compareDns(before, after, domain = 'indextennis.com') {
  domain = dnsName(domain);
  const prior = records(before);
  const next = records(after);
  const webRecord = (record) => [domain, 'www.' + domain].includes(record.name) && ['A', 'AAAA', 'CNAME', 'HTTPS'].includes(record.type);
  const delegated = (record) => record.name === domain && ['NS', 'SOA'].includes(record.type);
  const protectedRecords = (list) => list.filter((record) => !webRecord(record) && !delegated(record));
  const signature = (record) => {
    const content = ['MX', 'CNAME', 'NS', 'PTR'].includes(record.type) ? dnsName(record.content) : record.content;
    return JSON.stringify([record.name, record.type, content, record.priority ?? record.data?.priority ?? null]);
  };
  const counts = (list) => {
    const result = new Map();
    for (const record of protectedRecords(list)) {
      const key = signature(record);
      result.set(key, { count: (result.get(key)?.count || 0) + 1, record });
    }
    return result;
  };
  const oldCounts = counts(prior), newCounts = counts(next);
  const errors = [];
  for (const record of [...prior, ...next]) if (record.name !== domain && !record.name.endsWith('.' + domain)) errors.push(`Record name must be fully qualified within ${domain}: ${record.name}`);
  for (const [key, item] of oldCounts) if (newCounts.get(key)?.count !== item.count) errors.push(`Missing or changed protected record: ${item.record.name} ${item.record.type}`);
  for (const [key, item] of newCounts) if (oldCounts.get(key)?.count !== item.count) errors.push(`Unexpected or duplicated protected record: ${item.record.name} ${item.record.type}`);
  for (const record of next) if (record.proxied === true && !webRecord(record)) errors.push(`Non-website record must stay DNS-only: ${record.name} ${record.type}`);
  if (!prior.some((record) => record.type === 'MX' && record.name === domain)) errors.push('Baseline has no apex MX records; this is not a verified Zoho mail inventory.');
  return { ok: errors.length === 0, errors, protectedCount: protectedRecords(prior).length };
}

export function verifyKnownRecords(snapshot, known) {
  const list = records(snapshot);
  return records(known).every((required) => list.some((record) => record.name === required.name && record.type === required.type && record.content === required.content));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    if (process.argv.length !== 4) throw new Error('Usage: node scripts/compare-dns.mjs BEFORE.json AFTER.json');
    const [before, after] = await Promise.all(process.argv.slice(2).map((path) => readFile(path, 'utf8').then(JSON.parse)));
    if (before.inventoryComplete !== true || after.inventoryComplete !== true) throw new Error('Both inventories must be marked inventoryComplete: true after full-zone review. Partial/public-DNS snapshots cannot authorise a migration.');
    const known = JSON.parse(await readFile(new URL('../ops/known-mail-dns.json', import.meta.url), 'utf8'));
    if (!verifyKnownRecords(before, known) || !verifyKnownRecords(after, known)) throw new Error('Every owner-supplied Zoho MX, SPF, verification and DKIM record must be present unchanged in both complete inventories.');
    const result = compareDns(before, after);
    if (!result.ok) { result.errors.forEach((message) => console.error(message)); process.exitCode = 1; }
    else console.log(`All ${result.protectedCount} protected records match. TTLs, DNSSEC/delegation, inventory completeness and actual mail delivery still require verification. No DNS changes were made.`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
