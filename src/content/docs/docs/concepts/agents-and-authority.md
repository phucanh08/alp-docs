---
title: Agent và quyền
description: Hiểu built-in roles, capability grants và policy boundaries của ALP.
---

Agent trong ALP là một role có definition, không phải một model process tự do. Definition trả lời role là ai, được dùng gì, đọc/ghi ở đâu, delegate cho ai và phải kết thúc theo workflow nào.

## Built-in roles

| Role | Trách nhiệm |
|---|---|
| `main` | Coordinator làm việc trực tiếp với principal, tổng hợp và kiểm chứng kết quả |
| `search` | Tìm code và call site trong local repository |
| `librarian` | Nghiên cứu nguồn ngoài hoặc cross-repo |
| `read-thread` | Truy xuất quyết định và fact trong memory |
| `review` | Review code theo một concern có bằng chứng |
| `oracle` | Second opinion sâu cho quyết định khó |
| `compaction` | Tóm tắt context theo contract |
| `titling` | Sinh title ngắn |

`main` có thể delegate tới các role trên. Specialist không tự có quyền delegate chỉ vì đang làm thay `main`; quan hệ phải tồn tại trong definition.

## Sáu nhóm capability

1. **Tools:** tên tool role được gọi.
2. **Skills:** workflow/instruction package role được nạp.
3. **Memory:** logical scope role được đọc hoặc ghi.
4. **Workspace:** root được đọc/ghi và execution mode thực tế.
5. **Delegation/subagent/MCP:** capability phải vừa được khai vừa tồn tại trong catalog.
6. **Workflow:** tool còn phải được phép tại state hiện tại.

Write grant luôn phải nằm trong read grant tương ứng. Tên capability không tồn tại bị từ chối thay vì bỏ qua.

## Memory không kế thừa theo cấp bậc

- `shared` dành cho fact mọi role cần biết.
- `project:*` dành cho context của project.
- `private:<role>` chỉ role sở hữu đọc được.

Coordinator không được đọc private memory của specialist chỉ vì specialist báo cáo về coordinator. Kết quả cần chia sẻ phải được specialist trả qua output hoặc ghi vào scope được cấp.

## Workspace của phiên main

`main` nhận `workspace-write` khi project đã được đăng ký bằng `alp init`. Cwd chưa đăng ký là read-only. Delegated role còn bị giới hạn bởi workspace mode và roots của chính execution đó.

## Kiểm agent trước khi chạy

```bash
alp agent show review
alp agent test review
```

`agent test` chạy tối đa ba tầng, không gọi model:

- Tier 1: static definition, grants, skill roots và model/runtime mapping.
- Tier 2: dry-run preparation, authority, egress, cost và launch spec.
- Tier 3: các deny path phải trả đúng policy error.

Exit code `0` nghĩa là sạch; `1` nghĩa là có finding cần xử lý.

Tiếp theo: [Thiết lập project](../guides/project-setup/) hoặc [Custom agent](../guides/custom-agents/).
