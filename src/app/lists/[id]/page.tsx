import { notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { LikeButton } from '@/components/LikeButton'
import { GameItemReadOnly } from '@/components/GameItemReadOnly'
import type { ListItem } from '@/types'

type Props = { params: Promise<{ id: string }> }

export default async function ListPage({ params }: Props) {
  const { id } = await params
  const { userId } = await auth()

  const supabase = createServerSupabase()
  const { data: list } = await supabase
    .from('lists')
    .select(`*, list_items(*), list_likes(count)`)
    .eq('id', id)
    .single()

  if (!list) notFound()

  const likeCount = list.list_likes?.[0]?.count ?? 0
  const isOwner = userId === list.user_id

  // Check if current user has liked this list
  let userLiked = false
  if (userId) {
    const { data } = await supabase
      .from('list_likes')
      .select('user_id')
      .eq('list_id', id)
      .eq('user_id', userId)
      .maybeSingle()
    userLiked = !!data
  }

  const items: ListItem[] = list.list_items ?? []

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{list.name}</h1>
            <p className="text-zinc-500 mt-1">by {list.creator_name}</p>
            {list.description && (
              <p className="text-zinc-400 mt-3 text-sm leading-relaxed">{list.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0 pt-1">
            {isOwner && (
              <Link
                href={`/lists/${id}/edit`}
                className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-medium hover:border-zinc-600 hover:text-white transition-colors"
              >
                Edit
              </Link>
            )}
            <LikeButton listId={id} initialCount={likeCount} initialLiked={userLiked} />
          </div>
        </div>
      </div>

      {/* Games */}
      {items.length > 0 ? (
        <div className="flex flex-col gap-4">
          {items.map(item => (
            <GameItemReadOnly key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-zinc-500 text-center py-16">No games in this list yet.</p>
      )}
    </div>
  )
}
