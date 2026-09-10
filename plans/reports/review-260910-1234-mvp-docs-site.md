---
created: 2026-09-10
type: review
---

# Rà đối kháng MVP docs site

**Kế hoạch:** `plans/260910-1234-mvp-docs-site/plan.md`
**Đường chạy:** tự rà
**Lăng kính:** Kẻ tấn công; Kẻ phá giả định

## Phát hiện 1: Dependency range làm lần cài đầu không tái lập được

- **Mức:** NÊN SỬA
- **Lăng kính:** Kẻ tấn công
- **Ở đâu:** P0, việc 1
- **Sai gì:** Plan yêu cầu lockfile nhưng không yêu cầu exact top-level versions trong `package.json`.
- **Hỏng thế nào:** Nếu lockfile bị sinh lại, semver range có thể chọn dependency khác bản đã kiểm chứng.
- **Bằng chứng:** Registry ngày 2026-09-10 cho biết Starlight 0.42.0 peer với Astro `^7.2.10`; local Node 24.19.0 thỏa engine Astro 7.3.2 (`>=22.12.0`).
- **Đề xuất:** Pin `astro` 7.3.2 và `@astrojs/starlight` 0.42.0, commit lockfile.
- **Xử lý đề nghị:** Nhận.

## Phát hiện 2: Search assertion phụ thuộc file nội bộ Pagefind

- **Mức:** NÊN SỬA
- **Lăng kính:** Kẻ phá giả định
- **Ở đâu:** P1, tiêu chí hoàn thành
- **Sai gì:** `rg` vào `pagefind-entry.json` giả định format artifact sẽ chứa literal route.
- **Hỏng thế nào:** Search thật hoạt động nhưng check fail khi Pagefind đổi serialization, hoặc check pass mà UI search không trả kết quả.
- **Bằng chứng:** Plan đang test implementation detail thay vì public search behavior.
- **Đề xuất:** Giữ assertion artifact tồn tại; xác minh query qua browser preview thay cho `rg` nội dung index.
- **Xử lý đề nghị:** Nhận.

## Phân xử

- CHẶN: 0.
- NÊN SỬA: 2, đề nghị nhận cả hai.
- GHI NHẬN: 0.
- Principal duyệt ngày 2026-09-10; cả hai đã áp dụng vào plan/implementation.
