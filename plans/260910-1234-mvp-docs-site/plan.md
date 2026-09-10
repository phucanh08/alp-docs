---
status: completed
created: 2026-09-10
slug: mvp-docs-site
source: plans/reports/brainstorm-260910-1234-mvp-docs-site.md
blockedBy: []
blocks: []
---

# MVP docs site bằng Markdown

## Tổng quan

Dựng static docs site responsive cho người đọc tài liệu ALP. Astro Starlight render các file Markdown thành trang, cung cấp navigation, Pagefind search và dark mode mà không cần backend.

Nguồn sự thật: [Báo cáo brainstorm](../reports/brainstorm-260910-1234-mvp-docs-site.md).

**Ngoài phạm vi:** CMS, auth, docs versioning, analytics, i18n, deploy, API/backend, custom search service và component MDX tùy biến.

## Nguyên tắc bất biến

1. **Markdown là source of truth.** Content chỉ được author trong `src/content/docs/`; không nhân bản navigation data nếu có thể sinh từ cấu trúc content.
2. **Static và không secret.** Build phải chạy mà không cần credential; content và output đều công khai.
3. **Giữ customization mỏng.** Dùng Starlight primitives và CSS tokens; không fork theme hay tự xây lại search/theme switcher.

## Phase

| Phase | Tên | Trạng thái |
|---|---|---|
| 0 | [Dựng nền tảng](./phase-0-foundation.md) | hoàn tất |
| 1 | [Hoàn thiện content và giao diện](./phase-1-content-and-polish.md) | hoàn tất |

## Rà đối kháng

### Lượt — 2026-09-10

**Phát hiện:** 2 (2 nhận, 0 bác)  
**Theo mức:** 0 CHẶN · 2 NÊN SỬA · 0 GHI NHẬN

| # | Phát hiện | Mức | Xử lý | Áp vào |
|---|---|---|---|---|
| 1 | Dependency range không tái lập | NÊN SỬA | Nhận: pin exact versions | P0 |
| 2 | Search assertion dùng Pagefind internals | NÊN SỬA | Nhận: test qua preview | P1 |

## Phỏng vấn kiểm chứng

### Lượt — 2026-09-10

- Principal duyệt MVP, tên tạm “ALP Docs”, content mẫu tiếng Việt và cả hai điểm sửa sau rà đối kháng.

## Kiểm chứng triển khai

- `npm run build`: pass, sinh 4 HTML routes và Pagefind index.
- `npm audit --audit-level=high`: 0 vulnerability.
- Production preview: `/` và hai guide trả HTTP 200; favicon trả `image/svg+xml`.
- Pagefind query “Markdown”: 3 kết quả đúng.
- Chrome 390 px: `scrollWidth = clientWidth = 390`; theme dark giữ nguyên sau reload.

## Câu hỏi còn mở

- Production domain chưa có; sitemap/canonical sẽ được bật khi có URL deploy thật.
