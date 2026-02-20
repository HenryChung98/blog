---
title: "Deploy to Github Pages (Astro)"
description: "How to deploy a static site to Github Pages"
pubDate: "Jan 30 2026"
categories: ["DevOps"]
---

#### 1. Create .yml file

```text title="Required structure" no-icon
repository-root/
└── .github/
    └── workflows/
        └── deploy.yml  # or any-name.yml
```

```yml title="static.yml"
# Simple workflow for deploying static content to GitHub Pages
name: Deploy static content to Pages
on:
  # Runs on pushes targeting the default branch
  push:
    branches: ["main"]
  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:
# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write
# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: "pages"
  cancel-in-progress: false
jobs:
  # Single deploy job since we're just deploying
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: "dist"
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

This `.yml` file can be used for any project that requires a build step. Adjust the `path` parameter based on your framework's output directory:

- **Astro/Vite**: `path: 'dist'` (default)
- **Next.js**: `path: 'out'`
- **Create React App**: `path: 'build'`

---

#### 2. Configure astro.config.mjs

```js title="astro.config.mjs"
export default defineConfig({
  site: "https://yourusername.github.io",
  base: "/repository-name", // Required if repo name ≠ yourusername.github.io
});
```

---

#### 3. Verify package.json

```json title="package.json" icon="json"
{
  "scripts": {
    "build": "astro build"
  }
}
```

---

#### 4. Update Asset Paths

All internal links must include the base path:

❌ Wrong

`<a href="/posts">Blog</a>`

✅ Correct

`<a href="/repository-name/posts">Blog</a>`

---

#### 5. Enable GitHub Pages

Navigate to your repository settings:

- Go to **Settings** tab
- Click **Pages** in the left sidebar
- Under **Build and deployment**:
  - Source: Select **GitHub Actions** (not "Deploy from a branch")
- Click **Save**

---

#### 6. Deploy

Push to `main` branch:

```bash icon="powershell"
git push -u origin main
```

Workflow will run automatically. Check **Actions** tab to monitor deployment.
