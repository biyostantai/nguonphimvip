const fs = require('fs');
const https = require('https');

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            reject(new Error('Parse JSON failed: ' + e.message));
          }
        });
      })
      .on('error', (err) => reject(err));
  });
}

function extractSlugsFromSitemap(xml) {
  const slugs = [];
  const regex = /<loc>https?:\/\/[^<]+\/phim\/([^<]+)<\/loc>/g;
  let m;
  while ((m = regex.exec(xml)) !== null) {
    slugs.push(m[1]);
  }
  return slugs;
}

async function checkSlug(slug) {
  const url = `https://phimapi.com/phim/${slug}`;
  const start = Date.now();
  try {
    const json = await fetchJSON(url);
    const duration = Date.now() - start;
    const status = json.status !== false;
    const movie = json.movie || json.item || json;
    const episodesRoot =
      json.episodes ||
      json.item?.episodes ||
      json.movie?.episodes ||
      (json.data && (json.data.episodes || json.data.movie?.episodes)) ||
      [];
    const epiCount = Array.isArray(episodesRoot) ? episodesRoot.length : 0;
    console.log(
      `• ${slug} -> ${status ? 'OK' : 'ERR'} | episodes: ${epiCount} | ${duration}ms | name: ${movie?.name || movie?.title || 'N/A'}`
    );
    if (!status) {
      console.log('  ↳ Message:', json.msg || 'unknown');
    }
  } catch (err) {
    console.log(`• ${slug} -> FAIL (${err.message})`);
  }
}

async function main() {
  const xml = fs.readFileSync('sitemap.xml', 'utf8');
  const slugs = extractSlugsFromSitemap(xml);
  const sample = slugs.slice(0, 10);
  if (sample.length === 0) {
    console.log('❌ Không tìm thấy slug nào trong sitemap.xml');
    return;
  }
  console.log(`Đang kiểm tra ${sample.length} slug đầu tiên từ sitemap.xml với phimapi.com...`);
  for (const slug of sample) {
    await checkSlug(slug);
  }
  console.log('✅ Hoàn tất kiểm tra slug');
}

main();
