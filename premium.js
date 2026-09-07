(()=>{'use strict';
const KEY='speakio_premium_v2';
const FREE_LIMITS={coach:true,voiceScore:true,review:true,a1:true};
const PLANS={free:{name:'Ücretsiz',features:['A1 kursu','Temel konuşma skoru','Akıllı tekrar']},pro:{name:'Speakio Pro',features:['A1 + gelecek seviyeler','AI Coach','Gelişmiş konuşma geri bildirimi','Sınırsız tekrar']}};
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{"active":false,"plan":"free"}')}catch{return {active:false,plan:'free'}}};
let state=read();
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
window.SpeakioPremium={
 isPremium:()=>!!state.active,
 plan:()=>PLANS[state.plan]?state.plan:'free',
 planInfo:()=>PLANS[state.plan]||PLANS.free,
 has:feature=>state.active||!!FREE_LIMITS[feature],
 can:feature=>state.active||!!FREE_LIMITS[feature],
 activateLocal:(plan='pro')=>{state={active:true,plan:PLANS[plan]?plan:'pro',activatedAt:new Date().toISOString()};save();location.reload()},
 deactivate:()=>{state={active:false,plan:'free'};save();location.reload()},
 status:()=>({...state})
};
})();