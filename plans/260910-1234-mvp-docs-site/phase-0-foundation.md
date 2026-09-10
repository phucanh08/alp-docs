# P0 — Dựng nền tảng

**Mục tiêu:** Repo có Starlight app cài được, build được và cung cấp sẵn navigation, search, dark mode.
**Phụ thuộc:** không

---

## Việc phải làm

1. Tạo package manifest và scripts `dev`, `build`, `preview`; pin exact `astro` 7.3.2 và `@astrojs/starlight` 0.42.0, khóa dependency bằng npm lockfile.
2. Cấu hình Astro + Starlight với title “ALP Docs”, locale tiếng Việt, social metadata cơ bản và custom stylesheet.
3. Khai báo Starlight docs/i18n loaders và schemas. Tạo landing Markdown tối thiểu để route `/` có output.
4. Dùng sidebar autogenerate từ thư mục docs; giữ search Pagefind và theme selector mặc định.

## File đụng tới

- Tạo `package.json` — dependencies và scripts.
- Sinh `package-lock.json` — dependency lockfile.
- Tạo `astro.config.mjs` — Starlight/site/sidebar config.
- Tạo `tsconfig.json` — Astro TypeScript baseline.
- Tạo `src/content.config.ts` — Markdown collection loader/schema.
- Tạo `src/content/docs/index.md` — landing page.
- Tạo `src/content/i18n/vi.json` — kích hoạt built-in Vietnamese UI translations mà không override chuỗi.

<!-- Sửa: kiểm chứng lúc implement 2026-09-10 — Starlight i18n cần collection được khai báo để build không cảnh báo collection thiếu. -->

<!-- Rà đối kháng 2026-09-10: pin exact top-level dependencies để lần cài đầu tái lập được. -->

## Tiêu chí hoàn thành

```bash
npm install
npm run build
test -f dist/index.html
test -f dist/pagefind/pagefind.js
```

## Rủi ro

- Search không hoạt động trong dev vì Pagefind index sinh lúc production build. Giảm thiểu: test output `dist/pagefind/`, ghi rõ cách verify bằng `npm run preview`.
- Phiên bản Node/dependency lệch có thể làm scaffold hỏng. Giảm thiểu: dùng local Node 24, lockfile và build ngay sau khi scaffold.
- Config sai phải fail rõ trong `astro build`; không fallback im lặng hay nuốt lỗi.
