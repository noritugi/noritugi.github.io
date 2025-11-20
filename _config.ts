import lume from "lume/mod.ts";
import blog from "blog/mod.ts";
import markdown from "lume/plugins/markdown.ts";

const site = lume();

site.use(markdown({
  options: {
    linkify: true, // ← 自動リンク化を有効化
  },
}));

site.use(blog());

export default site;
