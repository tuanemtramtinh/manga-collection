# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server with hot reload (tsx watch)
npm run build    # Compile TypeScript to dist/
npm start        # Run compiled output (requires build first)
node migrate-auth.mjs   # Create/update users table in DB
```

Server runs on http://localhost:3000.

## Architecture

This is a **Hono MPA** (Multi-Page Application) with JSX server-side rendering, running on the Node.js adapter (`@hono/node-server`).

- `src/index.tsx` — Entry point. Registers auth routes first (no auth guard), then applies `requireAuth` middleware to all other routes.
- `src/middleware/auth.ts` — JWT-based auth using `hono/jwt` (`sign`/`verify` with `'HS256'`). Session stored in `session` HttpOnly cookie (30-day expiry). Always pass `'HS256'` as the third argument to both `sign` and `verify`.
- `src/routes/` — Route handlers (Hono sub-routers). Auth routes: `/login`, `/register`, `/logout`.
- `src/pages/` — JSX page components rendered server-side. Accept `userEmail?: string` and pass it to `BaseLayout`.
- `src/layouts/base.tsx` — Shared HTML shell with theme toggle, user menu (email + logout), and toast system (`?welcome=1`, `?login=1`).
- `src/repositories/` — DB access via Drizzle ORM + postgres-js on Supabase.
- `src/db/schema.ts` — Drizzle schema (tables: books, volumes, goods, wishlist, sections, section_items, users).
- `src/lib/slug.ts` — Vietnamese diacritic → ASCII slugify + uniqueness check.
- `dist/` — Compiled output from `tsc`; not committed.

**TypeScript config**: ESNext target, NodeNext module resolution, strict mode, JSX set to `react-jsx`.

**DB migrations**: `drizzle-kit push` has a bug in v0.31.10. Use raw postgres-js scripts (e.g. `migrate-auth.mjs`) to create/alter tables directly.

**Passwords**: hashed with `bcryptjs` (cost 12). Never store plain text.

## Responsive Design

**Every new page and component must be designed mobile-first and responsive.** This is a hard requirement.

- Use Tailwind breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px).
- Default styles target mobile; larger screens override with `sm:` / `md:`.
- Modals: add `modal-bottom sm:modal-middle` so they slide up from bottom on mobile.
- Grids: use `grid-cols-1 sm:grid-cols-2` for forms; `auto-fill minmax(120px, 1fr)` for card grids.
- Buttons/text: use `hidden sm:inline` / `sm:hidden` to show/hide labels at breakpoints.
- Stats cards: smaller icon (`sm:hidden`) and larger icon (`hidden sm:block`) at each size, truncate long values.
- Never use fixed pixel widths on flex/grid children without a responsive fallback.
- `min-w-0` on flex children to prevent overflow; `truncate` on text that may overflow.
