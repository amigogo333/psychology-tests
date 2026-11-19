// Item membership and reverse keys follow the UGA FFNI Long scoring algorithm.
export const facets = [
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
export const composites = [
  {id:'grandiose',name:'誇大型相關傾向',facets:['indifference','exhibition','authority','fantasy','manipulation','exploitation','entitlement','empathy','arrogance','acclaim','thrill'],description:'整合自我擴張、展示、主導及部分對抗性特質。'},
  {id:'vulnerable',name:'脆弱型相關傾向',facets:['anger','shame','admiration','distrust'],description:'整合評價敏感、需要肯定、憤怒及不信任。可與誇大型傾向並存。'},
  {id:'agentic',name:'外向／能動性相關因素',facets:['acclaim','authority','fantasy','exhibition'],description:'成就動力、主導、自我展示與成功想像的組合。'},
  {id:'antagonistic',name:'對抗性相關因素',facets:['manipulation','exploitation','entitlement','empathy','arrogance','anger','distrust','thrill'],description:'整合特權、利用他人、對抗與較少關注他人感受等面向。'},
  {id:'neurotic',name:'神經質相關因素',facets:['shame','indifference','admiration'],reverseFacets:['indifference'],description:'整合羞恥、對評價的敏感與需要讚賞；此名稱不代表疾病診斷。'}
];
export function scoreFFNI(answers) {
  if (!Array.isArray(answers)||answers.length!==148||answers.some(x=>!Number.isInteger(x)||x<1||x>5)) throw new Error('必須完成全部 148 題才能計分。');
  const scored=facets.map(f=>{const sum=f.items.reduce((s,k)=>s+(k<0?6-answers[-k-1]:answers[k-1]),0);return {id:f.id,sum,count:f.items.length,mean:sum/f.items.length};});
  const byId=Object.fromEntries(scored.map(f=>[f.id,f]));
  const groups=composites.map(c=>{let sum=0,count=0;for(const id of c.facets){const f=byId[id];sum+=(c.reverseFacets||[]).includes(id)?6*f.count-f.sum:f.sum;count+=f.count;}return {id:c.id,sum,count,mean:sum/count};});
  return {total:scored.reduce((s,f)=>s+f.sum,0),facets:scored,composites:groups};
}
