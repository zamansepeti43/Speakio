import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT=path.dirname(fileURLToPath(import.meta.url));
const PORT=Number(process.env.PORT||4173);
const TYPES={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8'};
function fileFor(urlPath){const clean=decodeURIComponent(String(urlPath||'/').split('?')[0]).replace(/^\/+/,'');const target=path.resolve(ROOT,clean||'index.html');if(!target.startsWith(ROOT+path.sep))return null;return target}
const server=http.createServer((req,res)=>{const target=fileFor(req.url);if(!target)return res.writeHead(403).end('Forbidden');fs.stat(target,(err,stat)=>{if(err||!stat.isFile())return res.writeHead(404).end('Not found');res.setHeader('Content-Type',TYPES[path.extname(target).toLowerCase()]||'application/octet-stream');fs.createReadStream(target).pipe(res)})});
server.listen(PORT,()=>console.log(`Speakio local: http://localhost:${PORT}`));
