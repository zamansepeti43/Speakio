(()=>{'use strict';
const KEY='speakio_state_v3',LEVEL='speakio_level',PROGRESS='speakio_course_progress_v1';
const getLevel=()=>String(localStorage.getItem(LEVEL)||'A1').toUpperCase()==='A2'?'A2':'A1';
function readState(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
function writeState(s){localStorage.setItem(KEY,JSON.stringify(s))}
function readProgress(){try{return JSON.parse(localStorage.getItem(PROGRESS)||'{}')}catch{return {}}}
function switchLevel(level){level=String(level).toUpperCase();if(!['A1','A2'].includes(level)||level===getLevel())return;const s=readState(),p=readProgress(),current=getLevel();p[current]={completed:Array.isArray(s.completed)?s.completed:[],xp:Number(s.xp||0),lastStudyDate:s.lastStudyDate||''};const target=p[level]||{completed:[],xp:0,lastStudyDate:''};s.completed=Array.from(new Set(target.completed||[])).map(Number);s.xp=Number(target.xp||0);s.lastStudyDate=target.lastStudyDate||'';localStorage.setItem(PROGRESS,JSON.stringify(p));writeState(s);localStorage.setItem(LEVEL,level);location.reload()}
window.SpeakioCourse={level:getLevel,switch:switchLevel,progress:()=>readProgress()};
function inject(){const root=document.querySelector('main section');if(!root||root.querySelector('.course-switcher'))return;const level=getLevel(),box=document.createElement('div');box.className='card course-switcher';box.innerHTML='<div class="row"><div><b>🎓 Öğrenme seviyen</b><p class="muted">Seviyeni seç; her seviyenin ilerlemesi ayrı tutulur.</p></div><span class="pill">'+level+'</span></div><div class="level-tabs"><button class="secondary '+(level==='A1'?'selected':'')+'" data-level="A1">A1 · Başlangıç</button><button class="secondary '+(level==='A2'?'selected':'')+'" data-level="A2">A2 · Temel</button></div>';
box.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>switchLevel(b.dataset.level));root.insertBefore(box,root.children[1]||null)}
function hook(){const api=window.Speakio;if(!api?.go)return;const old=api.go;api.go=function(v){old(v);setTimeout(inject,30)}}
hook();window.addEventListener('speakio:content-ready',()=>setTimeout(inject,50));setTimeout(inject,150);
})();