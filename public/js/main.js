// ─── Dark mode ────────────────────────────────────────────────────────────────

function syncThemeIcon() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  const sun  = document.getElementById('icon-sun')
  const moon = document.getElementById('icon-moon')
  if (sun)  sun.style.display  = isDark ? 'none' : 'inline-flex'
  if (moon) moon.style.display = isDark ? 'inline-flex' : 'none'
}

syncThemeIcon()

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', next)
  localStorage.setItem('theme', next)
  syncThemeIcon()
})

// ─── Modal open via [data-open-modal] ─────────────────────────────────────────

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-open-modal]')
  if (!btn) return
  const modal = document.getElementById(btn.getAttribute('data-open-modal'))
  if (modal) modal.showModal()
})

// ─── Delete via fetch ─────────────────────────────────────────────────────────

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-delete-url]')
  if (!btn) return
  const msg      = btn.dataset.deleteConfirm || 'Xóa mục này?'
  if (!confirm(msg)) return
  const url      = btn.dataset.deleteUrl
  const redirect = btn.dataset.deleteRedirect || '/'
  await fetch(url, { method: 'DELETE' })
  if (redirect === 'reload') {
    window.location.reload()
  } else {
    window.location.href = redirect
  }
})

// ─── Color swatch highlight ───────────────────────────────────────────────────

document.addEventListener('change', (e) => {
  if (e.target.name !== 'color') return
  document.querySelectorAll('[data-swatch]').forEach(el => {
    const isSelected = el.getAttribute('data-swatch') === e.target.value
    el.style.borderColor = isSelected ? 'white' : 'transparent'
    el.style.boxShadow   = isSelected ? '0 0 0 2px ' + e.target.value : 'none'
  })
})
