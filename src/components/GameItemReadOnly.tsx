import Image from 'next/image'
import type { ListItem } from '@/types'

type Props = { item: ListItem }

export function GameItemReadOnly({ item }: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="flex gap-4 p-4">
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
          {item.rating && (
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className={`text-lg leading-none ${star <= item.rating! ? 'text-yellow-400' : 'text-zinc-700'}`}>★</span>
              ))}
            </div>
          )}
        </div>
      </div>
      {item.notes && (
        <div className="px-4 pb-4 pt-0">
          <p className="text-zinc-400 text-sm italic border-l-2 border-zinc-700 pl-3">{item.notes}</p>
        </div>
      )}
    </div>
  )
}
