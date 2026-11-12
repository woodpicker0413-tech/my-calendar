const C='cal-v3';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
async function notify(){const cl=await self.clients.matchAll();cl.forEach(x=>x.postMessage('update'))}
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
if(e.request.method!=='GET'||u.pathname.startsWith('/__/'))return;
if(!(u.origin===location.origin||u.hostname==='www.gstatic.com'||u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'))return;
const doc=e.request.mode==='navigate'||u.pathname.endsWith('.html');
e.respondWith(caches.open(C).then(async c=>{const hit=await c.match(e.request);
const net=fetch(e.request,{cache:'no-cache'}).then(async r=>{if(r.ok||r.type==='opaque'){if(hit&&doc){try{const t=await Promise.all([hit.clone().text(),r.clone().text()]);if(t[0]!==t[1])notify()}catch(_){}}c.put(e.request,r.clone())}return r}).catch(()=>null);
if(hit){e.waitUntil(net);return hit}
return (await net)||Response.error()}))});
