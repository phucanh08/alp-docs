# Changelog

Mọi thay đổi đáng chú ý của dự án được ghi trong file này. Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) và dự án tuân theo [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Bộ tài liệu người dùng cho `alp-code`: cài đặt, bắt đầu nhanh, ba trang khái niệm, năm hướng dẫn vận hành và reference CLI/xử lý sự cố.
- GitHub Actions workflow tự build và deploy static output lên GitHub Pages khi push nhánh `main`.

### Changed

- Sidebar chuyển từ autogenerate sang bốn nhóm cố định (Bắt đầu, Khái niệm, Hướng dẫn, Tham chiếu) để thứ tự trang theo hành trình đọc.
- Astro config dùng custom domain khi có `DEPLOY_SITE`, đồng thời giữ fallback suy ra GitHub Pages URL từ repository context.
- Internal content links dùng relative paths để hoạt động cả ở domain root và project subpath.
- Chuyển toàn bộ docs sang `/docs/` và redirect domain root về trang giới thiệu.
- Thay favicon cũ và site title bằng bộ ALP SVG vector hóa, có wordmark riêng cho light/dark theme.
- Chuyển visual system sang docs shell tối giản: compact header, bordered sidebar, content column tập trung và green accent.

### Removed

- Hai trang placeholder `guides/getting-started` và `guides/writing-markdown` của bộ khung Starlight.

## [0.1.0] - 2026-09-10

### Added

- Static documentation site dùng Astro 7.3.2 và Starlight 0.42.0.
- Markdown content collection với landing page, quickstart và authoring guide mẫu.
- Responsive navigation và sidebar sinh tự động từ thư mục guides.
- Pagefind full-text search cho production build.
- Vietnamese UI, light/dark/automatic theme và theme persistence.
- Custom visual tokens, responsive styling và ALP favicon.
- npm scripts cho development, production build và local preview.
- Project README và versioned changelog.
