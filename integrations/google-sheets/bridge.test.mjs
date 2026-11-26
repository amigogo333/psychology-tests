import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const origin = 'https://amigogo333.github.io';
const google = 'https://fixture-script.googleusercontent.com';
const config = {
  origin, ready: true, noticeVersion: 'test', schemaVersion: 'ffni-research-v1',
  instrumentVersion: 'ffni148-zh-TW-draft-2026-11-19-v1',
  researcher: 'Test', email: 'test@example.test', retention: 'test only'
};

const site = {location: {origin}};
site.parent = site;
const wrapper = {parent: site, postMessage() {}};
const inner = {parent: wrapper};
let onSite, onBridge, status, stored, attempts = 0;
site.addEventListener = (_, cb) => { onSite = cb; };
inner.addEventListener = (_, cb) => { onBridge = cb; };
site.postMessage = (data, to) => {
  assert.equal(to, origin);
  queueMicrotask(() => onSite({data, origin: google, source: inner}));
};
inner.postMessage = (data, to) => {
  assert.equal(to, google);
  queueMicrotask(() => onBridge({data, origin, source: site}));
};

const proxy = {
  withSuccessHandler(cb) { this.success = cb; return this; },
  withFailureHandler(cb) { this.failure = cb; return this; },
  receiveSubmission(payload) {
    attempts += 1;
    if (!stored) { stored = payload; this.failure(); }
    else { assert.deepEqual(payload, stored); this.success({id: payload.id, ok: true, duplicate: true}); }
  }
};
const bridgeSource = fs.readFileSync(new URL('./Bridge.html', import.meta.url), 'utf8')
  .match(/<script>([\s\S]*?)<\/script>/)[1].replace('<?!= config ?>', JSON.stringify(config));
const document = {
  createElement: () => ({contentWindow: wrapper, remove() {}}),
  body: {append() { vm.runInNewContext(bridgeSource, {window: inner, google: {script: {run: proxy}}}); }}
};
const siteContext = vm.createContext({window: site, document, crypto: globalThis.crypto, setTimeout, clearTimeout});
const clientSource = fs.readFileSync(new URL('../../ffni/collection.js', import.meta.url), 'utf8');
vm.runInContext(clientSource.replaceAll('export ', ''), siteContext);
const client = siteContext.connectReceiver('https://script.google.com/macros/s/fixture/exec', config.instrumentVersion, s => {status = s;});
client.start();
await new Promise(resolve => setImmediate(resolve));
assert.equal(status, 'ready');
assert.equal(attempts, 0);
const payload = {id: crypto.randomUUID(), answers: Array(148).fill(3)};
await assert.rejects(client.submit(payload));
const receipt = await client.submit(payload);
assert.equal(receipt.id, payload.id);
assert.equal(receipt.duplicate, true);
assert.equal(attempts, 2);
const off = siteContext.connectReceiver('', config.instrumentVersion, s => {status = s;});
off.start();
assert.equal(status, 'unconfigured');
await assert.rejects(off.submit(payload));
assert.equal(attempts, 2);
console.log('PASS: nested-frame handshake, expected origins, no automatic upload on connect, lost receipt, same-ID retry, offline mode.');
