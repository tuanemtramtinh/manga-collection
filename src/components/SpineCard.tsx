import type { FC } from 'hono/jsx'
import type { Book } from '../types.js'
import Icon from './Icon.js'

type Props = { book: Book; returnQuery?: string }

const SPINE_HEIGHT = 200

const SpineCard: FC<Props> = ({ book, returnQuery }) => (
  <a
    href={`/books/${book.slug}${returnQuery ? `?${returnQuery}` : ''}`}
    class="relative flex flex-col items-center cursor-pointer group no-underline"
    title={`${book.title} — ${book.author}`}
  >
    {/* Spine */}
    <div
      class="relative flex flex-col items-center justify-between px-1.5 py-3 rounded-t shadow-md group-hover:brightness-110 group-hover:-translate-y-2 transition-all duration-150 select-none"
      style={`width:46px;height:${SPINE_HEIGHT}px;background-color:${book.color};`}
    >
      {/* Complete dot */}
      {book.status === 'complete' && (
        <div
          class="absolute top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-white/80 shadow"
          title="Đã đủ bộ"
        />
      )}

      {/* Vertical title */}
      <span
        class="text-white font-semibold overflow-hidden flex-1 flex items-center"
        style={`writing-mode:vertical-rl;text-orientation:mixed;font-size:11px;line-height:1.2;text-shadow:0 1px 3px rgba(0,0,0,.4);margin-top:${book.status === 'complete' ? '20' : '8'}px;max-height:calc(100% - 28px);`}
      >
        {book.title}
      </span>

      {/* Volume count */}
      <span class="text-white/70 font-mono" style="font-size:9px;">
        {book.ownedVolumes}
      </span>
    </div>

    {/* Goods star badge */}
    {book.hasGoods && (
      <div class="absolute -top-1 -right-1 drop-shadow" title={`${book.goodsCount} goods`}>
        <Icon name="Star" size={12} class="text-yellow-400 fill-yellow-400" />
      </div>
    )}
  </a>
)

export default SpineCard
