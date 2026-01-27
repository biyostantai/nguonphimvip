const fs = require('fs');

async function generateSitemap() {
    const domain = "https://nguonphimvip.online";
    const totalPages = 20; // Quét 20 trang để lấy nhiều phim (thay vì chỉ 1 trang)
    let movies = [];

    console.log(`Bắt đầu Robot quét ${totalPages} trang phim...`);

    try {
        // Vòng lặp lấy dữ liệu từ nhiều trang
        for (let page = 1; page <= totalPages; page++) {
            const apiURL = `https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${page}`;
            console.log(`Đang tải trang ${page}...`);
            
            const response = await fetch(apiURL);
            const data = await response.json();
            
            if (data && data.items) {
                movies = movies.concat(data.items);
            }
        }

        console.log(`Đã tìm thấy tổng cộng ${movies.length} phim.`);

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // Thêm trang chủ
        xml += `  <url>\n    <loc>${domain}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

        // Hàm escape ký tự đặc biệt cho XML
        const escapeXml = (unsafe) => {
            return unsafe.replace(/[<>&'"]/g, (c) => {
                switch (c) {
                    case '<': return '&lt;';
                    case '>': return '&gt;';
                    case '&': return '&amp;';
                    case '\'': return '&apos;';
                    case '"': return '&quot;';
                }
            });
        };

        // Tự động tạo link cho từng phim
        // Sử dụng Set để loại bỏ các phim trùng lặp (nếu có)
        const uniqueSlugs = new Set();
        
        movies.forEach(movie => {
            if (!uniqueSlugs.has(movie.slug)) {
                uniqueSlugs.add(movie.slug);
                
                // Xử lý ngày cập nhật
                let lastMod = new Date().toISOString().split('T')[0];
                if (movie.modified && movie.modified.time) {
                    lastMod = movie.modified.time.split('T')[0];
                }

                xml += `  <url>\n`;
                xml += `    <loc>${escapeXml(`${domain}/phim/${movie.slug}`)}</loc>\n`;
                xml += `    <lastmod>${lastMod}</lastmod>\n`;
                xml += `    <changefreq>weekly</changefreq>\n`;
                xml += `    <priority>0.8</priority>\n`;
                xml += `  </url>\n`;
            }
        });

        xml += `</urlset>`;

        fs.writeFileSync('sitemap.xml', xml);
        console.log('Sitemap đã được cập nhật mới nhất (sitemap.xml)!');
        
    } catch (error) {
        console.error('Lỗi khi chạy Robot:', error);
        process.exit(1); // Báo lỗi cho GitHub Action biết
    }
}

generateSitemap();
