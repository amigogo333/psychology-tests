/* Google Apps Script receiver. Read README before enabling collection. */
const WEB_ORIGIN = 'https://amigogo333.github.io';
const INSTRUMENT_VERSION = 'ffni148-zh-TW-draft-2026-11-19-v1';
const SCHEMA_VERSION = 'ffni-research-v1';
const MAX_WRITES_PER_DAY = 500;

function configuration_() {
  const p = PropertiesService.getScriptProperties();
  return {spreadsheetId:p.getProperty('SPREADSHEET_ID'),enabled:p.getProperty('COLLECTION_ENABLED')==='true',noticeVersion:p.getProperty('NOTICE_VERSION'),researcher:p.getProperty('RESEARCHER_NAME'),email:p.getProperty('RESEARCHER_EMAIL'),retention:p.getProperty('RETENTION_DESCRIPTION')};
}

// Run once in the editor of the script bound to the destination spreadsheet.
// This verifies headers and stores its ID, but deliberately does not enable collection.
function setup() {
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  if(!ss)throw new Error('請從目標試算表的「擴充功能 → Apps Script」建立此程式。');
  verifySheet_(ss,'作答資料',RESPONSE_HEADERS);
  verifySheet_(ss,'聯絡資料',CONTACT_HEADERS);
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID',ss.getId());
  return '欄位確認完成；尚未啟用資料接收。';
}

function verifySheet_(ss,name,headers) {
  const sheet=ss.getSheetByName(name);
  if(!sheet||sheet.getMaxColumns()<headers.length)throw new Error('缺少必要資料分頁或欄位。');
  const actual=sheet.getRange(1,1,1,headers.length).getValues()[0];
  if(actual.some((v,i)=>v!==headers[i]))throw new Error('欄位順序不符，請先確認資料表版本。');
  return sheet;
}

// Public GET only returns bridge/status and disclosure information, never stored answers.
function doGet() {
  const c=configuration_();
  const ready=Boolean(c.enabled&&c.spreadsheetId&&c.noticeVersion&&c.researcher&&c.email&&c.retention);
  const page=HtmlService.createTemplateFromFile('Bridge');
  page.config=JSON.stringify({ready,origin:WEB_ORIGIN,instrumentVersion:INSTRUMENT_VERSION,schemaVersion:SCHEMA_VERSION,noticeVersion:c.noticeVersion||'',researcher:c.researcher||'',email:c.email||'',retention:c.retention||''}).replace(/</g,'\\u003c');
  return page.evaluate().setTitle('問卷資料接收橋接').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function text_(value,max) {
  if(value===null||value===undefined)return '';
  if(typeof value!=='string'||value.length>max)throw new Error('文字欄位格式不符。');
  return value.trim();
}
function choice_(v,allowed) {
  const s=text_(v,80);if(s&&!allowed.includes(s))throw new Error('選項格式不符。');return s;
}
function list_(v,allowed,max) {
  if(v===undefined)return [];
  if(!Array.isArray(v)||v.length>max||new Set(v).size!==v.length||v.some(x=>!allowed.includes(x)))throw new Error('複選欄位格式不符。');return v;
}
function safeCell_(v) {
  // Prevent spreadsheet formula injection, including leading whitespace/control chars.
  if(typeof v==='string'&&/^[\s\u0000-\u001f]*[=+@-]/.test(v))return "'"+v;
  return v;
}
function uuid_(v) {if(typeof v!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v))throw new Error('作答代碼格式不符。');return v;}
function timestamp_(v) {if(typeof v!=='string'||v.length>40||!/^\d{4}-\d{2}-\d{2}T/.test(v)||!Number.isFinite(Date.parse(v)))throw new Error('作答時間格式不符。');return new Date(v).toISOString();}

function validate_(input,config) {
  if(!input||typeof input!=='object'||JSON.stringify(input).length>30000)throw new Error('資料格式或大小不符。');
  if(input.schemaVersion!==SCHEMA_VERSION||input.instrumentVersion!==INSTRUMENT_VERSION||input.noticeVersion!==config.noticeVersion)throw new Error('問卷或告知版本已變更，請重新整理。');
  const id=uuid_(input.id),startedAt=timestamp_(input.startedAt),finishedAt=timestamp_(input.finishedAt);
  if(Date.parse(finishedAt)<Date.parse(startedAt))throw new Error('完成時間早於開始時間。');
  const answers=input.answers,scores=scoreFFNI(answers); // Recompute on server; never trust client scores.
  const p=input.profile||{};
  if(typeof p!=='object'||Array.isArray(p))throw new Error('背景資料格式不符。');
  const gender=choice_(p.gender,['male','female','other']);
  if(p.age!==undefined&&p.age!==null&&(!Number.isInteger(p.age)||p.age<1||p.age>120))throw new Error('年齡格式不符。');
  const status=choice_(p.status,['highschool','college','graduate','employed','other']);
  const year=choice_(p.year,['一年級','二年級','三年級','四年級','五年級以上','其他']);
  const platform=list_(p.platform,['ig','threads','facebook','youtube','tiktok','douyin','xiaohongshu','dcard','ptt','x','discord','line','other','none'],14);
  if(platform.includes('none')&&platform.length!==1)throw new Error('未使用社群與其他平台互斥。');
  const main=choice_(p.mainPlatform,['ig','threads','facebook','youtube','tiktok','douyin','xiaohongshu','dcard','ptt','x','discord','line','other']);
  if(main&&!platform.includes(main))throw new Error('主要平台需包含在常用平台內。');
  const frequency=['never','ltweekly','1to2','3to5','daily'];
  const purposes=list_(p.purpose,['friends','fun','information','diary','creative','attention','work','other'],3);
  const background=[gender,p.age??'',status,['highschool','college','graduate'].includes(status)?year:'',platform.join('|'),platform.includes('other')?text_(p.otherPlatform,80):'',main,choice_(p.dailyTime,['none','lt30','30to60','1to2','2to4','4plus']),choice_(p.posting,frequency),choice_(p.browsing,frequency),purposes.join('|'),choice_(p.source,['class','friend','social','search','other'])];
  if(platform.includes('none')&&[main,background[7],background[8],background[9],purposes.length].some(Boolean))throw new Error('未使用社群者不填使用行為。');
  const npi=Array(16).fill('');let npiTotal='';
  if(input.entry){const a=input.entry.answers,k=[0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0];if(input.entry.version!=='npi16-material-v1'||!Array.isArray(a)||a.length!==16||a.some(x=>x!==0&&x!==1))throw new Error('入口答案格式不符。');a.forEach((v,i)=>npi[i]=v===0?'A':'B');npiTotal=a.reduce((s,v,i)=>s+Number(v===k[i]),0);}
  let contact=null;
  if(input.contact){const e=text_(input.contact.email,254);if(e){if(input.contact.purpose!=='research_invitation'||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))throw new Error('電郵或聯絡用途格式不符。');contact=e;}}
  return {id,startedAt,finishedAt,answers,scores,background,npi,npiTotal,contact};
}

function nextRow_(sheet) {
  const row = sheet.getLastRow() + 1;
  const limit = sheet.getMaxRows();
  if (row > limit) sheet.insertRowsAfter(limit, Math.max(100, row - limit));
  return row;
}

// Only externally callable write endpoint. No public list, lookup or export function.
function receiveSubmission(input) {
  const c=configuration_();
  if(!c.enabled||!c.spreadsheetId||!c.noticeVersion||!c.researcher||!c.email||!c.retention)throw new Error('目前尚未啟用資料接收。');
  const d=validate_(input,c),lock=LockService.getScriptLock();
  if(!lock.tryLock(10000))throw new Error('目前較忙，請稍後重試。');
  try {
    const ss=SpreadsheetApp.openById(c.spreadsheetId),sheet=verifySheet_(ss,'作答資料',RESPONSE_HEADERS),contacts=verifySheet_(ss,'聯絡資料',CONTACT_HEADERS);
    const now=new Date(),day=Utilities.formatDate(now,'Asia/Taipei','yyyy-MM-dd');
    const p=PropertiesService.getScriptProperties(),quota=JSON.parse(p.getProperty('DAILY_QUOTA')||'{}');
    // Idempotent immutable submission: an accepted participant ID is not overwritten.
    if(sheet.getLastRow()>1&&sheet.getRange(2,3,sheet.getLastRow()-1,1).createTextFinder(d.id).matchEntireCell(true).findNext())return {ok:true,id:d.id,duplicate:true};
    if(quota.day===day&&quota.count>=MAX_WRITES_PER_DAY)throw new Error('今日資料接收已達上限。');
    const received=Utilities.formatDate(now,'Asia/Taipei',"yyyy-MM-dd HH:mm:ss");
    const fs=d.scores.facets,cs=d.scores.composites;
    const row=[Utilities.getUuid(),received,d.id,d.startedAt,d.finishedAt,INSTRUMENT_VERSION,SCHEMA_VERSION,c.noticeVersion,...d.background,d.npiTotal,...d.npi,...d.answers,d.scores.total,...fs.map(f=>f.sum),...fs.map(f=>f.mean),...cs.map(f=>f.sum),...cs.map(f=>f.mean)].map(safeCell_);
    if(row.length!==RESPONSE_HEADERS.length)throw new Error('資料欄位長度不符。');
    const rr=nextRow_(sheet),cr=d.contact?nextRow_(contacts):null;
    try {
      if(d.contact)contacts.getRange(cr,1,1,CONTACT_HEADERS.length).setValues([[d.id,safeCell_(d.contact),'research_invitation',c.noticeVersion,received,'']]);
      sheet.getRange(rr,1,1,row.length).setValues([row]);
      SpreadsheetApp.flush();
    }catch(error){
      // Best-effort rollback; duplicate retries never overwrite previous rows.
      try{sheet.getRange(rr,1,1,row.length).clearContent();if(d.contact)contacts.getRange(cr,1,1,CONTACT_HEADERS.length).clearContent();SpreadsheetApp.flush();}catch(ignored){}
      throw new Error('資料儲存未完成，請稍後重試。');
    }
    p.setProperty('DAILY_QUOTA',JSON.stringify({day,count:quota.day===day?(quota.count||0)+1:1}));
    return {ok:true,id:d.id,contactSaved:!!d.contact};
  }finally{lock.releaseLock();}
}
