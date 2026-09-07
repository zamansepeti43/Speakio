(()=>{'use strict';
/* Speakio runtime hardening: safe state migration + browser compatibility. */
try{
 const KEY='speakio_state_v3';
 const s=JSON.parse(localStorage.getItem(KEY)||'null');
 if(s){
   s.completed=[...new Set((s.completed||[]).map(Number).filter(Number.isFinite))];
   s.savedWords=[...new Set(s.savedWords||[])];
   s.knownWords=[...new Set(s.knownWords||[])];
   s.mistakes=(s.mistakes||[]).slice(-30);
   s.daily=s.daily&&typeof s.daily==='object'?s.daily:{date:'',done:0};
   if(typeof s.daily.done!=='number')s.daily.done=0;
   localStorage.setItem(KEY,JSON.stringify(s));
 }
 window.addEventListener('error',e=>{if(/SpeechRecognition|speechSynthesis/i.test(String(e.message||'')))console.warn('Speakio voice feature unavailable:',e.message)});
 if(!window.SpeechRecognition&&!window.webkitSpeechRecognition){
   document.documentElement.dataset.voiceSupport='false';
 }
}catch(e){console.warn('Speakio runtime hardening skipped',e)}
})();