import type { FC } from 'hono/jsx'
import type { Book } from '../types.js'
import { STATUS_LABELS } from '../types.js'
import BaseLayout from '../layouts/base.js'
import SpineCard from '../components/SpineCard.js'
import Icon from '../components/Icon.js'
import BookModal from '../components/modals/BookModal.js'
import DetailModal from '../components/modals/DetailModal.js'

// ─── Cover card (grid view) ────────────────────────────────────────────────────

const BookCoverCard: FC<{ book: Book; returnQuery?: string }> = ({ book, returnQuery }) => (
  <a href={`/books/${book.slug}${returnQuery ? `?${returnQuery}` : ''}`} class="group block no-underline">
    <div class="card card-compact bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
      <figure class="pt-2 px-2">
        {book.coverUrl
          ? <img src={book.coverUrl} alt={book.title} class="rounded-lg w-full object-cover" style="aspect-ratio:2/3;" loading="lazy" />
          : <div class="rounded-lg flex items-center justify-center w-full" style={`aspect-ratio:2/3;background-color:${book.color};`}>
              <Icon name="BookOpen" size={32} class="text-white/40" />
            </div>
        }
      </figure>
      <div class="card-body gap-1 flex flex-col justify-between p-3">
        <div>
          <p class="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors" style="min-height:2.6em;">{book.title}</p>
          <p class="text-xs text-base-content/50 truncate mt-0.5">{book.author || '\u00a0'}</p>
        </div>
        <div class="flex flex-col items-start gap-1 min-w-0">
          <span class="badge badge-xs max-w-full truncate px-2" style={`background-color:${book.color};color:white;border:none;`}>
            {STATUS_LABELS[book.status]}
          </span>
          <span class="badge badge-xs badge-outline max-w-full truncate">
            {book.totalVolumes > 0 ? `${book.ownedVolumes}/${book.totalVolumes} tập` : `${book.ownedVolumes} tập`}
          </span>
        </div>
      </div>
    </div>
  </a>
)

// ─── Stats ──────────────────────────────────────────────────────────────────

const Stats: FC<{ books: Book[]; totalSpent: number }> = ({ books, totalSpent }) => {
  const totalSeries  = books.length
  const totalVolumes = books.reduce((s, b) => s + b.ownedVolumes, 0)
  const totalGoods   = books.reduce((s, b) => s + b.goodsCount, 0)

  const items: { label: string; value: string; icon: Parameters<typeof Icon>[0]['name']; accent: string }[] = [
    { label: 'Bộ truyện', value: String(totalSeries),                      icon: 'BookOpen',  accent: 'text-primary'   },
    { label: 'Số tập',    value: String(totalVolumes),                      icon: 'Bookmark',  accent: 'text-secondary' },
    { label: 'Goods',     value: String(totalGoods),                        icon: 'Gift',      accent: 'text-warning'   },
    { label: 'Đã chi',    value: totalSpent.toLocaleString('vi-VN') + '₫', icon: 'Banknote',  accent: 'text-success'   },
  ]

  return (
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map(({ label, value, icon, accent }) => (
        <div class="bg-base-100 rounded-2xl shadow px-3 py-3 sm:px-5 sm:py-4 flex items-center gap-3 border border-base-200">
          <Icon name={icon} size={24} class={`${accent} shrink-0`} />
          <div class="flex flex-col gap-0.5 min-w-0">
            <span class={`text-lg sm:text-2xl font-bold tracking-tight ${accent} truncate`}>{value}</span>
            <span class="text-xs text-base-content/50 font-medium uppercase tracking-wide">{label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Controls ────────────────────────────────────────────────────────────────

type ControlsProps = { q: string; status: string; sort: string; view: string }

const Controls: FC<ControlsProps> = ({ q, status, sort, view }) => (
  <form method="get" action="/" class="flex flex-col gap-2 mb-6" id="filter-form">
    {/* Row 1: Search (full width) */}
    <input
      type="search"
      id="search-input"
      name="q"
      value={q}
      class="input input-bordered w-full"
      placeholder="Tìm theo tên / tác giả..."
      autocomplete="off"
    />

    {/* Row 2: Status + Sort */}
    <div class="flex gap-2">
      <select id="status-select" name="status" class="select select-bordered flex-1" onchange="this.form.submit()">
        <option value="" selected={!status}>Tất cả</option>
        {(Object.entries(STATUS_LABELS) as [string, string][]).map(([value, label]) => (
          <option value={value} selected={status === value}>{label}</option>
        ))}
      </select>
      <select id="sort-select" name="sort" class="select select-bordered flex-1" onchange="this.form.submit()">
        <option value="newest" selected={!sort || sort === 'newest'}>Mới nhất</option>
        <option value="title" selected={sort === 'title'}>Tên A-Z</option>
        <option value="volumes" selected={sort === 'volumes'}>Nhiều tập nhất</option>
      </select>
    </div>

    {/* Giữ view param khi submit từ search/select */}
    <input type="hidden" name="view" value={view} id="hidden-view" />

    {/* Row 3: View toggle + Actions */}
    <div class="flex items-center gap-2 justify-between">
      <div class="join">
        <button
          type="button"
          onclick="document.getElementById('hidden-view').value='grid';document.getElementById('filter-form').submit()"
          class={`join-item btn btn-sm ${view === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
          title="Lưới ảnh"
        >
          <Icon name="LayoutGrid" size={16} />
        </button>
        <button
          type="button"
          onclick="document.getElementById('hidden-view').value='shelf';document.getElementById('filter-form').submit()"
          class={`join-item btn btn-sm ${view === 'shelf' ? 'btn-primary' : 'btn-ghost'}`}
          title="Kệ sách"
        >
          <Icon name="List" size={16} />
        </button>
      </div>

      <div class="flex gap-2">
        <button class="btn btn-secondary btn-sm sm:btn-md gap-2" type="button" data-open-modal="modal_quick_purchase">
          <Icon name="ShoppingCart" size={16} />
          <span class="hidden sm:inline">Nhập nhanh</span>
        </button>
        <button class="btn btn-primary btn-sm sm:btn-md gap-2" type="button" data-open-modal="modal_book">
          <Icon name="Plus" size={16} />
          <span class="hidden sm:inline">Thêm truyện</span>
          <span class="sm:hidden">Thêm</span>
        </button>
        <form method="post" action="/import/books" enctype="multipart/form-data" class="flex gap-1 items-center">
          <label for="import-books-file" class="btn btn-outline btn-sm sm:btn-md gap-2" title="Import dữ liệu sách">
            <Icon name="Upload" size={16} />
            <span class="hidden sm:inline">Import</span>
            <input
              id="import-books-file"
              type="file"
              name="file"
              accept=".xlsx,.xls,.csv"
              class="hidden"
              onchange="if (this.files.length) this.form.submit()"
            />
          </label>
        </form>
        <a href="/export/books" class="btn btn-success btn-sm sm:btn-md gap-2">
          <Icon name="Download" size={16} />
          <span class="hidden sm:inline">Export Excel</span>
        </a>
      </div>
    </div>
  </form>
)

// ─── Cover grid view ──────────────────────────────────────────────────────────

export const BookCoverGrid: FC<{ books: Book[]; returnQuery?: string }> = ({ books, returnQuery }) => {
  if (books.length === 0) {
    return (
      <div class="hero min-h-64 bg-base-100 rounded-xl border border-base-200">
        <div class="hero-content text-center">
          <div>
            <Icon name="BookOpen" size={48} class="text-base-content/20 mx-auto mb-3" />
            <h2 class="text-xl font-bold mb-2">Kệ truyện còn trống</h2>
            <p class="text-base-content/50 mb-4">Thêm bộ truyện đầu tiên của bạn!</p>
            <button class="btn btn-primary gap-2" data-open-modal="modal_book">
              <Icon name="Plus" size={16} />
              Thêm truyện
            </button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div class="grid gap-3 sm:gap-4" style="grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));">
      {books.map(book => <BookCoverCard book={book} returnQuery={returnQuery} />)}
    </div>
  )
}

// ─── Bookshelf ────────────────────────────────────────────────────────────────

export const BookshelfGrid: FC<{ books: Book[]; returnQuery?: string }> = ({ books, returnQuery }) => {
  if (books.length === 0) {
    return (
      <div class="hero min-h-64 bg-base-100 rounded-xl border border-base-200">
        <div class="hero-content text-center">
          <div>
            <Icon name="BookOpen" size={48} class="text-base-content/20 mx-auto mb-3" />
            <h2 class="text-xl font-bold mb-2">Kệ truyện còn trống</h2>
            <p class="text-base-content/50 mb-4">Thêm bộ truyện đầu tiên của bạn!</p>
            <button
              class="btn btn-primary gap-2"
              {...{ 'data-open-modal': 'modal_book' }}
            >
              <Icon name="Plus" size={16} />
              Thêm truyện
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div class="relative">
      <div class="flex flex-wrap gap-1.5 pb-4" id="bookshelf-grid">
        {books.map(book => <SpineCard book={book} returnQuery={returnQuery} />)}
      </div>
      <div
        class="rounded-sm shadow-md"
        style="height:14px;background:linear-gradient(180deg,#b5854a 0%,#8b5e34 60%,#6b4423 100%);box-shadow:0 4px 8px rgba(0,0,0,.25);"
      />
    </div>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

const Footer: FC = () => (
  <footer class="mt-16 pb-10" />
)

const QuickPurchaseModal: FC<{ books: Book[] }> = ({ books }) => (
  <dialog id="modal_quick_purchase" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box w-full sm:max-w-md">
      <h3 class="font-bold text-lg mb-1">Nhập nhanh giao dịch</h3>
      <p class="text-sm text-base-content/50 mb-4">Thêm tập đã mua mà không cần mở trang chi tiết.</p>
      <form method="post" action="/purchases/quick" class="flex flex-col gap-3" id="form_quick_purchase">
        <label class="form-control w-full">
          <div class="label"><span class="label-text">Bộ truyện *</span></div>
          <select name="bookId" class="select select-bordered w-full" required>
            <option value="" disabled selected>Chọn bộ truyện</option>
            {books.map(book => <option value={book.id}>{book.title}</option>)}
          </select>
        </label>
        <label class="form-control w-full">
          <div class="label"><span class="label-text">Số tập *</span><span class="label-text-alt text-base-content/40">vd: 1-5 hoặc 1,3,5</span></div>
          <input type="text" name="numbers" class="input input-bordered w-full font-mono" placeholder="1-5" required />
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label class="form-control w-full">
            <div class="label"><span class="label-text">Hình thức</span></div>
            <select name="mode" class="select select-bordered w-full">
              <option value="single">Giá từng tập</option>
              <option value="bundle">Giá nguyên bộ</option>
            </select>
          </label>
          <label class="form-control w-full">
            <div class="label"><span class="label-text">Giá (₫) *</span></div>
            <input type="number" name="price" class="input input-bordered w-full" min="1" required />
          </label>
        </div>
        <label class="form-control w-full">
          <div class="label"><span class="label-text">Ngày mua *</span></div>
          <input type="date" name="purchaseDate" class="input input-bordered w-full" required />
        </label>
      </form>
      <div class="flex justify-end gap-2 mt-5">
        <form method="dialog"><button class="btn btn-ghost">Hủy</button></form>
        <button class="btn btn-secondary" type="submit" form="form_quick_purchase">Lưu giao dịch</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop"><button>close</button></form>
  </dialog>
)

// ─── Page ─────────────────────────────────────────────────────────────────────

type HomePageProps = { books: Book[]; quickBooks: Book[]; totalSpent: number; userEmail?: string; q: string; status: string; sort: string; view: string; returnQuery?: string }

const HomePage: FC<HomePageProps> = ({ books, quickBooks, totalSpent, userEmail, q, status, sort, view, returnQuery }) => (
  <BaseLayout title="Kệ Truyện" userEmail={userEmail}>
    <div class="container mx-auto px-4 py-6 sm:py-8" style="max-width:1080px;">

      {/* Header */}
      <div class="mb-6">
        <div class="flex items-start justify-between gap-2">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Icon name="BookOpen" size={28} class="text-primary" />
              Kệ Truyện
            </h1>
            <p class="text-base-content/50 mt-1 text-sm">Quản lý bộ sưu tập manga cá nhân</p>
          </div>
          {/* Nav buttons — chỉ hiện trên sm+ vì mobile bị đè bởi user menu */}
          <div class="hidden sm:flex gap-2 shrink-0">
            <a href="/wishlist" class="btn btn-outline gap-2">
              <Icon name="ShoppingCart" size={16} />
              Wishlist
            </a>
            <a href="/spending" class="btn btn-primary gap-2">
              <Icon name="Banknote" size={16} />
              Chi tiêu
            </a>
          </div>
        </div>
        {/* Nav buttons mobile — full width row bên dưới title */}
        <div class="flex gap-2 mt-3 sm:hidden">
          <a href="/wishlist" class="btn btn-outline btn-sm flex-1 gap-1">
            <Icon name="ShoppingCart" size={15} />
            Wishlist
          </a>
          <a href="/spending" class="btn btn-primary btn-sm flex-1 gap-1">
            <Icon name="Banknote" size={15} />
            Chi tiêu
          </a>
        </div>
      </div>

      <div class="mb-6 sm:mb-8">
        <Stats books={books} totalSpent={totalSpent} />
      </div>

      <Controls q={q} status={status} sort={sort} view={view} />

      {view === 'grid'
        ? <BookCoverGrid books={books} returnQuery={returnQuery} />
        : <BookshelfGrid books={books} returnQuery={returnQuery} />}

      <Footer />
    </div>

    <BookModal />
    <QuickPurchaseModal books={quickBooks} />
    <DetailModal />

    <script src="/public/js/book-modal.js" defer></script>
  </BaseLayout>
)

export default HomePage
