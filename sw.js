const VERSION='20';
const CACHE='speakio-v'+VERSION;
const CORE=['./index.html','./app.js','./runtime-fixes.js','./build-fix.js','./course-system.js','./premium.js','./premium-ui.js','./manifest.json','./content/a1-curriculum.json','./content/a2-curriculum.json','./content/b1-curriculum.json','./content/b2-curriculum.json','./content/c1-curriculum.json','./content/content-loader.js'];
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.map(key=>caches.delete(key)));
  await self.clients.claim();
  await self.registration.unregister();
})()));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(fetch(event.request,{cache:'no-store'}));
});
