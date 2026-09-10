# P1 — Hoàn thiện content và giao diện

**Mục tiêu:** Site có bộ content mẫu tiếng Việt, hierarchy dễ quét và visual identity hiện đại trên desktop lẫn mobile.
**Phụ thuộc:** P0

---

## Việc phải làm

1. Viết hai trang Markdown mẫu: quickstart và hướng dẫn authoring Markdown; dùng frontmatter, headings, code block, callout và links nội bộ.
2. Tinh chỉnh landing page: value proposition, ba entry point và CTA vào quickstart.
3. Thêm stylesheet mỏng cho typography, accent color, surfaces và spacing; bảo toàn contrast/light-dark behavior của Starlight.
4. Chạy production build, preview, kiểm tra navigation, search query tiếng Việt, theme persistence và layout hẹp/rộng.

## File đụng tới

- Sửa `src/content/docs/index.md` — hoàn thiện landing content.
- Tạo `src/content/docs/guides/getting-started.md` — quickstart mẫu.
- Tạo `src/content/docs/guides/writing-markdown.md` — authoring guide mẫu.
- Tạo `src/styles/custom.css` — visual tokens và scoped polish.
- Tạo `public/favicon.svg` — favicon nhẹ, không để metadata mặc định trỏ tới route 404.
- Sửa `astro.config.mjs` — nối stylesheet và nhãn navigation cuối cùng.

## Tiêu chí hoàn thành

```bash
npm run build
test -f dist/index.html
test -f dist/guides/getting-started/index.html
test -f dist/guides/writing-markdown/index.html
test -f dist/pagefind/pagefind.js
rg -q 'Bắt đầu' dist/index.html
```

Sau các check tự động: chạy `npm run preview` và xác minh trong browser ở 390 px và 1440 px: sidebar điều hướng được, query “Markdown” trả kết quả, theme toggle giữ lựa chọn sau reload, không có horizontal overflow.

<!-- Rà đối kháng 2026-09-10: bỏ assertion vào serialization nội bộ của Pagefind; kiểm public search behavior qua production preview. -->

## Rủi ro

- CSS override quá rộng có thể phá contrast/theme. Giảm thiểu: chỉ override public CSS variables và component scope cần thiết; test cả hai theme.
- Tiếng Việt có dấu có thể cho search result không như mong đợi. Giảm thiểu: query thử từ có dấu và từ ASCII phổ biến; không thay search engine trong MVP.
- Link/frontmatter sai phải làm build fail hoặc bị phát hiện trong preview; không giữ dead link để “sửa sau”.
