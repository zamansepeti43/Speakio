(()=>{'use strict';
const KEY='speakio_state_v3';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}};
const write=s=>localStorage.setItem(KEY,JSON.stringify(s));
const today=()=>{const d=new Date();return d.toISOString().slice(0,10)};
const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
const norm=s=>String(s??'').toLowerCase().trim().replace(/[^a-z0-9ğüşıöçâîû]+/gi,' ').replace(/\s+/g,' ');
try{
 let s=read();
 if(s){
  s.completed=[...new Set((s.completed||[]).map(Number).filter(Number.isFinite))];
  s.savedWords=[...new Set(s.savedWords||[])]; s.knownWords=[...new Set(s.knownWords||[])];
  s.mistakes=(s.mistakes||[]).slice(-30); s.review=s.review&&typeof s.review==='object'?s.review:{};
  s.daily=s.daily&&typeof s.daily==='object'?s.daily:{date:'',done:0}; if(typeof s.daily.done!=='number')s.daily.done=0;
  s.lastStudyDate=s.lastStudyDate||''; s.voiceStats=s.voiceStats||{attempts:0,average:0}; write(s);
 }
 if(!window.SpeechRecognition&&!window.webkitSpeechRecognition)document.documentElement.dataset.voiceSupport='false';
 window.addEventListener('error',e=>{if(/SpeechRecognition|speechSynthesis/i.test(String(e.message||'')))console.warn('Speakio voice feature unavailable:',e.message)});

 const originalStart=window.Speakio?.startLesson;
 const originalNext=window.Speakio?.next;
 const originalListenAnswer=window.Speakio?.listenAnswer;
 let replay=false, reviewUnit=null;
 if(originalStart){
  window.Speakio.startLesson=function(id){
   const st=read(); replay=!!st?.completed?.includes(Number(id)); reviewUnit=null;
   originalStart(id);
   if(replay){const el=document.querySelector('.lessonbox'); if(el){const p=document.createElement('div');p.className='hint';p.innerHTML='🔁 <b>Tekrar modu:</b> Bu ders ilerleme ve XP hedefini yeniden saymaz.';el.appendChild(p)}}
  };
 }
 if(originalNext){
  window.Speakio.next=function(){
   const before=read(); const wasReplay=replay; const oldDaily=Number(before?.daily?.done||0),oldXp=Number(before?.xp||0),oldStreak=Number(before?.streak||0);
   originalNext();
   const after=read(); if(!after)return;
   if(wasReplay){after.daily=after.daily||{date:today(),done:0}; after.daily.done=Math.max(0,Number(after.daily.done||0)-1); after.xp=Math.max(0,Number(after.xp||0)-25); write(after); replay=false; const t=document.querySelector('#toast');if(t){t.textContent='Tekrar tamamlandı • XP hedefi korunuyor';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}}
   else if(Number(after.daily?.done||0)>oldDaily){
    const now=today(),last=after.lastStudyDate;
    if(last!==now){if(last){const d=new Date(now+'T00:00:00'),p=new Date(last+'T00:00:00'),days=Math.round((d-p)/86400000);after.streak=days===1?Math.max(1,oldStreak+1):1}else after.streak=Math.max(1,oldStreak||1);after.lastStudyDate=now;write(after)}
   }
  };
 }
 if(originalListenAnswer){
  window.Speakio.listenAnswer=function(i){
   const choices=[...document.querySelectorAll('.listen .choice')].map(x=>x.textContent.trim());
   const audio=document.querySelector('.listen .audio'); const attr=audio?.getAttribute('onclick')||'';
   const m=attr.match(/say\('([\\s\\S]*)'\)/); const correct=m?m[1].replace(/&#39;/g,"'"):'';
   if(!choices.length||!correct){originalListenAnswer(i);return}
   const st=read(); if(norm(choices[i])===norm(correct)){st.listeningDone=Number(st.listeningDone||0)+1;st.xp=Number(st.xp||0)+10;write(st);const t=document.querySelector('#toast');if(t){t.textContent='+10 XP • Dinleme doğru! 🎧';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1600)}}else{const t=document.querySelector('#toast');if(t){t.textContent='Bir kez daha dinle 🎧';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1600)}}
   setTimeout(()=>{window.Speakio.go('listen')},500);
  };
 }

 function scheduleMistakes(){const st=read();if(!st)return;let changed=false;const now=Date.now();st.mistakes=(st.mistakes||[]).map(m=>{if(!m.dueAt){m.dueAt=new Date(now+10*60*1000).toISOString();m.interval=10;m.reps=0;changed=true}return m}).slice(-30);if(changed)write(st)}
 scheduleMistakes(); setInterval(scheduleMistakes,15000);

 const originalGo=window.Speakio?.go;
 if(originalGo){window.Speakio.go=function(v){originalGo(v);if(v==='review')setTimeout(renderReviewMeta,0)}}
 function renderReviewMeta(){const root=document.querySelector('main section');if(!root)return;const st=read();if(!st)return;const now=Date.now();const due=(st.mistakes||[]).filter(m=>!m.dueAt||Date.parse(m.dueAt)<=now).length;const all=(st.mistakes||[]).length;const card=document.createElement('div');card.className='card';card.innerHTML=`<b>⏱️ Akıllı tekrar planı</b><p class="muted">${due} soru şimdi hazır • ${Math.max(0,all-due)} soru sonraki tekrarını bekliyor.</p>`;root.insertBefore(card,root.children[1]||null)}

 const originalListenSpeech=window.Speakio?.listenSpeech;
 if(originalListenSpeech){window.Speakio.listenSpeech=function(){
  const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R){originalListenSpeech();return}
  const st=read();const cards=[...document.querySelectorAll('.practice .bubble')];const prompt=cards.map(x=>x.textContent).join(' ');const r=new R();r.lang='en-US';r.interimResults=false;r.maxAlternatives=1;
  const mic=document.querySelector('#mic');r.onstart=()=>mic?.classList.add('listening');r.onend=()=>mic?.classList.remove('listening');r.onerror=()=>{const t=document.querySelector('#toast');if(t){t.textContent='Mikrofon iznini kontrol et.';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1600)}};
  r.onresult=e=>{const text=e.results[0][0].transcript||'';const p=norm(prompt).split(' ').filter(Boolean);const w=norm(text).split(' ').filter(Boolean);const uniq=[...new Set(p)];const hit=uniq.filter(x=>w.includes(x)).length;const coverage=uniq.length?hit/uniq.length:0;const length=Math.min(1,w.length/8);const score=Math.round((coverage*.7+length*.3)*100);st.conversations=Number(st.conversations||0)+1;st.voiceStats=st.voiceStats||{attempts:0,average:0};st.voiceStats.average=Math.round(((st.voiceStats.average*st.voiceStats.attempts)+score)/(st.voiceStats.attempts+1));st.voiceStats.attempts++;if(score>=70)st.xp=Number(st.xp||0)+5;write(st);renderVoiceResult(text,score)};r.start();
 }}
 function renderVoiceResult(text,score){const sec=document.querySelector('main section');if(!sec)return;const old=sec.querySelector('.voice-result');old?.remove();const box=document.createElement('div');box.className='card voice-result';const label=score>=85?'Mükemmel! 🏆':score>=70?'Çok iyi! 🎉':score>=50?'İyi gidiyorsun 💪':'Bir kez daha deneyelim 🎯';box.innerHTML=`<b>${label}</b><div class="progress"><i style="width:${score}%"></i></div><p><strong>${score}/100</strong> konuşma skoru</p><p class="muted">Söylediğin: “${esc(text)}”</p><small class="muted">İpucu: ${score>=70?'Aynı fikre bir ayrıntı daha ekle.':'Görevdeki ana kelimeleri kullan ve cümleyi biraz uzat.'}</small>`;sec.appendChild(box);window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'})}
}catch(e){console.warn('Speakio runtime hardening skipped',e)}
})();