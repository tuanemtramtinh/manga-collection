import type { FC } from 'hono/jsx'
import type { Book, Volume, Section, SectionItem } from '../types.js'
import { STATUS_LABELS } from '../types.js'
import BaseLayout from '../layouts/base.js'
import Icon from '../components/Icon.js'
import ImageUpload from '../components/ImageUpload.js'
import BookModal from '../components/modals/BookModal.js'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CoverPlaceholder: FC<{ color: string; size?: 'sm' | 'lg' }> = ({ color, size = 'sm' }) => (
  <div
    class="rounded-lg flex items-center justify-center"
    style={`background-color:${color};aspect-ratio:2/3;width:100%;`}
  >
    <Icon name="BookOpen" size={size === 'lg' ? 48 : 24} class="text-white/40" />
  </div>
)

const ImagePlaceholder: FC<{ color: string; label: string }> = ({ color, label }) => (
  <div
    class="rounded-lg flex flex-col items-center justify-center gap-1"
    style={`background-color:${color};aspect-ratio:2/3;width:100%;`}
  >
    <Icon name="Gift" size={20} class="text-white/40" />
    <span class="text-white/50 text-[10px] px-1 text-center truncate w-full text-center">{label}</span>
  </div>
)

// ─── Section header ───────────────────────────────────────────────────────────

type SectionHeaderProps = {
  icon: Parameters<typeof Icon>[0]['name']
  title: string
  count: number
  unit: string
  modalId?: string
  addLabel?: string
  onAddFetch?: string
  deleteUrl?: string
}

const SectionHeader: FC<SectionHeaderProps> = ({ icon, title, count, unit, modalId, addLabel, onAddFetch, deleteUrl }) => (
  <div class="flex items-center justify-between mb-4 gap-2">
    <h2 class="text-lg sm:text-xl font-bold flex items-center gap-2 min-w-0">
      <Icon name={icon} size={20} class="shrink-0" />
      <span class="truncate">{title}</span>
      <span class="text-base font-normal text-base-content/40 shrink-0">{count} {unit}</span>
    </h2>
    <div class="flex items-center gap-2 shrink-0">
      {modalId && addLabel && (
        <button class="btn btn-primary btn-sm gap-1.5" {...{ 'data-open-modal': modalId }}>
          <Icon name="Plus" size={14} />
          <span class="hidden sm:inline">{addLabel}</span>
        </button>
      )}
      {onAddFetch && addLabel && (
        <button class="btn btn-primary btn-sm gap-1.5" data-fetch-form={onAddFetch}>
          <Icon name="Plus" size={14} />
          <span class="hidden sm:inline">{addLabel}</span>
        </button>
      )}
      {deleteUrl && (
        <button
          class="btn btn-ghost btn-sm btn-square text-error"
          data-delete-url={deleteUrl}
          data-delete-confirm={`Xóa section "${title}" và tất cả items?`}
          data-delete-redirect="reload"
          title="Xóa section"
        >
          <Icon name="Trash2" size={14} />
        </button>
      )}
    </div>
  </div>
)

// ─── Add card (dashed) ────────────────────────────────────────────────────────

const AddCard: FC<{ modalId?: string; fetchUrl?: string; label: string }> = ({ modalId, fetchUrl, label }) => (
  <button
    class="card card-compact bg-base-100 border-2 border-dashed border-base-300 hover:border-primary hover:text-primary transition-colors w-full"
    style="aspect-ratio:2/3;"
    {...(modalId ? { 'data-open-modal': modalId } : {})}
    {...(fetchUrl ? { 'data-fetch-form': fetchUrl } : {})}
    title={label}
  >
    <div class="card-body flex items-center justify-center gap-1">
      <Icon name="Plus" size={20} />
      <span class="text-xs font-medium">{label}</span>
    </div>
  </button>
)

// ─── Volume card ──────────────────────────────────────────────────────────────

const VolumeCard: FC<{ volume: Volume; bookColor: string; bookId: number }> = ({ volume, bookColor, bookId }) => (
  <div class="card card-compact bg-base-100 border border-base-200 shadow-sm hover:shadow transition-shadow group relative">
    <figure class="pt-3 px-3">
      {volume.coverUrl
        ? <img src={volume.coverUrl} alt={`Tập ${volume.volumeNumber}`} class="rounded w-full object-cover" style="aspect-ratio:2/3;" loading="lazy" />
        : <CoverPlaceholder color={bookColor} />
      }
    </figure>
    <div class="card-body gap-0.5">
      <p class="font-semibold text-sm">Tập {volume.volumeNumber}</p>
      {volume.edition && (
        <span class="badge badge-xs badge-outline w-fit">{volume.edition}</span>
      )}
      {volume.purchaseBatchId && (
        <span class="badge badge-xs badge-secondary w-fit">Mua theo bộ</span>
      )}
      {volume.purchaseDate && (
        <p class="text-xs text-base-content/50 flex items-center gap-1">
          <Icon name="Calendar" size={11} />
          {new Date(volume.purchaseDate).toLocaleDateString('vi-VN')}
        </p>
      )}
      {volume.price != null && (
        <p class="text-xs font-medium text-primary">{volume.price.toLocaleString('vi-VN')}₫</p>
      )}
    </div>
    <button
      class="btn btn-xs btn-ghost btn-circle absolute top-2 right-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-base-100/80 backdrop-blur-sm"
      title="Sửa tập này"
      data-edit-volume={`/books/${bookId}/volumes/${volume.id}/edit-form`}
    >
      <Icon name="Pencil" size={12} />
    </button>
  </div>
)

// ─── Section item card ────────────────────────────────────────────────────────

const SectionItemCard: FC<{ item: SectionItem; bookColor: string; bookId: number; sectionId: number }> = ({ item, bookColor, bookId, sectionId }) => (
  <div class="card card-compact bg-base-100 border border-base-200 shadow-sm hover:shadow transition-shadow group relative">
    <figure class="pt-3 px-3">
      {item.imageUrl
        ? <img src={item.imageUrl} alt={item.name} class="rounded w-full object-cover" style="aspect-ratio:2/3;" loading="lazy" />
        : <ImagePlaceholder color={bookColor} label={item.type || item.name} />
      }
    </figure>
    <div class="card-body gap-0.5">
      <p class="font-semibold text-sm truncate" title={item.name}>{item.name}</p>
      {item.type && (
        <span class="badge badge-xs badge-ghost w-fit">{item.type}</span>
      )}
      {item.purchaseDate && (
        <p class="text-xs text-base-content/50 flex items-center gap-1">
          <Icon name="Calendar" size={11} />
          {new Date(item.purchaseDate).toLocaleDateString('vi-VN')}
        </p>
      )}
      {item.price != null && (
        <p class="text-xs font-medium text-primary">{item.price.toLocaleString('vi-VN')}₫</p>
      )}
    </div>
    <button
      class="btn btn-xs btn-ghost btn-circle absolute top-2 right-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-base-100/80 backdrop-blur-sm"
      title="Sửa item này"
      data-fetch-form={`/books/${bookId}/sections/${sectionId}/items/${item.id}/edit-form`}
    >
      <Icon name="Pencil" size={12} />
    </button>
  </div>
)

// ─── Page ─────────────────────────────────────────────────────────────────────

type Props = {
  book: Book
  volumes: Volume[]
  sections: Section[]
  userEmail?: string
  returnQuery?: string
  bundleTotal?: number
}

const GRID = 'grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));'

const BookDetailPage: FC<Props> = ({ book, volumes, sections, userEmail, returnQuery, bundleTotal = 0 }) => {
  const totalSpent        = volumes.reduce((s, v) => s + (v.price ?? 0), 0) + bundleTotal
  const totalSectionSpent = sections.reduce((s, sec) =>
    s + sec.items.reduce((a, i) => a + (i.price ?? 0), 0), 0)
  const grandTotal = totalSpent + totalSectionSpent
  const sorted = [...volumes].sort((a, b) => a.volumeNumber - b.volumeNumber)
  const totalItems = sections.reduce((s, sec) => s + sec.items.length, 0)

  return (
    <BaseLayout title={`${book.title} — Kệ Truyện`} userEmail={userEmail}>
      <div class="container mx-auto px-4 py-6 sm:py-8" style="max-width:1080px;">

        {/* Back + Edit */}
        <div class="flex items-center justify-between mb-4 sm:mb-6">
          <a href={`/${returnQuery ? `?${returnQuery}` : ''}`} class="btn btn-ghost btn-sm gap-1 pl-1">
            <Icon name="ArrowLeft" size={16} />
            Quay lại kệ
          </a>
          <button class="btn btn-ghost btn-sm gap-1.5" {...{ 'data-open-modal': 'modal_book' }}>
            <Icon name="Pencil" size={14} />
            Sửa truyện
          </button>
        </div>

        {/* Book header */}
        <div class="flex flex-col sm:flex-row gap-5 sm:gap-8 mb-8 sm:mb-10">
          {/* Cover */}
          <div class="flex gap-5 sm:block">
            <div class="w-28 sm:w-40 shrink-0">
              {book.coverUrl
                ? <img src={book.coverUrl} alt={book.title} class="rounded-xl shadow-lg w-full object-cover" style="aspect-ratio:2/3;" />
                : <CoverPlaceholder color={book.color} size="lg" />
              }
            </div>

            {/* On mobile: title + badges next to cover */}
            <div class="flex flex-col justify-center gap-2 sm:hidden min-w-0">
              <h1 class="text-xl font-bold leading-snug">{book.title}</h1>
              {book.author && <p class="text-base-content/60 text-sm">{book.author}</p>}
              <div class="flex flex-wrap gap-1.5">
                <span class="badge badge-sm" style={`background-color:${book.color};color:white;border:none;`}>
                  {STATUS_LABELS[book.status]}
                </span>
                <span class="badge badge-sm badge-outline">{book.ownedVolumes}/{book.totalVolumes} tập</span>
              </div>
            </div>
          </div>

          {/* On desktop: full info */}
          <div class="flex flex-col justify-center gap-3">
            <div class="hidden sm:block">
              <h1 class="text-3xl font-bold">{book.title}</h1>
              <p class="text-base-content/60 text-lg mt-1">{book.author}</p>
            </div>

            <div class="hidden sm:flex flex-wrap gap-2">
              <span class="badge badge-lg" style={`background-color:${book.color};color:white;border:none;`}>
                {STATUS_LABELS[book.status]}
              </span>
              <span class="badge badge-lg badge-outline">{book.ownedVolumes} / {book.totalVolumes} tập</span>
              {totalItems > 0 && (
                <span class="badge badge-lg badge-warning badge-outline">
                  <Icon name="Gift" size={12} />
                  &nbsp;{totalItems} items
                </span>
              )}
            </div>

            {book.notes && <p class="text-base-content/60 italic text-sm max-w-md hidden sm:block">{book.notes}</p>}

            {/* Stats — vertical on mobile, horizontal on sm+ */}
            <div class="stats stats-vertical sm:stats-horizontal shadow mt-1 text-sm">
              <div class="stat px-4 py-2">
                <div class="stat-title text-xs">Số tập đã có</div>
                <div class="stat-value text-lg sm:text-xl">{volumes.length}</div>
              </div>
              <div class="stat px-4 py-2">
                <div class="stat-title text-xs">Tiền tập</div>
                <div class="stat-value text-lg sm:text-xl">{totalSpent.toLocaleString('vi-VN')}₫</div>
              </div>
              {totalSectionSpent > 0 && (
                <div class="stat px-4 py-2">
                  <div class="stat-title text-xs">Tiền items</div>
                  <div class="stat-value text-lg sm:text-xl">{totalSectionSpent.toLocaleString('vi-VN')}₫</div>
                </div>
              )}
              <div class="stat px-4 py-2">
                <div class="stat-title text-xs">Tổng chi</div>
                <div class="stat-value text-lg sm:text-xl text-primary">{grandTotal.toLocaleString('vi-VN')}₫</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Volumes section ── */}
        <SectionHeader
          icon="BookOpen" title="Danh sách tập"
          count={volumes.length} unit="tập"
          modalId="modal_volume" addLabel="Thêm tập"
        />
        <div class="grid gap-3 sm:gap-4 mb-8 sm:mb-10" style={GRID}>
          {sorted.map(v => <VolumeCard volume={v} bookColor={book.color} bookId={book.id} />)}
          <AddCard modalId="modal_volume" label="Thêm tập" />
        </div>

        {/* ── Custom sections ── */}
        {sections.map(section => (
          <>
            <div class="divider" />
            <SectionHeader
              icon="Gift" title={section.name}
              count={section.items.length} unit="món"
              onAddFetch={`/books/${book.id}/sections/${section.id}/add-item-form`}
              addLabel="Thêm item"
              deleteUrl={`/books/${book.id}/sections/${section.id}`}
            />
            <div class="grid gap-3 sm:gap-4 mb-8 sm:mb-10" style={GRID}>
              {section.items.map(item => (
                <SectionItemCard item={item} bookColor={book.color} bookId={book.id} sectionId={section.id} />
              ))}
              <AddCard fetchUrl={`/books/${book.id}/sections/${section.id}/add-item-form`} label="Thêm item" />
            </div>
          </>
        ))}

        {/* ── Add section ── */}
        <div class="divider" />
        <div class="flex items-center justify-center py-4">
          <button class="btn btn-outline gap-2" data-open-modal="modal_add_section">
            <Icon name="Plus" size={16} />
            Tạo section mới
          </button>
        </div>

      </div>

      {/* ── Volume modal ── */}
      <dialog id="modal_volume" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box w-full sm:max-w-sm">
          <h3 class="font-bold text-lg">Thêm tập truyện</h3>
          <p class="text-sm text-base-content/50 mb-3">{book.title}</p>

          {/* Tabs */}
          <div class="flex gap-1 mb-4 p-1 bg-base-200 rounded-lg" id="vol-tabs">
            <button type="button" class="flex-1 btn btn-sm btn-primary" data-tab="single">Một tập</button>
            <button type="button" class="flex-1 btn btn-sm btn-ghost" data-tab="bulk">Nhiều tập</button>
            <button type="button" class="flex-1 btn btn-sm btn-ghost" data-tab="bundle">Theo bộ</button>
          </div>

          {/* Tab: Một tập */}
          <div id="vol-panel-single">
            <form method="post" action={`/books/${book.id}/volumes`} class="flex flex-col gap-3" id="form_volume">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label class="form-control w-full">
                  <div class="label"><span class="label-text">Số tập *</span></div>
                  <input type="number" name="volumeNumber" class="input input-bordered w-full" placeholder="1" min="1" required />
                </label>
                <label class="form-control w-full">
                  <div class="label"><span class="label-text">Phiên bản</span></div>
                  <input type="text" name="edition" class="input input-bordered w-full" placeholder="Đặc biệt..." list="edition-options" />
                  <datalist id="edition-options">
                    <option value="Đặc biệt" />
                    <option value="Sưu tầm" />
                    <option value="Limited" />
                    <option value="Bìa cứng" />
                  </datalist>
                </label>
              </div>
              <ImageUpload name="coverUrl" folder="volumes" label="Ảnh bìa" />
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label class="form-control w-full">
                  <div class="label"><span class="label-text">Ngày mua</span></div>
                  <input type="date" name="purchaseDate" class="input input-bordered w-full" />
                </label>
                <label class="form-control w-full">
                  <div class="label"><span class="label-text">Giá (₫)</span></div>
                  <input type="number" name="price" class="input input-bordered w-full" placeholder="35000" min="0" />
                </label>
              </div>
            </form>
            <div class="flex justify-end gap-2 mt-5">
              <form method="dialog"><button class="btn btn-ghost">Hủy</button></form>
              <button class="btn btn-primary" type="submit" form="form_volume">Thêm</button>
            </div>
          </div>

          {/* Tab: Mua theo bộ */}
          <div id="vol-panel-bundle" class="hidden">
            <form method="post" action={`/books/${book.id}/volumes/bundle`} class="flex flex-col gap-3" id="form_volume_bundle">
              <label class="form-control w-full">
                <div class="label"><span class="label-text">Số tập *</span><span class="label-text-alt text-base-content/40">vd: 1-10</span></div>
                <input type="text" name="numbers" class="input input-bordered w-full font-mono" placeholder="1-10 hoặc 1,3,5" required />
              </label>
              <label class="form-control w-full">
                <div class="label"><span class="label-text">Tổng giá bộ (₫) *</span></div>
                <input type="number" name="totalPrice" class="input input-bordered w-full" min="1" required />
              </label>
              <label class="form-control w-full">
                <div class="label"><span class="label-text">Ngày mua *</span></div>
                <input type="date" name="purchaseDate" class="input input-bordered w-full" required />
              </label>
              <input type="text" name="note" class="input input-bordered w-full" placeholder="Ghi chú (không bắt buộc)" />
            </form>
            <div class="flex justify-end gap-2 mt-5">
              <form method="dialog"><button class="btn btn-ghost">Hủy</button></form>
              <button class="btn btn-primary" type="submit" form="form_volume_bundle">Thêm bộ</button>
            </div>
          </div>

          {/* Tab: Nhiều tập */}
          <div id="vol-panel-bulk" class="hidden">
            <form method="post" action={`/books/${book.id}/volumes/bulk`} class="flex flex-col gap-3" id="form_volume_bulk">
              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text">Số tập *</span>
                  <span class="label-text-alt text-base-content/40">vd: 1-10 hoặc 1,3,5</span>
                </div>
                <input
                  type="text"
                  name="numbers"
                  class="input input-bordered w-full font-mono"
                  placeholder="1-10 hoặc 1,3,5,7"
                  required
                />
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label class="form-control w-full">
                  <div class="label"><span class="label-text">Ngày mua</span></div>
                  <input type="date" name="purchaseDate" class="input input-bordered w-full" />
                </label>
                <label class="form-control w-full">
                  <div class="label"><span class="label-text">Giá / tập (₫)</span></div>
                  <input type="number" name="price" class="input input-bordered w-full" placeholder="35000" min="0" />
                </label>
              </div>
              <p id="bulk-preview" class="text-xs text-base-content/50 min-h-4"></p>
            </form>
            <div class="flex justify-end gap-2 mt-5">
              <form method="dialog"><button class="btn btn-ghost">Hủy</button></form>
              <button class="btn btn-primary" type="submit" form="form_volume_bulk">Thêm tất cả</button>
            </div>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop"><button>close</button></form>
      </dialog>

      {/* ── Add section modal ── */}
      <dialog id="modal_add_section" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box w-full sm:max-w-sm">
          <h3 class="font-bold text-lg mb-4">Tạo section mới</h3>
          <form method="post" action={`/books/${book.id}/sections`} class="flex flex-col gap-3" id="form_add_section">
            <label class="form-control w-full">
              <div class="label"><span class="label-text">Tên section *</span></div>
              <input type="text" name="name" class="input input-bordered w-full" placeholder="Goods / Artbook / Poster..." required />
            </label>
          </form>
          <div class="flex justify-end gap-2 mt-5">
            <form method="dialog"><button class="btn btn-ghost">Hủy</button></form>
            <button class="btn btn-primary" type="submit" form="form_add_section">Tạo</button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop"><button>close</button></form>
      </dialog>

      <BookModal book={book} />

      {/* ── Edit / add-item modal (loaded dynamically) ── */}
      <dialog id="modal_edit" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box w-full sm:max-w-sm">
          <div id="modal_edit_body" />
        </div>
        <form method="dialog" class="modal-backdrop"><button>close</button></form>
      </dialog>

      <script src="/public/js/book-detail.js" defer></script>
    </BaseLayout>
  )
}

export default BookDetailPage
