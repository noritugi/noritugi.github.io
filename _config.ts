import lume from "lume/mod.ts";
import pagefind from "lume/plugins/pagefind.ts";
import favicon from "lume/plugins/favicon.ts";
import feed from "lume/plugins/feed.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import remark from "lume/plugins/remark.ts";
import remarkShortcode from "./_plugins/remark-shortcode.ts";

const site = lume({
  location: new URL("https://blog.vuwuv.com"),
});

site.use(tailwindcss(/* Options */));
site.use(pagefind());
site.use(favicon({
  input: "/favicon.png",
}));
site.use(
  feed({
    output: ["/posts.rss"],

    // posts/ 配下の記事のみ対象
    query: "url^=/posts/",
    sort: "date=desc",

    info: {
      title: "乗継ログ",
      description: "インターネット乗継ログ",
      lang: "ja",
      generator: true,
    },

    items: {
      title: "=title",
      description: "=description",
      published: "=date",

      // 記事本文は配信しない
      content: "記事本文を読む",
    },
  }),
);
site.use(
  remark({
    remarkPlugins: [remarkShortcode],
  }),
);

site.preprocess([".html"], (pages) => {
  for (const page of pages) {
    page.data.filename = page.sourcePath;
  }
});

// デバッグ用
// site.preprocess([".md"], (pages) => {
//   for (const page of pages) {
//     console.log(page.data);
//   }
// });

site.add("styles/tailwind.css");
site.add("styles/pagefind-dark.css");
export default site;
