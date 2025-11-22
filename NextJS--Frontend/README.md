# VyomGarud Mission Log (Strapi × Next.js)

A military-grade blogging front-end for *VyomGarud*, a UAV/drone systems company. Built with **Next.js 16** on top of a **Strapi** CMS, it ships a charcoal/orange visual identity, animated hero, featured debrief, system taxonomy pills, post grid, and markdown-driven mission reports.

## Requirements

- Node.js 20+
- Running Strapi instance exposing `/api/posts` with related `author`, `categories`, `tags`, and `cover`

## Environment variables

Create `blog/.env.local` with:

```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Install & run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` (ensure Strapi runs on `localhost:1337`).

## Project structure highlights

- `app/page.tsx` - mission-themed landing page with hero, featured briefing, taxonomy pills, and CTA panels.
- `app/posts/[slug]/page.tsx` - rich article view with markdown rendering, author meta, and share links styled for VyomGarud.
- `components/` - header, footer, cards, tag pills, containers, and motion effects.
- `lib/strapi.ts` - typed helpers for fetching + normalizing Strapi responses.
- `types/content.ts` - shared content contracts and Strapi relation typings.

## Content workflow

1. Use Strapi admin to create authors, categories, tags, and posts (with cover images and markdown content).
2. Publish entries; the frontend fetches them server-side (no caching) for instant previews.
3. Deploy the Next.js app (Vercel, Render, etc.) and point `NEXT_PUBLIC_STRAPI_URL` at your Strapi deployment.

## Scripts

- `npm run dev` - Next.js dev server.
- `npm run build` - production build.
- `npm run lint` - ESLint (run before commits).

You now have a CMS-driven mission log tailored for VyomGarud’s UAV updates, announcements, and tactical progress reports.
