(()=>{'use strict';
const $=s=>document.querySelector(s);
function decorateHome(){const root=$('#app');if(!root||root.dataset.speakioUi==='home')return;const h1=root.querySelector('.hero h1');if(!h1)return;root.dataset.speakioUi='home';const hero=root.querySelector('.hero');if(hero)hero.querySelector('p')?.replaceChildren(document.createTextNode('Bugün 10 dakikada İngilizceni geliştir.'));const stats=root.querySelector('.stats');const ai=document.createElement('div');ai.className='ai-tutor';ai.innerHTML='<div class="ai-top"><div class="ai-face">🤖</div><div><span class="coach-chip">✨ AI ENGLISH TUTOR</span><h3>Bugünkü konuşma pratiğin hazır</h3><p>Seviyene göre gerçek hayat konuşmaları ve anında geri bildirim.</p></div></div><button onclick="Speakio.go(\'speak\')">AI öğretmenle konuş →</button>';if(stats)stats.after(ai);const quick=root.querySelector('.section b');if(quick&&quick.textContent.includes('Hızlı'))quick.textContent='Bugün ne çalışmak istersin?';}
function bootWatch(){const obs=new MutationObserver(()=>decorateHome());obs.observe(document.documentElement,{childList:true,subtree:true});decorateHome();}
window.addEventListener('speakio:content-ready',()=>setTimeout(decorateHome,0));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootWatch,{once:true});else bootWatch();
})();
