// Generated Apps Script; do not edit without rebuilding.
// Item membership and reverse keys follow the UGA FFNI Long scoring algorithm.
const facets = [
  {id:'anger',name:'反應性憤怒',en:'Reactive Anger',items:[1,16,-31,46,61,76,-91,106,121,136],description:'受到批評、不公平待遇或不尊重時，生氣與反擊的反應。',reflection:'感到不被尊重時，可以先辨認事實、感受與需要，再選擇回應方式。'},
  {id:'shame',name:'羞恥感',en:'Shame',items:[2,17,32,-47,62,77,-92,107,122,-137],description:'失敗、犯錯或受到評斷時，感到難堪或受辱的程度。',reflection:'一次表現不理想，是否容易變成對整個自己的否定？試著把事情的結果與人的價值分開。'},
  {id:'indifference',name:'不在意外界評價',en:'Indifference',items:[3,-18,33,-48,63,78,93,-108,123,138],description:'對他人評價較不受影響的傾向；較認同這些敘述，不等於缺乏同理心。',reflection:'既能保留自己的判斷，也能分辨哪些建議值得參考，是一種可以練習的平衡。'},
  {id:'admiration',name:'需要他人讚賞',en:'Need for Admiration',items:[4,19,34,49,-64,79,94,109,124,139],description:'自我肯定與他人欣賞之間的連結，以及對自我和成就的不確定感。',reflection:'在沒有按讚或稱讚的一天，你能否指出一件仍然值得肯定自己的事？'},
  {id:'exhibition',name:'自我展示',en:'Exhibitionism',items:[5,-20,35,50,-65,80,95,110,125,140],description:'享受被看見、表演及吸引注意的傾向。這不單獨等於炫耀。',reflection:'分享時，你最希望表達什麼？是作品、連結、樂趣，還是被看見的感覺？'},
  {id:'authority',name:'權威與主導',en:'Authoritativeness',items:[6,21,36,51,66,81,-96,111,-126,141],description:'帶領別人、掌控局面和擔任有權力角色時的自在程度。',reflection:'帶領討論時，能否同時邀請不同意見，讓較安靜的人也有空間？'},
  {id:'fantasy',name:'誇大與成功幻想',en:'Grandiose Fantasies',items:[7,22,37,52,-67,82,97,112,127,-142],description:'想像未來獲得不凡成功、名聲、財富或權力的傾向。',reflection:'想像中的成功，可以轉化成哪一個具體、可完成的小步驟？'},
  {id:'manipulation',name:'操控傾向',en:'Manipulativeness',items:[8,-23,38,53,68,83,98,113,-128,143],description:'運用影響、誤導或策略，使別人依自己的意願行動的傾向。',reflection:'說服別人時，是否讓對方掌握足夠資訊，也有真正拒絕的空間？'},
  {id:'exploitation',name:'利用他人傾向',en:'Exploitativeness',items:[9,24,-39,54,69,84,-99,114,129,144],description:'為達成個人目標而利用別人，或接受這種做法的程度。',reflection:'追求目標時，誰承擔了代價？能否用互惠、清楚協商取代單方面利用？'},
  {id:'entitlement',name:'特殊待遇期待',en:'Entitlement',items:[10,-25,40,55,-70,85,100,115,130,-145],description:'期待比別人獲得更多關注、優待或規則例外的傾向。',reflection:'你期待的待遇，是每個人都合理享有的權利，還是只有自己能獲得的例外？'},
  {id:'empathy',name:'較少關注他人感受',en:'Lack of Empathy',items:[11,26,41,-56,71,86,-101,116,-131,146],description:'較少注意或回應他人需求、苦難及感受的傾向；分數不是同理能力的完整評估。',reflection:'在提出建議之前，先用一句話確認對方現在最難受的是什麼。'},
  {id:'arrogance',name:'優越與傲慢',en:'Arrogance',items:[12,27,42,-57,72,-87,102,117,132,-147],description:'認為自己優於他人，以及以地位或能力區分交往對象的傾向。',reflection:'肯定自己的能力時，是否也能看見他人的長處與不同處境？'},
  {id:'acclaim',name:'成就與聲望追求',en:'Acclaim-Seeking',items:[13,28,43,58,73,-88,103,118,133,-148],description:'投入成功、成就及聲望的動力。這裡同時包含一般企圖心相關敘述。',reflection:'除了成就和被認可，你希望保留哪些同樣重要的生活價值？'},
  {id:'thrill',name:'尋求刺激',en:'Thrill-Seeking',items:[14,29,44,59,-74,89,104,119,134],description:'尋求新奇、刺激與風險的傾向，包含對危險行動的態度。',reflection:'追求刺激時，你如何評估自己與別人的安全、界線和後果？'},
  {id:'distrust',name:'人際不信任',en:'Distrust',items:[15,30,45,-60,75,90,105,120,135],description:'懷疑他人的動機、誠實與善意，或對吐露心事有所保留的傾向。',reflection:'你目前的警覺來自哪些具體經驗？有哪些證據能幫助你逐步調整信任？'}
];
const composites = [
  {id:'grandiose',name:'誇大型相關傾向',facets:['indifference','exhibition','authority','fantasy','manipulation','exploitation','entitlement','empathy','arrogance','acclaim','thrill'],description:'整合自我擴張、展示、主導及部分對抗性特質。'},
  {id:'vulnerable',name:'脆弱型相關傾向',facets:['anger','shame','admiration','distrust'],description:'整合評價敏感、需要肯定、憤怒及不信任。可與誇大型傾向並存。'},
  {id:'agentic',name:'外向／能動性相關因素',facets:['acclaim','authority','fantasy','exhibition'],description:'成就動力、主導、自我展示與成功想像的組合。'},
  {id:'antagonistic',name:'對抗性相關因素',facets:['manipulation','exploitation','entitlement','empathy','arrogance','anger','distrust','thrill'],description:'整合特權、利用他人、對抗與較少關注他人感受等面向。'},
  {id:'neurotic',name:'神經質相關因素',facets:['shame','indifference','admiration'],reverseFacets:['indifference'],description:'整合羞恥、對評價的敏感與需要讚賞；此名稱不代表疾病診斷。'}
];
function scoreFFNI(answers) {
  if (!Array.isArray(answers)||answers.length!==148||answers.some(x=>!Number.isInteger(x)||x<1||x>5)) throw new Error('必須完成全部 148 題才能計分。');
  const scored=facets.map(f=>{const sum=f.items.reduce((s,k)=>s+(k<0?6-answers[-k-1]:answers[k-1]),0);return {id:f.id,sum,count:f.items.length,mean:sum/f.items.length};});
  const byId=Object.fromEntries(scored.map(f=>[f.id,f]));
  const groups=composites.map(c=>{let sum=0,count=0;for(const id of c.facets){const f=byId[id];sum+=(c.reverseFacets||[]).includes(id)?6*f.count-f.sum:f.sum;count+=f.count;}return {id:c.id,sum,count,mean:sum/count};});
  return {total:scored.reduce((s,f)=>s+f.sum,0),facets:scored,composites:groups};
}

const RESPONSE_HEADERS=["提交編號","接收時間（台灣）","作答代碼","開始時間","完成時間","量表版本","資料格式版本","告知版本","性別","年齡","就學工作狀態","年級","常用平台","其他平台","最常用平台","每日使用時間","發布頻率","瀏覽頻率","使用目的","測驗來源","NPI16總分","NPI16_Q01","NPI16_Q02","NPI16_Q03","NPI16_Q04","NPI16_Q05","NPI16_Q06","NPI16_Q07","NPI16_Q08","NPI16_Q09","NPI16_Q10","NPI16_Q11","NPI16_Q12","NPI16_Q13","NPI16_Q14","NPI16_Q15","NPI16_Q16","FFNI_Q001","FFNI_Q002","FFNI_Q003","FFNI_Q004","FFNI_Q005","FFNI_Q006","FFNI_Q007","FFNI_Q008","FFNI_Q009","FFNI_Q010","FFNI_Q011","FFNI_Q012","FFNI_Q013","FFNI_Q014","FFNI_Q015","FFNI_Q016","FFNI_Q017","FFNI_Q018","FFNI_Q019","FFNI_Q020","FFNI_Q021","FFNI_Q022","FFNI_Q023","FFNI_Q024","FFNI_Q025","FFNI_Q026","FFNI_Q027","FFNI_Q028","FFNI_Q029","FFNI_Q030","FFNI_Q031","FFNI_Q032","FFNI_Q033","FFNI_Q034","FFNI_Q035","FFNI_Q036","FFNI_Q037","FFNI_Q038","FFNI_Q039","FFNI_Q040","FFNI_Q041","FFNI_Q042","FFNI_Q043","FFNI_Q044","FFNI_Q045","FFNI_Q046","FFNI_Q047","FFNI_Q048","FFNI_Q049","FFNI_Q050","FFNI_Q051","FFNI_Q052","FFNI_Q053","FFNI_Q054","FFNI_Q055","FFNI_Q056","FFNI_Q057","FFNI_Q058","FFNI_Q059","FFNI_Q060","FFNI_Q061","FFNI_Q062","FFNI_Q063","FFNI_Q064","FFNI_Q065","FFNI_Q066","FFNI_Q067","FFNI_Q068","FFNI_Q069","FFNI_Q070","FFNI_Q071","FFNI_Q072","FFNI_Q073","FFNI_Q074","FFNI_Q075","FFNI_Q076","FFNI_Q077","FFNI_Q078","FFNI_Q079","FFNI_Q080","FFNI_Q081","FFNI_Q082","FFNI_Q083","FFNI_Q084","FFNI_Q085","FFNI_Q086","FFNI_Q087","FFNI_Q088","FFNI_Q089","FFNI_Q090","FFNI_Q091","FFNI_Q092","FFNI_Q093","FFNI_Q094","FFNI_Q095","FFNI_Q096","FFNI_Q097","FFNI_Q098","FFNI_Q099","FFNI_Q100","FFNI_Q101","FFNI_Q102","FFNI_Q103","FFNI_Q104","FFNI_Q105","FFNI_Q106","FFNI_Q107","FFNI_Q108","FFNI_Q109","FFNI_Q110","FFNI_Q111","FFNI_Q112","FFNI_Q113","FFNI_Q114","FFNI_Q115","FFNI_Q116","FFNI_Q117","FFNI_Q118","FFNI_Q119","FFNI_Q120","FFNI_Q121","FFNI_Q122","FFNI_Q123","FFNI_Q124","FFNI_Q125","FFNI_Q126","FFNI_Q127","FFNI_Q128","FFNI_Q129","FFNI_Q130","FFNI_Q131","FFNI_Q132","FFNI_Q133","FFNI_Q134","FFNI_Q135","FFNI_Q136","FFNI_Q137","FFNI_Q138","FFNI_Q139","FFNI_Q140","FFNI_Q141","FFNI_Q142","FFNI_Q143","FFNI_Q144","FFNI_Q145","FFNI_Q146","FFNI_Q147","FFNI_Q148","FFNI總分","FFNI_anger_sum","FFNI_shame_sum","FFNI_indifference_sum","FFNI_admiration_sum","FFNI_exhibition_sum","FFNI_authority_sum","FFNI_fantasy_sum","FFNI_manipulation_sum","FFNI_exploitation_sum","FFNI_entitlement_sum","FFNI_empathy_sum","FFNI_arrogance_sum","FFNI_acclaim_sum","FFNI_thrill_sum","FFNI_distrust_sum","FFNI_anger_mean","FFNI_shame_mean","FFNI_indifference_mean","FFNI_admiration_mean","FFNI_exhibition_mean","FFNI_authority_mean","FFNI_fantasy_mean","FFNI_manipulation_mean","FFNI_exploitation_mean","FFNI_entitlement_mean","FFNI_empathy_mean","FFNI_arrogance_mean","FFNI_acclaim_mean","FFNI_thrill_mean","FFNI_distrust_mean","FFNI_grandiose_sum","FFNI_vulnerable_sum","FFNI_agentic_sum","FFNI_antagonistic_sum","FFNI_neurotic_sum","FFNI_grandiose_mean","FFNI_vulnerable_mean","FFNI_agentic_mean","FFNI_antagonistic_mean","FFNI_neurotic_mean"];
const CONTACT_HEADERS=["作答代碼","電子郵件","聯絡用途","告知版本","接收時間（台灣）","撤回時間"];
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
