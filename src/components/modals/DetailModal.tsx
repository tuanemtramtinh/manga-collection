import type { FC } from 'hono/jsx'
import type { Book, Volume, Goods } from '../../types.js'
import { STATUS_LABELS } from '../../types.js'
import Icon from '../Icon.js'

type Props = {
  book: Book
  volumes: Volume[]
  goods: Goods[]
}

const CoverPlaceholder: FC<{ color: string; label: string }> = ({ color, label }) => (
  <div
    class="w-full rounded flex items-center justify-center text-white text-xs font-medium px-1 text-center"
    style={`background-color:${color};aspect-ratio:2/3;`}
  >
    {label}
  </div>
)

const VolumeCard: FC<{ volume: Volume; bookColor: string }> = ({ volume, bookColor }) => (
  <div
    class="card card-compact bg-base-100 border border-base-200 cursor-pointer hover:shadow transition-shadow"
    {...{ 'data-open-modal': 'modal_volume' }}
  >
    <figure class="pt-2 px-2">
      {volume.coverUrl
        ? <img src={volume.coverUrl} alt={`Tập ${volume.volumeNumber}`} class="rounded w-full object-cover" style="aspect-ratio:2/3;" />
        : <CoverPlaceholder color={bookColor} label={`Tập ${volume.volumeNumber}`} />
      }
    </figure>
    <div class="card-body">
      <p class="font-semibold text-xs">Tập {volume.volumeNumber}</p>
      {volume.purchaseDate && <p class="text-xs text-base-content/50">{volume.purchaseDate}</p>}
      {volume.price && <p class="text-xs text-base-content/60">{volume.price.toLocaleString('vi-VN')}₫</p>}
    </div>
  </div>
)

const GoodsCard: FC<{ goods: Goods; bookColor: string }> = ({ goods, bookColor }) => (
  <div
    class="card card-compact bg-base-100 border border-base-200 cursor-pointer hover:shadow transition-shadow"
    {...{ 'data-open-modal': 'modal_goods' }}
  >
    <figure class="pt-2 px-2">
      {goods.imageUrl
        ? <img src={goods.imageUrl} alt={goods.name} class="rounded w-full object-cover" style="aspect-ratio:2/3;" />
        : <CoverPlaceholder color={bookColor} label={goods.type || 'goods'} />
      }
    </figure>
    <div class="card-body">
      <p class="font-semibold text-xs truncate">{goods.name}</p>
      {goods.type && <p class="text-xs text-base-content/50">{goods.type}</p>}
      {goods.price && <p class="text-xs text-base-content/60">{goods.price.toLocaleString('vi-VN')}₫</p>}
    </div>
  </div>
)

const AddCard: FC<{ modalId: string; label: string }> = ({ modalId, label }) => (
  <div
    class="card card-compact bg-base-100 border-2 border-dashed border-base-300 cursor-pointer hover:border-primary hover:text-primary transition-colors"
    {...{ 'data-open-modal': modalId }}
    style="aspect-ratio:2/3;"
  >
    <div class="card-body flex items-center justify-center">
      <span class="text-2xl">+</span>
      <span class="text-xs">{label}</span>
    </div>
  </div>
)

export const DetailModalContent: FC<Props> = ({ book, volumes, goods }) => (
  <>
    {/* Header */}
    <div class="flex items-start justify-between mb-4">
      <div>
        <h3 class="font-bold text-xl">{book.title}</h3>
        <p class="text-base-content/60 text-sm mt-0.5">{book.author}</p>
        <div class="flex flex-wrap gap-2 mt-2">
          <span class="badge badge-outline">{book.ownedVolumes} / {book.totalVolumes} tập</span>
          <span class="badge" style={`background-color:${book.color};color:white;border:none;`}>
            {STATUS_LABELS[book.status]}
          </span>
          {book.goodsCount > 0 && (
            <span class="badge badge-warning badge-outline">{book.goodsCount} goods</span>
          )}
        </div>
        {book.notes && <p class="text-sm text-base-content/50 mt-2 italic">{book.notes}</p>}
      </div>
      <div class="flex gap-1 shrink-0">
        <button
          class="btn btn-ghost btn-sm btn-circle"
          title="Sửa bộ truyện"
          {...{ 'data-open-modal': 'modal_book' }}
        >
          <Icon name="Pencil" size={15} />
        </button>
        <form method="dialog">
          <button class="btn btn-ghost btn-sm btn-circle">
            <Icon name="X" size={15} />
          </button>
        </form>
      </div>
    </div>

    <div class="divider my-2" />

    {/* Volumes section */}
    <div class="flex items-center justify-between mb-3">
      <span class="font-semibold flex items-center gap-1.5"><Icon name="BookOpen" size={16} /> Tập truyện</span>
      <span class="text-sm text-base-content/50">{volumes.length} tập</span>
    </div>
    <div class="grid gap-3" style="grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));">
      {volumes.map(v => <VolumeCard volume={v} bookColor={book.color} />)}
      <AddCard modalId="modal_volume" label="Thêm tập" />
    </div>

    <div class="divider my-4" />

    {/* Goods section */}
    <div class="flex items-center justify-between mb-3">
      <span class="font-semibold flex items-center gap-1.5"><Icon name="Gift" size={16} /> Goods</span>
      <span class="text-sm text-base-content/50">{goods.length} món</span>
    </div>
    <div class="grid gap-3" style="grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));">
      {goods.map(g => <GoodsCard goods={g} bookColor={book.color} />)}
      <AddCard modalId="modal_goods" label="Thêm goods" />
    </div>
  </>
)

const DetailModal: FC = () => (
  <dialog id="modal_detail" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box w-11/12 max-w-3xl max-h-[85vh] overflow-y-auto">
      {/* Content is loaded via HTMX into this div */}
      <div id="modal_detail_body">
        <p class="text-center text-base-content/40 py-8">Đang tải...</p>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
)

export default DetailModal
