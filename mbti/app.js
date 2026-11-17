'use strict';
const main=document.getElementById('main');
const base=rounds.flatMap((round,r)=>round.map((item,d)=>({item,d,id:r*4+d,flip:(r+d)%2===1})));
const key='fieldnotes-answers-v1';
let answers={}, pos=0, filter='全部';
try{
 const saved=JSON.parse(sessionStorage.getItem(key)||'{}');
 for(const [i,v] of Object.entries(saved.answers||{})) if(/^(?:[0-9]|1[0-9]|2[0-7])$/.test(i)&&(v===0||v===1)) answers[i]=v;
 if(Number.isInteger(saved.pos)) pos=Math.max(0,Math.min(27,saved.pos));
}catch{}
function persist(){try{sessionStorage.setItem(key,JSON.stringify({answers,pos}));}catch{}}
function counts(){return axes.map((_,d)=>[0,1].map(v=>base.filter(q=>q.d===d&&answers[q.id]===v).length));}
function questions(){
 if(base.some(q=>answers[q.id]===undefined)) return base;
 const extra=counts().flatMap(([a,b],d)=>a===b?[{item:tieItems[d],d,id:24+d,flip:d%2===0}]:[]);
 return base.concat(extra);
}
function result(){
 if(questions().some(q=>answers[q.id]===undefined))return '';
 return counts().map(([a,b],d)=>axes[d][0][a===b?answers[24+d]:a>b?0:1]).join('');
}
const tones=['var(--purple)','var(--coral)','var(--lime)','var(--sky)'];
const palettes=t=>tones[(t[1]==='N'?2:0)+(t[2]==='F'?1:0)];
const button=(href,label,cls='primary')=>'<a class="'+cls+'" href="#'+href+'">'+label+'</a>';
const back=(to,label)=>'<a class="back" href="#'+to+'">← '+label+'</a>';
const poster='<div class="poster" aria-hidden="true"><span class="figlab">PERSONALITY ATLAS</span>'+[0,1,2,3].map(i=>'<span class="creature c'+i+'"><i></i><b></b></span>').join('')+'<span class="orn a">✳</span><span class="orn b">✧</span><span class="figlab end">16 TYPES / 04 PAIRS</span></div>';
function home(){
 const finished=result();
 main.innerHTML='<section class="hero"><div><div class="eyebrow">16 型人格測驗</div><h1>探索你的<br><em>人格偏好。</em></h1><p>從一個人的週五傍晚，到一群人的旅行計畫。選出更像你的日常反應，讀懂自己的四字母人格類型。</p><div class="actions">'+button(finished?'result':'quiz',(finished?'查看我的結果':Object.keys(answers).length?'繼續測驗':'開始測驗')+'　→')+button('atlas','瀏覽 16 型圖鑑','linkbtn')+'</div><div class="meta">24 道情境題 <span>·</span> 約 5–8 分鐘 <span>·</span> 免登入</div></div>'+poster+'</section><div class="sectionhead"><h2>認識四個人格向度</h2><span>THE FOUR PAIRS</span></div><div class="grid">'+axes.map(([pair,name,l,r,desc],i)=>'<article class="axis" style="--accent:'+tones[i]+'"><div class="axcode">'+pair[0]+' / '+pair[1]+'</div><h3>'+name+'</h3><p>'+desc+'</p></article>').join('')+'</div>';
}
function atlas(){
 const groups=['全部','ST','SF','NT','NF'];
 main.innerHTML='<section class="atlas"><div class="eyebrow">TYPE ATLAS</div><h1>16 型人格圖鑑</h1><p class="sub">選一種類型，閱讀它的性格特徵與日常表現。</p><div class="filters" aria-label="依中間兩個字母篩選">'+groups.map(g=>'<button data-filter="'+g+'" aria-pressed="'+(filter===g)+'">'+g+'</button>').join('')+'</div><div class="grid">'+Object.keys(profiles).filter(t=>filter==='全部'||t.slice(1,3)===filter).map(t=>'<a class="typecard" href="#type/'+t+'" style="--accent:'+palettes(t)+'"><span class="code">'+t+'</span><small>'+profiles[t][0]+'　↗</small></a>').join('')+'</div></section>';
 main.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;atlas();main.querySelector('[aria-pressed=true]').focus()});
}
function quiz(){
 let qs=questions(),first=qs.findIndex(q=>answers[q.id]===undefined);
 pos=Math.min(pos,qs.length-1,first<0?Infinity:first);
 const q=qs[pos],extra=pos>=24,choices=q.flip?[1,0]:[0,1];
 const total=qs.length, last=pos===total-1;
 main.innerHTML='<div class="inner">'+back('home','測驗首頁')+'<div class="qtop"><b>'+(extra?'同分偏好確認':'校園情境測驗')+'</b><span>第 '+(pos+1)+' / '+total+' 題</span></div><div class="track"><i style="width:'+((pos+1)/total*100)+'%"></i></div><form class="quizbox"><div class="eyebrow">'+(extra?'這個向度兩側各選了 3 次':'選出平常更自然的反應')+'</div><h1 id="question">'+q.item[0]+'</h1><div role="radiogroup" aria-labelledby="question">'+choices.map(v=>'<label class="answer"><input required type="radio" name="answer" value="'+v+'" '+(answers[q.id]===v?'checked':'')+'><span>'+q.item[v+1]+'</span></label>').join('')+'</div><div class="stepfoot"><button type="button" class="secondary" id="prev" '+(pos?'':'disabled')+'>← 上一題</button><button type="submit" class="primary" '+(answers[q.id]===undefined?'disabled':'')+'>'+((last&&pos>=23&&result())||extra&&last?'查看結果':pos===23?'完成作答':'下一題')+'　→</button></div></form><p class="fine">答案只暫存在這個瀏覽器分頁。可回上一題修改。</p></div>';
 main.querySelectorAll('input').forEach(input=>input.onchange=()=>{
   const v=Number(input.value);
   if(!extra&&answers[q.id]!==v) delete answers[24+q.d];
   answers[q.id]=v;persist();main.querySelector('[type=submit]').disabled=false;
 });
 const focusQuestion=()=>{quiz();const h=main.querySelector('h1');h.tabIndex=-1;h.focus();};
 document.getElementById('prev').onclick=()=>{if(pos>0){pos--;persist();focusQuestion();}};
 main.querySelector('form').onsubmit=e=>{e.preventDefault();if(answers[q.id]===undefined)return;
   if(pos===questions().length-1&&result()){persist();location.hash='result';}
   else{pos++;persist();focusQuestion();}
 };
}
function profile(t,own){
 const [title,learning,team,blind,growth]=profiles[t];
 const description=axes.map(([pair,name,l,r],d)=>pair[0]===t[d]?l:r).join(' · ');
 const scores=counts();
 const showScores=own?'<section class="box"><h3>你的四向度作答分布</h3><p class="fine">每個向度各有 6 題。數字代表選擇次數，同分時依加答的偏好確認題決定字母。</p>'+axes.map(([pair,name,l,r],d)=>'<div class="score"><div class="scoreline"><span>'+l+' '+pair[0]+'　'+scores[d][0]+' 次</span><span>'+scores[d][1]+' 次　'+pair[1]+' '+r+'</span></div><div class="track"><i style="width:'+scores[d][0]/6*100+'%"></i></div>'+(scores[d][0]===3?'<small>兩側同分，偏好確認題選了 '+t[d]+'。</small>':'')+'</div>').join('')+'</section>':'';
 main.innerHTML='<article class="inner">'+back(own?'home':'atlas',own?'測驗首頁':'16 型圖鑑')+'<div class="typehead" style="--accent:'+palettes(t)+'"><div class="eyebrow">'+(own?'你的測驗結果':'人格類型')+'</div><div class="bigcode">'+t+'</div><h1>'+title+'</h1><p>'+description+'</p></div><div class="box"><h3>性格特徵</h3><p>'+traits[t]+'</p></div><div class="twocol">'+[['學習偏好',learning],['人際與合作',team],['可能的盲點',blind],['成長建議',growth]].map(([h,p])=>'<section class="box"><h3>'+h+'</h3><p>'+p+'</p></section>').join('')+'</div>'+showScores+'<p class="fine section">這是原創自我探索練習，未經信效度驗證。四個字母描述本次選擇呈現的偏好，無法判定能力或心理健康。</p><div class="actions">'+(own?button('atlas','瀏覽其他類型','secondary')+'<button id="restart" class="linkbtn">重新測驗</button>':button(result()?'result':'quiz',result()?'回到我的結果':'進入人格測驗'))+'</div></article>';
 if(own)document.getElementById('restart').onclick=()=>{if(confirm('清除這次作答，從第一題重新開始？')){answers={};pos=0;persist();location.hash='quiz'}};
}
function about(){
 main.innerHTML='<article class="inner">'+back('home','測驗首頁')+'<div class="eyebrow">ABOUT THE TEST</div><h1>測驗說明</h1><div class="box"><h3>如何作答</h3><p>想想平常能自由選擇時，哪個反應對你比較自然。兩個選項都適用時，選較常發生的一個。可以在送出前返回修改。</p></div><div class="box"><h3>如何得出四個字母？</h3><p>24 道原創題分別探索能量方向、接收資訊、判斷依據與生活安排，每個向度各 6 題。每選一次，該側加 1 票。票數較多的一側成為結果字母。若兩側各 3 票，會多問 1 題來確認你的偏好，最多加答 4 題。</p></div><div class="box"><h3>如何閱讀結果？</h3><p>每一型都有特徵分析和生活例子。票數相近，代表你在這些情境中常使用兩側的做法。這份自編練習未經心理計量驗證，僅供自我探索，不具官方 MBTI® 評量或臨床診斷效力。</p></div><div class="box"><h3>誰看得到我的作答？</h3><p>網站不要求姓名或學號，作答與計分都在裝置上完成，答案不會送給教師或伺服器。同一分頁重新整理可繼續作答；在結果頁選擇重新測驗即會清除這次答案。</p></div><details><summary>題型與參考資料</summary><p>四向度的定義參考 Myers & Briggs Foundation。另參閱 Open Psychometrics 公開的雙端偏好題型。本站題幹、回答選項及校園分析均為另行撰寫。</p><ul><li><a href="https://www.myersbriggs.org/my-mbti-personality-type/the-mbti-preferences/">Myers & Briggs Foundation · 四組偏好</a></li><li><a href="https://www.myersbriggs.org/my-mbti-personality-type/the-16-mbti-personality-types/">Myers & Briggs Foundation · 16 型概覽</a></li><li><a href="https://openpsychometrics.org/tests/OJTS/development/">Open Psychometrics · 公開題型發展說明</a></li></ul></details></article>';
}
function route(){
 const dest=location.hash.slice(1)||'home';
 document.querySelectorAll('nav a').forEach(a=>{if(a.hash==='#'+dest)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 if(dest==='quiz')quiz();
 else if(dest==='atlas')atlas();
 else if(dest==='about')about();
 else if(dest==='result'&&result())profile(result(),true);
 else if(/^type\/[EI][SN][TF][JP]$/.test(dest))profile(dest.slice(5),false);
 else home();
 window.scrollTo(0,0);
 main.focus({preventScroll:true});
}
window.addEventListener('hashchange',route);route();
