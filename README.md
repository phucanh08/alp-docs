# ALP Docs

Static documentation site cho ALP, xây bằng [Astro](https://astro.build/) và [Starlight](https://starlight.astro.build/). Toàn bộ nội dung chính được viết bằng Markdown.

## Tính năng

- Navigation responsive sinh từ cấu trúc content.
- Full-text search bằng Pagefind.
- Light, dark và automatic theme; ghi nhớ lựa chọn của người dùng.
- Vietnamese UI và content mẫu.
- Static output, không cần backend hay runtime secret.

## Yêu cầu

- Node.js 22.12.0 trở lên.
- npm 9.6.5 trở lên.

## Chạy local

```bash
npm install
npm run dev
```

Astro sẽ in local URL trong terminal, mặc định là `http://localhost:4321`.

## Production build

```bash
npm run build
npm run preview
```

Static output nằm trong `dist/`. Pagefind index chỉ được sinh khi build, vì vậy hãy dùng `npm run preview` khi kiểm tra search.

## Scripts

| Command | Mục đích |
|---|---|
| `npm run dev` | Chạy development server với hot reload |
| `npm run build` | Build static site và Pagefind index vào `dist/` |
| `npm run preview` | Preview production build local |

## Cấu trúc

```text
.
├── astro.config.mjs          # Starlight, locale và navigation
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/               # ALP wordmark cho light/dark theme
│   ├── content.config.ts     # Docs/i18n collections
│   ├── content/
│   │   ├── docs/             # Markdown source of truth
│   │   └── i18n/
│   └── styles/
│       └── custom.css        # Visual tokens và theme polish
└── package.json
```

Ba brand asset đều là vector SVG: `public/favicon.svg` dùng cho browser/app icon, còn hai wordmark trong `src/assets/` được Starlight tự đổi theo light/dark theme.

## Thêm trang tài liệu

Tạo file `.md` trong `src/content/docs/`. Thư mục và tên file quyết định URL; frontmatter cung cấp metadata cho navigation và SEO.

```md
---
title: Tên trang
description: Một câu mô tả kết quả người đọc nhận được.
sidebar:
  order: 3
---

# Nội dung

Viết hướng dẫn tại đây.
```

Sidebar nhóm `Hướng dẫn` tự động đọc các trang trong `src/content/docs/guides/`. Xem thêm trang [Viết tài liệu bằng Markdown](src/content/docs/guides/writing-markdown.md).

## Trước khi deploy

1. Chạy `npm run build` và xử lý mọi build error.
2. Kiểm tra navigation, search và cả hai color theme qua `npm run preview`.

## Deploy lên GitHub Pages

Workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) tự build và deploy mỗi khi có commit được push lên nhánh `main`. Có thể chạy thủ công qua **Actions → Deploy to GitHub Pages → Run workflow**.

Thiết lập lần đầu:

1. Tạo GitHub repository và push source lên nhánh `main`.
2. Mở **Settings → Pages** trong repository.
3. Ở **Build and deployment → Source**, chọn **GitHub Actions**.
4. Push một commit hoặc chạy workflow thủ công.

Workflow tự suy ra URL từ `GITHUB_REPOSITORY`:

- Project repository: `https://<owner>.github.io/<repo>/`.
- User/organization repository tên `<owner>.github.io`: `https://<owner>.github.io/`.

Không cần GitHub secret. Workflow dùng `GITHUB_TOKEN` ngắn hạn với quyền tối thiểu `contents: read`, `pages: write` và `id-token: write`.

## Changelog

Thay đổi theo phiên bản được ghi trong [CHANGELOG.md](CHANGELOG.md).
