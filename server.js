const path = require('path');
const fs = require('fs');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = path.resolve(__dirname);

app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'NguonPhimVIP');
  next();
});

// Serve sitemap with correct content-type
app.get('/sitemap.xml', (req, res) => {
  const filePath = path.join(ROOT, 'sitemap.xml');
  if (!fs.existsSync(filePath)) return res.status(404).send('Not found');
  res.type('application/xml; charset=UTF-8');
  fs.createReadStream(filePath).pipe(res);
});

// Rewrite pretty URLs to movie.html
app.get(['/phim/*', '/movie', '/movie.html'], (req, res) => {
  res.sendFile(path.join(ROOT, 'movie.html'));
});

// Static assets
app.use(express.static(ROOT, {
  extensions: ['html'],
  maxAge: '1h',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`NguonPhimVIP server listening at http://localhost:${PORT}/`);
});
