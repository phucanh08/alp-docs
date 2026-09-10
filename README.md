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
| `npm run check:release` | Hỏi GitHub xem alp-code đã có release nào mới hơn pin chưa; thoát `1` nếu có |
| `npm run sync:release` | Chạy codemod version/pin rồi in report những chỗ cần người quyết định |

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

Tạo file `.md` trong `src/content/docs/docs/`. Thư mục và tên file quyết định URL dưới `/docs/`; frontmatter cung cấp metadata cho navigation và SEO.

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

Sidebar nhóm `Hướng dẫn` tự động đọc các trang trong `src/content/docs/docs/guides/`.

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

Workflow đặt production URL qua `DEPLOY_SITE=https://alp.anhlp.com`, phục vụ docs tại `https://alp.anhlp.com/docs/` và redirect `/` về `/docs/`. Nếu bỏ `DEPLOY_SITE`, config vẫn tự suy ra URL từ `GITHUB_REPOSITORY`:

- Project repository: `https://<owner>.github.io/<repo>/`.
- User/organization repository tên `<owner>.github.io`: `https://<owner>.github.io/`.

Không cần GitHub secret. Workflow dùng `GITHUB_TOKEN` ngắn hạn với quyền tối thiểu `contents: read`, `pages: write` và `id-token: write`.

## Đồng bộ với alp-code

`alp-code` và `alp-docs` là hai repository độc lập. Đường release của `alp-code` cố ý chạy tay và không dùng GitHub Actions, nên thông tin đi ngược lại: repo docs tự hỏi, `alp-code` không phải bắn gì sang.

`alp-code-pin.json` giữ hai giá trị và chúng **không** phải một:

| Trường | Nghĩa |
|---|---|
| `stable` | Release mà docs đang gọi là stable |
| `pin` | Revision nguồn mà docs đã được đối chiếu |

`pin` được phép chạy trước `stable`: docs mô tả cả preview sau tag mới nhất, và đó là trạng thái làm việc bình thường chứ không phải lỗi. Vì vậy drift chỉ đo theo `stable`.

Workflow [`.github/workflows/check-alp-code-release.yml`](.github/workflows/check-alp-code-release.yml) chạy hằng ngày lúc 02:00 UTC, và chạy tay được qua **Actions → Kiểm tra release mới của alp-code → Run workflow** (có thể truyền một tag cụ thể thay vì lấy release mới nhất). Khi có release mới, nó mở **PR nháp** chứ không commit thẳng.

Ranh giới giữa máy và người:

- **Máy sửa:** chuỗi version, commit pin và link kiểm chứng — những thứ suy được từ một cái tag.
- **Máy chỉ đo rồi hỏi:** banner preview nào phải xoá, và `reference/cli.md` đã lệch chỗ nào. Thân PR đính kèm mục CHANGELOG của release đó, diff help text giữa pin cũ và tag mới, và checklist từng banner.

Lý do tách như vậy: một release đưa `alp agent` vào stable thì banner “chưa có trong stable `v0.10.4`” phải bị **xoá**, không phải đổi số. Tự đổi số là biến docs từ cũ thành sai. PR luôn ở trạng thái nháp và không bao giờ auto-merge.

Build trên runner **không** chặn PR. Một release làm gãy build là chuyện phải thấy trong PR, không phải chuyện làm PR biến mất; kết quả build được ghi thẳng vào thân PR.

Thiết lập lần đầu:

1. Mở **Settings → Actions → General → Workflow permissions**.
2. Bật **Allow GitHub Actions to create and approve pull requests**. Không bật thì bước mở PR fail với lỗi permission.

Hai điều cần biết về `schedule`: workflow phải nằm trên nhánh mặc định mới chạy, và GitHub tắt scheduled workflow sau 60 ngày repository không có hoạt động nào — chạy tay một lần là bật lại.

Chạy local cũng được. `check:release` chỉ hỏi và thoát `1` nếu lệch, hợp cho một bước CI riêng; `sync:release` sửa cây làm việc rồi in report ra stdout.

## Changelog

Thay đổi theo phiên bản được ghi trong [CHANGELOG.md](CHANGELOG.md).
