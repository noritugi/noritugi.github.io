import { parse, stringify } from "https://deno.land/std@0.224.0/yaml/mod.ts";

// 設定
const BASE_URL = "https://blog.vuwuv.com";
const MASTODON_URL = Deno.env.get("MASTODON_URL")!;
const ACCESS_TOKEN = Deno.env.get("MASTODON_TOKEN")!;

if (!MASTODON_URL || !ACCESS_TOKEN) {
  console.error("MASTODON_URL と MASTODON_TOKEN を環境変数で設定してください");
  Deno.exit(1);
}

const filePath = Deno.args[0];
if (!filePath) {
  console.error("Usage: deno run post-toot.ts <postfile.md>");
  Deno.exit(1);
}

// Markdown 読み込み
let text = await Deno.readTextFile(filePath);
const fmMatch = text.match(/^---\s*([\s\S]*?)\s*---/);
if (!fmMatch) {
  console.error("YAML frontmatter not found");
  Deno.exit(1);
}

// Frontmatter を YAML として解析
const fmYaml = fmMatch[1];
const fm = parse(fmYaml) as Record<string, unknown>;

// title
const title = fm.title ?? "(タイトル不明)";

// slug と URL
let normalizedPath = filePath.replace(/\\/g, "/").replace(/^\.?\//, "");
const slug = normalizedPath.replace(/\.md$/, "");
const postUrl = `${BASE_URL}/${slug}/`;

// --- Mastodon に投稿する本文 ---
const tootText = `
📖 新しいブログ記事を公開しました！

📌 ${title}
🔗 ${postUrl}

コメントはこのトゥートに返信してください。

#乗継ログ
`.trim();

// Mastodon 投稿
const res = await fetch(`${MASTODON_URL}/api/v1/statuses`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ status: tootText, visibility: "public" }),
});

if (!res.ok) {
  console.error("投稿エラー:", await res.text());
  Deno.exit(1);
}

const json = await res.json();
const tootUrl = json.url;
console.log("Toot URL:", tootUrl);

// --- frontmatter に comments.src を追加 ---
if (!fm.comments) fm.comments = {};
(fm.comments as Record<string, string>)["src"] = tootUrl;

// YAML に変換
const newYaml = stringify(fm).trim();

// --- Markdown 全体を再構築 ---
const body = text.slice(fmMatch[0].length).trimStart();
const newMarkdown = `---\n${newYaml}\n---\n\n${body}`;

// 上書き保存
await Deno.writeTextFile(filePath, newMarkdown, { encoding: "utf-8" });

console.log("Markdown frontmatter を更新しました。");
