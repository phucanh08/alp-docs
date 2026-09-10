# P0 — Information architecture và onboarding

**Mục tiêu:** Người mới hiểu ALP là gì, cài được và mở phiên đầu tiên qua navigation ổn định.
**Phụ thuộc:** không

---

## Bối cảnh

- `src/content/docs/docs/index.md` và hai page `guides/` hiện mô tả chính docs site, không mô tả sản phẩm.
- `astro.config.mjs` dùng sidebar thủ công cho trang đầu và autogenerate cho `guides/`.
- Installation claim lấy từ `alp-code/README.md`; command contract lấy từ `alp-code/src/cli/alp.ts`.

## Việc phải làm

1. Viết lại landing page: ALP giải quyết gì, mental model ngắn, đường đi cho người mới và người đã cài.
2. Tạo trang installation cho binary mặc định, npm wrapper, platform support, kiểm `alp --version`, update/uninstall an toàn. Đặt caution tại remote-script installer: cho phép inspect trước và pin `--version`.
3. Tạo quickstart: `alp init`, principal profile, chọn mode, mở `alp`, kiểm workspace registration.
4. Đổi sidebar thành bốn nhóm ổn định: Bắt đầu, Khái niệm, Hướng dẫn, Tham chiếu; khai rõ thứ tự page.
5. Xoá hai placeholder `guides/getting-started.md` và `guides/writing-markdown.md` sau khi link mới đã thay thế chúng.
6. Đặt danger callout sát `--purge-memory`: default uninstall backup memory; purge không nằm trong happy path.

## File đụng tới

- Sửa `astro.config.mjs` — navigation cho toàn sitemap.
- Sửa `src/content/docs/docs/index.md` — product landing page.
- Tạo `src/content/docs/docs/getting-started/installation.md` — cài đặt và bảo trì cơ bản.
- Tạo `src/content/docs/docs/getting-started/quickstart.md` — first successful session.
- Xoá `src/content/docs/docs/guides/getting-started.md` — placeholder bị thay thế.
- Xoá `src/content/docs/docs/guides/writing-markdown.md` — contributor content ngoài phạm vi.

## Tiêu chí hoàn thành

```bash
npm run build
test -f dist/docs/index.html
test -f dist/docs/getting-started/installation/index.html
test -f dist/docs/getting-started/quickstart/index.html
! rg -n 'ALP Docs là static site|Viết tài liệu bằng Markdown' src/content/docs/docs
```

## Rủi ro

- **Platform claim vượt bằng chứng:** không hứa target ngoài matrix hiện có; ghi giới hạn Linux musl/Windows arm64/notarization đúng nguồn.
- **Supply-chain/destructive copy-paste:** giải thích trust boundary của remote script, cách pin version và tác động không thể hoàn tác của memory purge ngay cạnh command.
- **Link cũ gãy:** sửa landing/sidebar cùng lúc và để Astro build bắt route/content lỗi.
- **Quickstart ngầm cho write:** nói rõ cwd chưa `alp init` là read-only và đưa bước kiểm registration trước khi giao việc.

## Cần principal duyệt

Không có thao tác khó đảo ngược. Xoá chỉ hai placeholder do MVP tạo, có thể phục hồi bằng git.
