(()=>{'use strict';
const KEY='speakio_recovery_v18';
const render=()=>{try{if(window.Speakio?.render && window.SpeakioContent?.ready){window.Speakio.render();return true}}catch(e){console.error('Speakio render recovery',e)}return false};
const recover=async()=>{
  try{
    if(window.SpeakioContent?.ready){render();return}
    if(window.SpeakioContentReady) await Promise.race([window.SpeakioContentReady,new Promise((_,reject)=>setTimeout(()=>reject(new Error('content timeout')),8000))]);
    if(render())return;
    throw new Error('Speakio app did not initialize');
  }catch(e){
    console.error('Speakio boot recovery',e);
    const app=document.getElementById('app');
    if(app && /yükleniyor/i.test(app.textContent||'')){
      app.innerHTML='<section class="screen"><div class="card"><h2>Speakio başlatılamadı</h2><p class="muted">Uygulama önbelleği yenileniyor. Lütfen bir kez daha aç.</p><button class="primary full" onclick="location.reload()">Tekrar yükle</button></div></section>';
    }
  }
};
window.addEventListener('speakio:content-ready',()=>setTimeout(render,0));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(recover,0),{once:true});else setTimeout(recover,0);
if('serviceWorker' in navigator){
  let wasControlled=!!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{
    if(wasControlled){location.reload();return}
    wasControlled=true;
  });
  if(!localStorage.getItem(KEY)){
    localStorage.setItem(KEY,'1');
    navigator.serviceWorker.getRegistrations().then(rs=>Promise.all(rs.map(r=>r.update().catch(()=>{})))).catch(()=>{});
  }
}
})();
