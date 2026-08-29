// ─── Volume modal tabs ────────────────────────────────────────────────────────

;(function() {
  const tabs       = document.querySelectorAll('#vol-tabs [data-tab]')
  const panelSingle = document.getElementById('vol-panel-single')
  const panelBulk   = document.getElementById('vol-panel-bulk')
  const panelBundle = document.getElementById('vol-panel-bundle')
  if (!tabs.length || !panelSingle || !panelBulk || !panelBundle) return

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const activePanel = document.getElementById(`vol-panel-${tab.dataset.tab}`)
      tabs.forEach(t => {
        const isActive = t.dataset.tab === tab.dataset.tab
        t.classList.toggle('btn-primary', isActive)
        t.classList.toggle('btn-ghost', !isActive)
      })
      ;[panelSingle, panelBulk, panelBundle].forEach(panel => panel.classList.toggle('hidden', panel !== activePanel))
    })
  })

  // Preview danh sách tập khi nhập
  const numbersInput = document.querySelector('#form_volume_bulk input[name="numbers"]')
  const preview      = document.getElementById('bulk-preview')
  if (numbersInput && preview) {
    numbersInput.addEventListener('input', () => {
      const nums = parseNums(numbersInput.value)
      if (!nums.length) { preview.textContent = ''; return }
      preview.textContent = `Sẽ tạo ${nums.length} tập: ${nums.slice(0, 20).join(', ')}${nums.length > 20 ? '...' : ''}`
    })
  }

  function parseNums(raw) {
    const nums = new Set()
    for (const part of raw.split(',')) {
      const p = part.trim()
      const range = p.match(/^(\d+)-(\d+)$/)
      if (range) {
        const a = Number(range[1]), b = Number(range[2])
        for (let i = Math.min(a,b); i <= Math.max(a,b); i++) nums.add(i)
      } else if (/^\d+$/.test(p)) {
        nums.add(Number(p))
      }
    }
    return [...nums].sort((a,b) => a-b)
  }
})()

// ─── Collapsible custom sections ─────────────────────────────────────────────

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-toggle-section]')
  if (!button) return
  const content = document.getElementById(button.dataset.toggleSection)
  if (!content) return

  const isOpen = button.getAttribute('aria-expanded') === 'true'
  button.setAttribute('aria-expanded', String(!isOpen))
  content.classList.toggle('is-collapsed', isOpen)
  button.querySelector('span')?.classList.toggle('rotate-180', !isOpen)
})

// ─── Load form vào modal_edit ─────────────────────────────────────────────────

async function loadEditForm(url) {
  const res  = await fetch(url)
  const html = await res.text()
  const body = document.getElementById('modal_edit_body')
  if (!body) return

  body.innerHTML = html

  // Re-execute scripts vì innerHTML không tự chạy script tags
  body.querySelectorAll('script').forEach(oldScript => {
    const newScript = document.createElement('script')
    newScript.textContent = oldScript.textContent
    oldScript.replaceWith(newScript)
  })

  const modal = document.getElementById('modal_edit')
  if (modal) modal.showModal()
}

document.addEventListener('click', async (e) => {
  // Volume edit
  const volBtn = e.target.closest('[data-edit-volume]')
  if (volBtn) {
    e.preventDefault()
    await loadEditForm(volBtn.dataset.editVolume)
    return
  }

  // Section item add or edit (via fetch-form)
  const fetchBtn = e.target.closest('[data-fetch-form]')
  if (fetchBtn) {
    e.preventDefault()
    await loadEditForm(fetchBtn.dataset.fetchForm)
    return
  }
})
