(()=>{'use strict';
const CLEAN='speakio_legacy_sw_clean_v2';
async function cleanLegacyWorker(){
  try{
    if(!('serviceWorker' in navigator))return;
    const regs=await navigator.serviceWorker.getRegistrations();
    const hadController=!!navigator.serviceWorker.controller;
    if(regs.length)await Promise.all(regs.map(r=>r.unregister().catch(()=>false)));
    if('caches' in window){const keys=await caches.keys();await Promise.all(keys.map(k=>caches.delete(k)));}
    if(hadController&&!sessionStorage.getItem(CLEAN)){
      sessionStorage.setItem(CLEAN,'1');
      location.reload();
      return;
    }
    sessionStorage.removeItem(CLEAN);
  }catch(e){console.warn('Speakio legacy SW cleanup',e)}
}
cleanLegacyWorker();
const original=window.Speakio?.startLesson;
const patch=()=>{try{const box=document.querySelector('.lessonbox');if(!box)return;const pill=box.querySelector('.pill');if(!pill||pill.textContent.trim()!=='BUILD')return;const meta=document.querySelector('.lessonMeta span');const idx=Math.max(0,(parseInt(meta?.textContent||'1',10)||1)-1);const units=typeof getSpeakioUnits==='function'?getSpeakioUnits():[];const title=document.querySelector('header b')?.textContent?.trim();const u=units.find(x=>x.title===title);const z=u?.exercises?.[idx];if(!z)return;const parts=z.parts||z.words||String(z.answer||'').split(' ');const buttons=[...box.querySelectorAll('.answer')];parts.forEach((p,i)=>{if(buttons[i]){buttons[i].textContent=p;buttons[i].disabled=false;buttons[i].style.opacity='1'}})}catch(e){console.warn('Speakio build fix',e)}};
if(original)window.Speakio.startLesson=function(id){original(id);setTimeout(patch,50)};
new MutationObserver(()=>setTimeout(patch,0)).observe(document.body,{childList:true,subtree:true});
})();