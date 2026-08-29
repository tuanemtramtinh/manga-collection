;(function () {
// ─── Book quick search ────────────────────────────────────────────────────────

const bookSearchInput = document.getElementById('book-search-input')
const resultsBox      = document.getElementById('book-search-results')

function hideBox() {
  if (!resultsBox) return
  resultsBox.style.display = 'none'
  resultsBox.innerHTML = ''
}
function showBox() {
  if (!resultsBox) return
  resultsBox.style.display = 'flex'
}

if (bookSearchInput && resultsBox) {
  let debounceTimer

  bookSearchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer)
    const q = bookSearchInput.value.trim()
    if (!q) { hideBox(); return }
    debounceTimer = setTimeout(() => doSearch(q), 400)
  })

  document.addEventListener('click', (e) => {
    if (!resultsBox.contains(e.target) && e.target !== bookSearchInput) hideBox()
  })

  async function doSearch(q) {
    resultsBox.innerHTML = '<p class="text-xs text-base-content/40 px-3 py-2">Đang tìm...</p>'
    showBox()
    try {
      const res  = await fetch('/api/book-search?q=' + encodeURIComponent(q))
      const data = await res.json()
      if (data.__error === 'unavailable') {
        resultsBox.innerHTML = '<p class="text-xs text-warning px-3 py-2">⚠ Tenrai đang bảo trì, thử lại sau</p>'
        return
      }
      renderResults(data)
    } catch {
      resultsBox.innerHTML = '<p class="text-xs text-error px-3 py-2">Không thể kết nối</p>'
    }
  }

  function renderResults(items) {
    if (!items.length) {
      resultsBox.innerHTML = '<p class="text-xs text-base-content/40 px-3 py-2">Không tìm thấy kết quả</p>'
      return
    }
    resultsBox.innerHTML = items.map((item, i) => `
      <div
        class="flex gap-2 px-3 py-2 hover:bg-base-200 cursor-pointer items-center shrink-0"
        data-idx="${i}"
        data-title="${escapeAttr(item.title)}"
        data-author="${escapeAttr(item.author)}"
        data-cover="${escapeAttr(item.coverUrl)}"
        data-volumes="${item.totalVolumes || 0}"
      >
        ${item.coverUrl
          ? `<img src="${escapeAttr(item.coverUrl)}" width="32" height="48" style="object-fit:cover;border-radius:3px;flex-shrink:0;" alt="" />`
          : `<div style="width:32px;height:48px;background:#e5e7eb;border-radius:3px;flex-shrink:0;"></div>`
        }
        <div class="flex flex-col min-w-0">
          <span class="text-sm font-medium truncate">${escapeHtml(item.title)}</span>
          ${item.author ? `<span class="text-xs text-base-content/50 truncate">${escapeHtml(item.author)}</span>` : ''}
        </div>
      </div>
    `).join('')

    resultsBox.querySelectorAll('[data-idx]').forEach(el => {
      el.addEventListener('click', () => fillForm(
        el.dataset.title,
        el.dataset.author,
        el.dataset.cover,
        el.dataset.volumes,
      ))
    })
  }

  function fillForm(title, author, coverUrl, volumes) {
    const form = document.getElementById('form_book')
    if (!form) return
    const titleInput   = form.querySelector('input[name="title"]')
    const authorInput  = form.querySelector('input[name="author"]')
    const volumesInput = form.querySelector('input[name="totalVolumes"]')
    const coverInput   = form.querySelector('input[type="hidden"][name="coverUrl"]')
    const previewBox   = document.getElementById('preview_coverUrl')
    const previewImg   = document.getElementById('img_coverUrl')

    if (titleInput)  titleInput.value  = title
    if (authorInput) authorInput.value = author
    if (volumesInput && volumes && Number(volumes) > 0) volumesInput.value = volumes
    if (coverUrl) {
      if (coverInput) coverInput.value = coverUrl
      if (previewImg) previewImg.src   = coverUrl
      if (previewBox) previewBox.classList.remove('hidden')
    }
    hideBox()
    bookSearchInput.value = ''
  }
}

// ─── Reset form khi đóng modal (chỉ add mode) ────────────────────────────────

const modalBook = document.getElementById('modal_book')
const formBook  = document.getElementById('form_book')

if (modalBook && formBook && !formBook.action.match(/\/books\/\d+$/)) {
  modalBook.addEventListener('close', () => {
    formBook.reset()

    const coverInput = formBook.querySelector('input[type="hidden"][name="coverUrl"]')
    if (coverInput) coverInput.value = ''

    const previewBox = document.getElementById('preview_coverUrl')
    const previewImg = document.getElementById('img_coverUrl')
    if (previewBox) previewBox.classList.add('hidden')
    if (previewImg) previewImg.src = ''

    hideBox()
    if (bookSearchInput) bookSearchInput.value = ''
  })
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeAttr(str) {
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

})()
