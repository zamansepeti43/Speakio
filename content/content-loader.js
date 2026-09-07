/* Speakio curriculum runtime */
window.SpeakioContent={course:null,ready:false,error:null};
window.SpeakioSelectedLevel=localStorage.getItem('speakio_level')||'A1';
window.SpeakioContentReady=(async()=>{
  try{
    const level=String(window.SpeakioSelectedLevel).toUpperCase()==='A2'?'A2':'A1';
    const file=level==='A2'?'a2-curriculum.json':'a1-curriculum.json';
    const res=await fetch('./content/'+file,{cache:'no-store'});
    if(!res.ok) throw new Error('Curriculum HTTP '+res.status);
    const data=await res.json();
    if(!data?.course||!Array.isArray(data?.units)||!data.units.length) throw new Error('Invalid curriculum schema');
    window.SpeakioContent.course=data;
    window.SpeakioContent.ready=true;
    window.SpeakioContent.level=level;
    window.dispatchEvent(new CustomEvent('speakio:content-ready',{detail:data}));
    return data;
  }catch(err){
    window.SpeakioContent.error=String(err);
    window.dispatchEvent(new CustomEvent('speakio:content-error',{detail:String(err)}));
    return null;
  }
})();
window.getSpeakioUnit=id=>window.SpeakioContent.course?.units?.find(u=>Number(u.id)===Number(id))||null;
window.getSpeakioUnits=()=>window.SpeakioContent.course?.units||[];
window.getSpeakioVocabulary=()=>window.getSpeakioUnits().flatMap(u=>(u.vocabulary||[]).map(v=>({unitId:u.id,unit:u.title,en:v[0],tr:v[1]})));
window.getSpeakioListening=()=>window.getSpeakioUnits().flatMap(u=>(u.listening||[]).map(text=>({unitId:u.id,unit:u.title,text})));
window.getSpeakioSpeaking=()=>window.getSpeakioUnits().flatMap(u=>(u.speaking||[]).map(prompt=>({unitId:u.id,unit:u.title,prompt})));
window.getSpeakioExercises=id=>window.getSpeakioUnit(id)?.exercises||[];
window.getSpeakioDialogue=id=>window.getSpeakioUnit(id)?.dialogue||[];
setTimeout(()=>{['runtime-fixes.js?v=3','build-fix.js?v=3'].forEach(src=>{const s=document.createElement('script');s.src=src;s.defer=true;document.head.appendChild(s)})},0);