---
title: "Cover Letter Filler Project"
description: "Cover Letter Filler Project"
pubDate: "Mar 5 2026"
categories: ["Projects"]
---

<mark>**Live Demo:**</mark> [cover-letter-filler.vercel.app](https://cover-letter-filler.vercel.app/)

#### Tech Stack

- **Frontend:** Next.js, TypeScript, Shadcn UI, Tailwind CSS
- **Backend:** Oracle VM, Docker
- **Deploy:** Vercel

#### Features

- Square bracket-based keyword extraction and automated paragraph detection
- Editing of paragraph content
- PDF export using Gotenberg (Docker-based conversion)

#### Architecture

###### - API Routes

- `api/export-docx` — Manipulates XML directly with **JSZip**, returns DOCX
- `api/export-pdf` — Generates DOCX then sends to **Gotenberg** server hosted on **Oracle VM** for PDF conversion

#### Challenges

###### - PDF Conversion Server Deployment

Vercel’s serverless environment does not support long-running background processes, so it was not suitable for hosting Gotenberg as a continuously running service.

To solve this issue, I used an **Oracle Cloud Free Tier VM** and deployed Gotenberg with Docker, which allowed me to run it as a self-hosted service without additional cost.
