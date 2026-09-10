# ALP Docs

Static documentation site cho ALP, xây bằng [Astro](https://astro.build/) và [Starlight](https://starlight.astro.build/).

**Repo này giữ khung site, không giữ content.** Toàn bộ tài liệu người dùng sống ở
[`alp-code/docs/user/`](https://github.com/phucanh08/alp-code/tree/main/docs/user) và được kéo về mỗi lần build. Sửa câu chữ thì sửa bên đó.

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

`predev` tự kéo content về từ `alp-code@main`. Nếu có sẵn checkout local — sửa docs và xem kết quả ngay không cần push:

```bash
ALP_CODE_PATH=../alp-code npm run dev
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
| `npm run fetch:docs` | Kéo `docs/user/` của alp-code vào `src/content/docs/docs/` |

`fetch:docs` chạy tự động qua `predev` và `prebuild`; hiếm khi phải gọi tay.

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
│   │   ├── docs/
│   │   │   └── docs/         # KÉO VỀ từ alp-code, gitignore
│   │   └── i18n/
│   ├── generated/            # sidebar.json kéo về, gitignore
│   └── styles/
│       └── custom.css        # Visual tokens và theme polish
└── package.json
```

Ba brand asset đều là vector SVG: `public/favicon.svg` dùng cho browser/app icon, còn hai wordmark trong `src/assets/` được Starlight tự đổi theo light/dark theme.

## Thêm trang tài liệu

Ở repo `alp-code`, không phải ở đây. Thêm file `.md` vào `docs/user/` rồi thêm một mục vào `docs/user/sidebar.json`. Xem [`docs/user/README.md`](https://github.com/phucanh08/alp-code/blob/main/docs/user/README.md).

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

## Content đến từ đâu

`scripts/fetch-docs.mjs` kéo `docs/user/` của alp-code vào `src/content/docs/docs/`, và `docs/user/sidebar.json` vào `src/generated/sidebar.json`. Cả hai đường dẫn đích đều nằm trong `.gitignore` — coi chúng như build output, mỗi lần chạy là xoá sạch rồi ghi lại.

| Nguồn | Khi nào dùng |
|---|---|
| `ALP_CODE_PATH=../alp-code` hoặc `--from <path>` | Sửa docs local, thấy kết quả ngay |
| Mặc định: tarball `alp-code@main` trên GitHub | CI, và mọi lần build không có checkout local |

Đổi ref bằng `ALP_CODE_REF` hoặc `--ref`. Deploy workflow đặt `ALP_CODE_REF: main`, nghĩa là site mô tả source HEAD của alp-code chứ không phải bản stable mới nhất — khớp với cách content được viết, vì nó có banner đánh dấu phần chưa vào stable.

Bước fetch fail sớm nếu `sidebar.json` trỏ vào trang không tồn tại, và cảnh báo nếu có trang không nằm trong sidebar. Không có bước này thì một commit ở alp-code sẽ làm gãy build ở đây với thông báo của Starlight, khó lần ra nguyên nhân.

### Khi nào site được build lại

| Trigger | Lý do |
|---|---|
| Push lên `main` của repo này | Khung site đổi |
| Cron mỗi giờ | Content bên alp-code đổi |
| **Actions → Deploy to GitHub Pages → Run workflow** | Muốn ngay |
| `repository_dispatch` type `docs-updated` | Đường cho alp-code chủ động đẩy; cần PAT lưu bên đó, chưa bật |

alp-code không phải bắn gì sang: repo này tự hỏi. Đổi lại, docs mới mất tối đa một giờ để lên production, hoặc bấm Run workflow là xong.

## Changelog

Thay đổi theo phiên bản được ghi trong [CHANGELOG.md](CHANGELOG.md).
