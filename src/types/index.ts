export type RawgGame = {
  id: number
  name: string
  background_image: string | null
  rating: number
  ratings_count: number
}

export type ListItem = {
  id: string
  list_id: string
  rawg_id: number
  game_name: string
  background_image: string | null
  rating: number | null
  notes: string | null
  added_at: string
}

export type GameList = {
  id: string
  user_id: string
  creator_name: string
  name: string
  description: string | null
  created_at: string
  list_items?: Pick<ListItem, 'background_image'>[]
  list_likes?: { count: number }[]
}
