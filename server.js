const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 3000;

// Paths
const PROJECT_DIR = __dirname;
const FRAMES_DIR  = path.resolve('C:/Users/USER/Downloads/ezgif-540be4fbff4088dc-jpg');

// MIME types
const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
  '.webp': 'image/webp',
};

function getMime(filePath) {
  return MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

const server = http.createServer((req, res) => {
  let url = req.url.split('?')[0]; // strip query
  if (url === '/') url = '/index.html';

  let filePath;

  // Route /frames/* to the actual frames directory
  if (url.startsWith('/frames/')) {
    const frameName = url.replace('/frames/', '');
    filePath = path.join(FRAMES_DIR, frameName);
  } else {
    filePath = path.join(PROJECT_DIR, url);
  }

  // Security: prevent path traversal
  if (!filePath.startsWith(PROJECT_DIR) && !filePath.startsWith(FRAMES_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': getMime(filePath),
      'Cache-Control': 'public, max-age=31536000', // cache frames aggressively
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  ⚽ World Cup Scroll Cinema is live!`);
  console.log(`  → http://localhost:${PORT}\n`);
});
