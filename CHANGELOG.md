# Changelog

Mọi thay đổi đáng chú ý của dự án được ghi trong file này. Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) và dự án tuân theo [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- GitHub Actions workflow tự build và deploy static output lên GitHub Pages khi push nhánh `main`.

### Changed

- Astro config tự suy ra GitHub Pages `site` và `base` từ repository context.
- Internal content links dùng relative paths để hoạt động cả ở domain root và project subpath.

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
