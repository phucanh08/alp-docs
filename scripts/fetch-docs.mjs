#!/usr/bin/env node
// fetch-docs.mjs — kéo docs/user/ của alp-code về cây build của site.
//
//   node scripts/fetch-docs.mjs [--ref main] [--from <đường dẫn checkout local>]
//
// Content là của alp-code, không phải của repo này: nó đi cùng commit sinh ra nó, nên
// một thay đổi code và câu văn mô tả nó nằm chung một chỗ. Repo này chỉ giữ khung site.
//
// Hai nguồn, cùng một kết quả:
//   - `--from` hoặc ALP_CODE_PATH: copy từ checkout local, cho vòng lặp sửa docs offline.
//   - mặc định: tải tarball của ref trên GitHub.
//
// Đích là `src/content/docs/docs/`, và thư mục đó nằm trong .gitignore. Coi nó như build
// output: mọi thứ trong đó sẽ bị xoá sạch mỗi lần chạy.

import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "src/content/docs/docs");
const sidebarOut = join(root, "src/generated/sidebar.json");

const REPO = process.env.ALP_CODE_REPO || "phucanh08/alp-code";
const SOURCE_DIR = "docs/user";
// README.md là hướng dẫn cho người sửa docs trong alp-code, không phải một trang của site.
// Nó không có frontmatter `title` nên để lọt vào content collection là gãy build.
const NOT_A_PAGE = new Set(["README.md", "sidebar.json"]);

const args = process.argv.slice(2);
if (args.includes("-h") || args.includes("--help")) usage(0);
const ref = valueOf("--ref") || process.env.ALP_CODE_REF || "main";
const localPath = valueOf("--from") || process.env.ALP_CODE_PATH || "";

const source = localPath ? fromLocal(localPath) : await fromGitHub(ref);

// -------------------------------------------------------------------------- ghi ra

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });

const pages = [];
for (const file of walk(source)) {
  const rel = relative(source, file);
  if (NOT_A_PAGE.has(rel)) continue;
  mkdirSync(dirname(join(dest, rel)), { recursive: true });
  cpSync(file, join(dest, rel));
  if (rel.endsWith(".md")) pages.push(rel.slice(0, -3));
}

const sidebar = JSON.parse(readFileSync(join(source, "sidebar.json"), "utf8"));
validate(sidebar, pages);

mkdirSync(dirname(sidebarOut), { recursive: true });
writeFileSync(sidebarOut, JSON.stringify(sidebar, null, 2) + "\n");

log("OK", `${pages.length} trang từ ${REPO}@${localPath ? localPath : ref}`);

// ------------------------------------------------------------------------ nguồn

function fromLocal(path) {
  const dir = join(path, SOURCE_DIR);
  if (!existsSync(dir)) die(`không thấy ${SOURCE_DIR} trong ${path}`);
  log("LOCAL", dir);
  return dir;
}

/** Tarball chứ không phải git clone: runner không cần credential, và không kéo cả lịch sử. */
async function fromGitHub(ref) {
  const url = `https://codeload.github.com/${REPO}/tar.gz/${encodeURIComponent(ref)}`;
  const response = await fetch(url, { headers: { "user-agent": "alp-docs-fetch" } });
  if (!response.ok) die(`tải ${REPO}@${ref} thất bại: HTTP ${response.status}`);

  const work = join(tmpdir(), `alp-docs-fetch-${process.pid}`);
  rmSync(work, { recursive: true, force: true });
  mkdirSync(work, { recursive: true });
  const tarball = join(work, "src.tar.gz");
  writeFileSync(tarball, Buffer.from(await response.arrayBuffer()));

  // --strip-components=1 bỏ thư mục `<repo>-<sha>/` mà GitHub bọc ngoài tarball.
  execFileSync("tar", ["-xzf", tarball, "-C", work, "--strip-components=1"], { stdio: "pipe" });

  const dir = join(work, SOURCE_DIR);
  if (!existsSync(dir)) die(`${REPO}@${ref} không có thư mục ${SOURCE_DIR}`);
  log("FETCH", `${REPO}@${ref}`);
  return dir;
}

// ----------------------------------------------------------------- kiểm tra sớm

/**
 * Fail ở đây thay vì để Starlight fail: sidebar.json trỏ vào file không tồn tại là một
 * commit ở repo khác làm gãy build ở repo này, nên thông báo phải chỉ thẳng ra file nào.
 */
function validate(sidebar, pages) {
  const known = new Set(pages);
  const listed = new Set();
  const missing = [];

  for (const group of sidebar.groups ?? []) {
    for (const item of group.items ?? []) {
      const path = item.path === "" ? "index" : item.path;
      listed.add(path);
      if (!known.has(path)) missing.push(`${group.label} → ${item.label} (${item.path || "index"}.md)`);
    }
  }

  if (missing.length) {
    die(
      `sidebar.json trỏ vào ${missing.length} trang không tồn tại trong ${REPO}:${SOURCE_DIR}\n` +
        missing.map((m) => `         - ${m}`).join("\n"),
    );
  }

  // Trang thiếu trong sidebar không phải lỗi: nó vẫn build và vẫn truy cập được bằng URL,
  // chỉ là không có trong navigation. Cảnh báo để người sửa docs thấy mình quên.
  const orphans = pages.filter((p) => !listed.has(p));
  for (const orphan of orphans) log("WARN", `${orphan}.md không có trong sidebar.json`);
}

// ---------------------------------------------------------------------- tiện ích

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* walk(path);
    else yield path;
  }
}

function valueOf(flag) {
  const index = args.indexOf(flag);
  return index === -1 ? "" : (args[index + 1] ?? "");
}

function log(label, message) {
  console.log(`${label.padEnd(8)} ${message}`);
}

function die(message) {
  console.error(`LỖI     ${message}`);
  process.exit(1);
}

function usage(code) {
  console.log(
    [
      "fetch-docs.mjs — kéo docs/user/ của alp-code vào src/content/docs/docs/",
      "",
      "  --ref <ref>     branch, tag hoặc sha của alp-code (mặc định: main)",
      "  --from <path>   copy từ checkout local thay vì tải về",
      "",
      "Biến môi trường: ALP_CODE_REPO, ALP_CODE_REF, ALP_CODE_PATH",
    ].join("\n"),
  );
  process.exit(code);
}
