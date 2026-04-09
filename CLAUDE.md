# Game Hub: Full-Stack Game Tracker
A social platform to search video games (via RAWG API) and save favorites to a personal library.

## Tech Stack
- **Framework**: Next.js 15 (App Router, React Compiler enabled)
- **Auth**: Clerk (User authentication)
- **Database**: Supabase (Postgres) via MCP
- **External API**: RAWG API (https://rawg.io/apidocs)
- **Styling**: Tailwind CSS (Dark Mode by default)

## Database Schema (Supabase)
### `favorites` table:
- `id`: uuid (primary key)
- `user_id`: text (Clerk user ID)
- `game_name`: text
- `rawg_id`: integer (unique ID from RAWG API)
- `background_image`: text (URL for game poster)
- `rating`: integer (1-5 user rating)
- `notes`: text (User's personal comments)
- `created_at`: timestamptz (default: now())

## Development Guidelines
- **Project Structure**: Always use `src/` directory.
- **Component Patterns**: Use React Server Components (RSC) for data fetching where possible. Use "use client" only for interactive elements.
- **API Strategy**: Fetch RAWG data via Next.js Route Handlers (`/api/games`) to protect API keys.
- **MCP Usage**: Use Supabase MCP for schema modifications and data inspection.

## Required Secrets (.env.local)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RAWG_API_KEY`
- Also check @AGENTS.md
