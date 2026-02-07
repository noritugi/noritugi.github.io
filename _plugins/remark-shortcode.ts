import { visit } from "npm:unist-util-visit";

function formatJST(dateString: string) {
  const d = new Date(dateString);
  return d.toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function placeholderHTML() {
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

export default function remarkPleroma() {
  return async (tree) => {
    const tasks: Promise<void>[] = [];

    visit(tree, "text", (node, index, parent) => {
      const match = node.value.match(
        /\{\{<\s*pleroma\s+instance="([^"]+)"\s+id="([^"]+)"\s*>\}\}/
      );
      if (!match) return;

      const [, instance, id] = match;

      tasks.push((async () => {
        try {
          const api = `https://${instance}/api/v1/statuses/${id}`;
          const res = await fetch(api, { headers: { accept: "application/json" } });

          if (!res.ok) throw new Error("fetch failed");

          const json = await res.json();

          const created = formatJST(json.created_at);
          const noticeUrl = json.url;

          const mediaHTML = (json.media_attachments ?? []).map((m) => {
            const media =
              m.type === "video"
                ? `<video controls class="w-full rounded-lg">
                     <source src="${m.url}" type="${m.pleroma?.mime_type ?? "video/mp4"}">
                   </video>`
                : `<img src="${m.url}" alt="${m.description ?? ""}"
                     class="w-full rounded-lg" loading="lazy" />`;

            const desc = m.description
              ? `<p class="mt-1 text-xs text-gray-600 dark:text-gray-400">
                   ${m.description}
                 </p>`
              : "";

            return `
<div class="space-y-1">
  ${media}
  ${desc}
</div>
`;
          }).join("");

          parent.children[index] = {
            type: "html",
            value: `
<div class="pleroma-embed my-8 space-y-4">
  <a href="${noticeUrl}"
     class="block text-sm text-gray-500 hover:underline"
     target="_blank" rel="noopener">
    ${created}
  </a>

  <div class="flex flex-col gap-6">
    ${mediaHTML}
  </div>
</div>
`,
          };
        } catch {
          parent.children[index] = {
            type: "html",
            value: placeholderHTML(),
          };
        }
      })());
    });

    await Promise.all(tasks);
  };
}
