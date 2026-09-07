/* Speakio curriculum runtime */
window.SpeakioContent={course:null,ready:false,error:null};
window.SpeakioContentReady=(async()=>{
  try{
    const res=await fetch('./content/a1-curriculum.json',{cache:'no-store'});
    if(!res.ok) throw new Error('Curriculum HTTP '+res.status);
    const data=await res.json();
    if(!data?.course||!Array.isArray(data?.units)) throw new Error('Invalid curriculum schema');
    window.SpeakioContent.course=data;
    window.SpeakioContent.ready=true;
    window.dispatchEvent(new CustomEvent('speakio:content-ready',{detail:data}));
    return data;
  }catch(err){
    window.SpeakioContent.error=String(err);
    window.dispatchEvent(new CustomEvent('speakio:content-error',{detail:String(err}));
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
/* Load hardening after the main app script has initialized. */
setTimeout(()=>{const s=document.createElement('script');s.src='./runtime-fixes.js?v=1';s.defer=true;document.head.appendChild(s)},0);