# W0 · Nguồn đối chiếu

| Nguồn | Dấu vết |
|---|---|
| Repository | Kenbinhoainam/WebMinhDuc · GitHub node R_kgDOVuEZaQ · origin HTTPS |
| Checkout thực thi | /workspace/sprint2-implementation · môi trường Codex Cloud · Node v24.22.1, npm 11.9.0 |
| Handoff | sprint-2/approved-ui-upgrade-sel-20261127-v1 · 5744b6da70af721bf08d915107960ab61dfb0080 · sạch khi mở |
| Merge-base | Handoff thêm 22 tài liệu trên 08e2da46106b51537b871aea3880fc94b25da935 (prototype v30), không sửa app |
| Nguồn app trước adapter GitHub Pages | 098167bfc1cceb3990c0f9bdf616e23846677cab · thay đổi v29/v30 về số chạy, rail và mobile/tablet |
| Nhánh thực thi | feat/s2-ui-upgrade-sel-20261127-v1, tách từ handoff |
| Site đối chiếu, audience | minhduc-sprint1-ui-review.kenbinhoainam.chatgpt.site · appgprj_6b087a000f648191a964277818053771 · custom · current_user_role owner |
| Sites v1 | bc0610e208b35d7b2e65c7a4fc3819a3d5a00b91 · SHA của Sheet nằm trong lịch sử repository Sites |
| Sites v2 | 907a62e6d47ba44c10af4387b63eff293624bf62 |
| Sites v3 | 3453c096629a3235beeee6fd321a4c274c828f06 · get_deployment_status succeeded · appgprj_6b087a000f648191a964277818053771~appgdep_bd02df05371c81918c7003a50a7627be · archive sha256 2ab27444a9085eb75a6d52dfaf12c34bfd6572a4ab0f850758881007267d9bcd |
| Manifest bàn giao | appgprj_6af9854ff97481918e5f4fb346668a2b là site prototype khác. Manifest này được giữ trong source GitHub |
| Preview Sprint 2 | Project riêng appgprj_6b0977a9d68c8191abad13d792f6f2f6 |

## Cách hòa giải hai nguồn

Đã đọc danh sách phiên bản và trạng thái triển khai từ Sites rồi đối chiếu SHA với checkout sạch /workspace/sites/minhduc-sprint1-review. Diff thư mục public giữa v3 và handoff chỉ có public/duyet.html phía Sites, .nojekyll/404.html/xem-hero phía GitHub. Diff src v3 với source v30 trước adapter Pages giới hạn ở mười tệp thuộc Home, HomeHero, ServiceShowcase, hero-media, home-reference, motion, seo/routes, service-showcase, sprint-navigation và useHomeCarousel. Giữ các thay đổi v29/v30 ở GitHub; khôi phục reviewer từ blob 95a08bc45cb20f21de50a69382798822ca89ad3d trên Sites v3. Blob v1 có tám trang gốc; v3 còn có năm lối tắt nội dung. Giữ các lối tắt hiện hữu. Không tự mở rộng danh mục sang route mới.

Hai bản được build từ cùng source cho hai mount (Pages /WebMinhDuc/ và preview Sites /). Dùng npm run build cho Pages; cấu hình MINHDUC_PREVIEW_ORIGIN ở bước build cho preview. Target không được xuất bản trong nhiệm vụ này.

Task/selection nghiệp vụ MD-S2-UI-UPGRADE-SEL-2026.11.27-v1.0.0. Không có biên nhận dispatch của MASTER trong phiên. Bằng chứng thực thi là Git, log QA và receipt triển khai riêng.
