import type { Plugin } from "npm:unified";
import { visit } from "npm:unist-util-visit";
import type { Root, Text } from "npm:@types/mdast";

/* ------------------------------
 * shortcode parser
 * ----------------------------- */

type YouTubeShortcode = {
  id: string;
};

function parseShortcode(value: string): YouTubeShortcode | null {
  const match = value.match(
    /\{\{<\s*youtube\s+id="([^"]+)"\s*>}}/
  );

  if (!match) return null;

  return {
    id: match[1],
  };
}

/* ------------------------------
 * render html
 * ----------------------------- */

function renderYouTube(id: string): string {
  return `
<div class="my-8">
  <div class="relative w-full overflow-hidden rounded-xl"
       style="padding-bottom: 56.25%;">
    <iframe
      class="absolute top-0 left-0 w-full h-full"
      src="https://www.youtube.com/embed/${id}"
      title="YouTube video player"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen>
    </iframe>
  </div>
</div>
`;
}

/* ------------------------------
 * remark plugin
 * ----------------------------- */

const remarkYouTube: Plugin<[], Root> = function () {
  return async function transformer(tree) {
    visit(tree, "text", (node: Text, index, parent) => {
      const parsed = parseShortcode(node.value);

      if (!parsed || !parent || index === undefined) {
        return;
      }

      parent.children[index] = {
        type: "html",
        value: renderYouTube(parsed.id),
      } as any;
    });
  };
};

export default remarkYouTube;
