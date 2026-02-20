import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

import expressiveCode from "astro-expressive-code";
import { pluginFileIcons } from "@xt0rted/expressive-code-file-icons";
import rehypeExternalLinks from "rehype-external-links";

// https://astro.build/config
export default defineConfig({
  site: "https://henrychung98.github.io",
  base: "/blog",
  markdown: {
    rehypePlugins: [[rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }]],
  },
  integrations: [
    expressiveCode({
      plugins: [
        // @ts-ignore
        pluginFileIcons({
          iconClass: "shrink-0 size-4",
          titleClass: "flex items-center gap-1",
        }),
      ],
      themes: ["dark-plus"],
    }),
    mdx({
      rehypePlugins: [[rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }]],
    }),
    sitemap(),
  ],
});
