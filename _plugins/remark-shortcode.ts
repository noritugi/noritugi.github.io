import type { Plugin } from "npm:unified";
import { visit } from "npm:unist-util-visit";
import type { Root, Text } from "npm:@types/mdast";

/* ------------------------------
 * 型
 * ----------------------------- */

type PleromaStatus = {
  url: string;
  created_at: string;
  media_attachments: Array<{
    id: string;
    type: "image" | "video" | string;
    description: string | null;
    url: string;
  }>;
};

/* ------------------------------
 * キャッシュ（SSG 1ビルド内）
 * ----------------------------- */

const statusCache = new Map<string, PleromaStatus>();

/* ------------------------------
 * UI: フォールバックHTML
 * ----------------------------- */

function fallbackHTML(): string {
  return `
<div class="max-w-md text-center mx-auto my-8">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    stroke-width="1.5" stroke="currentColor"
    class="mx-auto size-20 text-gray-400 dark:text-gray-500">
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M12 9v3.75m9-.75a9 9 0 1 1-18 0
         9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
  </svg>

  <h2 class="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
    No items found
  </h2>

  <p class="mt-4 text-pretty text-gray-700 dark:text-gray-200">
    サーバーからの応答がないため、表示できません。後ほどお試しください。
  </p>
</div>
`;
}

/* ------------------------------
 * UI: 正常表示HTML
 * ----------------------------- */

function renderStatus(status: PleromaStatus): string {
  const date = new Date(status.created_at);
  const jp = new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Tokyo",
  }).format(date);

  const media = status.media_attachments
    .map((m) => {
      if (m.type === "video") {
        return `
<figure class="my-4">
  <video controls class="w-full rounded-lg">
    <source src="${m.url}">
  </video>
  ${m.description ? `<figcaption class="mt-1 text-center text-sm text-gray-500">${m.description}</figcaption>` : ""}
</figure>
`;
      }

      return `
<figure class="my-4">
  <img src="${m.url}" class="w-full rounded-lg" loading="lazy" />
  ${m.description ? `<figcaption class="mt-1 text-center text-sm text-gray-500">${m.description}</figcaption>` : ""}
</figure>
`;
    })
    .join("");

  return `
<section class="my-8 space-y-4">
  <a href="${status.url}" class="text-sm text-blue-600 dark:text-blue-400 underline">
    投稿日時: ${jp}
  </a>
  <div class="flex flex-col gap-4">
    ${media}
  </div>
</section>
`;
}

/* ------------------------------
 * fetch（低負荷）
 * ----------------------------- */

async function fetchStatus(instance: string, id: string): Promise<PleromaStatus> {
  const key = `${instance}:${id}`;
  if (statusCache.has(key)) {
    return statusCache.get(key)!;
  }

  const res = await fetch(`https://${instance}/api/v1/statuses/${id}`);
  if (!res.ok) throw new Error("fetch failed");

  const json = (await res.json()) as PleromaStatus;
  statusCache.set(key, json);
  return json;
}

/* ------------------------------
 * Hugo風 shortcode パーサ
 * ----------------------------- */

function parseShortcode(value: string): { instance: string; id: string } | null {
  const match = value.match(
    /\{\{<\s*pleroma\s+instance="([^"]+)"\s+id="([^"]+)"\s*>}}/
  );
  if (!match) return null;
  return { instance: match[1], id: match[2] };
}

/* ------------------------------
 * remark plugin 本体
 * ----------------------------- */

const remarkShortcode: Plugin<[], Root> = function () {
  return async function transformer(tree) {
    const jobs: Promise<void>[] = [];

    visit(tree, "text", (node: Text, index, parent) => {
      const parsed = parseShortcode(node.value);
      if (!parsed || !parent || index === undefined) return;

      const placeholder = { type: "html", value: "<!-- PLEROMA -->" };

      parent.children[index] = placeholder as any;

      jobs.push(
        (async () => {
          try {
            const status = await fetchStatus(parsed.instance, parsed.id);
            placeholder.value = renderStatus(status);
          } catch {
            placeholder.value = fallbackHTML();
          }
        })()
      );
    });

    await Promise.all(jobs);
  };
};

export default remarkShortcode;