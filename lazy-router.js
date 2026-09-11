(()=>{'use strict';
const needsContent=new Set(['lessons','lesson','result','review','words','listen','speak','grammar','analytics','achievements']);
let hooked=false;
function hook(){const api=window.Speakio;if(!api||hooked)return;hooked=true;const oldGo=api.go,oldStart=api.startLesson;const ensure=()=>window.SpeakioContent?.ready?Promise.resolve(window.SpeakioContent.course):window.SpeakioLoadCurriculum();api.go=async function(target){if(target==='home'){window.SpeakioHome?.render?.();return}if(needsContent.has(target)){try{await ensure()}catch(e){console.error('Speakio lazy content',e);return}}return oldGo(target)};api.startLesson=async function(id){try{await ensure()}catch(e){console.error('Speakio lazy lesson',e);return}return oldStart(id)};api.__lazyRouter=true;window.SpeakioLazy={ensure};}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook,{once:true});else hook();
setTimeout(hook,0);
})();