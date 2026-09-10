# P2 — Extension, reference và kiểm chứng production

**Mục tiêu:** Người dùng tạo/trust agent và skill đúng trần capability, tra được toàn bộ public CLI, tự xử lý lỗi phổ biến và tìm thấy nội dung qua production search.
**Phụ thuộc:** P1

---

## Bối cảnh

- Custom agent contract nằm ở `alp-code/src/agents/loader/`; trust ở `src/trust/` và `src/cli/commands/agent-trust.ts`.
- Public CLI dispatch nằm ở `src/cli/alp.ts` và `src/cli/commands/*.ts`.
- Pagefind index chỉ có sau production build; checkpoint MVP đã duyệt kiểm search qua production preview.

## Việc phải làm

1. Viết tutorial custom agent từ `.alp/agents/<id>/agent.yaml` đến `test` → `add` → `show` → delegation; giải thích leaf role, capability ceiling, trust hash và re-approval. Đối chiếu từng field example với loader schema/ceiling, rồi kiểm cùng YAML bằng fixture tạm và `alp agent test --tier 1` nếu installed CLI khớp source; nếu không chạy được phải ghi rõ evidence thấp hơn.
2. Viết project skills: shared/per-agent layout, directory/symlink/`.skillref`, precedence, overlay built-in và escape denial.
3. Viết CLI reference cho toàn bộ public command, subcommand, option và exit behavior đã có nguồn; loại internal dispatch paths.
4. Viết troubleshooting theo symptom: read-only cwd, removed runtime flag, delegation denied, runtime missing, agent unloadable/untrusted/changed, context ID/integrity và doctor exit code.
5. Cross-link toàn sitemap, kiểm heading/frontmatter, toàn bộ page routes, responsive sidebar và production search cho các term `delegation`, `custom agent`, `continuity`.
6. Đặt source link ở CLI/troubleshooting và danger callout sát `uninstall --purge-memory`; ghi version nguồn hiện hành để rủi ro drift nhìn thấy được.

## File đụng tới

- Tạo `src/content/docs/docs/guides/custom-agents.md`.
- Tạo `src/content/docs/docs/guides/project-skills.md`.
- Tạo `src/content/docs/docs/reference/cli.md`.
- Tạo `src/content/docs/docs/reference/troubleshooting.md`.
- Có thể sửa các page P0/P1 và `astro.config.mjs` chỉ để chữa link/navigation phát hiện khi kiểm chứng.

## Tiêu chí hoàn thành

```bash
npm run build
test -f dist/docs/guides/custom-agents/index.html
test -f dist/docs/guides/project-skills/index.html
test -f dist/docs/reference/cli/index.html
test -f dist/docs/reference/troubleshooting/index.html
test -d dist/pagefind
for item in 'alp delegation status' 'alp delegation wait' 'alp delegation cancel' 'alp delegation cleanup' 'alp delegation list' 'alp agent test' 'alp agent add' 'alp agent show' 'alp agent untrust' 'alp agent list'; do rg -Fq "$item" src/content/docs/docs/reference/cli.md || exit 1; done
```

Sau build, chạy `npm run preview`, curl đủ 13 route trong sitemap và dùng UI search tìm ba term trên; không coi `npm run dev` là bằng chứng search. Kiểm output build không có broken-link warning.

## Rủi ro

- **Reference thiếu hoặc thêm command internal:** đối chiếu trực tiếp parser/USAGE trước build và giữ internal paths ngoài trang.
- **YAML copy-paste không load:** lấy schema từ loader/README hiện tại, giữ example tối thiểu và kiểm từng field với ceiling.
- **Semantic check lệch source:** installed stable `v0.10.4` chưa có `alp agent`; dùng dev launcher của checkout làm evidence bổ sung, đồng thời ghi rõ built artifact tự nhận `v0.10.0` nên source/schema comparison vẫn là bằng chứng chính.
- **Search build có index nhưng UX không dùng được:** kiểm qua production preview, không chỉ `test -d`.
- **Sửa lan sang visual/deploy:** mọi thay đổi ngoài content/sidebar phải dừng và báo principal vì ngoài phạm vi.

## Cần principal duyệt

Chỉ cần duyệt riêng nếu phát sinh thay đổi deploy/domain hoặc dependency; kế hoạch hiện tại không yêu cầu.
