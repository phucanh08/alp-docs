# Changelog

Mọi thay đổi đáng chú ý của dự án được ghi trong file này. Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) và dự án tuân theo [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Bộ tài liệu người dùng cho `alp-code`: cài đặt, bắt đầu nhanh, ba trang khái niệm, năm hướng dẫn vận hành và reference CLI/xử lý sự cố. Content sau đó chuyển sang `alp-code/docs/user/`; xem mục Changed.
- GitHub Actions workflow tự build và deploy static output lên GitHub Pages khi push nhánh `main`.
- `scripts/fetch-docs.mjs` kéo `docs/user/` của `alp-code` vào cây build, từ tarball GitHub hoặc từ checkout local qua `ALP_CODE_PATH`. Chạy tự động qua `predev`/`prebuild`.
- Deploy workflow chạy thêm theo cron mỗi giờ, `workflow_dispatch` và `repository_dispatch` type `docs-updated`, để content đổi bên `alp-code` cũng dựng lại site.

### Changed

- Content của site chuyển sang `alp-code/docs/user/` và repo này không còn giữ bản sao. Tài liệu người dùng giờ đi cùng commit code sinh ra nó, thay vì được đồng bộ sau bằng codemod ở một repo khác. `src/content/docs/docs/` và `src/generated/` trở thành build output và vào `.gitignore`.
- Thứ tự và nhãn sidebar đọc từ `alp-code/docs/user/sidebar.json` thay vì hardcode trong `astro.config.mjs`, để thêm một trang là một commit ở một repo.
- Đồng bộ docs với `alp-code` commit `7833490`: thêm mục "Runtime nào cưỡng chế phần nào" vào trang Agent và quyền, và nói rõ khối **Enforced by** mà tier 2 của `alp agent test`/`alp agent add` in ra.
- Sửa các claim về quyền cho đúng mức cưỡng chế thật ở landing page, ALP hoạt động thế nào, Nấc và runtime, Memory và continuity và Custom agent: trên Codex, tool grant và read root là ràng buộc mức prompt; chỉ ghi và egress mạng bị sandbox chặn.
- Cập nhật commit pin và link kiểm chứng từ `777113b` sang `7833490` ở CLI reference, xử lý sự cố, Nấc và runtime, Custom agent và Skill của project.
- Sidebar chuyển từ autogenerate sang bốn nhóm cố định (Bắt đầu, Khái niệm, Hướng dẫn, Tham chiếu) để thứ tự trang theo hành trình đọc.
- Astro config dùng custom domain khi có `DEPLOY_SITE`, đồng thời giữ fallback suy ra GitHub Pages URL từ repository context.
- Internal content links dùng relative paths để hoạt động cả ở domain root và project subpath.
- Chuyển toàn bộ docs sang `/docs/` và redirect domain root về trang giới thiệu.
- Thay favicon cũ và site title bằng bộ ALP SVG vector hóa, có wordmark riêng cho light/dark theme.
- Chuyển visual system sang docs shell tối giản: compact header, bordered sidebar, content column tập trung và green accent.

### Fixed

- 12 internal link giữa các trang bị gãy trên site đã build: link tương đối được viết theo vị trí file nguồn, nhưng mỗi trang được phục vụ tại URL có trailing slash nên `./x/` trỏ vào chính thư mục của trang. Sibling giờ là `../x/`, khác nhóm là `../../<nhóm>/x/`. Script kiểm link trước đó resolve theo thư mục file thay vì URL của trang nên báo xanh nhầm.

### Removed

- `scripts/sync-release.mjs`, `alp-code-pin.json` và workflow `check-alp-code-release.yml`. Chúng mở PR sửa chuỗi version và commit pin trong `src/content/docs/docs/` — thư mục giờ là output của bước fetch, không còn file nào được commit ở repo này. Việc giữ số version trong docs cho khớp release thuộc về `alp-code`.
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
