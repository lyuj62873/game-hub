'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useSupabaseClient } from '@/lib/supabase'

export function TestInsertButton() {
  const { user } = useUser()
  const supabase = useSupabaseClient()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleTest() {
    if (!user) {
      setStatus('error')
      setMessage('You must be signed in first.')
      return
    }

    setStatus('loading')
    setMessage('')

    const { data, error } = await supabase.from('favorites').insert({
      user_id: user.id,
      game_name: 'The Legend of Zelda: Breath of the Wild',
      rawg_id: 12020,
      background_image: 'https://media.rawg.io/media/games/cc3/cc3de4f3d7ea28fd4a03a7be6e5b88f4.jpg',
      rating: 5,
      notes: 'Test insert — RLS + Clerk JWT working!',
    }).select().single()

    if (error) {
      setStatus('error')
      setMessage(error.message)
    } else {
      setStatus('success')
      setMessage(`Inserted: ${data.game_name} (row id: ${data.id})`)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleTest}
        disabled={status === 'loading'}
        className="px-6 py-3 rounded-md bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500 hover:text-cyan-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {status === 'loading' ? 'Inserting…' : 'Test Supabase Insert'}
      </button>

      {status === 'success' && (
        <p className="text-green-400 text-sm text-center">{message}</p>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-sm text-center">Error: {message}</p>
      )}
    </div>
  )
}
