import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

function serverSupabaseWithToken(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { getToken, userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const token = await getToken({ template: 'supabase' })
  if (!token) return NextResponse.json({ error: 'No token' }, { status: 401 })

  const { id: listId } = await params
  const body = await request.json()

  const supabase = serverSupabaseWithToken(token)
  const { data, error } = await supabase
    .from('list_items')
    .insert({
      list_id: listId,
      rawg_id: body.rawg_id,
      game_name: body.game_name,
      background_image: body.background_image ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
