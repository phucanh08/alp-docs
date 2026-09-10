---
created: 2026-09-10
type: brainstorm
---

# MVP docs site

## Yêu cầu đã chốt

- Docs site hiện đại, responsive.
- Navigation, search, dark mode.
- Markdown là nguồn content.
- Có content mẫu để site dùng được ngay.

## Hiện trạng

Repo chưa có source application, package manifest hay kế hoạch cũ. Không có thành phần nào để tái sử dụng.

## Phương án

| Phương án | Hợp khi | Đánh đổi | Chi phí đảo ngược |
|---|---|---|---|
| Astro Starlight | Docs-first, Markdown-first, cần ship nhanh | UI theo conventions của Starlight | Thấp: Markdown di chuyển được |
| VitePress | Vue team, muốn theme Vue | Thêm ràng buộc Vue; không có lợi thế trong repo trống | Thấp |
| Custom React/Next.js | Cần UX hay data flow riêng | Tự xây search, content pipeline, theme; vượt scope MVP | Trung bình |

**Chọn Astro Starlight.** Nó giữ Markdown là source of truth và cung cấp sẵn sidebar, Pagefind search và color-theme control. Không có backend hay runtime state.

## Bằng chứng framework

- Tài liệu chính thức đã kiểm tra ngày 2026-09-10: [Getting Started](https://starlight.astro.build/getting-started/), [Markdown authoring](https://starlight.astro.build/guides/authoring-content/), [Sidebar](https://starlight.astro.build/guides/sidebar/), [Site search](https://starlight.astro.build/guides/site-search/).
- npm registry ngày 2026-09-10: `@astrojs/starlight` 0.42.0, `astro` 7.3.2.
- Local toolchain: Node 24.19.0, npm 11.17.0.

## Thách thức phạm vi

- Tối thiểu: scaffold, config, visual tokens, ba trang Markdown mẫu, build verification.
- Hoãn: CMS, auth, docs versioning, analytics, i18n, deploy, custom search service.
- Dự kiến 9 file: vượt ngưỡng 8 chỉ do ba trang content và lockfile; không thêm application module tùy biến.
- Hướng: THU HẸP về MVP theo xác nhận của principal.

