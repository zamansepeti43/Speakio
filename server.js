import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const TYPES = {
  '.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.mjs':'application/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml',
  '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif',
  '.ico':'image/x-icon','.txt':'text/plain; charset=utf-8','.webmanifest':'application/manifest+json'
};

function safeFile(urlPath){
  const clean=decodeURIComponent(String(urlPath||'/').split('?')[0]).replace(/^\/+/, '');
  const rel=clean || 'index.html';
  const target=path.resolve(ROOT, rel);
  if(target!==ROOT && !target.startsWith(ROOT+path.sep)) return null;
  return target;
}

function serveFile(req,res,target){
  fs.stat(target,(err,stat)=>{
    if(err || !stat.isFile()) return res.status(404).send('Not found');
    const type=TYPES[path.extname(target).toLowerCase()]||'application/octet-stream';
    res.setHeader('Content-Type',type);
    res.setHeader('Cache-Control','no-store');
    if(req.method==='HEAD') return res.status(200).end();
    fs.createReadStream(target).on('error',()=>res.status(500).end()).pipe(res);
  });
}

export default function handler(req,res){
  if(req.method!=='GET' && req.method!=='HEAD') return res.status(405).setHeader('Allow','GET, HEAD').end('Method Not Allowed');
  const target=safeFile(req.url);
  if(!target) return res.status(403).end('Forbidden');
  serveFile(req,res,target);
}
