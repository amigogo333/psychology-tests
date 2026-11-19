import assert from 'node:assert/strict';
import {scoreFFNI,facets} from './scoring.js';
import {instrument} from './items.js';
assert.equal(instrument.items.length,148);
assert.deepEqual(instrument.items.map(q=>q.id),Array.from({length:148},(_,i)=>i+1));
assert(instrument.items.every(q=>q.zh&&q.en));
assert.equal(facets.length,15);
const membership=facets.flatMap(f=>f.items.map(Math.abs)).sort((a,b)=>a-b);
assert.deepEqual(membership,Array.from({length:148},(_,i)=>i+1),'No omitted or multiply scored items');
// Independent reference vectors calculated from the published UGA scoring sheet:
// 32 reversed items; vulnerable group 39 items; grandiose group 109 items.
const one=scoreFFNI(Array(148).fill(1));
const five=scoreFFNI(Array(148).fill(5));
const neutral=scoreFFNI(Array(148).fill(3));
assert.equal(one.total,276);assert.equal(five.total,612);assert.equal(neutral.total,444);
assert.deepEqual(one.facets.map(f=>f.sum),[18,22,22,14,18,18,18,18,18,22,22,22,18,13,13]);
assert.deepEqual(one.composites.map(c=>[c.id,c.sum,c.count]),[['grandiose',209,109],['vulnerable',67,39],['agentic',72,40],['antagonistic',146,78],['neurotic',74,30]]);
for (const s of neutral.facets.concat(neutral.composites)) assert.equal(s.mean,3);
for (let i=0;i<one.composites.length;i++)assert.equal(one.composites[i].sum+five.composites[i].sum,6*one.composites[i].count);
// Q108 is reverse for Indifference and then re-reversed in Neuroticism.
const vector=Array(148).fill(3);vector[107]=5;const changed=scoreFFNI(vector);
assert.equal(changed.facets.find(x=>x.id==='indifference').sum,28);
assert.equal(changed.composites.find(x=>x.id==='neurotic').sum,92);
for(const bad of [[],Array(147).fill(3),Array(148).fill(null),Array(148).fill(0),Array(148).fill(6),Array(148).fill(2.5)])assert.throws(()=>scoreFFNI(bad));
console.log('PASS: source coverage, reference scoring, composites, reverse keys, missing/invalid answers.');
