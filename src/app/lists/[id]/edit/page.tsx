'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { useSupabaseClient } from '@/lib/supabase'
import { GameSearch } from '@/components/GameSearch'
import { GameItem } from '@/components/GameItem'
import type { ListItem, RawgGame } from '@/types'

export default function EditListPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useUser()
  const supabase = useSupabaseClient()
  const router = useRouter()

  const [listName, setListName] = useState('')
  const [description, setDescription] = useState('')
  const [items, setItems] = useState<ListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [savingMeta, setSavingMeta] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  useEffect(() => {
    if (!user) return
    supabase
      .from('lists')
      .select('*, list_items(*)')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data || data.user_id !== user.id) {
          router.replace('/')
          return
        }
        setListName(data.name)
        setDescription(data.description ?? '')
        setItems(data.list_items ?? [])
        setLoading(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.id])

  async function handleSaveMeta(e: React.FormEvent) {
    e.preventDefault()
    setSavingMeta(true)
    await supabase
      .from('lists')
      .update({ name: listName.trim(), description: description.trim() || null })
      .eq('id', id)
    setSavingMeta(false)
    showToast('List updated!')
  }

  async function handleGameAdded(game: RawgGame) {
    // Optimistically add item (will be refreshed from server on reload)
    setItems(prev => [...prev, {
      id: crypto.randomUUID(),
      list_id: id,
      rawg_id: game.id,
      game_name: game.name,
      background_image: game.background_image,
      rating: null,
      notes: null,
      added_at: new Date().toISOString(),
    }])
  }

  async function handleUpdate(itemId: string, notes: string, rating: number | null) {
    await fetch(`/api/lists/${id}/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, rating }),
    })
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, notes, rating } : i))
    showToast('Saved!')
  }

  async function handleRemove(itemId: string) {
    await fetch(`/api/lists/${id}/items/${itemId}`, { method: 'DELETE' })
    setItems(prev => prev.filter(i => i.id !== itemId))
  }

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-zinc-500">Loading…</div>
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Edit List</h1>
        <Link
          href={`/lists/${id}`}
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          ← View list
        </Link>
      </div>

      {/* Metadata form */}
      <form onSubmit={handleSaveMeta} className="flex flex-col gap-4 mb-10 p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">List Name</label>
          <input
            type="text"
            value={listName}
            onChange={e => setListName(e.target.value)}
            required
            maxLength={80}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={300}
            rows={2}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={savingMeta}
          className="self-end px-4 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
        >
          {savingMeta ? 'Saving…' : 'Save Details'}
        </button>
      </form>

      {/* Add games */}
      <h2 className="text-lg font-semibold text-white mb-4">Add Games</h2>
      <div className="mb-8">
        <GameSearch
          listId={id}
          existingRawgIds={items.map(i => i.rawg_id)}
          onGameAdded={handleGameAdded}
        />
      </div>

      {/* Games list */}
      {items.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-white mb-4">Games in this List</h2>
          <div className="flex flex-col gap-4">
            {items.map(item => (
              <GameItem
                key={item.id}
                item={item}
                isOwner
                onUpdate={handleUpdate}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-800 border border-cyan-500 text-cyan-400 px-4 py-3 rounded-lg shadow-2xl text-sm font-medium">
          ✓ {toast}
        </div>
      )}
    </div>
  )
}
