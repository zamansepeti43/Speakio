(()=>{'use strict';
const KEY='speakio_state_v3',LEVEL='speakio_level',PROGRESS='speakio_course_progress_v2';
const CATALOG=[
 {id:'A1',name:'Başlangıç',file:'a1-curriculum.json',free:true},
 {id:'A2',name:'Temel',file:'a2-curriculum.json',free:false,requires:'A1'},
 {id:'B1',name:'Orta',file:'b1-curriculum.json',free:false,requires:'A2'},
 {id:'B2',name:'Orta-Üstü',file:'b2-curriculum.json',free:false,requires:'B1'},
 {id:'C1',name:'İleri',file:'c1-curriculum.json',free:false,requires:'B2'}
];
const LEVELS=CATALOG.map(x=>x.id), getLevel=()=>{const x=String(localStorage.getItem(LEVEL)||'A1').toUpperCase();return LEVELS.includes(x)?x:'A1'};
const read=key=>{try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return {}}};
const write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
const readState=()=>read(KEY),writeState=s=>write(KEY,s),readProgress=()=>read(PROGRESS);
const cleanLearning=s=>({xp:Number(s?.xp||0),streak:Number(s?.streak||0),completed:Array.isArray(s?.completed)?Array.from(new Set(s.completed.map(Number))):[],week:Array.isArray(s?.week)?s.week.slice(-7):[0,0,0,0,0,0,0],listeningDone:Number(s?.listeningDone||0),conversations:Number(s?.conversations||0),mistakes:Array.isArray(s?.mistakes)?s.mistakes.slice(-30):[],review:s?.review&&typeof s.review==='object'?s.review:{},daily:s?.daily&&typeof s.daily==='object'?s.daily:{date:'',done:0,listening:0,speaking:0},lastStudyDate:s?.lastStudyDate||'',voiceStats:s?.voiceStats&&typeof s.voiceStats==='object'?s.voiceStats:{attempts:0,average:0},savedWords:Array.isArray(s?.savedWords)?s.savedWords:[],knownWords:Array.isArray(s?.knownWords)?s.knownWords:[]});
const mergeLearning=(s,l)=>{const n={...s,...l};n.completed=l.completed||[];n.mistakes=l.mistakes||[];n.review=l.review||{};n.daily=l.daily||{date:'',done:0,listening:0,speaking:0};n.week=l.week||[0,0,0,0,0,0,0];n.voiceStats=l.voiceStats||{attempts:0,average:0};n.savedWords=l.savedWords||[];n.knownWords=l.knownWords||[];return n};
function progress(){return readProgress()}
function migrate(){const s=readState(),p=progress();if(!p.__migrated){p[getLevel()]=cleanLearning(s);p.__migrated=true;write(PROGRESS,p)}return p}
function completion(level){const p=migrate(),entry=p[level];const total=12;return entry?Math.round(Math.min(1,entry.completed.length/total)*100):0}
function unlocked(level){const item=CATALOG.find(x=>x.id===level);if(!item)return false;if(!item.requires)return true;return completion(item.requires)>=100}
function unitUnlocked(id){id=Number(id);if(!Number.isInteger(id)||id<1||id>12)return false;if(id===1)return true;const s=readState();const done=Array.isArray(s.completed)?s.completed.map(Number):[];return done.includes(id-1)}
function switchLevel(level){level=String(level).toUpperCase();if(!LEVELS.includes(level)||level===getLevel())return;if(!unlocked(level)){toast('Önce '+level+' öncesindeki seviyeyi tamamla. 🔒');return}
 const s=readState(),p=migrate(),current=getLevel();p[current]=cleanLearning(s);const target=p[level]||cleanLearning({});write(PROGRESS,p);writeState(mergeLearning(s,target));localStorage.setItem(LEVEL,level);location.reload()}
function toast(t){const e=document.querySelector('#toast');if(e){e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1800)}}
function patchUI(){const level=getLevel(),item=CATALOG.find(x=>x.id===level)||CATALOG[0];
 document.querySelectorAll('.courseHead b').forEach(e=>e.textContent='İngilizce '+level);
 document.querySelectorAll('.course-switcher .pill').forEach(e=>e.textContent=level);
 document.querySelectorAll('.course-switcher [data-level]').forEach(b=>{const l=b.dataset.level;b.disabled=!unlocked(l);b.classList.toggle('selected',l===level);if(!unlocked(l))b.setAttribute('title','Önceki seviyeyi tamamla')});
 document.querySelectorAll('.pron').forEach(e=>{const txt=e.textContent.replace(/^A[12]/,'').replace(/^B[12]/,'').replace(/^C1/,'');e.textContent=level+' •'+txt});
 document.querySelectorAll('.card .row b').forEach(e=>{if(/Yolculuğun$/.test(e.textContent))e.textContent='🎯 '+level+' Yolculuğun';if(/ilerlemesi$/.test(e.textContent))e.textContent='📈 '+level+' ilerlemesi'});
 document.querySelectorAll('header b').forEach(e=>{if(/Kursu$/.test(e.textContent))e.textContent=level+' Kursu'});
 const desc=document.querySelector('.course-switcher p.muted');if(desc)desc.textContent=level+' seviyesindeki ilerlemen ayrı tutulur.';
 document.querySelectorAll('.lesson[data-unit],button.lesson').forEach(el=>{const m=el.dataset.unit||el.getAttribute('data-id');if(!m)return;const ok=unitUnlocked(m);el.classList.toggle('locked',!ok);el.setAttribute('aria-disabled',String(!ok));if(!ok)el.title='Önceki bölümü tamamla 🔒')});
}
function inject(){const root=document.querySelector('main section');if(!root)return;let box=root.querySelector('.course-switcher');if(!box){box=document.createElement('div');box.className='card course-switcher';root.insertBefore(box,root.children[1]||null)}const level=getLevel();box.innerHTML='<div class="row"><div><b>🎓 Öğrenme seviyen</b><p class="muted">Seviyeni seç; ilerlemen seviyeye göre ayrı tutulur.</p></div><span class="pill">'+level+'</span></div><div class="level-tabs">'+CATALOG.map(x=>'<button class="secondary" data-level="'+x.id+'" '+(unlocked(x.id)?'':'disabled')+'>'+x.id+' · '+x.name+(unlocked(x.id)?'':' 🔒')+'</button>').join('')+'</div>';
 box.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>switchLevel(b.dataset.level));patchUI()}
window.SpeakioCourse={level:getLevel,switch:switchLevel,progress:progress,catalog:()=>CATALOG.map(x=>({...x,unlocked:unlocked(x.id),completion:completion(x.id)})),isUnlocked:unlocked,isUnitUnlocked:unitUnlocked};
function hook(){const api=window.Speakio;if(!api?.go)return;const old=api.go;api.go=function(v){old(v);setTimeout(()=>{inject();patchUI()},40)};
 const start=api.startLesson;if(start){api.startLesson=function(id){if(!unitUnlocked(id)){toast('🔒 Önceki bölümü tamamla.');return false}return start(id)}}}
setTimeout(()=>{migrate();hook();inject()},180);window.addEventListener('speakio:content-ready',()=>setTimeout(()=>{inject();patchUI();hook()},80));
new MutationObserver(()=>patchUI()).observe(document.documentElement,{childList:true,subtree:true});
})();