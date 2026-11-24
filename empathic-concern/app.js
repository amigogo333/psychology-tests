import {labels,items,scoreConcern} from './data.js';
const $=id=>document.getElementById(id);
let answers=Array(7).fill(null),index=0;
function display(id){for(const s of ['intro','survey','results'])$(s).hidden=s!==id;window.scrollTo(0,0);}
function count(){return answers.filter(v=>v!==null).length;}
function update(){ $('completed').textContent=`已完成 ${count()} / 7 題`;$('progress').value=count();$('jump').innerHTML=items.map((q,i)=>`<button type="button" data-index="${i}" class="${answers[i]!==null?'done ':''}${i===index?'current':''}" ${i===index?'aria-current="step"':''} aria-label="第 ${i+1} 題${answers[i]!==null?'，已完成':''}">${i+1}${answers[i]!==null?' ✓':''}</button>`).join(''); }
function render(){const q=items[index];$('counter').textContent=`第 ${index+1} / 7 題`;$('question-title').textContent=q.text;$('choices').innerHTML=labels.map((l,i)=>`<label class="option"><input type="radio" name="answer" value="${i+1}" ${answers[index]===i+1?'checked':''}><strong>${i+1}</strong><span>${l}</span></label>`).join('');$('previous').disabled=index===0;$('next').textContent=index===6?'查看結果':'下一題';$('message').textContent='';update();$('page-title').focus();}
function results(){const score=scoreConcern(answers);$('mean').textContent=score.mean.toFixed(2);$('total').textContent=`七題加總 ${score.total} / 35；平均 ${score.total} ÷ 7 = ${score.mean.toFixed(2)}。`;$('score-meter').setAttribute('aria-valuenow',String(score.mean));$('score-meter').setAttribute('aria-valuetext',`每題平均 ${score.mean.toFixed(2)} 分，範圍一至五分`);$('score-fill').style.width=`${(score.mean-1)/4*100}%`;$('answer-review').innerHTML=items.map((q,i)=>`<tr><td>${i+1}. ${q.text}</td><td>${answers[i]}・${labels[answers[i]-1]}</td><td>${score.values[i]}${q.reverse?'（反向計分）':''}</td></tr>`).join('');display('results');$('result-title').focus();}
$('start').onclick=()=>{display('survey');render();};
$('choices').addEventListener('change',e=>{if(e.target.type!=='radio')return;answers[index]=Number(e.target.value);$('message').textContent='';update();});
$('previous').onclick=()=>{if(index>0){index--;render();}};
$('next').onclick=()=>{if(answers[index]===null){$('message').textContent=`請先回答第 ${index+1} 題。`;$('choices').querySelector('input').focus();return;}if(index<6){index++;render();return;}const missing=answers.findIndex(v=>v===null);if(missing>=0){index=missing;render();$('message').textContent=`還有題目未完成，請回答第 ${index+1} 題。`;$('choices').querySelector('input').focus();return;}results();};
$('jump').addEventListener('click',e=>{const b=e.target.closest('button[data-index]');if(!b)return;index=Number(b.dataset.index);render();});
$('edit').onclick=()=>{display('survey');render();};
$('restart').onclick=()=>{answers=Array(7).fill(null);index=0;$('answer-review').replaceChildren();$('answer-details').open=false;display('survey');render();};
$('project').onclick=()=>{const active=document.body.classList.toggle('projection');$('project').setAttribute('aria-pressed',String(active));$('project').textContent=active?'一般模式':'投影模式';};
$('print').onclick=()=>{const details=$('answer-details'),wasOpen=details.open;details.open=true;window.print();details.open=wasOpen;};
