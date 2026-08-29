// ─── View toggle ──────────────────────────────────────────────────────────────

let currentView = localStorage.getItem('bookshelf-view') || 'shelf'

function applyViewToggleUI() {
  const btnShelf = document.getElementById('btn-view-shelf')
  const btnGrid  = document.getElementById('btn-view-grid')
  if (!btnShelf || !btnGrid) return
  btnShelf.classList.toggle('btn-active', currentView === 'shelf')
  btnGrid.classList.toggle('btn-active',  currentView === 'grid')
}

document.getElementById('btn-view-shelf')?.addEventListener('click', () => {
  currentView = 'shelf'
  localStorage.setItem('bookshelf-view', 'shelf')
  applyViewToggleUI()
  fetchBookshelf()
})

document.getElementById('btn-view-grid')?.addEventListener('click', () => {
  currentView = 'grid'
  localStorage.setItem('bookshelf-view', 'grid')
  applyViewToggleUI()
  fetchBookshelf()
})

applyViewToggleUI()

// ─── Search + Filter ──────────────────────────────────────────────────────────

const container   = document.getElementById('bookshelf-container')
const searchInput = document.getElementById('search-input')
const statusSelect = document.getElementById('status-select')
const sortSelect   = document.getElementById('sort-select')

async function fetchBookshelf() {
  const q      = searchInput?.value ?? ''
  const status = statusSelect?.value ?? ''
  const sort   = sortSelect?.value ?? ''
  const params = new URLSearchParams()
  if (q)      params.set('q', q)
  if (status) params.set('status', status)
  if (sort)   params.set('sort', sort)
  params.set('view', currentView)

  const res  = await fetch('/books?' + params.toString())
  const html = await res.text()
  if (container) container.innerHTML = html
}

// Initial load với đúng view
fetchBookshelf()

let debounceTimer
searchInput?.addEventListener('input', () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(fetchBookshelf, 300)
})

statusSelect?.addEventListener('change', fetchBookshelf)
sortSelect?.addEventListener('change', fetchBookshelf)
