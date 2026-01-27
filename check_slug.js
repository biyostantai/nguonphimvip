const https = require('https');

const slugs = ['cai-chet-cua-singsala'];
const apiBase = 'https://phimapi.com/phim/';

console.log(`Đang kiểm tra slug: ${slugs[0]}...`);

slugs.forEach(slug => {
    const url = apiBase + slug;
    const start = Date.now();
    
    https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            const time = Date.now() - start;
            try {
                const json = JSON.parse(data);
                if (json.status) {
                    const epCount = json.episodes ? json.episodes.length : (json.movie?.episodes ? json.movie.episodes.length : 0);
                    console.log(`• ${slug} -> OK | episodes: ${epCount} | ${time}ms | name: ${json.movie.name}`);
                } else {
                    console.log(`• ${slug} -> ERROR: ${json.msg} | ${time}ms`);
                }
            } catch (e) {
                console.log(`• ${slug} -> FAIL (Parse Error) | ${time}ms`);
            }
        });
    }).on('error', e => {
        console.log(`• ${slug} -> NET ERROR: ${e.message}`);
    });
});
