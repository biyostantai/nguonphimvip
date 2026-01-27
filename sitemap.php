<?php
// sitemap.php
require_once 'config.php';

// Set header là XML
header("Content-Type: text/xml; charset=utf-8");

echo '<?xml version="1.0" encoding="UTF-8"?>';
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

// Thêm trang chủ
echo '<url>';
echo '<loc>https://nguonphimvip.online/</loc>';
echo '<changefreq>daily</changefreq>';
echo '<priority>1.0</priority>';
echo '</url>';

// Lấy danh sách phim từ database, sắp xếp theo ngày cập nhật mới nhất
$sql = "SELECT slug, modified FROM movies ORDER BY modified DESC LIMIT 5000";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $slug = $row['slug'];
        // Format ngày theo chuẩn ISO 8601 (YYYY-MM-DD) cho sitemap
        $lastmod = date('Y-m-d', strtotime($row['modified']));
        
        // Tạo link đẹp dạng /phim/ten-phim
        $loc = "https://nguonphimvip.online/phim/" . $slug;

        echo '<url>';
        echo '<loc>' . htmlspecialchars($loc) . '</loc>';
        echo '<lastmod>' . $lastmod . '</lastmod>';
        echo '<changefreq>weekly</changefreq>';
        // Ưu tiên phim mới cập nhật
        $days_diff = (time() - strtotime($row['modified'])) / (60 * 60 * 24);
        $priority = $days_diff < 7 ? '0.9' : '0.7'; 
        echo '<priority>' . $priority . '</priority>';
        echo '</url>';
    }
}

echo '</urlset>';

$conn->close();
?>