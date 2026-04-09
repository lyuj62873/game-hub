import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase-server'
import { ListCard } from '@/components/ListCard'
import type { GameList } from '@/types'

export default async function BookmarksPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const supabase = createServerSupabase()
  // Fetch lists that the user has liked
  const { data: likes } = await supabase
    .from('list_likes')
    .select(`list_id, lists(id, user_id, creator_name, name, description, created_at, list_items(background_image), list_likes(count))`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const lists = (likes ?? [])
    .map(l => l.lists)
    .filter(Boolean) as unknown as GameList[]

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Bookmarked Lists</h1>
        <p className="text-zinc-500 mt-1">Lists you&apos;ve liked and saved</p>
      </div>

      {lists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {lists.map(list => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-zinc-500">
          <p className="text-lg">No bookmarks yet.</p>
          <Link href="/" className="text-cyan-500 hover:text-cyan-400 mt-2 inline-block">
            Browse community lists →
          </Link>
        </div>
      )}
    </div>
  )
}
