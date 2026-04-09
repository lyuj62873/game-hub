'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useSupabaseClient } from '@/lib/supabase'

type Props = {
  listId: string
  initialCount: number
  initialLiked: boolean
}

export function LikeButton({ listId, initialCount, initialLiked }: Props) {
  const { user } = useUser()
  const supabase = useSupabaseClient()
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    if (!user) return
    setLoading(true)

    if (liked) {
      const { error } = await supabase
        .from('list_likes')
        .delete()
        .eq('list_id', listId)
        .eq('user_id', user.id)
      if (!error) {
        setLiked(false)
        setCount(c => c - 1)
      }
    } else {
      const { error } = await supabase
        .from('list_likes')
        .insert({ list_id: listId, user_id: user.id })
      if (!error) {
        setLiked(true)
        setCount(c => c + 1)
      }
    }

    setLoading(false)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={!user || loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
        liked
          ? 'bg-cyan-900/50 border-cyan-500/50 text-cyan-400'
          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-cyan-500/50 hover:text-cyan-400'
      } disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
      title={!user ? 'Sign in to like lists' : undefined}
    >
      <span>{liked ? '♥' : '♡'}</span>
      <span>{count}</span>
    </button>
  )
}
