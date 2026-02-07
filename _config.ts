import lume from "lume/mod.ts";
import pagefind from "lume/plugins/pagefind.ts";
import favicon from "lume/plugins/favicon.ts";
import feed from "lume/plugins/feed.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import remark from "lume/plugins/remark.ts";
import remarkShortcode from "./_plugins/remark-shortcode.ts";

const site = lume();

site.use(tailwindcss(/* Options */));
site.use(pagefind());
site.use(favicon({
  input: "/favicon.png",
}));
site.use(feed());
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

site.add("styles/tailwind.css"); //Add the entry point
export default site;
