<div align="center">

# ✈️ VyomGarud Mission Log (Next.js × Strapi CMS)

Full-stack blogging platform for the VyomGarud UAV/drone program. The Next.js 16 frontend delivers a cinematic mission log, while the Strapi v5 CMS stores posts, categories, tags, authors, and media assets.

</div>

## 🧱 Architecture Snapshot

- **NextJS--Frontend/** → Next.js App Router (TypeScript, Tailwind CSS 4, React 19). Fetches content via `lib/strapi.ts` and renders hero sections, featured missions, taxonomy chips, search, modals, and single-post pages.
- **StrapiCMS(NodeJS)--Backend/** → Strapi 5 (Node 20). Ships ready-made content types (`post`, `category`, `tag`, `author`), REST/GraphQL APIs, media library, and RBAC. Uses SQLite (`.tmp/data.db`) by default; Postgres/MySQL available via `.env`.
- **Content Flow** → Strapi persists structured data + uploads. Next.js fetches `/api/posts`, `/api/categories`, `/api/tags`, `/api/authors` (with relations) and hydrates UI components. No other databases or services are involved.
- A Mermaid diagram that mirrors this stack lives in `.azure/architecture.copilotmd` (open it with a Mermaid preview extension for visuals).

```
Next.js UI (http://localhost:3000)
	↓ REST/GraphQL fetch
Strapi CMS API (http://localhost:1337)
	↓ via Knex ORM
SQLite / Postgres / MySQL + public/uploads media
```

## ✨ Feature Highlights

### Frontend (Next.js 16)
- 🎯 **Animated Parallax Hero** with charcoal/orange VyomGarud branding and CTA buttons.
- 📰 **Featured Debrief & Mission Grid** (cards, hover states, modal quick-read).
- 🧭 **Category Carousel & Tag Pills** for fast taxonomy navigation.
- 🔍 **Server/Client Search** with debounced query + keyboard shortcuts.
- 📄 **Rich Markdown Rendering** (`react-markdown`) for `[slug]` article pages.
- 🌗 **Theme Toggle + Scroll Reveal** micro-interactions powered by custom hooks.
- 📱 **Responsive Layout** using shared `Container` component (desktop → mobile).

### Backend (Strapi 5.31)
- 🧑‍✈️ **Authors, Posts, Categories, Tags** modelled in `src/api/*` with relations & validations.
- 🖼️ **Media Library** storing covers and inline assets in `public/uploads`.
- 🔐 **RBAC & Auth** via Strapi Users & Permissions plugin (ready for API tokens/JWT).
- ⚙️ **Configurable Database** (SQLite default, Postgres/MySQL via env vars in `config/database.ts`).
- 🔁 **Auto-generated REST & GraphQL endpoints** plus Admin UI for editors.

## 🗂️ Repository Layout

| Path | Description |
| --- | --- |
| `NextJS--Frontend/` | Next.js 16 application (App Router, Tailwind v4, React 19). |
| `StrapiCMS(NodeJS)--Backend/` | Strapi 5 project with content types & public uploads. |
| `.azure/architecture.copilotmd` | Mermaid diagram + reminder to install Mermaid preview. |
| `.vscode/` | Suggested VS Code settings.

## ✅ Prerequisites

- Node.js **20.x** (works up to 24 per Strapi engines).
- npm 9+/pnpm/yarn (examples use npm).
- Two terminals (or tmux) to run frontend and backend concurrently.
- For production DBs: Postgres/MySQL + connection string (optional when staying on SQLite).

## 🛠️ Setup Instructions

### 1. Clone

```bash
git clone https://github.com/Umesh-L/VyomGarud--Blogging-site.git
cd VyomGarud--Blogging-site
```

### 2. Configure Environment Files

**Frontend → `NextJS--Frontend/.env.local`**

```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Backend → `StrapiCMS(NodeJS)--Backend/.env` (sample)**

```
APP_KEYS=replace-with-four-random-strings
API_TOKEN_SALT=random-string
ADMIN_JWT_SECRET=random-string
TRANSFER_TOKEN_SALT=random-string

DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
# For Postgres/MySQL replace with DATABASE_HOST, PORT, NAME, USER, PASSWORD, SSL, etc.

HOST=0.0.0.0
PORT=1337
```

Strapi generates these automatically on first run; edit as needed.

## 🚀 Running Locally (two terminals)

### Terminal A – Strapi backend

```bash
cd StrapiCMS(NodeJS)--Backend
npm install
npm run develop   # hot reload, seeds SQLite `.tmp/data.db`
```

Backend available at `http://localhost:1337` with admin panel at `/admin`.

### Terminal B – Next.js frontend

```bash
cd NextJS--Frontend
npm install
npm run dev       # Next.js dev server
```

Visit `http://localhost:3000`. Ensure `NEXT_PUBLIC_STRAPI_URL` points to the running Strapi instance.

## 📦 Production Builds

| App | Command | Notes |
| --- | --- | --- |
| Strapi | `npm run build && npm run start` | Builds admin assets, starts without autoReload. |
| Next.js | `npm run build && npm run start` | Generates optimized server/SSR output. |

Deploy anywhere Node 20 is available (Vercel, Render, Railway, custom VM). Point the frontend’s env vars to the deployed Strapi URL.

## 📝 Content Workflow

1. Log into Strapi Admin (`/admin`) and create **Authors**, **Categories**, and **Tags** first.
2. Create **Posts** with cover image, excerpt, markdown content, featured flag, and relations.
3. Publish posts → API immediately exposes them at `/api/posts?populate=*`.
4. Refresh the Next.js site; SSR fetches the latest missions. Search + mission metrics update instantly.

## 📚 Important Files

- `NextJS--Frontend/lib/strapi.ts` – typed fetch helpers (getPosts, getFeaturedPost, getPostBySlug, getCategories, etc.).
- `NextJS--Frontend/types/content.ts` – TS interfaces mapping Strapi responses.
- `StrapiCMS(NodeJS)--Backend/src/api/*` – content-type schemas, controllers, services, routes.
- `StrapiCMS(NodeJS)--Backend/config/database.ts` – DB client selection (sqlite/mysql/postgres).

## 🧪 Scripts Reference

| Location | Script | Purpose |
| --- | --- | --- |
| Frontend | `npm run dev` | Next.js dev server (hot reload). |
| Frontend | `npm run build` / `npm run start` | Production build and serve. |
| Frontend | `npm run lint` | ESLint via `eslint-config-next`. |
| Backend | `npm run develop` | Strapi dev with autoReload. |
| Backend | `npm run build` | Builds Strapi admin panel. |
| Backend | `npm run start` | Production start (no autoReload). |
| Backend | `npm run console` | Opens Strapi console. |

## 🧩 Troubleshooting

- **Strapi fails to start** → Remove `.tmp/` & `.cache/`, then rerun `npm run develop` (rebuilds SQLite DB). Verify Node ≥ 20.
- **Next.js can’t fetch** → Confirm `NEXT_PUBLIC_STRAPI_URL` matches running backend and that content is published (not draft). Check browser console for CORS errors.
- **Media not loading** → Ensure Strapi’s `public/uploads` contains the asset and the URL is absolute (`${NEXT_PUBLIC_STRAPI_URL}${image.url}`).

## 🤝 Contributing / Customizing

- Adjust palette/brand tokens via `NextJS--Frontend/app/globals.css` + component classes.
- Add new Strapi components/content-types under `StrapiCMS(NodeJS)--Backend/src/components` or `src/api` to extend mission data.
- Use Strapi’s GraphQL plugin (optional) if you prefer GraphQL queries from Next.js.

Enjoy building the VyomGarud mission log! 🛩️
