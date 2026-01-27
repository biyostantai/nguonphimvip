<?php
// config.php
$db_host = 'localhost';
$db_user = 'root'; // Thay bằng user database của bạn
$db_pass = '';     // Thay bằng mật khẩu database của bạn
$db_name = 'nguonphimvip'; // Tên database

$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}

// Thiết lập charset utf8 để không bị lỗi font
$conn->set_charset("utf8");
