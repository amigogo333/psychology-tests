import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const context=vm.createContext({console});
vm.runInContext(fs.readFileSync(new URL('./Code.gs',import.meta.url),'utf8'),context);
const valid={schemaVersion:'ffni-research-v1',instrumentVersion:'ffni148-zh-TW-draft-2026-11-19-v1',noticeVersion:'test-v1',id:'12345678-1234-4123-8123-123456789abc',startedAt:'2026-11-20T01:00:00.000Z',finishedAt:'2026-11-20T02:00:00.000Z',answers:Array(148).fill(3),profile:{gender:'female',age:20,status:'college',year:'一年級',platform:['ig'],mainPlatform:'ig',purpose:['friends'],source:'class'},entry:{version:'npi16-material-v1',answers:Array(16).fill(0)},contact:{email:'test@example.com',purpose:'research_invitation'}};
function run(input){return context.validate_(input,{noticeVersion:'test-v1'});}
const result=run(valid);
assert.equal(result.scores.total,444);assert.equal(result.npiTotal,8);assert.equal(result.background.length,12);assert.equal(result.contact,'test@example.com');
for(const change of [{schemaVersion:'bad'},{noticeVersion:'other'},{id:'test'},{answers:Array(147).fill(3)},{answers:Array(148).fill(6)},{finishedAt:'2026-11-19T01:00:00Z'},{profile:{age:3.5}},{profile:{platform:['none','ig']}},{profile:{platform:['ig'],mainPlatform:'threads'}},{profile:{purpose:['friends','fun','information','work']}},{contact:{email:'bad',purpose:'research_invitation'}},{contact:{email:'test@example.com',purpose:'marketing'}},{entry:{version:'bad',answers:Array(16).fill(0)}}])assert.throws(()=>run({...valid,...change}));
assert.equal(run({...valid,profile:{},contact:null,entry:null}).contact,null);
assert.equal(run({...valid,profile:{platform:['none']}}).background[4],'none');
assert.equal(context.safeCell_(' =IMPORTXML("https://example.com")').startsWith("'"),true);
assert.equal(context.safeCell_('@malicious').startsWith("'"),true);
assert.equal(context.safeCell_('普通文字'),'普通文字');
assert.equal(context.safeCell_(3),3);
// Exercise the write endpoint with isolated spreadsheet mocks, including dedupe.
let receivedRows=[],contactRows=[],flushes=0;
const schema=JSON.parse(fs.readFileSync(new URL('./headers.json',import.meta.url),'utf8'));
function sheet(headers,rows){return {getMaxColumns:()=>headers.length,getLastRow:()=>1+rows.length,getRange:(r,c,h,w)=>({getValues:()=>[headers],createTextFinder:id=>({matchEntireCell:()=>({findNext:()=>receivedRows.some(row=>row[2]===id)?{}:null})}),setValues:value=>{rows[r-2]=value[0];},clearContent:()=>{rows.splice(r-2,1);}})};}
const rs=sheet(schema.response,receivedRows),cs=sheet(schema.contact,contactRows),ss={getSheetByName:name=>name==='作答資料'?rs:cs};
const config={SPREADSHEET_ID:'test-only',COLLECTION_ENABLED:'true',NOTICE_VERSION:'test-v1',RESEARCHER_NAME:'test',RESEARCHER_EMAIL:'test@example.com',RETENTION_DESCRIPTION:'test'};
context.PropertiesService={getScriptProperties:()=>({getProperty:k=>config[k]||null,setProperty:(k,v)=>{config[k]=v;}})};
context.LockService={getScriptLock:()=>({tryLock:()=>true,releaseLock:()=>{}})};
context.SpreadsheetApp={openById:()=>ss,flush:()=>{flushes++;}};
context.Utilities={formatDate:()=> '2026-11-20',getUuid:()=> 'test-submission'};
assert.equal(context.receiveSubmission(valid).ok,true);
assert.equal(receivedRows.length,1);assert.equal(receivedRows[0].length,226);assert.equal(contactRows[0].length,6);assert(!JSON.stringify(receivedRows).includes('test@example.com'));
assert.equal(context.receiveSubmission(valid).duplicate,true);assert.equal(receivedRows.length,1);assert.equal(contactRows.length,1);
config.COLLECTION_ENABLED='false';assert.throws(()=>context.receiveSubmission(valid));assert.equal(receivedRows.length,1);
console.log('PASS: server scoring, payload validation, formula escaping, separate email storage, duplicate protection, disabled collection; no live data written.');
