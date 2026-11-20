import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=new URL('./',import.meta.url);
const headers=JSON.parse(fs.readFileSync(new URL('headers.json',root),'utf8'));
let scoring=fs.readFileSync(new URL('../../ffni/scoring.js',root),'utf8').replaceAll('export const ','const ').replaceAll('export function ','function ');
const source=fs.readFileSync(new URL('receiver-source.js',root),'utf8');
const result='// Generated Apps Script; do not edit without rebuilding.\n'+scoring+'\nconst RESPONSE_HEADERS='+JSON.stringify(headers.response)+';\nconst CONTACT_HEADERS='+JSON.stringify(headers.contact)+';\n'+source;
fs.writeFileSync(new URL('Code.gs',root),result);
console.log('Built '+fileURLToPath(new URL('Code.gs',root)));
