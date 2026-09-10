# Rà đối kháng plan `alp-code` user docs

Ngày rà: 2026-09-10. Đường chạy: tự rà qua Kẻ tấn công → Kẻ phá giả định → Người phân tích failure mode. Plan chưa được sửa theo các phát hiện dưới đây.

## Kết quả đã khử trùng lặp

### 1. Installer copy-paste thiếu trust boundary — NÊN SỬA

- **Lăng kính:** Kẻ tấn công
- **Ở đâu:** P0, “Việc phải làm” mục 2
- **Sai gì:** Plan yêu cầu đưa direct installer nhưng chưa bắt buộc giải thích rủi ro của `curl | bash`/`irm | iex` hoặc lựa chọn pin version.
- **Hỏng thế nào:** Người đọc copy command remote execution mà không biết có thể inspect script hoặc pin release; docs vô tình bình thường hoá supply-chain trust không được nói ra.
- **Đề nghị:** Thêm caution và đường pin `--version`; không tự tuyên bố checksum flow đã được kiểm trong lượt này.

### 2. Lệnh purge/destructive chưa có guard cụ thể — NÊN SỬA

- **Lăng kính:** Kẻ tấn công
- **Ở đâu:** P0 installation và P2 CLI reference
- **Sai gì:** Nguyên tắc “không làm mặc định” chưa bắt buộc callout sát `alp uninstall --purge-memory`.
- **Hỏng thế nào:** Người đọc tra reference, copy flag và xoá memory vì warning chỉ tồn tại trong plan chứ không nằm cạnh command.
- **Đề nghị:** Bắt buộc danger callout, mô tả default backup và tách `--purge-memory` khỏi happy path.

### 3. Example custom agent chưa có semantic check — NÊN SỬA

- **Lăng kính:** Kẻ phá giả định
- **Ở đâu:** P2, “Tiêu chí hoàn thành”
- **Sai gì:** Build chỉ kiểm Markdown; không chứng minh YAML tutorial được loader hiện tại chấp nhận.
- **Hỏng thế nào:** Page render xanh nhưng người dùng copy `agent.yaml` rồi `alp agent test` fail vì schema/ceiling drift.
- **Đề nghị:** Thêm một check read-only/isolated cho example hoặc buộc đối chiếu từng field với `src/agents/loader/schema.ts` và `ceiling.ts`; không claim executable nếu không chạy được.

### 4. CLI coverage regex chỉ cần một alternative match — NÊN SỬA

- **Lăng kính:** Kẻ phá giả định
- **Ở đâu:** P2, “Tiêu chí hoàn thành”
- **Sai gì:** Regex `(status|wait|…)` pass nếu chỉ một subcommand tồn tại.
- **Hỏng thế nào:** Reference thiếu bốn lifecycle command vẫn đóng phase xanh.
- **Đề nghị:** Lặp qua danh sách command/subcommand và `rg -q` từng item.

### 5. Broken-link/search check chưa tái lập đầy đủ — NÊN SỬA

- **Lăng kính:** Người phân tích failure mode
- **Ở đâu:** P2, “Tiêu chí hoàn thành”
- **Sai gì:** “mở/curl bốn route” và “dùng UI search” chưa ghi exact route/command/result; không kiểm toàn bộ cross-link.
- **Hỏng thế nào:** Build có Pagefind directory nhưng navigation hoặc link giữa page gãy; người thực thi chọn bốn route thuận lợi và bỏ sót route hỏng.
- **Đề nghị:** Ghi exact representative routes + expected status, kiểm tất cả HTML route tồn tại từ sitemap, và quy định ba query phải trả result qua production preview.

### 6. Curated copy chưa có tín hiệu chống drift sau bàn giao — GHI NHẬN

- **Lăng kính:** Người phân tích failure mode
- **Ở đâu:** Plan, nguyên tắc 1 và 4
- **Sai gì:** Source map nằm trong `plans/`; page không có dấu chỉ nguồn/version cho maintainer tương lai.
- **Hỏng thế nào:** CLI đổi nhưng docs build vẫn xanh và không ai biết page nào cần rà.
- **Đề nghị:** Gắn source comments hoặc “Nguồn kiểm chứng” gọn vào page/reference; không thêm automation cross-repo trong scope này.

### 7. Platform matrix chưa được thực thi lại — GHI NHẬN

- **Lăng kính:** Kẻ phá giả định
- **Ở đâu:** P0 installation
- **Sai gì:** Report đã thừa nhận không chạy installer/release matrix.
- **Hỏng thế nào:** Docs có thể mô tả target theo README nhưng release artifact hiện tại không đủ hoặc provider CLI không có trên máy người đọc.
- **Đề nghị:** Giữ wording theo “supported release targets”, link release evidence khi có; không claim đã test platform trong task docs.

## Phân xử đề xuất

| # | Mức | Đề xuất |
|---|---|---|
| 1–5 | NÊN SỬA | Nhận và sửa plan trước triển khai |
| 6–7 | GHI NHẬN | Nhận như constraint/uncertainty, không mở rộng automation hay chạy matrix |

Tổng: 0 CHẶN · 5 NÊN SỬA · 2 GHI NHẬN. Đề nghị nhận cả 7; chỉ 1–5 làm thay đổi phase.
