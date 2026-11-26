import {instrument} from './items.js';
import {receiverUrl} from './collection-config.js';
import {connectReceiver, schemaVersion} from './collection.js';
import {facets, composites, scoreFFNI} from './scoring.js';
const $=id=>document.getElementById(id);
const STATE_KEY='ffni148-review-v1', ENTRY_KEY='npi16-entry-v1';
const screens=['welcome','background','questionnaire','results'];
const pageSize=10, pages=Math.ceil(instrument.items.length/pageSize);
const platformOptions=[['ig','Instagram（IG）'],['threads','Threads'],['facebook','Facebook'],['youtube','YouTube'],['tiktok','TikTok'],['douyin','抖音'],['xiaohongshu','小紅書'],['dcard','Dcard'],['ptt','PTT'],['x','X'],['discord','Discord'],['line','LINE 社群／公開內容'],['other','其他'],['none','沒有使用']];
const purposeOptions=[['friends','聯繫朋友'],['fun','娛樂'],['information','獲取資訊'],['diary','記錄生活'],['creative','分享作品'],['attention','獲得關注'],['work','工作'],['other','其他']];
const responseLabels=['非常不同意','不同意','中立／難以判斷','同意','非常同意'];
let state={version:instrument.version,id:crypto.randomUUID(),startedAt:null,finishedAt:null,answers:Array(148).fill(null),page:0,profile:{},entry:null};
let currentScreen='welcome',editingProfile=false;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function readStorage(key){try{return JSON.parse(sessionStorage.getItem(key)||'null');}catch{return null;}}
function save(){try{sessionStorage.setItem(STATE_KEY,JSON.stringify(state));}catch{$('storage-warning').hidden=false;}}
function count(){return state.answers.filter(x=>x!==null).length;}
function show(id){currentScreen=id;screens.forEach(x=>$(x).hidden=x!==id);window.scrollTo({top:0,behavior:'instant'});const heading=$(id).querySelector('h1');heading?.focus();}
function options(name,data){return data.map(([value,label])=>`<label><input type="checkbox" name="${name}" value="${value}">${label}</label>`).join('');}
$('platform-options').innerHTML=options('platform',platformOptions);
$('purpose-options').innerHTML=options('purpose',purposeOptions);
document.querySelectorAll('.frequency').forEach(s=>s.innerHTML='<option value="">請選擇（可略過）</option><option value="never">從未</option><option value="ltweekly">少於每週一次</option><option value="1to2">每週 1～2 天</option><option value="3to5">每週 3～5 天</option><option value="daily">幾乎每天</option>');
$('jump').innerHTML=Array.from({length:pages},(_,i)=>`<option value="${i}">第 ${i+1} 頁</option>`).join('');
const stored=readStorage(STATE_KEY);
if(stored?.version===instrument.version&&Array.isArray(stored.answers)&&stored.answers.length===148&&stored.answers.every(x=>x===null||Number.isInteger(x)&&x>=1&&x<=5)&&Number.isInteger(stored.page)&&stored.page>=0&&stored.page<pages&&typeof stored.id==='string'&&stored.profile&&typeof stored.profile==='object')state=stored;
const incomingEntry=readStorage(ENTRY_KEY);
if(!state.entry&&incomingEntry?.version==='npi16-material-v1'&&Array.isArray(incomingEntry.answers)&&incomingEntry.answers.length===16&&incomingEntry.answers.every(x=>x===0||x===1)&&Number.isInteger(incomingEntry.total)&&incomingEntry.total>=0&&incomingEntry.total<=16)state.entry=incomingEntry;
let collectionStatus = 'unconfigured', disclosure = null, sending = false;
let deliveryError = '';
const collection = connectReceiver(receiverUrl, instrument.version, (status, config) => {
  collectionStatus = status;
  disclosure = config || null;
  updateCollectionUI();
});

function updateCollectionUI() {
  const ready = collectionStatus === 'ready';
  const localOnly = collectionStatus === 'unconfigured' || collectionStatus === 'disabled';
  const delivery = state.delivery?.status;
  const locked = Boolean(delivery);
  const lastPage = state.page === pages - 1;
  const notice = ready
    ? `本問卷用於研究自戀特質與社群使用情形。送出內容包含 148 題答案、分數、已填寫的背景資料，以及從短測驗帶入的 16 題答案。研究聯絡窗口為 ${disclosure.researcher}（${disclosure.email}）。本研究的保存說明為「${disclosure.retention}」。`
    : '';
  $('collection-title').textContent = ready ? '研究問卷收件中' : localOnly ? '個人練習模式' : '研究收件連線中';
  $('collection-summary').textContent = ready
    ? '進度暫存在此分頁。完成後，請在最後一頁按「送出並查看結果」。'
    : localOnly ? '本次作答保留在此分頁，結果可自行下載。'
    : '尚未連上研究試算表，可先作答，並在最後一頁確認收件狀態。';
  $('welcome-disclosure').hidden = !ready;
  $('welcome-disclosure').textContent = notice;
  $('submission-panel').hidden = !lastPage || (localOnly && !locked);
  $('submission-disclosure').textContent = ready ? notice : '目前無法送達研究試算表。可先查看或下載結果，保留分頁以便稍後重試。';
  $('contact-fields').hidden = !ready || delivery === 'saved';
  $('reconnect').hidden = (ready && !delivery) || collectionStatus === 'unconfigured' || collectionStatus === 'loading';
  if (lastPage) {
    $('next-page').textContent = delivery === 'saved' ? '查看已送出的結果'
      : ready ? (delivery ? '重新送出同一筆作答' : '送出並查看結果') : '查看個人結果';
  }
  $('next-page').disabled = sending;
  $('previous').disabled = locked || state.page === 0;
  $('jump').disabled = locked;
  $('pause').disabled = sending;
  $('edit-profile').hidden = locked;
  $('edit-answers').hidden = locked;
  $('clear-all').disabled = sending;
  const submitButton = $('review-submission');
  submitButton.hidden = sending || delivery === 'saved' || (localOnly && !locked);
  submitButton.textContent = delivery ? '返回最後一頁重試' : '查看送出說明';
  const idText = `作答代碼 ${state.id}`;
  let resultText = '此份結果目前僅保留在這個分頁。你也可以下載個人作答檔。';
  if (sending) resultText = '正在寫入研究試算表，請保留此分頁。';
  else if (delivery === 'saved') resultText = `研究試算表已收到你的作答。${idText}。如需聯絡研究者，請保留此代碼。`;
  else if (delivery) resultText = deliveryError || '尚未收到試算表的儲存確認。請用同一份作答重試。';
  else if (ready) resultText = '這份作答尚未送出。可返回最後一頁，確認研究用途並送出。';
  $('delivery-note').textContent = resultText;
  const badge = $('delivery-badge');
  if (badge) badge.textContent = delivery === 'saved' ? '試算表已收件' : sending ? '送出中' : delivery ? '待確認' : '尚未送出';
}

// Called only by the participant's last-page submit action, never on restore or view.
async function finishQuestionnaire() {
  if (sending) return;
  if (!disclosure || state.delivery?.status === 'saved') {
    renderResults();
    return;
  }
  const emailField = $('email'), email = emailField.value.trim();
  if (!emailField.reportValidity()) return;
  if (state.delivery?.hadEmail && !email) {
    $('quiz-error').textContent = '上次送出時有填寫聯絡信箱。請重新輸入，以便重試同一份作答。';
    emailField.focus();
    return;
  }
  state.finishedAt ||= new Date().toISOString();
  const id = state.id;
  const payload = {
    schemaVersion, instrumentVersion: instrument.version, noticeVersion: disclosure.noticeVersion,
    id, startedAt: state.startedAt, finishedAt: state.finishedAt, answers: state.answers,
    profile: state.profile, entry: state.entry,
    contact: email ? {email, purpose: 'research_invitation'} : null
  };
  sending = true;
  deliveryError = '';
  state.delivery = {status: 'pending', hadEmail: Boolean(email)};
  save();
  renderResults();
  try {
    await collection.submit(payload);
    if (state.id === id) {
      state.delivery = {status: 'saved'};
      emailField.value = '';
    }
  } catch (error) {
    if (state.id === id) deliveryError = error.message;
  } finally {
    sending = false;
    if (state.id === id) { save(); updateCollectionUI(); }
  }
}

$('review-submission').onclick = () => move(pages - 1);
$('reconnect').onclick = () => collection.start();

function welcome(){const n=count();$('resume-box').hidden=!state.startedAt;$('begin').hidden=!!state.startedAt;$('resume-count').textContent=n===148?'你已完成全部 148 題，可再次查看分析。':`已完成 ${n} / 148 題，接著第 ${state.page+1} 頁。`;$('entry-summary').hidden=!state.entry;if(state.entry)$('entry-summary').textContent=`你已完成入口短測驗：${state.entry.total} / 16 分。這與完整 FFNI 是不同工具，兩者分數不直接相加或換算。`;show('welcome');}
function start(){state.startedAt ||= new Date().toISOString();save();hydrateProfile();editingProfile=false;show('background');}
$('begin').onclick=start;
$('resume').onclick=()=>{if(count()===148)renderResults();else{renderQuestions();show('questionnaire');}};
$('new-attempt').onclick=()=>{if(!confirm('清除本次 FFNI 進度並重新開始？'))return;reset(false);start();};
$('back-welcome').onclick=welcome;
function selected(name){return [...document.querySelectorAll(`#profile-form input[name="${name}"]:checked`)].map(x=>x.value);}
function socialVisibility(){const platforms=selected('platform'),none=platforms.includes('none');$('social-fields').hidden=none;for(const el of $('social-fields').querySelectorAll('input,select'))el.disabled=none;$('other-platform-field').hidden=!platforms.includes('other');const main=$('main-platform'),previous=main.value;main.innerHTML='<option value="">請選擇（可略過）</option>'+platformOptions.filter(([v])=>platforms.includes(v)&&v!=='none').map(([v,l])=>`<option value="${v}">${l}</option>`).join('');main.value=platforms.includes(previous)?previous:'';}
const profileForm=$('profile-form');
profileForm.addEventListener('change',e=>{if(e.target.name==='status')$('year-field').hidden=!['highschool','college','graduate'].includes(e.target.value);if(e.target.name==='platform'){if(e.target.checked&&e.target.value==='none')profileForm.querySelectorAll('[name=platform]').forEach(x=>{if(x.value!=='none')x.checked=false;});else if(e.target.checked)profileForm.querySelector('[name=platform][value=none]').checked=false;socialVisibility();}if(e.target.name==='purpose'){if(selected('purpose').length>3){e.target.checked=false;$('purpose-error').textContent='最多選擇三個主要目的。';}else $('purpose-error').textContent='';}});
function hydrateProfile(){profileForm.reset();const p=state.profile;for(const [key,value]of Object.entries(p)){if(['platform','purpose'].includes(key)){profileForm.querySelectorAll(`[name="${key}"]`).forEach(el=>el.checked=Array.isArray(value)&&value.includes(el.value));}else{const el=profileForm.elements.namedItem(key);if(el&&key!=='mainPlatform')el.value=value??'';}}socialVisibility();$('main-platform').value=p.mainPlatform||'';$('year-field').hidden=!['highschool','college','graduate'].includes(p.status);$('profile-error').textContent='';}
function getProfile(){const data=new FormData(profileForm),p={};for(const key of ['gender','status','year','otherPlatform','mainPlatform','dailyTime','posting','browsing','source'])p[key]=String(data.get(key)||'').trim();p.age=data.get('age')?Number(data.get('age')):null;p.platform=data.getAll('platform');p.purpose=data.getAll('purpose');if(!['highschool','college','graduate'].includes(p.status))p.year='';if(!p.platform.includes('other'))p.otherPlatform='';if(p.platform.includes('none')){p.mainPlatform='';p.dailyTime='';p.posting='';p.browsing='';p.purpose=[];}return p;}
profileForm.onsubmit=e=>{e.preventDefault();if(!profileForm.checkValidity()){profileForm.reportValidity();$('profile-error').textContent='請確認年齡是 1～120 的整數；也可以留白。';return;}state.profile=getProfile();save();if(editingProfile){renderResults();return;}renderQuestions();show('questionnaire');};
$('skip-profile').onclick=()=>{state.profile={};save();if(editingProfile)renderResults();else{renderQuestions();show('questionnaire');}};
function updateProgress(){$('answered-count').textContent=`已完成 ${count()} / 148 題`;$('progress').value=count();}
function renderQuestions(){const first=state.page*pageSize,last=Math.min(first+pageSize,148);$('page-label').textContent=`第 ${state.page+1} / ${pages} 頁 · 第 ${first+1}–${last} 題`;$('jump').value=String(state.page);$('question-list').innerHTML=instrument.items.slice(first,last).map(q=>`<fieldset class="question-card" id="q-${q.id}"><legend><span class="q-number">第 ${q.id} 題</span>${esc(q.zh)}</legend><div class="question-body"><p class="english" ${$('show-english').checked?'':'hidden'} lang="en">${esc(q.en)}</p><div class="likert">${responseLabels.map((l,i)=>`<label><input type="radio" name="q${q.id}" value="${i+1}" ${state.answers[q.id-1]===i+1?'checked':''}><strong>${i+1}</strong><span>${l}</span></label>`).join('')}</div></div></fieldset>`).join('');$('previous').disabled=state.page===0;$('next-page').textContent=state.page===pages-1?'查看完整分析':'下一頁';$('quiz-error').textContent='';updateProgress();updateCollectionUI();if(state.delivery){$('question-list').querySelectorAll('input').forEach(el=>el.disabled=true);}}
$('question-list').addEventListener('change',e=>{const id=Number(e.target.name.slice(1));if(!Number.isInteger(id)||id<1||id>148)return;state.answers[id-1]=Number(e.target.value);state.finishedAt=null;$(`q-${id}`).classList.remove('invalid');save();updateProgress();});
$('show-english').onchange=()=>document.querySelectorAll('.english').forEach(el=>el.hidden=!$('show-english').checked);
function move(page){state.page=page;save();renderQuestions();show('questionnaire');}
$('previous').onclick=()=>{if(state.page>0)move(state.page-1);};
$('next-page').onclick=()=>{const first=state.page*pageSize,last=Math.min(first+pageSize,148),missing=state.answers.slice(first,last).findIndex(x=>x===null);if(missing>=0){const id=first+missing+1;$('quiz-error').textContent=`第 ${id} 題尚未作答，請選擇較接近你的選項。`;$(`q-${id}`).classList.add('invalid');$(`q-${id}`).scrollIntoView({block:'center'});$(`q-${id}`).querySelector('input').focus({preventScroll:true});return;}if(state.page<pages-1)move(state.page+1);else if(count()<148){const page=Math.floor(state.answers.findIndex(x=>x===null)/pageSize);move(page);$('quiz-error').textContent='還有題目未完成，已帶你回到該頁。';}else finishQuestionnaire();};
$('jump').onchange=e=>move(Number(e.target.value));
$('pause').onclick=()=>{save();welcome();};
function bar(mean){return `<div class="score-track" role="meter" aria-label="計分後每題平均" aria-valuemin="1" aria-valuemax="5" aria-valuenow="${mean.toFixed(2)}"><div class="score-fill" style="width:${(mean-1)/4*100}%"></div></div><div class="axis"><span>1</span><span>計分後每題平均</span><span>5</span></div>`;}
function groupBlock(c,s){return `<article class="score-block"><div class="score-label"><span>${c.name}</span><strong>${s.mean.toFixed(2)} <small>/ 5</small></strong></div>${bar(s.mean)}<p>${c.description}</p><p class="hint">原始組合分數 ${s.sum}；${s.count} 題。</p></article>`;}
function renderResults(){const scores=scoreFFNI(state.answers);state.finishedAt ||=new Date().toISOString();save();const byId=Object.fromEntries(scores.facets.map(f=>[f.id,f]));const sorted=[...scores.facets].sort((a,b)=>b.mean-a.mean);const highlights=sorted.slice(0,3);if(sorted.every(f=>Math.abs(f.mean-sorted[0].mean)<1e-9))$('highlights').innerHTML='<div class="panel wide"><h3>各面向平均值相同</h3><p>本次回答沒有呈現數值較突出的面向。請從下方逐項閱讀；也可以返回確認答案是否符合平時的自己。</p></div>';else $('highlights').innerHTML=highlights.map(s=>{const f=facets.find(f=>f.id===s.id);return `<article class="panel"><p class="eyebrow">${s.mean.toFixed(2)} / 5</p><h3>${f.name}</h3><p>${f.description}</p><p class="reflection">${f.reflection}</p></article>`;}).join('');$('result-meta').innerHTML=`<span>148 / 148 題完成</span><span>繁體中文試譯</span><span id="delivery-badge"></span>`;$('broad-results').innerHTML=composites.slice(0,2).map(c=>groupBlock(c,scores.composites.find(s=>s.id===c.id))).join('');$('factor-results').innerHTML=composites.slice(2).map(c=>groupBlock(c,scores.composites.find(s=>s.id===c.id))).join('');$('facet-results').innerHTML=facets.map(f=>{const s=byId[f.id];return `<details class="facet-card"><summary><div class="score-label"><span class="facet-name">${f.name}</span><strong>${s.mean.toFixed(2)} <small>/ 5</small></strong></div>${bar(s.mean)}</summary><p lang="en" class="hint">${f.en}</p><p>${f.description}</p><p class="reflection">${f.reflection}</p><p class="hint">原始分數 ${s.sum}；題數 ${s.count}；不使用常模分級。</p></details>`;}).join('');editingProfile=false;show('results');updateCollectionUI();}
$('edit-profile').onclick=()=>{editingProfile=true;hydrateProfile();show('background');};
$('edit-answers').onclick=()=>move(0);
$('print').onclick=()=>{const details=[...document.querySelectorAll('#facet-results details')],previous=details.map(d=>d.open);details.forEach(d=>d.open=true);window.print();details.forEach((d,i)=>d.open=previous[i]);};
$('download').onclick=()=>{const payload={schemaVersion:'self-exploration-export-v1',instrumentVersion:instrument.version,translationStatus:instrument.translationStatus,id:state.id,startedAt:state.startedAt,finishedAt:state.finishedAt,entry:state.entry,profile:state.profile,answers:state.answers,scores:scoreFFNI(state.answers),submissionStatus:state.delivery?.status||'local',privacy:'個人下載檔不含聯絡信箱。'};const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`FFNI-${state.id.slice(0,8)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
function reset(clearEntry=true){try{sessionStorage.removeItem(STATE_KEY);if(clearEntry)sessionStorage.removeItem(ENTRY_KEY);}catch{}state={version:instrument.version,id:crypto.randomUUID(),startedAt:null,finishedAt:null,answers:Array(148).fill(null),page:0,profile:{},entry:clearEntry?null:state.entry};$('email').value='';deliveryError='';profileForm.reset();editingProfile=false;welcome();}
$('clear-all').onclick=()=>{if(confirm('清除此分頁中的 FFNI、背景與入口資料？這只會清除裝置上的資料。'))reset();};
collection.start();
welcome();
