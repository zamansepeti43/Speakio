(()=>{'use strict';
const KEY='speakio_premium_v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{"active":false,"plan":"free"}')}catch{return {active:false,plan:'free'}}};
const state=read();
window.SpeakioPremium={
 isPremium:()=>!!state.active,
 plan:()=>state.plan||'free',
 has:(feature)=>!!state.active,
 activateLocal:(plan='pro')=>{state.active=true;state.plan=plan;localStorage.setItem(KEY,JSON.stringify(state));location.reload()},
 deactivate:()=>{state.active=false;state.plan='free';localStorage.setItem(KEY,JSON.stringify(state));location.reload()}
};
})();