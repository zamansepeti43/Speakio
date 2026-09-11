/* Speakio curriculum runtime */
// course-system.js is loaded by index.html after this content loader.
window.SpeakioContent={course:null,ready:false,error:null};
window.SpeakioSelectedLevel=(localStorage.getItem('speakio_level')||'A1').toUpperCase();
const SPEAKIO_CURRICULUM_FILES={A1:'a1-curriculum.json',A2:'a2-curriculum.json',B1:'b1-curriculum.json',B2:'b2-curriculum.json',C1:'c1-curriculum.json'};
const EXERCISES_PER_UNIT=10;
function shuffleCopy(items){return items.slice().sort((a,b)=>a.localeCompare(b));}
function expandExercises(unit){
  const base=Array.isArray(unit.exercises)?unit.exercises.slice():[];
  if(base.length>=EXERCISES_PER_UNIT){unit.exercises=base.slice(0,EXERCISES_PER_UNIT);return unit;}
  const vocab=Array.isArray(unit.vocabulary)?unit.vocabulary:[];
  const sentences=Array.isArray(unit.sentences)?unit.sentences:[];
  const used=new Set(base.map(e=>`${e.type}|${String(e.q||'').trim()}|${String(e.answer||'').trim()}`));
  const add=e=>{const key=`${e.type}|${String(e.q||'').trim()}|${String(e.answer||'').trim()}`;if(!used.has(key)&&unit.exercises.length<EXERCISES_PER_UNIT){unit.exercises.push(e);used.add(key);}};
  if(vocab.length>=4){const v=vocab[0],opts=[v[1],...shuffleCopy(vocab.slice(1,4).map(x=>x[1]))];add({type:'mcq',q:`“${v[0]}” Türkçe ne demek?`,options:opts,answer:0});}
  if(sentences.length>=4){const s=sentences[1],distractors=shuffleCopy(sentences.slice(0,4).map(x=>x[0])).filter(x=>x!==s[0]).slice(0,3);add({type:'mcq',q:'Hangisi doğru İngilizce cümledir?',options:[s[0],...distractors],answer:0});add({type:'translate',q:s[1],answer:s[0]});const s2=sentences[2];add({type:'translate',q:s2[1],answer:s2[0]});const s3=sentences[3];add({type:'build',q:'Cümleyi kur.',parts:s3[0].replace(/[.!?]/g,'').split(/\s+/),answer:s3[0]});const s0=sentences[0];add({type:'build',q:'Cümleyi kur.',parts:s0[0].replace(/[.!?]/g,'').split(/\s+/),answer:s0[0]});}
  if(vocab.length>=8){const v=vocab[4],opts=[v[1],...shuffleCopy(vocab.slice(4,8).map(x=>x[1])).filter(x=>x!==v[1]).slice(0,3)];while(opts.length<4)opts.push('diğer seçenek');add({type:'mcq',q:`“${v[0]}” kelimesinin Türkçesi nedir?`,options:opts.slice(0,4),answer:0});}
  return unit;
}
async function loadCurriculum(){try{const level=Object.prototype.hasOwnProperty.call(SPEAKIO_CURRICULUM_FILES,window.SpeakioSelectedLevel)?window.SpeakioSelectedLevel:'A1';const res=await fetch('./content/'+SPEAKIO_CURRICULUM_FILES[level],{cache:'no-store'});if(!res.ok)throw new Error('Curriculum HTTP '+res.status);const data=await res.json();if(!data?.course||!Array.isArray(data?.units)||!data.units.length)throw new Error('Invalid curriculum schema');data.units.forEach(expandExercises);window.SpeakioContent.course=data;window.SpeakioContent.ready=true;window.SpeakioContent.level=level;window.dispatchEvent(new CustomEvent('speakio:content-ready',{detail:data}));return data;}catch(err){window.SpeakioContent.error=String(err);window.dispatchEvent(new CustomEvent('speakio:content-error',{detail:String(err)}));return null;}}
window.SpeakioContentReady=(()=>{if(document.readyState==='loading')return new Promise(resolve=>document.addEventListener('DOMContentLoaded',()=>resolve(loadCurriculum()),{once:true}));return loadCurriculum()})();
window.getSpeakioUnit=id=>window.SpeakioContent.course?.units?.find(u=>Number(u.id)===Number(id))||null;
window.getSpeakioUnits=()=>window.SpeakioContent.course?.units||[];
window.getSpeakioVocabulary=()=>window.getSpeakioUnits().flatMap(u=>(u.vocabulary||[]).map(v=>({unitId:u.id,unit:u.title,en:v[0],tr:v[1]})));
window.getSpeakioListening=()=>window.getSpeakioUnits().flatMap(u=>(u.listening||[]).map(text=>({unitId:u.id,unit:u.title,text})));
window.getSpeakioSpeaking=()=>window.getSpeakioUnits().flatMap(u=>(u.speaking||[]).map(prompt=>({unitId:u.id,unit:u.title,prompt})));
window.getSpeakioExercises=id=>window.getSpeakioUnit(id)?.exercises||[];
window.getSpeakioDialogue=id=>window.getSpeakioUnit(id)?.dialogue||[];
