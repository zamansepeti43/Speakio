(()=>{'use strict';
const original=window.Speakio?.startLesson;
if(!original)return;
window.Speakio.startLesson=function(id){original(id);setTimeout(()=>{try{const units=typeof getSpeakioUnits==='function'?getSpeakioUnits():[],u=units.find(x=>Number(x.id)===Number(id)),z=u?.exercises?.[0];if(!u||!z||z.type!=='build')return;const box=document.querySelector('.lessonbox');if(!box)return;const parts=z.parts||z.words||String(z.answer||'').split(' ');const old=[...box.querySelectorAll('.answer')];if(!old.length)return;old.forEach((b,i)=>{if(parts[i])b.textContent=parts[i]});}catch(e){console.warn('Speakio build fix',e)}},30)};
})();