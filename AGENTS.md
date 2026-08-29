# Repository Guidelines

## Project Structure & Module Organization

This is a TypeScript Hono multi-page application using server-side JSX and the Node.js adapter. The entry point is `src/index.tsx`, which registers auth routes before protecting other routes with `requireAuth`. Route handlers live in `src/routes/`; pages in `src/pages/`; reusable UI in `src/components/` and `src/layouts/`; database access in `src/repositories/`; and Drizzle schema/setup in `src/db/`. Shared helpers are under `src/lib/`, authentication middleware under `src/middleware/`, and styles/assets under `src/styles/`, `public/`, and `public/js/`. Migrations are in `drizzle/`; compiled `dist/` output should not be committed.

## Build, Test, and Development Commands

Run `npm install`, then `npm run dev` to start the server at `http://localhost:3000`. Use `npm run build` to generate CSS and compile TypeScript, and `npm start` to run output. Use `npm run build:css` for stylesheet-only changes. Database utilities are `npm run db:generate`, `npm run db:migrate`, and `npm run db:studio`; because `drizzle-kit push` is unreliable here, use raw scripts such as `node migrate-auth.mjs` for schema changes. There is no automated test script; run `npm run build` and exercise affected routes manually.

## Coding Style & Naming Conventions

Use strict TypeScript with ES modules and Hono JSX (`jsxImportSource: hono/jsx`). Use PascalCase for JSX components/pages (for example, `BookDetail.tsx`) and camelCase for utilities, repositories, and route modules. Keep DB access in repositories and auth behavior in middleware. Use Tailwind utility classes. New UI must be mobile-first: use `sm:`, `md:`, and `lg:` breakpoints, `modal-bottom sm:modal-middle` for modals, responsive grids, `min-w-0`, and `truncate`; avoid fixed widths that overflow.

## Testing Guidelines

No test framework or coverage threshold is configured. Verify browser flows locally and run `npm run build`. Test authenticated and unauthenticated paths when touching middleware or routes, and check mobile layouts when changing pages or components.

## Commit & Pull Request Guidelines

Git history is unavailable in this checkout, so no repository-specific convention can be confirmed. Use concise imperative subjects such as `Fix wishlist item deletion`, keep commits focused, and explain migrations or configuration changes in the body. Pull requests should describe behavior changes, list verification commands, mention database changes, link issues, and include screenshots for UI changes.

## Security & Configuration

Keep secrets and database credentials in local environment configuration; never commit them. Passwords must be stored only as `bcryptjs` hashes. Auth uses JWT HS256 in `src/middleware/auth.ts`, stored in a 30-day HttpOnly `session` cookie; preserve the algorithm when calling `sign` or `verify`, and review authorization for protected routes.
