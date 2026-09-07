(()=>{'use strict';
const KEY='speakio_state_v3';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}};
const write=s=>localStorage.setItem(KEY,JSON.stringify(s));
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const norm=s=>String(s??'').toLowerCase().trim().replace(/[^a-z0-9ğüşıöçâîû]+/gi,' ').replace(/\s+/g,' ');
const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
const toast=t=>{const e=document.querySelector('#toast');if(e){e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1700)}};
try{
 let s=read();
 if(s){
  s.completed=[...new Set((s.completed||[]).map(Number).filter(Number.isFinite))];
  s.savedWords=[...new Set(s.savedWords||[])];s.knownWords=[...new Set(s.knownWords||[])];
  s.mistakes=(s.mistakes||[]).slice(-50);s.review=s.review&&typeof s.review==='object'?s.review:{};
  s.daily=s.daily&&typeof s.daily==='object'?s.daily:{date:today(),done:0,listening:0,speaking:0};
  if(s.daily.date!==today())s.daily={date:today(),done:0,listening:0,speaking:0};
  s.daily.done=Number(s.daily.done||0);s.daily.listening=Number(s.daily.listening||0);s.daily.speaking=Number(s.daily.speaking||0);
  s.lastStudyDate=s.lastStudyDate||'';s.voiceStats=s.voiceStats||{attempts:0,average:0};write(s)
 }
 if(!window.SpeechRecognition&&!window.webkitSpeechRecognition)document.documentElement.dataset.voiceSupport='false';
 let replay=false,sessionScore=0,sessionTotal=0,currentLesson=0,exerciseIndex=0,buildFix=[];
 const curriculum=()=>typeof getSpeakioUnits==='function'?getSpeakioUnits():[];
 const unit=()=>curriculum().find(u=>Number(u.id)===currentLesson);
 const currentExercise=()=>{const a=unit()?.exercises||[];return a.length?a[exerciseIndex%a.length]:null};
 const originalStart=window.Speakio?.startLesson,originalNext=window.Speakio?.next,originalGo=window.Speakio?.go;
 const ensureDaily=st=>{if(!st.daily||st.daily.date!==today())st.daily={date:today(),done:0,listening:0,speaking:0};return st.daily};
 const markStudy=st=>{const now=today(),last=st.lastStudyDate;if(last!==now){let streak=Number(st.streak||0);if(last){const a=new Date(last+'T00:00:00'),b=new Date(now+'T00:00:00'),days=Math.round((b-a)/86400000);streak=days===1?streak+1:1}else streak=Math.max(1,streak);st.streak=streak;st.lastStudyDate=now;return true}return false};
 const mistakeKey=z=>`${currentLesson}|${norm(z?.q||z?.question||z?.prompt||'')}`;
 const answerText=z=>Array.isArray(z?.options)&&typeof z?.answer==='number'?z.options[z.answer]:String(z?.answer??'');
 const schedule=(z,correct)=>{
  const st=read();if(!st||!z)return;
  const key=mistakeKey(z),now=Date.now(),idx=(st.mistakes||[]).findIndex(m=>m.key===key);
  if(correct){
   if(idx>=0){const m=st.mistakes[idx],reps=Number(m.reps||0)+1,steps=[1,3,7,14,30],interval=steps[Math.min(reps-1,steps.length-1)];m.reps=reps;m.interval=interval;m.dueAt=new Date(now+interval*86400000).toISOString();m.lastResult='correct'}
  }else{
   const m=idx>=0?st.mistakes[idx]:{key,unitId:currentLesson,question:z.q||z.question||z.prompt||'',answer:answerText(z),reps:0,interval:10};
   m.dueAt=new Date(now+10*60*1000).toISOString();m.lastResult='wrong';
   if(idx<0)st.mistakes.push(m);else st.mistakes[idx]=m;
   st.mistakes=st.mistakes.slice(-50)
  }
  write(st)
 };
 if(originalStart)window.Speakio.startLesson=function(id){const st=read();replay=!!st?.completed?.includes(Number(id));currentLesson=Number(id);exerciseIndex=0;sessionScore=0;sessionTotal=0;buildFix=[];originalStart(id);setTimeout(()=>{sessionTotal=unit()?.exercises?.length||0;if(replay){const el=document.querySelector('.lessonbox');if(el&&!el.querySelector('.replay-hint')){const p=document.createElement('div');p.className='hint replay-hint';p.innerHTML='🔁 <b>Tekrar modu:</b> Bu ders XP ve günlük hedefi yeniden saymaz.';el.appendChild(p)}}},0)};
 if(originalNext)window.Speakio.next=function(){const before=read(),wasReplay=replay,oldDaily=Number(before?.daily?.done||0),oldXp=Number(before?.xp||0);originalNext();const after=read();if(!after)return;ensureDaily(after);
  if(wasReplay){after.daily.done=Math.max(0,Number(after.daily.done||0)-1);after.xp=Math.max(0,Number(after.xp||0)-25);write(after);replay=false;toast('Tekrar tamamlandı • XP ve hedef korunuyor')}
  else if(Number(after.daily?.done||0)>oldDaily){markStudy(after);write(after)}
  exerciseIndex++;
  setTimeout(()=>{const hero=document.querySelector('.resultHero');if(hero){const card=hero.parentElement?.querySelector('.card');if(card){const total=sessionTotal||1,pct=Math.round(sessionScore/total*100);card.innerHTML=`<b>${sessionScore}/${total} doğru</b><div class="progress"><i style="width:${pct}%"></i></div><p class="muted">${pct>=90?'Mükemmel hakimiyet.':pct>=70?'Çok iyi. Birkaç noktayı daha pekiştirelim.':'Tekrarla birlikte hızla güçlenecek.'}</p>`}}},0)
 };
 const recordWrong=z=>schedule(z,false);
 const originalAnswer=window.Speakio?.answer;
 if(originalAnswer)window.Speakio.answer=function(i){const z=currentExercise(),buttons=[...document.querySelectorAll('.lessonbox .answer')];const opts=buttons.map(x=>x.textContent.trim());if(!z||!buttons.length){originalAnswer(i);return}const correct=typeof z.answer==='number'?Number(i)===Number(z.answer):norm(opts[i])===norm(z.answer);if(correct)sessionScore++;schedule(z,correct);buttons.forEach((b,j)=>{b.disabled=true;if(j===Number(z.answer))b.classList.add('selected');if(j===i&&!correct)b.classList.add('wrong')});toast(correct?'Doğru! 🎉':'Tekrar edeceğiz 💪');setTimeout(()=>window.Speakio.next(),350)};
 const originalText=window.Speakio?.checkText;
 if(originalText)window.Speakio.checkText=function(){const z=currentExercise(),v=document.querySelector('#answer')?.value||'';if(!z){originalText();return}const answers=Array.isArray(z.answers)?z.answers:[z.answer],correct=answers.some(x=>norm(x)===norm(v));if(correct)sessionScore++;schedule(z,correct);toast(correct?'Doğru! 🎉':'Cevabı tekrar et 💪');setTimeout(()=>window.Speakio.next(),350)};
 const originalAdd=window.Speakio?.addWord,originalBuild=window.Speakio?.checkBuild;
 if(originalAdd)window.Speakio.addWord=function(i){const z=currentExercise(),parts=z?.parts||z?.words||[];const b=[...document.querySelectorAll('.lessonbox .answer')][i];if(!b||!parts[i])return;buildFix.push(parts[i]);const h=document.querySelector('.lessonbox .hint');if(h)h.textContent=buildFix.join(' ');b.disabled=true;b.style.opacity='.45};
 if(originalBuild)window.Speakio.checkBuild=function(){const z=currentExercise(),correct=!!z&&norm(buildFix.join(' '))===norm(z.answer||'');if(correct)sessionScore++;if(z)schedule(z,correct);toast(correct?'Doğru! 🎉':'Cümleyi tekrar deneyeceğiz 💪');buildFix=[];setTimeout(()=>window.Speakio.next(),350)};
 const originalListen=window.Speakio?.listenAnswer;
 if(originalListen)window.Speakio.listenAnswer=function(i){const choices=[...document.querySelectorAll('.listen .choice')].map(x=>x.textContent.trim()),audio=document.querySelector('.listen .audio'),attr=audio?.getAttribute('onclick')||'',m=attr.match(/say\('([\s\S]*)'\)/),correct=m?m[1].replace(/&#39;/g,"'"):'';if(!choices.length||!correct){originalListen(i);return}const st=read();ensureDaily(st);if(norm(choices[i])===norm(correct)){st.listeningDone=Number(st.listeningDone||0)+1;st.xp=Number(st.xp||0)+10;st.daily.listening=Math.min(1,st.daily.listening+1);markStudy(st);write(st);toast('+10 XP • Dinleme doğru! 🎧')}else toast('Bir kez daha dinle 🎧');setTimeout(()=>window.Speakio.go('listen'),500)};
 if(originalGo)window.Speakio.go=function(v){originalGo(v);setTimeout(()=>{if(v==='review')renderReviewMeta();if(v==='home')renderHomeTasks();if(v==='settings')renderSettingsTools()},0)};
 function renderReviewMeta(){const root=document.querySelector('main section'),st=read();if(!root||!st)return;root.querySelector('.review-meta')?.remove();const now=Date.now(),all=st.mistakes||[],due=all.filter(m=>!m.dueAt||Date.parse(m.dueAt)<=now),card=document.createElement('div');card.className='card review-meta';card.innerHTML=`<b>⏱️ Akıllı tekrar planı</b><p class="muted">${due.length} soru şimdi hazır • ${Math.max(0,all.length-due.length)} soru bekliyor.</p><small class="muted">Yanlışlar 10 dk sonra; doğru tekrarlar 1 → 3 → 7 → 14 → 30 gün aralıklarla planlanır.</small>`;root.insertBefore(card,root.children[1]||null)}
 function renderHomeTasks(){const root=document.querySelector('main section'),st=read();if(!root||!st)return;ensureDaily(st);root.querySelector('.daily-tasks')?.remove();const d=st.daily,box=document.createElement('div');box.className='card daily-tasks';box.innerHTML=`<div class="row"><b>⚡ Bugünün mini görevleri</b><span>${Math.min(3,(d.done>0?1:0)+d.listening+d.speaking)}/3</span></div><p class="muted">Dersi tamamla · 1 dinleme · 1 konuşma</p><div class="taskline"><span>${d.done>0?'✓':'○'} Ders</span><span>${d.listening?'✓':'○'} Dinleme</span><span>${d.speaking?'✓':'○'} Konuşma</span></div>`;root.insertBefore(box,root.querySelector('.section')||root.firstChild)}
 function renderSettingsTools(){const root=document.querySelector('main section'),st=read();if(!root||!st||root.querySelector('.data-tools'))return;const box=document.createElement('div');box.className='card data-tools';box.innerHTML=`<b>🔐 Verilerin</b><p class="muted">İlerleme bilgilerin bu cihazda tutulur. Yedek almak veya başka cihazda geri yüklemek için kullan.</p><div class="grid"><button class="secondary" id="speakioExport">Dışa aktar</button><button class="secondary" id="speakioImportBtn">İçe aktar</button></div><input id="speakioImport" type="file" accept="application/json" hidden>`;root.appendChild(box);box.querySelector('#speakioExport').onclick=()=>{const blob=new Blob([JSON.stringify(read(),null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='speakio-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};box.querySelector('#speakioImportBtn').onclick=()=>box.querySelector('#speakioImport').click();box.querySelector('#speakioImport').onchange=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const incoming=JSON.parse(r.result);if(!incoming||typeof incoming!=='object'||!Array.isArray(incoming.completed))throw 0;localStorage.setItem(KEY,JSON.stringify({...read(),...incoming}));location.reload()}catch{toast('Geçersiz Speakio yedeği')}};r.readAsText(f)}}}
 const originalVoice=window.Speakio?.listenSpeech;
 if(originalVoice)window.Speakio.listenSpeech=function(){const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R){originalVoice();return}const st=read(),prompt=document.querySelector('.practice .bubble')?.textContent||'',r=new R();r.lang='en-US';r.interimResults=false;r.maxAlternatives=1;const mic=document.querySelector('#mic');r.onstart=()=>mic?.classList.add('listening');r.onend=()=>mic?.classList.remove('listening');r.onerror=()=>toast('Mikrofon iznini kontrol et.');r.onresult=async e=>{const text=e.results[0][0].transcript||'',p=norm(prompt).split(' ').filter(Boolean),w=norm(text).split(' ').filter(Boolean),uniq=[...new Set(p)],hit=uniq.filter(x=>w.includes(x)).length,coverage=uniq.length?hit/uniq.length:0,length=Math.min(1,w.length/8),score=Math.round((coverage*.7+length*.3)*100);ensureDaily(st);st.conversations=Number(st.conversations||0)+1;st.daily.speaking=Math.min(1,st.daily.speaking+1);st.voiceStats=st.voiceStats||{attempts:0,average:0};st.voiceStats.average=Math.round(((st.voiceStats.average*st.voiceStats.attempts)+score)/(st.voiceStats.attempts+1));st.voiceStats.attempts++;if(score>=70)st.xp=Number(st.xp||0)+5;markStudy(st);write(st);renderVoiceResult(text,score,'');try{const ai=await fetch('/api/coach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt,transcript:text,level:'A1'})});if(ai.ok){const data=await ai.json();if(data?.text)renderVoiceResult(text,score,data.text)}}catch{}};r.start()};
 function renderVoiceResult(text,score,ai){const sec=document.querySelector('main section');if(!sec)return;sec.querySelector('.voice-result')?.remove();const box=document.createElement('div');box.className='card voice-result';const label=score>=85?'Mükemmel! 🏆':score>=70?'Çok iyi! 🎉':score>=50?'İyi gidiyorsun 💪':'Bir kez daha deneyelim 🎯';box.innerHTML=`<b>${label}</b><div class="progress"><i style="width:${score}%"></i></div><p><strong>${score}/100</strong> konuşma skoru</p><p class="muted">Söylediğin: “${esc(text)}”</p>${ai?`<div class="hint"><b>🤖 Speakio Coach</b><br>${esc(ai).replace(/\n/g,'<br>')}</div>`:`<small class="muted">${score>=70?'Aynı fikre bir ayrıntı daha ekle.':'Görevdeki ana kelimeleri kullan ve cümleyi biraz uzat.'}</small>`}`;sec.appendChild(box);window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'})}
}catch(e){console.warn('Speakio runtime hardening skipped',e)}
})();