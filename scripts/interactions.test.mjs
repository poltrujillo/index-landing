import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { handleRequest } from './serve.mjs';

const copyScript = await readFile(new URL('../public/assets/copy-address.js', import.meta.url), 'utf8');

function clipboardUI(clipboard) {
  let onClick;
  let focused = false;
  let selected = false;
  const button = { hidden: true, dataset: { copyAddress: 'support@indextennis.com', copySuccess: 'Copied', copyFailure: 'Copy manually' }, addEventListener(type, fn) { assert.equal(type, 'click'); onClick = fn; } };
  const feedback = { textContent: '' };
  const address = { focus() { focused = true; } };
  const document = { querySelector() { return button; }, getElementById(id) { return id === 'copy-feedback' ? feedback : address; }, createRange() { return { selectNodeContents(node) { assert.equal(node, address); } }; } };
  const window = { getSelection() { return { removeAllRanges() {}, addRange() { selected = true; } }; } };
  runInNewContext(copyScript, { document, window, navigator: { clipboard } });
  return { button, feedback, click: () => onClick(), selected: () => selected && focused };
}

test('copy-address succeeds only after the clipboard operation succeeds', async () => {
  const writes = [];
  const ui = clipboardUI({ async writeText(value) { writes.push(value); } });
  assert.equal(ui.button.hidden, false);
  assert.equal(ui.feedback.textContent, '');
  await ui.click();
  assert.deepEqual(writes, ['support@indextennis.com']);
  assert.equal(ui.feedback.textContent, 'Copied');
});

test('denied clipboard access announces failure and selects the full address', async () => {
  const ui = clipboardUI({ async writeText() { throw new Error('Permission denied'); } });
  await ui.click();
  assert.equal(ui.feedback.textContent, 'Copy manually');
  assert.ok(ui.selected());
});

test('unsupported clipboard API offers the same accessible manual fallback', async () => {
  const ui = clipboardUI(undefined);
  await ui.click();
  assert.equal(ui.feedback.textContent, 'Copy manually');
  assert.ok(ui.selected());
});

async function request(url, method = 'GET') {
  const response = {};
  await handleRequest({ url, method }, { writeHead(status, headers) { response.status = status; response.headers = headers; }, end(data) { response.body = data?.toString() || ''; } });
  return response;
}

test('every stable route opens directly without auth, with slash normalization', async () => {
  for (const prefix of ['', '/en']) {
    for (const page of ['support', 'privacy', 'terms', 'delete-account']) {
      const path = `${prefix}/${page}`;
      const redirect = await request(path);
      assert.equal(redirect.status, 301, path);
      assert.equal(redirect.headers.Location, path + '/');
      const response = await request(path + '/');
      assert.equal(response.status, 200, path);
      assert.equal(response.headers['Content-Type'], 'text/html; charset=utf-8');
      assert.ok(response.body.includes('support@indextennis.com'));
      assert.ok(!response.headers['Set-Cookie']);
    }
  }
  assert.equal((await request('/privacidad/')).status, 200, 'Old policy URL remains usable');
});

test('clipboard JS is served with a JavaScript MIME type and unknown routes return 404', async () => {
  assert.equal((await request('/assets/copy-address.js')).headers['Content-Type'], 'text/javascript; charset=utf-8');
  assert.equal((await request('/does-not-exist')).status, 404);
  const head = await request('/delete-account/', 'HEAD');
  assert.equal(head.status, 200);
  assert.equal(head.body, '');
});
