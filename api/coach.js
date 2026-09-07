export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 const {prompt='',transcript='',level='A1'}=req.body||{};
 const base=process.env.AI_API_URL;
 const key=process.env.AI_API_KEY;
 const model=process.env.AI_MODEL||'gpt-4o-mini';
 if(!base||!key)return res.status(204).end();
 try{
  const r=await fetch(base,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${key}`},body:JSON.stringify({model,messages:[{role:'system',content:`You are Speakio Coach. Help a Turkish A1 English learner. Be encouraging, concise, correct the most important mistake, and give one natural improved sentence. Respond in Turkish except for English examples.`},{role:'user',content:`Level: ${level}\nTask: ${prompt}\nLearner said: ${transcript}`}],temperature:.4,max_tokens:220})});
  if(!r.ok)return res.status(204).end();
  const data=await r.json();
  const text=data?.choices?.[0]?.message?.content||data?.output?.[0]?.content?.[0]?.text||'';
  return res.status(200).json({text:String(text).slice(0,1600)});
 }catch(e){return res.status(204).end()}
}