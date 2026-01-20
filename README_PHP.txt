HƯỚNG DẪN CÀI ĐẶT SITEMAP ĐỘNG PHP/MYSQL
========================================

LƯU Ý QUAN TRỌNG: 
Bộ code này chỉ chạy được trên Hosting có hỗ trợ PHP và MySQL (như HawkHost, StableHost, v.v.). 
Nó KHÔNG chạy được trên Cloudflare Pages hay Firebase Hosting (vì đây là các dịch vụ Static Hosting).

Nếu bạn đang dùng Hosting PHP/MySQL, hãy làm theo các bước sau:

BƯỚC 1: CẤU HÌNH DATABASE
-------------------------
1. Vào phpMyAdmin trên hosting của bạn.
2. Tạo một database mới (ví dụ: nguonphimvip).
3. Import file `setup.sql` vào database đó để tạo bảng `movies`.
4. Mở file `config.php` và điền thông tin kết nối database của bạn (host, user, pass, db_name).

BƯỚC 2: CẬP NHẬT DỮ LIỆU (CRON JOB)
-----------------------------------
Để dữ liệu luôn mới, bạn cần cài đặt Cron Job trên Hosting để chạy file `update_movies.php` tự động.
1. Vào Cpanel -> Cron Jobs.
2. Thêm một cron job mới:
   - Thời gian: "Once per hour" (Mỗi giờ một lần) hoặc "Twice per day".
   - Command: `php /home/username/public_html/update_movies.php` 
     (Lưu ý: thay `/home/username/public_html/` bằng đường dẫn thực tế trên host của bạn).

BƯỚC 3: KIỂM TRA SITEMAP
------------------------
1. Truy cập `https://nguonphimvip.online/update_movies.php` lần đầu tiên để nó tải dữ liệu về database.
2. Truy cập `https://nguonphimvip.online/sitemap.xml`.
   Nếu cấu hình đúng, file `.htaccess` sẽ tự động chuyển hướng request này sang `sitemap.php` và hiển thị XML danh sách phim.

CHÚC BẠN THÀNH CÔNG!
