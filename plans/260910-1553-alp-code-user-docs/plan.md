---
status: done
created: 2026-09-10
slug: alp-code-user-docs
source: plans/reports/research-260910-1553-alp-code-user-docs.md
blockedBy: []
blocks: []
---

# Public user docs cho `alp-code`

## Tổng quan

Thay ba trang placeholder của `alp-docs` bằng bộ tài liệu tiếng Việt hướng người dùng cho `alp-code`. Content giải thích cách cài, bắt đầu, vận hành, mở rộng và xử lý lỗi; code/tests hiện tại của `alp-code` thắng khi tài liệu nguồn mâu thuẫn. Giữ nguyên Astro/Starlight, visual shell, search và deployment.

Nguồn sự thật: [Báo cáo khảo sát](../reports/research-260910-1553-alp-code-user-docs.md).

**Ngoài phạm vi:** contributor/release docs, internals cấp maintainer, roadmap/proposal, automated cross-repo import, dependency mới, redesign, i18n, CMS, auth, versioning và thay đổi deploy/domain.

## Nguyên tắc bất biến

1. **Current code là contract.** Không sao chép claim stale từ design/history docs.
2. **Task-oriented và một chủ đề một nguồn.** CLI reference liệt kê cú pháp; guide giải thích workflow và link sang reference thay vì lặp bảng option.
3. **Không biến internal surface thành public API.** Bỏ `alp hook` và `alp __internal`; nêu rõ phần future-facing nếu buộc phải nhắc.
4. **Không thêm machinery.** Curated Markdown khớp Starlight hiện có; rủi ro drift chưa đủ để biện minh build-time sync.
5. **Ví dụ an toàn.** Dùng path/ID giả, không secret, không lệnh commit/push/deploy/purge như bước mặc định.

## Phạm vi và độ phức tạp

13 page + một sidebar, vượt 8 file vì mỗi user task cần URL/search entry độc lập. Không thêm module/lớp; ba phase chia theo hành trình đọc và phụ thuộc content.

## Phase

| Phase | Tên | Trạng thái |
|---|---|---|
| 0 | [Information architecture và onboarding](./phase-0-information-architecture-and-onboarding.md) | xong |
| 1 | [Core concepts và workflow hằng ngày](./phase-1-core-concepts-and-workflows.md) | xong |
| 2 | [Extension, reference và kiểm chứng production](./phase-2-extension-reference-and-verification.md) | xong |

## Câu hỏi còn mở

Không. Principal đã chọn phạm vi GIỮ NGUYÊN ngày 2026-09-10; curated Markdown là phương án nhỏ nhất tương thích kiến trúc hiện có.

## Rà đối kháng

### Lượt — 2026-09-10

**Phát hiện:** 7 (7 nhận, 0 bác)  
**Theo mức:** 0 CHẶN · 5 NÊN SỬA · 2 GHI NHẬN

| Nhóm | Xử lý | Áp vào |
|---|---|---|
| Installer/purge safety | Nhận có sửa | P0, P2 |
| YAML semantic check | Nhận có sửa | P2 |
| CLI/link/search coverage | Nhận có sửa | P2 |
| Platform evidence/content drift | Nhận, ghi giới hạn | Report, P0, P2 |

## Nhật ký kiểm chứng

### Lượt 1 — 2026-09-10

| Câu hỏi | Principal chọn | Ảnh hưởng |
|---|---|---|
| Phạm vi docs | GIỮ NGUYÊN | Giữ 13 page user-facing; loại contributor/release/roadmap |
| Áp dụng rà đối kháng và triển khai | Duyệt toàn bộ | Plan `in-progress`; triển khai P0 → P2 |

### Lượt 2 — 2026-09-10 (đóng P2)

| Kiểm | Kết quả |
|---|---|
| `npm run build` | 14 page; chỉ còn 2 warning tiền lệ (`Entry docs → 404`, sitemap thiếu `site` ở local build) |
| 13 route trên `npm run preview` | tất cả `200` |
| Link nội bộ + anchor | 19 link, 0 lỗi (kiểm bằng script resolve vào `dist/`) |
| Pagefind production | `delegation` 6, `custom agent` 8, `continuity` 3 kết quả, hit đầu đúng trang |
| CLI coverage | 10/10 command trong tiêu chí có mặt; không lộ `alp hook`/`__internal`/`run-main` |
| Semantic check `agent.yaml` | YAML trong guide load sạch qua `loadProjectAgents` thật (schema + ceiling), `reportsTo: main`, `delegatesTo: []`, `writeRoots: []` |
| Semantic check skill layout | cây directory/symlink/`.skillref` trong guide resolve đủ 4 grant; test âm: binding thoát root deny cả agent |

**Sửa phát sinh:** sơ đồ layout trong `project-skills.md` thiếu `.alp/skills/release-drill/`, làm `.skillref` ví dụ trỏ vào target không tồn tại.

**Giới hạn evidence:** stable binary đang cài là `0.10.4`, chưa có `alp agent`, nên semantic check chạy qua loader compiled của checkout `777113b` trên fixture tạm, không qua `alp agent test`. Nội dung custom agent/project skill được gắn nhãn preview đúng với thực tế đó.
