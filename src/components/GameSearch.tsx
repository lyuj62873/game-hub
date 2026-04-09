'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useDebounce } from '@/hooks/useDebounce'
import type { RawgGame } from '@/types'

type Props = {
  listId: string
  existingRawgIds: number[]
  onGameAdded: (game: RawgGame) => void
}

export function GameSearch({ listId, existingRawgIds, onGameAdded }: Props) {
  const [query, setQuery] = useState('')
  const [games, setGames] = useState<RawgGame[]>([])
  const [loading, setLoading] = useState(false)
  const [addingId, setAddingId] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setGames([])
      return
    }
    setLoading(true)
    fetch(`/api/games?search=${encodeURIComponent(debouncedQuery)}`)
      .then(r => r.json())
      .then(data => { setGames(data.results ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [debouncedQuery])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  async function handleAdd(game: RawgGame) {
    setAddingId(game.id)
    const res = await fetch(`/api/lists/${listId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rawg_id: game.id,
        game_name: game.name,
        background_image: game.background_image,
      }),
    })
    setAddingId(null)
    if (res.ok) {
      onGameAdded(game)
      showToast(`"${game.name}" added!`)
    } else {
      showToast('Failed to add game.')
    }
  }

  const existingSet = new Set(existingRawgIds)

  return (
    <div className="relative">
      <div className="relative mb-4">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for a game to add..."
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
        />
        {loading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">Searching…</span>
        )}
      </div>

      {games.length > 0 && (
        <ul className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
          {games.map(game => {
            const already = existingSet.has(game.id)
            return (
              <li key={game.id} className="flex items-center gap-3 p-3 hover:bg-zinc-800 transition-colors">
                {game.background_image && (
                  <div className="relative w-14 h-10 shrink-0 rounded overflow-hidden">
                    <Image src={game.background_image} alt={game.name} fill className="object-cover" sizes="56px" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{game.name}</p>
                  <p className="text-zinc-500 text-xs">★ {game.rating.toFixed(1)}</p>
                </div>
                <button
                  onClick={() => handleAdd(game)}
                  disabled={already || addingId === game.id}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer ${
                    already
                      ? 'border-zinc-700 text-zinc-600 cursor-default'
                      : 'border-zinc-700 text-zinc-300 hover:border-cyan-500 hover:text-cyan-400'
                  } disabled:opacity-50`}
                >
                  {already ? 'Added' : addingId === game.id ? '…' : '+ Add'}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-800 border border-cyan-500 text-cyan-400 px-4 py-3 rounded-lg shadow-2xl text-sm font-medium">
          ✓ {toast}
        </div>
      )}
    </div>
  )
}
