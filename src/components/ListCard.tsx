import Image from 'next/image'
import Link from 'next/link'
import type { GameList } from '@/types'

type Props = {
  list: GameList
}

export function ListCard({ list }: Props) {
  const thumbnails = (list.list_items ?? [])
    .filter(i => i.background_image)
    .slice(0, 3)
  const likeCount = list.list_likes?.[0]?.count ?? 0

  return (
    <Link
      href={`/lists/${list.id}`}
      className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-200 flex flex-col"
    >
      {/* Thumbnail strip */}
      <div className="grid grid-cols-3 h-28 bg-zinc-800">
        {thumbnails.length > 0 ? (
          thumbnails.map((item, i) => (
            <div key={i} className="relative overflow-hidden">
              <Image
                src={item.background_image!}
                alt=""
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 33vw, 10vw"
              />
            </div>
          ))
        ) : (
          <div className="col-span-3 flex items-center justify-center text-zinc-600 text-sm">
            No games yet
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="text-white font-semibold leading-tight line-clamp-1 group-hover:text-cyan-400 transition-colors">
          {list.name}
        </h3>
        {list.description && (
          <p className="text-zinc-500 text-xs line-clamp-2">{list.description}</p>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between text-xs text-zinc-500">
          <span>by {list.creator_name}</span>
          <span>♥ {likeCount}</span>
        </div>
      </div>
    </Link>
  )
}
