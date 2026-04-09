import { NextRequest, NextResponse } from 'next/server'

const RAWG_BASE = 'https://api.rawg.io/api'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const search = searchParams.get('search') ?? ''
  const page = searchParams.get('page') ?? '1'

  if (!search.trim()) {
    return NextResponse.json({ results: [], count: 0, next: null })
  }

  const url = new URL(`${RAWG_BASE}/games`)
  url.searchParams.set('key', process.env.RAWG_API_KEY!)
  url.searchParams.set('search', search)
  url.searchParams.set('page', page)
  url.searchParams.set('page_size', '20')

  const res = await fetch(url.toString(), { next: { revalidate: 300 } })

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
