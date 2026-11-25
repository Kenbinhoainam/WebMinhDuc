# Tài sản video Minh Đức — v14

Nguồn: video Minh Đức được cung cấp tại `https://drive.google.com/file/d/1i4ZHg9BAApueTxur4KwU_oXxH-NqbMHu/view`. Tệp nguồn được giữ ngoài `public/`; SHA-256 `23183a003731fcd78321432999f101430814e51b4ca74df613157d11ceff9582`. Nguồn dài 132,133333 giây, 1024 × 576, 30 khung/giây, 3.964 khung, H.264 và AAC stereo, 22.433.189 byte. Nguồn gốc đã đặt `moov` trước `mdat`.

| Tài nguyên | Kích thước | Ghi chú |
|---|---:|---|
| `/assets/minhduc-corporate-59381d80.mp4` | 19.754.706 B | Toàn bộ thời lượng, H.264 CRF 25; AAC sao chép, faststart |
| `/assets/minhduc-corporate-1de77724.webm` | 22.292.313 B | Toàn bộ thời lượng, VP9 CRF 36; Opus 64 kb/s |
| `/assets/minhduc-poster-1s.webp` | 34.628 B | Khung nguồn tại 1 giây |
| `/assets/minhduc-meeting-10s.webp` | 56.806 B | Khung nguồn tại 10 giây |
| `/assets/minhduc-offices-20s.webp` | 85.058 B | Khung nguồn tại 20 giây, có chữ trong video |
| `/assets/minhduc-title-45s.webp` | 20.576 B | Khung nguồn tại 45 giây |
| `/assets/minhduc-working-60s.webp` | 48.732 B | Khung nguồn tại 60 giây |

Hai bản mã hóa giữ nguyên 1024 × 576 và 3.964 khung hình được giải mã. Kiểm tra mẫu 1, 60, 131 và 132,066 giây đối chiếu nội dung với nguồn; đây không phải phép so sánh từng pixel toàn video. Các gói AAC của MP4 khớp SHA-256 với nguồn. Âm thanh WebM được mã hóa lại thành Opus; số mẫu PCM giải mã khớp nguồn trong phép kiểm tra, không đồng nghĩa nội dung âm thanh giống từng bit. Không sử dụng `-shortest`, cắt hay tạo thêm nội dung.

Khung 131 giây hiển thị logo trên nền trắng; video gốc tự tối dần ở khoảng 132 giây. Thẻ kết thúc cần xuất hiện sau sự kiện `ended`, không thay thế đoạn cuối. Các con số dung lượng không chứng minh tốc độ tải; phép đo mạng và hiển thị phải thực hiện trên cấu hình thống nhất.

Tái tạo: `node scripts/generate-minhduc-media.mjs /đường/dẫn/minhduc-original.mp4`. Kiểm tra: `node scripts/verify-minhduc-media.mjs /đường/dẫn/minhduc-original.mp4`. Script tạo video kiểm tra SHA nguồn và cập nhật `src/hero-assets.json`; script tối ưu ảnh HR2B không thay thế cấu hình hero. Giữ các đường dẫn video cũ để tương thích liên kết.
