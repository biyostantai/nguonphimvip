<?php
ob_start();
require_once 'config.php';
if (ob_get_length()) ob_clean();
header("Content-Type: application/xml; charset=utf-8");
echo '<?xml version="1.0" encoding="UTF-8"?>';
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
echo '<url><loc>https://nguonphimvip.online/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>';
$sql = "SELECT slug, modified FROM movies ORDER BY modified DESC LIMIT 5000";
$result = $conn->query($sql);
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $slug = $row['slug'];
        $lastmod = date('Y-m-d', strtotime($row['modified']));
        $loc = "https://nguonphimvip.online/phim/" . $slug;
        echo '<url>';
        echo '<loc>' . htmlspecialchars($loc) . '</loc>';
        echo '<lastmod>' . $lastmod . '</lastmod>';
        echo '<changefreq>weekly</changefreq>';
        $priority = (time() - strtotime($row['modified'])) < (7 * 24 * 60 * 60) ? '0.9' : '0.7';
        echo '<priority>' . $priority . '</priority>';
        echo '</url>';
    }
}
echo '</urlset>';
$conn->close();
ob_end_flush();
?>