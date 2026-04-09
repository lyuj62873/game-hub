'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useSupabaseClient } from '@/lib/supabase'

export default function NewListPage() {
  const { user } = useUser()
  const supabase = useSupabaseClient()
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !name.trim()) return
    setSaving(true)
    setError('')

    const { data, error } = await supabase
      .from('lists')
      .insert({
        user_id: user.id,
        creator_name: user.fullName ?? user.username ?? 'Anonymous',
        name: name.trim(),
        description: description.trim() || null,
      })
      .select('id')
      .single()

    setSaving(false)
    if (error) { setError(error.message); return }
    router.push(`/lists/${data.id}/edit`)
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-white mb-8">Create a New List</h1>
      <form onSubmit={handleCreate} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">List Name *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            maxLength={80}
            placeholder="e.g. Best Open-World Games"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={300}
            rows={3}
            placeholder="What's this list about? (optional)"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="py-3 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-medium transition-colors border border-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {saving ? 'Creating…' : 'Create & Add Games →'}
        </button>
      </form>
    </div>
  )
}
