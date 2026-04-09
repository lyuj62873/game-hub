'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ListItem } from '@/types'

type Props = {
  item: ListItem
  isOwner: boolean
  onUpdate: (id: string, notes: string, rating: number | null) => Promise<void>
  onRemove: (id: string) => Promise<void>
}

export function GameItem({ item, isOwner, onUpdate, onRemove }: Props) {
  const [notes, setNotes] = useState(item.notes ?? '')
  const [rating, setRating] = useState<number | null>(item.rating)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await onUpdate(item.id, notes, rating)
    setSaving(false)
    setEditing(false)
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
      <div className="flex gap-4 p-4">
        {/* Thumbnail */}
        {item.background_image && (
          <div className="relative w-28 h-20 shrink-0 rounded-lg overflow-hidden">
            <Image
              src={item.background_image}
              alt={item.game_name}
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <h3 className="text-white font-semibold text-sm leading-tight">{item.game_name}</h3>

          {/* Star rating display / editor */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => isOwner && setRating(rating === star ? null : star)}
                disabled={!isOwner}
                className={`text-lg leading-none transition-colors ${
                  rating !== null && star <= rating ? 'text-yellow-400' : 'text-zinc-700'
                } ${isOwner ? 'cursor-pointer hover:text-yellow-300' : 'cursor-default'}`}
              >
                ★
              </button>
            ))}
          </div>

          {/* Notes */}
          {editing ? (
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add a review or notes..."
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none mt-1"
            />
          ) : (
            notes && <p className="text-zinc-400 text-sm line-clamp-3">{notes}</p>
          )}
        </div>

        {/* Owner actions */}
        {isOwner && (
          <div className="flex flex-col gap-2 shrink-0">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-3 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {saving ? '…' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditing(false); setNotes(item.notes ?? ''); setRating(item.rating) }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-medium hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-medium hover:text-white hover:border-zinc-600 transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => onRemove(item.id)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-500 text-xs font-medium hover:text-red-400 hover:border-red-500/50 transition-colors cursor-pointer"
                >
                  Remove
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Read-only notes for non-owners */}
      {!isOwner && notes && (
        <div className="px-4 pb-4 pt-0">
          <p className="text-zinc-400 text-sm italic border-l-2 border-zinc-700 pl-3">{notes}</p>
        </div>
      )}
    </div>
  )
}
