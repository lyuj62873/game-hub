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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const { getToken, userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const token = await getToken({ template: 'supabase' })
  if (!token) return NextResponse.json({ error: 'No token' }, { status: 401 })

  const { itemId } = await params
  const body = await request.json()

  const supabase = serverSupabaseWithToken(token)
  const { data, error } = await supabase
    .from('list_items')
    .update({ notes: body.notes, rating: body.rating ?? null })
    .eq('id', itemId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const { getToken, userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const token = await getToken({ template: 'supabase' })
  if (!token) return NextResponse.json({ error: 'No token' }, { status: 401 })

  const { itemId } = await params

  const supabase = serverSupabaseWithToken(token)
  const { error } = await supabase
    .from('list_items')
    .delete()
    .eq('id', itemId)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return new NextResponse(null, { status: 204 })
}
