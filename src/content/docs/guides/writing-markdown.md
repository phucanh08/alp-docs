---
title: Viết tài liệu bằng Markdown
description: Quy ước ngắn gọn để thêm content rõ ràng và dễ tìm.
sidebar:
  order: 2
---

Mỗi file `.md` trong `src/content/docs/` trở thành một trang. Thư mục và tên file quyết định URL; frontmatter cung cấp metadata cho navigation và SEO.

## Frontmatter tối thiểu

Mỗi trang cần `title` và nên có `description`:

```yaml
---
title: Tên trang
description: Một câu cho biết người đọc sẽ làm được gì.
sidebar:
  order: 3
---
```

## Tổ chức một trang

1. Mở đầu bằng kết quả người đọc sẽ đạt được.
2. Chia quy trình thành các heading ngắn, có thể quét nhanh.
3. Đặt command và code trong fenced code block có language.
4. Kết thúc bằng cách kiểm chứng hoặc bước tiếp theo.

### Callout

Dùng callout khi thông tin cần tách khỏi luồng chính:

```md
:::caution[Kiểm tra trước khi chạy]
Mô tả rõ tác động và cách quay lui.
:::
```

:::caution[Không đưa secret vào docs]
Static output là nội dung công khai. Dùng tên biến mô phỏng trong ví dụ, không dùng credential thật.
:::

## Kiểm chứng

Chạy `npm run build`. Build phải fail khi frontmatter sai hoặc content không hợp lệ; không bỏ qua lỗi để deploy trang hỏng.
