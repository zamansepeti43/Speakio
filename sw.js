const VERSION='18';
const CACHE='speakio-v'+VERSION;
const CORE=['./','./index.html','./app.js','./runtime-fixes.js?v=4','./build-fix.js?v=3','./course-system.js?v=2','./premium.js','./premium-ui.js','./manifest.json','./content/content-loader.js','./content/a1-curriculum.json','./content/a2-curriculum.json','./content/b1-curriculum.json','./content/b2-curriculum.json','./content/c1-curriculum.json'];
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);await Promise.all(CORE.map(async url=>{try{const r=await fetch(url,{cache:'reload'});if(r.ok)await c.put(url,r)}catch(_){}});await self.skipWaiting()})()));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{})}return res}).catch(()=>e.request.mode==='navigate'?caches.match('./index.html'):undefined)))})
