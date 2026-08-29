import type { FC } from 'hono/jsx'
import BaseLayout from '../layouts/base.js'
import Icon from '../components/Icon.js'
import type { WishlistItem } from '../repositories/wishlistRepository.js'

type Props = {
  items: WishlistItem[]
  userEmail?: string
}

const WishlistPage: FC<Props> = ({ items, userEmail }) => {
  const totalCost = items.reduce((s, i) => s + (i.estimatedPrice ?? 0), 0)

  // Group by resolvedTitle
  const grouped = new Map<string, WishlistItem[]>()
  for (const item of items) {
    const key = item.resolvedTitle || '(Chưa có tên)'
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(item)
  }

  return (
    <BaseLayout title="Wishlist — Kệ Truyện" userEmail={userEmail}>
      <div class="container mx-auto px-4 py-6 sm:py-8" style="max-width:800px;">

        {/* Header */}
        <div class="mb-6">
          <a href="/" class="btn btn-ghost btn-sm gap-1 pl-1 mb-4">
            <Icon name="ArrowLeft" size={16} />
            Quay lại kệ
          </a>
          <h1 class="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Icon name="ShoppingCart" size={28} class="text-primary" />
            Wishlist
          </h1>
          <p class="text-base-content/50 mt-1 text-sm">Các tập muốn mua trong tương lai</p>
        </div>

        {/* Stats */}
        <div class="grid grid-cols-2 gap-3 mb-6">
          <div class="bg-base-100 rounded-2xl shadow px-3 py-3 sm:px-5 sm:py-4 flex items-center gap-3 border border-base-200">
            <Icon name="ShoppingCart" size={24} class="text-primary shrink-0" />
            <div class="flex flex-col gap-0.5 min-w-0">
              <span class="text-xl sm:text-2xl font-bold tracking-tight text-primary">{items.length}</span>
              <span class="text-xs text-base-content/50 font-medium uppercase tracking-wide">Mục wishlist</span>
            </div>
          </div>
          <div class="bg-base-100 rounded-2xl shadow px-3 py-3 sm:px-5 sm:py-4 flex items-center gap-3 border border-base-200">
            <Icon name="Banknote" size={24} class="text-success shrink-0" />
            <div class="flex flex-col gap-0.5 min-w-0">
              <span class="text-xl sm:text-2xl font-bold tracking-tight text-success truncate">{totalCost.toLocaleString('vi-VN')}₫</span>
              <span class="text-xs text-base-content/50 font-medium uppercase tracking-wide">Dự tính chi</span>
            </div>
          </div>
        </div>

        {/* Add form */}
        <div class="bg-base-100 rounded-2xl border border-base-200 shadow p-4 sm:p-5 mb-8">
          <h2 class="font-bold text-lg mb-4">Thêm vào wishlist</h2>
          <form method="post" action="/wishlist" class="flex flex-col gap-3">

            {/* Tìm nhanh */}
            <div class="form-control w-full">
              <div class="label">
                <span class="label-text">Tìm nhanh</span>
                <span class="label-text-alt text-base-content/40 hidden sm:block">Tên tiếng Anh hoặc Nhật</span>
              </div>
              <div class="relative">
                <input
                  type="search"
                  id="wishlist-search-input"
                  placeholder="Tìm manga trên MAL..."
                  class="input input-bordered w-full"
                  autocomplete="off"
                />
                <div
                  id="wishlist-search-results"
                  class="absolute left-0 right-0 z-50 flex flex-col overflow-y-auto rounded-lg border border-base-200 bg-base-100 shadow-lg"
                  style="max-height:200px;display:none;top:calc(100% + 6px);"
                />
              </div>
            </div>

            {/* Tên truyện */}
            <label class="form-control w-full">
              <div class="label">
                <span class="label-text">Tên bộ truyện *</span>
              </div>
              <input type="text" name="bookTitle" id="wishlist-book-title" class="input input-bordered w-full" placeholder="Tên truyện..." required />
            </label>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label class="form-control w-full">
                <div class="label"><span class="label-text">Tổng số tập</span></div>
                <input type="number" name="volumeNumber" class="input input-bordered w-full" min="0" placeholder="0" />
              </label>
              <label class="form-control w-full">
                <div class="label"><span class="label-text">Giá dự tính (₫)</span></div>
                <input type="number" name="estimatedPrice" class="input input-bordered w-full" min="0" placeholder="0" />
              </label>
            </div>

            <label class="form-control w-full">
              <div class="label"><span class="label-text">Ghi chú</span></div>
              <input type="text" name="notes" class="input input-bordered w-full" placeholder="Ghi chú thêm..." />
            </label>

            <div class="flex justify-end mt-1">
              <button type="submit" class="btn btn-primary gap-2 w-full sm:w-auto">
                <Icon name="Plus" size={16} />
                Thêm vào wishlist
              </button>
            </div>
          </form>
        </div>

        {/* Wishlist items */}
        {items.length === 0 ? (
          <div class="hero min-h-48 bg-base-100 rounded-xl border border-base-200">
            <div class="hero-content text-center">
              <div>
                <Icon name="ShoppingCart" size={48} class="text-base-content/20 mx-auto mb-3" />
                <h2 class="text-xl font-bold mb-2">Wishlist còn trống</h2>
                <p class="text-base-content/50">Thêm các tập bạn muốn mua!</p>
              </div>
            </div>
          </div>
        ) : (
          <div class="flex flex-col gap-4">
            {[...grouped.entries()].map(([title, groupItems]) => (
              <div class="bg-base-100 rounded-2xl border border-base-200 shadow overflow-hidden">
                <div class="flex items-center gap-2 px-4 py-3 border-b border-base-200 bg-base-200/40">
                  <Icon name="BookOpen" size={14} class="text-base-content/40 shrink-0" />
                  <span class="font-semibold truncate">{title}</span>
                </div>
                <div class="divide-y divide-base-200">
                  {groupItems.map(item => (
                    <div class="flex items-center justify-between px-4 py-3 gap-3">
                      <div class="flex flex-col gap-0.5 min-w-0">
                        <span class="font-medium">{item.volumeNumber > 0 ? `${item.volumeNumber} tập` : 'Chưa rõ số tập'}</span>
                        {item.estimatedPrice ? (
                          <span class="text-sm text-primary">{item.estimatedPrice.toLocaleString('vi-VN')}₫</span>
                        ) : null}
                        {item.notes ? (
                          <span class="text-xs text-base-content/50 truncate">{item.notes}</span>
                        ) : null}
                      </div>
                      <button
                        class="btn btn-ghost btn-sm btn-square text-error shrink-0"
                        data-delete-url={`/wishlist/${item.id}`}
                        data-delete-confirm="Xóa mục này?"
                        data-delete-redirect="/wishlist"
                      >
                        <Icon name="Trash2" size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        ;(function() {
          const searchInput  = document.getElementById('wishlist-search-input')
          const resultsBox   = document.getElementById('wishlist-search-results')
          const titleInput   = document.getElementById('wishlist-book-title')
          const volumeInput  = document.querySelector('input[name="volumeNumber"]')
          if (!searchInput || !resultsBox || !titleInput) return

          let timer
          function hide() { resultsBox.style.display = 'none'; resultsBox.innerHTML = '' }
          function show() { resultsBox.style.display = 'flex' }

          searchInput.addEventListener('input', () => {
            clearTimeout(timer)
            const q = searchInput.value.trim()
            if (!q) { hide(); return }
            timer = setTimeout(() => doSearch(q), 400)
          })

          document.addEventListener('click', (e) => {
            if (!resultsBox.contains(e.target) && e.target !== searchInput) hide()
          })

          async function doSearch(q) {
            resultsBox.innerHTML = '<p style="padding:8px 12px;font-size:12px;opacity:.5;">Đang tìm...</p>'
            show()
            try {
              const res  = await fetch('/api/book-search?q=' + encodeURIComponent(q))
              const data = await res.json()
              if (data.__error === 'unavailable') {
                resultsBox.innerHTML = '<p style="padding:8px 12px;font-size:12px;color:orange;">⚠ Tenrai đang bảo trì</p>'
                return
              }
              if (!data.length) {
                resultsBox.innerHTML = '<p style="padding:8px 12px;font-size:12px;opacity:.5;">Không tìm thấy kết quả</p>'
                return
              }
              resultsBox.innerHTML = data.map((item, i) => \`
                <div
                  style="display:flex;gap:8px;padding:8px 12px;cursor:pointer;align-items:center;flex-shrink:0;"
                  onmouseenter="this.style.background='var(--fallback-b2,oklch(var(--b2)))'"
                  onmouseleave="this.style.background=''"
                  data-title="\${esc(item.title)}"
                  data-volumes="\${item.totalVolumes || ''}"
                >
                  \${item.coverUrl
                    ? \`<img src="\${esc(item.coverUrl)}" width="28" height="42" style="object-fit:cover;border-radius:3px;flex-shrink:0;" />\`
                    : \`<div style="width:28px;height:42px;background:#e5e7eb;border-radius:3px;flex-shrink:0;"></div>\`
                  }
                  <div style="min-width:0;">
                    <div style="font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">\${esc(item.title)}</div>
                    \${item.author ? \`<div style="font-size:11px;opacity:.5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">\${esc(item.author)}</div>\` : ''}
                  </div>
                </div>
              \`).join('')
              resultsBox.querySelectorAll('[data-title]').forEach(el => {
                el.addEventListener('click', () => {
                  titleInput.value = el.dataset.title
                  if (el.dataset.volumes && volumeInput) volumeInput.value = el.dataset.volumes
                  searchInput.value = ''
                  hide()
                })
              })
            } catch {
              resultsBox.innerHTML = '<p style="padding:8px 12px;font-size:12px;color:red;">Không thể kết nối</p>'
            }
          }

          function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;') }
        })()
      ` }} />
    </BaseLayout>
  )
}

export default WishlistPage
