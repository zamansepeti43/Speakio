(()=>{'use strict';
const KEY='speakio_recovery_v30';
function isBoot(){const app=document.getElementById('app');return !!app&&/AI İngilizce öğretmenin hazırlanıyor/i.test(app.textContent||'')}
function recover(){try{if(window.SpeakioHome?.render&&!isBoot())return true;if(window.Speakio?.render&&!isBoot())return true;const app=document.getElementById('app');if(app&&isBoot()){app.innerHTML='<main><section><div class="card"><h2>Speakio başlatılamadı</h2><p class="muted">Başlangıç dosyaları yüklenemedi. Önbelleği temizleyip yeniden deneyebilirsin.</p><button class="primary full" onclick="location.reload()">Tekrar yükle</button></div></section></main>'}return false}catch(e){console.error('Speakio recovery',e);return false}}
setTimeout(recover,5000);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(recover,5000),{once:true});
})();