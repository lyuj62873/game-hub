<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Component Strategy
- **Default to Server Components**: Fetch data from RAWG API or Supabase in Server Components whenever possible.
- **Client Components**: Use "use client" only for interactive UI (e.g., search input, favorite toggle, login buttons).
- **React Compiler**: The project has React Compiler enabled. Avoid manual `useMemo` or `useCallback` unless specifically requested for stable object references.

## State & Data Fetching
- **Server Components (public data)**: Use `createServerSupabase()` from `src/lib/supabase-server.ts` to read public tables (`lists`, `list_items`, `list_likes`) without auth.
- **Client Components (mutations)**: Use `useSupabaseClient()` from `src/lib/supabase.ts` for authenticated Supabase writes (likes). It injects the Clerk JWT automatically.
- **Route Handlers**: Use for authenticated mutations requiring Clerk's `auth()` server helper (e.g., adding/updating/removing list items). Located in `src/app/api/lists/`.
- **API Routes**: RAWG API requests must go through `/api/games` to protect the API key.

## Styling
- **Tailwind CSS**: Use Tailwind for all styling.
- **Theme**: Stick to a dark-themed gaming aesthetic. Use `slate-900` or `zinc-950` as primary backgrounds.
- **Responsive**: Ensure the game grid is responsive (e.g., `grid-cols-1 md:grid-cols-3 lg:grid-cols-4`).

## Tools
- **Supabase MCP**: Use the Supabase MCP to inspect schema and verify data. 
- **Clerk**: Follow the `@clerk/nextjs` App Router integration patterns.
<!-- END:nextjs-agent-rules -->
