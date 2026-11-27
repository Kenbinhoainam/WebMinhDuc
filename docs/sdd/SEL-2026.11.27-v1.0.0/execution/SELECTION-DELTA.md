# Đối chiếu sau khi đóng băng

SEL-2026.11.27-v1.0.0 · 27/11/2026. Đọc bằng Google Sheets API, chỉ đọc.

Đối chiếu 19113 giá trị theo tên cột và số dòng của 1590 dòng JSONL thuộc 7 tab. Có 0 giá trị khác và 0 cột nguồn chưa ghép được. Các hàng sau vùng đóng băng được đọc thêm đến dòng 1000/250/150/150/90/90/300 theo thứ tự các tab trong manifest kiểm tra.

## Chênh lệch giá trị

Không thấy chênh lệch giá trị trong các ô đã đối chiếu.

## Dòng live ngoài JSONL

- Chọn từng trang!8 · Không chọn / P01-E1
- Chọn từng trang!9 · Không chọn / P01-E2
- Chọn từng trang!10 · Không chọn / P01-E3
- Chọn từng trang!11 · Không chọn / P01-E4
- Chọn từng trang!12 · Không chọn / P02-E1
- Chọn từng trang!13 · Không chọn / P02-E2
- Chọn từng trang!14 · Không chọn / P02-E3
- Chọn từng trang!15 · Không chọn / P02-E4

Tám dòng P01/P02-E có trạng thái Không chọn được định danh trong APPROVAL-BOUNDARIES.md. DX chỉ là tài liệu tham khảo. Nội dung live không được nhập vào phạm vi triển khai.
