<?php
// update_movies.php
require_once 'config.php';

// Tăng thời gian thực thi script nếu dữ liệu nhiều
set_time_limit(300); 

$api_url = 'https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1';
$total_pages_to_scan = 5; // Số trang muốn quét mỗi lần chạy (để tránh timeout)

echo "Bắt đầu cập nhật dữ liệu...<br>";

for ($page = 1; $page <= $total_pages_to_scan; $page++) {
    $current_url = $api_url . '&page=' . $page;
    $json_data = file_get_contents($current_url);
    
    if ($json_data === FALSE) {
        echo "Lỗi không thể tải dữ liệu từ trang $page<br>";
        continue;
    }

    $data = json_decode($json_data, true);

    if (isset($data['items']) && is_array($data['items'])) {
        foreach ($data['items'] as $movie) {
            $slug = $conn->real_escape_string($movie['slug']);
            $name = $conn->real_escape_string($movie['name']);
            $origin_name = $conn->real_escape_string($movie['origin_name']);
            $thumb_url = $conn->real_escape_string($movie['thumb_url']);
            
            // Xử lý ngày modified
            // API trả về format kiểu "2024-01-20T10:00:00.000Z"
            $modified_raw = isset($movie['modified']['time']) ? $movie['modified']['time'] : (isset($movie['modified']) ? $movie['modified'] : date('Y-m-d H:i:s'));
            $modified = date('Y-m-d H:i:s', strtotime($modified_raw));

            // Sử dụng INSERT ... ON DUPLICATE KEY UPDATE để thêm mới hoặc cập nhật
            $sql = "INSERT INTO movies (slug, name, origin_name, thumb_url, modified) 
                    VALUES ('$slug', '$name', '$origin_name', '$thumb_url', '$modified')
                    ON DUPLICATE KEY UPDATE 
                    name = '$name',
                    origin_name = '$origin_name',
                    thumb_url = '$thumb_url',
                    modified = '$modified'";

            if ($conn->query($sql) === TRUE) {
                // Thành công (không cần in ra để tránh spam log)
            } else {
                echo "Lỗi SQL: " . $conn->error . "<br>";
            }
        }
        echo "Đã quét xong trang $page<br>";
    } else {
        echo "Không tìm thấy dữ liệu phim ở trang $page<br>";
    }
}

echo "Hoàn tất quá trình cập nhật!";
$conn->close();
?>