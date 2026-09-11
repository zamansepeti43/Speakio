(()=>{'use strict';
const S=window.Speakio;
if(!S)return;
let route='home';
const originalGo=S.go,originalRender=S.render;
function forceHome(){try{if(route==='home'&&window.SpeakioHome&&window.SpeakioHome.render){window.SpeakioHome.render();return true}}catch(e){console.warn('Speakio home override',e)}return false}
S.go=function(target){route=target;return originalGo(target)};
S.render=function(){if(forceHome())return;return originalRender()};
window.addEventListener('speakio:content-ready',function(){if(route==='home')forceHome()});
setTimeout(forceHome,0);setTimeout(forceHome,100);setTimeout(forceHome,500);setTimeout(forceHome,1200);
new MutationObserver(function(){if(route==='home'&&document.querySelector('#app .hero'))forceHome()}).observe(document.documentElement,{childList:true,subtree:true});
forceHome();
})();
