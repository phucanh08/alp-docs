#!/usr/bin/env node
// sync-release.mjs — đối chiếu docs với release mới nhất của alp-code.
//
//   node scripts/sync-release.mjs [--tag vX.Y.Z] [--check] [--report <path>]
//
// Script làm ĐÚNG phần suy được từ một cái tag: chuỗi version, commit pin và link
// kiểm chứng. Phần còn lại — banner preview nào phải xoá, CLI reference nào đã lệch —
// nó KHÔNG tự sửa, chỉ đo rồi viết ra report để người đọc PR quyết định.
//
// Lý do tách như vậy: một release đưa `alp agent` vào stable thì banner "chưa có trong
// stable v0.10.4" phải bị xoá, không phải đổi số. Tự đổi số là biến docs từ cũ thành sai.

import { readFileSync, writeFileSync, appendFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pinFile = join(root, "alp-code-pin.json");
const docsRoot = join(root, "src/content/docs/docs");

const args = process.argv.slice(2);
if (args.includes("-h") || args.includes("--help")) usage(0);
const checkOnly = args.includes("--check");
const requestedTag = valueOf("--tag");
const reportPath = valueOf("--report");
for (const arg of args)
  if (arg.startsWith("--") && !["--tag", "--check", "--report", "--help"].includes(arg) && !isValue(arg))
    die(`tham số lạ: ${arg}`);

const pin = JSON.parse(readFileSync(pinFile, "utf8"));
const repo = pin.repo;

// ------------------------------------------------------------------ phía upstream
// `||` chứ không phải `??`: workflow_dispatch với input bỏ trống truyền xuống chuỗi rỗng,
// và chuỗi rỗng phải rơi về "lấy release mới nhất" chứ không phải resolve ref rỗng.
const tag = requestedTag || (await latestReleaseTag());
const sha = await resolveSha(tag);

log("PINNED", `stable ${pin.stable} · nguồn kiểm chứng ${pin.pin.slice(0, 7)}`);
log("LATEST", `${tag} · ${sha.slice(0, 7)}`);

// Drift đo theo TAG, không theo sha. `pin` cố ý được phép chạy trước `stable`: docs mô tả
// preview source sau tag mới nhất, và đó là trạng thái làm việc bình thường chứ không phải
// lỗi. Chỉ khi có release mới thì cả hai mới cùng nhảy.
if (tag === pin.stable) {
  emit({ drift: "false", tag, previous: pin.stable });
  log("OK", `chưa có release nào mới hơn ${pin.stable} — không có gì để làm`);
  process.exit(0);
}

emit({ drift: "true", tag, sha, previous: pin.stable });

if (checkOnly) {
  log("DRIFT", `docs đang mô tả stable ${pin.stable}, upstream đã phát hành ${tag}`);
  process.exit(1);
}

// ------------------------------------------------------------------ phần máy sửa được
const rewrites = rewriteDocs(pin, { stable: tag, pin: sha });
for (const [file, count] of rewrites) log("EDIT", `${file} (${count} thay thế)`);
if (rewrites.length === 0) log("EDIT", "không file nào đổi — kiểm lại giá trị trong alp-code-pin.json");

writeFileSync(
  pinFile,
  JSON.stringify({ ...pin, stable: tag, pin: sha, syncedAt: new Date().toISOString().slice(0, 10) }, null, 2) + "\n",
);
log("EDIT", "alp-code-pin.json");

// ------------------------------------------------------------------ phần cần người đọc
const report = await buildReport(pin, { stable: tag, pin: sha }, rewrites);
if (reportPath) {
  writeFileSync(reportPath, report);
  log("REPORT", relative(root, reportPath));
} else {
  console.log("\n" + report);
}

// ------------------------------------------------------------------------- upstream

async function latestReleaseTag() {
  const release = await api(`/repos/${repo}/releases/latest`);
  if (release?.tag_name) return release.tag_name;
  const tags = await api(`/repos/${repo}/tags?per_page=1`);
  if (Array.isArray(tags) && tags[0]?.name) return tags[0].name;
  die(`không đọc được release hay tag nào của ${repo}`);
}

/** `/commits/<ref>` resolve cả branch, tag thường lẫn annotated tag về đúng commit sha. */
async function resolveSha(ref) {
  const commit = await api(`/repos/${repo}/commits/${encodeURIComponent(ref)}`);
  if (!commit?.sha) die(`không resolve được ref ${ref} trong ${repo}`);
  return commit.sha;
}

async function api(path) {
  const headers = { accept: "application/vnd.github+json", "user-agent": "alp-docs-sync" };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(`https://api.github.com${path}`, { headers });
  if (response.status === 404) return null;
  if (!response.ok) die(`GitHub API ${response.status} cho ${path}`);
  return response.json();
}

/** Trả `null` thay vì chết: pin cũ có thể nằm trên branch đã xoá, và report vẫn phải ra. */
async function raw(ref, path) {
  const response = await fetch(`https://raw.githubusercontent.com/${repo}/${ref}/${path}`, {
    headers: { "user-agent": "alp-docs-sync" },
  });
  return response.ok ? response.text() : null;
}

// -------------------------------------------------------------------- codemod

function rewriteDocs(from, to) {
  // Dài trước ngắn: full sha phải được thay trước, nếu không short sha khớp vào tiền tố
  // của chính nó và để lại phần đuôi rác.
  const substitutions = [
    [from.pin, to.pin],
    [from.pin.slice(0, 7), to.pin.slice(0, 7)],
    [from.stable, to.stable],
    [from.stable.replace(/^v/, ""), to.stable.replace(/^v/, "")],
  ].filter(([before, after]) => before !== after);

  const changed = [];
  for (const file of markdownFiles(docsRoot)) {
    const original = readFileSync(file, "utf8");
    let text = original;
    let count = 0;
    for (const [before, after] of substitutions) {
      const parts = text.split(before);
      count += parts.length - 1;
      text = parts.join(after);
    }
    if (text !== original) {
      writeFileSync(file, text);
      changed.push([relative(root, file), count]);
    }
  }
  return changed;
}

function markdownFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) out.push(...markdownFiles(path));
    else if (path.endsWith(".md") || path.endsWith(".mdx")) out.push(path);
  }
  return out.sort();
}

// --------------------------------------------------------------------- report

async function buildReport(from, to, rewrites) {
  const lines = [
    `## Đồng bộ ${from.stable} → ${to.stable}`,
    "",
    `Pin: \`${from.pin.slice(0, 7)}\` → [\`${to.pin.slice(0, 7)}\`](https://github.com/${repo}/commit/${to.pin})`,
    "",
    "### Đã sửa tự động",
    "",
    ...(rewrites.length
      ? rewrites.map(([file, count]) => `- \`${file}\` — ${count} thay thế`)
      : ["- (không có)"]),
    "",
    ...(await changelogSection(to.stable)),
    "",
    ...(await helpDiff(from.pin, to.pin)),
    "",
    ...previewChecklist(to.stable),
    "",
    "### Trước khi merge",
    "",
    "- [ ] Mọi banner preview ở trên: giữ hay xoá, theo release notes chứ không theo số version.",
    "- [ ] `reference/cli.md` khớp help diff ở trên.",
    "- [ ] `npm run build` xanh và link check không gãy.",
  ];
  return lines.join("\n") + "\n";
}

async function changelogSection(tag) {
  const changelog = await raw(tag, "CHANGELOG.md");
  if (!changelog) return ["### CHANGELOG", "", `Không đọc được \`CHANGELOG.md\` tại \`${tag}\`.`];
  const version = tag.replace(/^v/, "");
  const start = changelog.indexOf(`## [${version}]`);
  if (start === -1) return ["### CHANGELOG", "", `Không tìm thấy mục \`## [${version}]\` trong CHANGELOG.`];
  const rest = changelog.slice(start);
  const nextHeading = rest.indexOf("\n## ", 1);
  const section = (nextHeading === -1 ? rest : rest.slice(0, nextHeading)).trim();
  return ["### CHANGELOG của bản này", "", section];
}

/**
 * Diff riêng `helpText()` chứ không diff cả `alp.ts`: khối đó là public command surface,
 * nên một dòng đổi ở đây gần như luôn kéo theo `reference/cli.md`, còn phần còn lại của
 * file đổi liên tục mà không ảnh hưởng gì tới docs.
 */
async function helpDiff(fromRef, toRef) {
  const [before, after] = await Promise.all([raw(fromRef, "src/cli/alp.ts"), raw(toRef, "src/cli/alp.ts")]);
  if (!before || !after)
    return ["### CLI surface", "", "Không đọc được `src/cli/alp.ts` ở một trong hai ref — cần rà `reference/cli.md` bằng tay."];

  const oldLines = helpLines(before);
  const newLines = helpLines(after);
  if (!oldLines.length || !newLines.length)
    return ["### CLI surface", "", "Không tách được `helpText()` — cần rà `reference/cli.md` bằng tay."];

  const removed = oldLines.filter((line) => !newLines.includes(line));
  const added = newLines.filter((line) => !oldLines.includes(line));
  if (!removed.length && !added.length) return ["### CLI surface", "", "`helpText()` không đổi giữa hai ref."];

  return [
    "### CLI surface đã đổi",
    "",
    "```diff",
    ...removed.map((line) => `- ${line}`),
    ...added.map((line) => `+ ${line}`),
    "```",
    "",
    "Đối chiếu với `src/content/docs/docs/reference/cli.md`.",
  ];
}

/** Lấy các string literal trong mảng mà `helpText()` trả về. */
function helpLines(source) {
  const start = source.indexOf("function helpText()");
  if (start === -1) return [];
  const body = source.slice(start, source.indexOf("\n}", start));
  return [...body.matchAll(/"((?:[^"\\]|\\.)*)"/g)]
    .map((match) => match[1].trim())
    .filter((line) => line.startsWith("alp"));
}

/**
 * Chỉ bắt hai dạng thật sự là lời hứa về version: aside mở đầu bằng "Preview", và câu
 * vừa nói preview vừa nhắc số version. Nếu bắt mọi chữ "preview" thì `npm run preview`
 * và text pin ví dụ cũng lọt vào, làm checklist dài tới mức không ai đọc.
 */
function previewChecklist(version) {
  const bare = version.replace(/^v/, "");
  const hits = [];
  for (const file of markdownFiles(docsRoot)) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, index) => {
      const aside = /^:::[a-z]+\[[^\]]*preview/i.test(line.trim());
      const claim =
        /preview|chưa có trong stable/i.test(line) && (line.includes(version) || line.includes(bare));
      if (aside || claim)
        hits.push(`- [ ] \`${relative(root, file)}:${index + 1}\` — ${line.trim().slice(0, 140)}`);
    });
  }
  return hits.length
    ? ["### Banner preview cần quyết định", "", "Codemod đã đổi số version trong các dòng này. Nếu tính năng đã vào stable thì phải **xoá** banner, không phải đổi số:", "", ...hits]
    : ["### Banner preview cần quyết định", "", "Không còn dòng nào nhắc preview."];
}

// ---------------------------------------------------------------------- tiện ích

function valueOf(flag) {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
}

function isValue(arg) {
  const index = args.indexOf(arg);
  return index > 0 && ["--tag", "--report"].includes(args[index - 1]);
}

function log(label, message) {
  console.log(`${label.padEnd(8)} ${message}`);
}

/** Ngoài GitHub Actions thì `GITHUB_OUTPUT` không tồn tại và hàm này là no-op. */
function emit(values) {
  if (!process.env.GITHUB_OUTPUT) return;
  const lines = Object.entries(values)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`);
  appendFileSync(process.env.GITHUB_OUTPUT, lines.join("\n") + "\n");
}

function die(message) {
  console.error(`LỖI     ${message}`);
  process.exit(2);
}

function usage(code, message) {
  if (message) console.error(`LỖI     ${message}`);
  console.log("node scripts/sync-release.mjs [--tag vX.Y.Z] [--check] [--report <path>]");
  console.log("  --tag     ref cụ thể thay vì release mới nhất của alp-code");
  console.log("  --check   chỉ báo có drift hay không (exit 1 nếu có), không ghi file");
  console.log("  --report  ghi report ra file thay vì stdout");
  process.exit(code);
}
