# P1 — Core concepts và workflow hằng ngày

**Mục tiêu:** Người dùng hiểu policy model và thực hiện đúng project setup, mode selection, delegation, memory và continuity.
**Phụ thuộc:** P0

---

## Bối cảnh

Nguồn chính: `alp-code/src/agents/`, `src/policy/`, `src/execution/`, `src/delegation/`, `src/memory/`, `src/context/` và tests tương ứng. `docs/delegation.md` có contract cũ nên chỉ dùng code/tests cho CLI và lifecycle.

## Việc phải làm

1. Viết mental model từ definition → policy snapshot → runtime launch → terminal execution state; giải thích fail-closed bằng tình huống người dùng thấy được.
2. Viết modes/runtimes: năm mode, precedence, model quyết runtime; không hướng dẫn `--runtime` hoặc `/model` như ALP contract.
3. Viết agents/authority: built-in roles, tools/skills/memory/workspace/delegation grants và ranh giới private memory.
4. Viết project setup: artifact nào project sở hữu, artifact nào machine-local/generated, `init`, `deinit`, principal và identity sync.
5. Viết delegation foreground/background, lifecycle command, cancellation/cleanup và policy denial trước spawn.
6. Gộp memory + continuity vào một guide: scope, nơi lưu, pin kind, explicit execution ID, validation và cảnh báo không pin secret/file content.
7. Cross-link guide với CLI reference dự kiến; không lặp toàn bộ options.

## File đụng tới

- Tạo `src/content/docs/docs/concepts/how-alp-works.md`.
- Tạo `src/content/docs/docs/concepts/modes-and-runtimes.md`.
- Tạo `src/content/docs/docs/concepts/agents-and-authority.md`.
- Tạo `src/content/docs/docs/guides/project-setup.md`.
- Tạo `src/content/docs/docs/guides/delegation.md`.
- Tạo `src/content/docs/docs/guides/memory-and-continuity.md`.

## Tiêu chí hoàn thành

```bash
npm run build
test "$(find dist/docs/concepts dist/docs/guides -name index.html | wc -l | tr -d ' ')" -ge 6
! rg -n 'ContextBuilder|reuseSession|--pane|--exec|--release|alp --runtime|alp runtime|/model' src/content/docs/docs
```

Mỗi page phải có ít nhất một “kiểm chứng” hoặc expected outcome; mọi command có trong code block phải tồn tại trong public parser/usage hoặc được ghi rõ là path/file, không phải CLI.

## Rủi ro

- **Narrative docs stale:** bảng mode/role chỉ mô tả source hiện tại và tránh claim provider mang tính dự báo.
- **Trùng lặp:** guide link đến reference cho flags; concepts link đến guide cho procedure.
- **Lộ private memory:** ví dụ chỉ dùng ID giả và nhấn mạnh role ownership; không minh hoạ đọc chéo private scope.
- **Lifecycle bị hiểu là retry-safe:** chỉ mô tả status contract đã kiểm; không hứa retry/resume không có trong code.

## Cần principal duyệt

Không.
