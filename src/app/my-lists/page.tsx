import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase-server'
import { ListCard } from '@/components/ListCard'
import type { GameList } from '@/types'

export default async function MyListsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const supabase = createServerSupabase()
  const { data: lists } = await supabase
    .from('lists')
    .select(`id, user_id, creator_name, name, description, created_at, list_items(background_image), list_likes(count)`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Lists</h1>
          <p className="text-zinc-500 mt-1">Manage your game collections</p>
        </div>
        <Link
          href="/lists/new"
          className="px-4 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-sm font-medium transition-colors border border-cyan-600"
        >
          + New List
        </Link>
      </div>

      {lists && lists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(lists as unknown as GameList[]).map(list => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-zinc-500">
          <p className="text-lg">You haven&apos;t created any lists yet.</p>
          <Link href="/lists/new" className="text-cyan-500 hover:text-cyan-400 mt-2 inline-block">
            Create your first list →
          </Link>
        </div>
      )}
    </div>
  )
}
