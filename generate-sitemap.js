const fs = require('fs');

async function generateSitemap() {
    // Sử dụng domain mặc định là nguonphimvip.pages.dev nếu chưa cấu hình custom domain
    const domain = "https://nguonphimvip.pages.dev";
    const totalPages = 20; // Quét 20 trang để lấy nhiều phim
    let movies = [];

    console.log(`Bắt đầu Robot quét ${totalPages} trang phim...`);

    try {
        // Vòng lặp lấy dữ liệu từ nhiều trang
        for (let page = 1; page <= totalPages; page++) {
            const apiURL = `https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${page}`;
            console.log(`Đang tải trang ${page}...`);
            
            // Thêm try-catch nhỏ để tránh chết chương trình nếu 1 request lỗi
            try {
                const response = await fetch(apiURL);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                
                if (data && data.items) {
                    movies = movies.concat(data.items);
                }
            } catch (err) {
                console.error(`Lỗi tải trang ${page}:`, err.message);
            }
        }

        console.log(`Đã tìm thấy tổng cộng ${movies.length} phim.`);

        // Tạo nội dung XML
        // Quan trọng: Không được có khoảng trắng trước <?xml
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

        // Ghi file với encoding utf8 rõ ràng, không BOM
        fs.writeFileSync('sitemap.xml', xml, { encoding: 'utf8' });
        console.log('Sitemap đã được cập nhật mới nhất (sitemap.xml)!');
        
    } catch (error) {
        console.error('Lỗi khi chạy Robot:', error);
        process.exit(1);
    }
}

generateSitemap();
