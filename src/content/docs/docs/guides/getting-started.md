---
title: Bắt đầu
description: Làm quen với cấu trúc và cách chạy ALP Docs.
sidebar:
  order: 1
---

ALP Docs là static site: source là các file Markdown, output là HTML có thể deploy lên bất kỳ static host nào.

## Chạy local

Cài dependencies và mở development server:

```bash
npm install
npm run dev
```

Astro hiển thị URL local trong terminal. Thay đổi file trong `src/content/docs/docs/` sẽ được cập nhật ngay.

## Tạo production build

```bash
npm run build
npm run preview
```

Build tạo static output trong `dist/`. Search index Pagefind cũng được tạo ở bước này, vì vậy hãy dùng preview khi cần test search.

:::note[Development và search]
Search có thể không trả kết quả trong `npm run dev`. Đây là hành vi bình thường khi chưa có production index.
:::

## Cấu trúc cốt lõi

```text
src/
├── content/
│   └── docs/          # Markdown source of truth
├── content.config.ts  # Content collection
└── styles/
    └── custom.css    # Visual tokens
```

Tiếp theo, xem [Viết tài liệu bằng Markdown](../writing-markdown/) để tạo trang mới.
