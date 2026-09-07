const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const defaultPort = Number(process.env.PORT || 4173);

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.txt': 'text/plain; charset=utf-8'
  };
  return map[ext] || 'application/octet-stream';
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }
    res.setHeader('Content-Type', contentType(filePath));
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const safePath = urlPath === '/' ? '/index.html' : urlPath;
  const target = path.normalize(path.join(root, safePath));

  if (!target.startsWith(root)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  fs.stat(target, (err, stats) => {
    if (err) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    if (stats.isDirectory()) {
      sendFile(res, path.join(target, 'index.html'));
      return;
    }

    sendFile(res, target);
  });
});

function tryListen(port) {
  server.once('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      tryListen(port + 1);
      return;
    }
    console.error(error);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(`Speakio running: http://localhost:${port}`);
  });
}

tryListen(defaultPort);
