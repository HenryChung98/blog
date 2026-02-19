---
title: "Creating Static JSON API"
description: "How to create a static JSON API"
pubDate: "Feb 1 2026"
categories: ["Backend"]
---

#### Creating API Route

```ts title="src/pages/api/astro-example.json.ts"
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const allPosts = await getCollection("blog");
  const recentPosts = allPosts
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .slice(0, 6)
    .map((post) => ({
      id: post.id,
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.categories,
      url: `/${post.id}`,
    }));

  return new Response(JSON.stringify(recentPosts), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
```

```ts title="app/api/nextjs-example/route.ts"
import { getAllPosts } from "@/lib/posts";

export async function GET() {
  const allPosts = await getAllPosts();
  const recentPosts = allPosts
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 6)
    .map((post) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      pubDate: post.pubDate,
      categories: post.categories,
      url: `/${post.id}`,
    }));

  return Response.json(recentPosts, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
```

```ts title="src/routes/api/express-example/server.ts"
import express from "express";
import { getPosts } from "./lib/posts";

const app = express();

app.get("/api/recent-posts", async (req, res) => {
  const allPosts = await getPosts();
  const recentPosts = allPosts
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 6)
    .map((post) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      pubDate: post.pubDate,
      categories: post.categories,
      url: `/${post.id}`,
    }));

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(recentPosts);
});

app.listen(3000);
```

---

#### Consuming the API

```ts title="react-example.ts"
export default function Blog() {
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    fetch("https://your-domain.com/api/your-api.json")
      .then((res) => res.json())
      .then((data) => setRecentPosts(data));
  }, []);
```

---

#### How it works

1. **API Route** - Framework-specific endpoint that handles HTTP GET requests
2. **Fetch data** - Retrieve items from data source (content collection, file system, database)
3. **Sort & filter** - Order by date/field and limit results
4. **Transform** - Map to consistent JSON structure with only needed fields
5. **Response** - Return JSON with appropriate headers (Content-Type, CORS)
6. **Static generation** - Some frameworks can pre-render this at build time for performance

---

#### Why use static JSON APIs?

- **Performance** - Pre-generated at build time, served instantly via CDN
- **Cost** - No server processing per request, cheaper hosting
- **Reliability** - No database dependency or server failures
- **Simplicity** - No backend infrastructure needed for read-only data

---

#### Tradeoffs

- **Stale data** - Requires rebuild to update (not suitable for real-time data)
- **Build time** - Large datasets can slow down builds
- **Limited functionality** - No dynamic filtering, authentication, or POST requests

---

#### When to use

- Read-only content (blog posts, products, documentation)
- Infrequently updated data
- Public data that doesn't need authentication
- Headless CMS or static site generators
