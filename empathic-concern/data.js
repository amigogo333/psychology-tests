// Transcribed from the two textbook photographs supplied by the user.
// This is the textbook's five-point version, not a claim of a validated Taiwanese translation.
export const labels=['非常不符合','不符合','中立／難以判斷','符合','非常符合'];
export const items=[
  {id:1,text:'我常對於比自己更不幸的人產生體貼、關懷的感受。',reverse:false},
  {id:2,text:'有時我並不為遭遇問題的人感到難過。',reverse:true},
  {id:3,text:'當我看到有人被占便宜的時候，我覺得想要保護他們。',reverse:false},
  {id:4,text:'他人的不幸通常並不會造成我的困擾。',reverse:true},
  {id:5,text:'當我看見某人受到不公平對待，我有時並不憐憫他們。',reverse:true},
  {id:6,text:'我常因為看見的事情而感動。',reverse:false},
  {id:7,text:'我認為自己是個相當心軟的人。',reverse:false}
];
export function scoreConcern(answers){
  if(!Array.isArray(answers)||answers.length!==7||answers.some(x=>!Number.isInteger(x)||x<1||x>5))throw new Error('請完成全部 7 題，每題選擇 1–5。');
  const values=answers.map((v,i)=>items[i].reverse?6-v:v);
  const total=values.reduce((a,b)=>a+b,0);
  return {values,total,mean:total/7};
}
