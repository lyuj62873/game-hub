# Game Hub: Social Game List Platform
A social platform where users browse and like community game lists, create their own lists, search games via RAWG API, and write per-game reviews.

## Tech Stack
- **Framework**: Next.js 16 (App Router, React Compiler enabled)
- **Auth**: Clerk (User authentication)
- **Database**: Supabase (Postgres) via MCP
- **External API**: RAWG API (https://rawg.io/apidocs)
- **Styling**: Tailwind CSS (Dark theme, zinc-950/slate-900/cyan accents)

## Database Schema (Supabase)

### `lists` table
- `id`: uuid (primary key)
- `user_id`: text (Clerk user ID)
- `creator_name`: text (denormalized from Clerk at creation)
- `name`: text
- `description`: text (nullable)
- `created_at`: timestamptz (default: now())

### `list_items` table
- `id`: uuid (primary key)
- `list_id`: uuid (FK → lists.id CASCADE)
- `rawg_id`: integer (RAWG game ID)
- `game_name`: text
- `background_image`: text (nullable)
- `rating`: integer 1–5 (nullable, user's personal rating)
- `notes`: text (nullable, user's review/comment)
- `added_at`: timestamptz (default: now())
- UNIQUE (list_id, rawg_id)

### `list_likes` table (also used as bookmarks)
- `list_id`: uuid (FK → lists.id CASCADE)
- `user_id`: text (Clerk user ID)
- `created_at`: timestamptz (default: now())
- PRIMARY KEY (list_id, user_id)

## RLS Policies
- **lists/list_items**: SELECT public (no auth), INSERT/UPDATE/DELETE own rows only
- **list_likes**: SELECT public, INSERT/DELETE own rows only

## Routes
| Path | Auth | Purpose |
|---|---|---|
| `/` | No | Browse all public lists |
| `/lists/[id]` | No | View list + game reviews |
| `/lists/new` | Yes | Create a list |
| `/lists/[id]/edit` | Yes (owner) | Edit list, add/remove games, write reviews |
| `/my-lists` | Yes | Manage own lists |
| `/bookmarks` | Yes | View liked/bookmarked lists |
| `/api/games` | No | RAWG search proxy |
| `/api/lists/[id]/items` | Yes | Add game to list |
| `/api/lists/[id]/items/[itemId]` | Yes | Update/delete list item |

## Supabase Clients
- **`createServerSupabase()`** (`src/lib/supabase-server.ts`): anon client for Server Components reading public data
- **`useSupabaseClient()`** (`src/lib/supabase.ts`): Clerk JWT-authenticated client for Client Components mutations

## Development Guidelines
- **Project Structure**: Always use `src/` directory.
- **Component Patterns**: Default to Server Components. Use "use client" only for interactive elements.
- **API Strategy**: Fetch RAWG data via `/api/games` to protect API keys. Use Route Handlers for authenticated mutations.
- **MCP Usage**: Use Supabase MCP for schema modifications and data inspection.

## Required Secrets (.env.local)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RAWG_API_KEY`
- Also check @AGENTS.md
