# Khảo sát public documentation cho `alp-code`

Ngày khảo sát: 2026-09-10.

## Thách thức phạm vi

- **Đã có sẵn:** `alp-code/README.md` mô tả hầu hết user surface; `alp-code/docs/` có architecture, delegation và design notes; `alp-docs` đã có Starlight, navigation, search, dark mode và deployment.
- **Tập tối thiểu:** overview, installation, quickstart, core concepts, project setup, delegation, memory/continuity, custom agents/skills, CLI reference và troubleshooting.
- **Hoãn:** maintainer/release, contributor internals, roadmap/proposal, tự động import content giữa hai repo và thay đổi deploy/visual shell.
- **Độ phức tạp:** khoảng 13 content page và một sidebar. Vượt 8 file vì mỗi task cần URL/search entry riêng; không thêm module hoặc dependency.
- **Hướng đã chốt:** GIỮ NGUYÊN — principal chọn ngày 2026-09-10.

## Nguồn và thứ tự tin cậy

Khi nguồn mâu thuẫn: code + tests hiện tại → `README.md` → tài liệu chuyên đề. Vision/proposal không được trình bày như capability đã phát hành.

Nguồn chính đã đọc:

- `/Users/oaidq/AnhlpProjects/alp-workspace/alp-code/src/policy/invariants.ts`
- `/Users/oaidq/AnhlpProjects/alp-workspace/alp-code/src/agents/shared/house-rules.ts`
- `/Users/oaidq/AnhlpProjects/alp-workspace/alp-code/src/agents/main.ts`
- `/Users/oaidq/AnhlpProjects/alp-workspace/alp-code/README.md`
- `/Users/oaidq/AnhlpProjects/alp-workspace/alp-code/docs/architecture.md`
- `/Users/oaidq/AnhlpProjects/alp-workspace/alp-code/docs/delegation.md`
- `/Users/oaidq/AnhlpProjects/alp-workspace/alp-code/src/cli/alp.ts`
- `/Users/oaidq/AnhlpProjects/alp-workspace/alp-code/src/cli/commands/*.ts`
- `/Users/oaidq/AnhlpProjects/alp-workspace/alp-code/src/agents/loader/*.ts`
- `/Users/oaidq/AnhlpProjects/alp-workspace/alp-code/test/`

Vai `search` khảo sát độc lập trong execution `exec_fd5f466afd044e56a3e8`; báo cáo hoàn tất nhưng execution bị huỷ sau đó vì Stop hook cũ lặp vô hạn. Các kết luận dưới đây đã được đối chiếu lại với file nguồn.

## User surface đã kiểm chứng

| Nhóm | Contract hiện tại | Nguồn code |
|---|---|---|
| Phiên main | `alp [--mode low|medium|high|ultra|puck]`; mode quyết model, model quyết runtime | `src/cli/alp.ts:57`, `src/agents/modes.ts:32` |
| Project | `alp init [path]`, `alp deinit [path]`; project đã đăng ký mới cho `main` quyền write | `src/cli/alp.ts:90`, `src/cli/commands/init.ts:217` |
| Principal | `alp principal show|set` | `src/cli/alp.ts:108`, `src/cli/commands/principal.ts:127` |
| Agent | `test`, `add`, `show`, `untrust`, `list` cùng các option trong usage | `src/cli/commands/agent.ts:27` |
| Delegation | `alp delegate <role> [--background] [--timeout-ms N] [--project path] -- <task>` và lifecycle `status|wait|cancel|cleanup|list` | `src/cli/commands/delegate.ts:47` |
| Continuity | `context status|validate|pin|unpin`; pin thuộc execution, không phải notes chung | `src/cli/commands/context.ts:25` |
| Bảo trì | `doctor [--quiet]`, `update`, `uninstall [--purge-memory] [--force]`, `--version` | `src/cli/alp.ts:118`, `src/cli/entry.ts:15` |

`alp hook …` và `alp __internal …` là internal dispatch path, không thuộc public CLI reference.

## Core concepts cần giải thích

1. **Mode và runtime routing:** không có public `--runtime`; thứ tự chọn mode là flag → `ALP_MODE` → saved preference → TTY menu → `medium`.
2. **AgentDefinition và fail-closed policy:** definition giới hạn tools, skills, memory, workspace, delegation và workflow trước khi runtime chạy.
3. **Project registration:** `alp init` tạo project extension space và local runtime wiring; `.alp/` thuộc project, generated runtime config thuộc ALP.
4. **Execution snapshot:** identity, policy và launch spec được chuẩn bị bất biến trước spawn.
5. **Delegation lifecycle:** authorize/prepare → probe → queue → spawn → terminal status; background trả execution ID ngay.
6. **Memory scopes:** `shared`, `project`, `private:<role>`; policy nằm trên storage adapter.
7. **Continuity:** checkpoint và compact journal theo execution; pin phải ngắn, không chứa secret/file content.
8. **Custom agent trust:** YAML bị giới hạn capability, custom agent là leaf, trust ghim hash theo project + agent ID và thay đổi file làm mất trust.
9. **Project skills:** directory, one-hop symlink hoặc `.skillref`; resolution cụ thể thắng chung và không được thoát skill root.

## Điểm drift phải tránh

- `docs/delegation.md` còn mô tả `ContextBuilder`, `reuseSession`, provider hint, raw context và các flag/wrapper cũ như `--pane`, `--exec`, `--release`; không sao chép các contract này.
- `docs/model-routing.md` chứa model/provider facts dễ đổi và hướng dẫn `/model`; public docs phải lấy bảng hiện tại từ `MODE_PROFILES` và không mô tả runtime-native override như ALP contract.
- `docs/orchestrator-vision.md` và phần proposal trong design docs là tương lai, không phải tính năng hiện hành.
- `alp init` hiện wiring SessionStart cho Claude qua `.claude/settings.local.json`; không khái quát thành cấu hình project tương đương cho mọi runtime.
- Installation/platform matrix chưa được chạy lại trong khảo sát này; chỉ dùng claim từ release/README hiện tại và nói rõ giới hạn khi cần.

## So sánh cách triển khai

| Phương án | Hợp khi | Đánh đổi | Chi phí đảo ngược |
|---|---|---|---|
| Curated Markdown trong `alp-docs` | Cần task-oriented public docs, khớp Starlight hiện có | Có rủi ro drift; phải đối chiếu code/tests khi cập nhật | Thấp: sửa/xoá từng page |
| Import hoặc generate từ `alp-code` lúc build | Muốn một nguồn content tuyệt đối | Coupling hai repo/CI, cần thêm pipeline và nguồn hiện tại chưa task-oriented | Trung bình: tháo build integration và phục hồi content |

**Chọn curated Markdown.** Đây là thay đổi nhỏ nhất, không thêm dependency và cho phép tách current capability khỏi design history. Source fidelity được giữ bằng source map trong plan và build/preview checks, không bằng automation mới.

## Sitemap đề xuất

- `docs/index.md`
- `docs/getting-started/installation.md`
- `docs/getting-started/quickstart.md`
- `docs/concepts/how-alp-works.md`
- `docs/concepts/modes-and-runtimes.md`
- `docs/concepts/agents-and-authority.md`
- `docs/guides/project-setup.md`
- `docs/guides/delegation.md`
- `docs/guides/memory-and-continuity.md`
- `docs/guides/custom-agents.md`
- `docs/guides/project-skills.md`
- `docs/reference/cli.md`
- `docs/reference/troubleshooting.md`

## Uncertainty

Checkout được khảo sát là branch `feat/agent-test` tại commit `777113b`, sau tag `v0.10.4`. Custom agents, project skills và `alp agent …` nằm trong `[Chưa phát hành]`; installed stable binary cùng machine chưa có surface này. Không chạy installer/release matrix. Build của `alp-docs` chỉ chứng minh content/render/search, không chứng minh availability của provider hay từng platform binary.
