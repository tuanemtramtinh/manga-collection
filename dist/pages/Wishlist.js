import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import BaseLayout from '../layouts/base.js';
import Icon from '../components/Icon.js';
const WishlistPage = ({ items, userEmail }) => {
    const totalCost = items.reduce((s, i) => s + (i.estimatedPrice ?? 0), 0);
    // Group by resolvedTitle
    const grouped = new Map();
    for (const item of items) {
        const key = item.resolvedTitle || '(Chưa có tên)';
        if (!grouped.has(key))
            grouped.set(key, []);
        grouped.get(key).push(item);
    }
    return (_jsxs(BaseLayout, { title: "Wishlist \u2014 K\u1EC7 Truy\u1EC7n", userEmail: userEmail, children: [_jsxs("div", { class: "container mx-auto px-4 py-6 sm:py-8", style: "max-width:800px;", children: [_jsxs("div", { class: "mb-6", children: [_jsxs("a", { href: "/", class: "btn btn-ghost btn-sm gap-1 pl-1 mb-4", children: [_jsx(Icon, { name: "ArrowLeft", size: 16 }), "Quay l\u1EA1i k\u1EC7"] }), _jsxs("h1", { class: "text-2xl sm:text-3xl font-bold flex items-center gap-2", children: [_jsx(Icon, { name: "ShoppingCart", size: 28, class: "text-primary" }), "Wishlist"] }), _jsx("p", { class: "text-base-content/50 mt-1 text-sm", children: "C\u00E1c t\u1EADp mu\u1ED1n mua trong t\u01B0\u01A1ng lai" })] }), _jsxs("div", { class: "grid grid-cols-2 gap-3 mb-6", children: [_jsxs("div", { class: "bg-base-100 rounded-2xl shadow px-3 py-3 sm:px-5 sm:py-4 flex items-center gap-3 border border-base-200", children: [_jsx(Icon, { name: "ShoppingCart", size: 24, class: "text-primary shrink-0" }), _jsxs("div", { class: "flex flex-col gap-0.5 min-w-0", children: [_jsx("span", { class: "text-xl sm:text-2xl font-bold tracking-tight text-primary", children: items.length }), _jsx("span", { class: "text-xs text-base-content/50 font-medium uppercase tracking-wide", children: "M\u1EE5c wishlist" })] })] }), _jsxs("div", { class: "bg-base-100 rounded-2xl shadow px-3 py-3 sm:px-5 sm:py-4 flex items-center gap-3 border border-base-200", children: [_jsx(Icon, { name: "Banknote", size: 24, class: "text-success shrink-0" }), _jsxs("div", { class: "flex flex-col gap-0.5 min-w-0", children: [_jsxs("span", { class: "text-xl sm:text-2xl font-bold tracking-tight text-success truncate", children: [totalCost.toLocaleString('vi-VN'), "\u20AB"] }), _jsx("span", { class: "text-xs text-base-content/50 font-medium uppercase tracking-wide", children: "D\u1EF1 t\u00EDnh chi" })] })] })] }), _jsxs("div", { class: "bg-base-100 rounded-2xl border border-base-200 shadow p-4 sm:p-5 mb-8", children: [_jsx("h2", { class: "font-bold text-lg mb-4", children: "Th\u00EAm v\u00E0o wishlist" }), _jsxs("form", { method: "post", action: "/wishlist", class: "flex flex-col gap-3", children: [_jsxs("div", { class: "form-control w-full", children: [_jsxs("div", { class: "label", children: [_jsx("span", { class: "label-text", children: "T\u00ECm nhanh" }), _jsx("span", { class: "label-text-alt text-base-content/40 hidden sm:block", children: "T\u00EAn ti\u1EBFng Anh ho\u1EB7c Nh\u1EADt" })] }), _jsxs("div", { class: "relative", children: [_jsx("input", { type: "search", id: "wishlist-search-input", placeholder: "T\u00ECm manga tr\u00EAn MAL...", class: "input input-bordered w-full", autocomplete: "off" }), _jsx("div", { id: "wishlist-search-results", class: "absolute left-0 right-0 z-50 flex flex-col overflow-y-auto rounded-lg border border-base-200 bg-base-100 shadow-lg", style: "max-height:200px;display:none;top:calc(100% + 6px);" })] })] }), _jsxs("label", { class: "form-control w-full", children: [_jsx("div", { class: "label", children: _jsx("span", { class: "label-text", children: "T\u00EAn b\u1ED9 truy\u1EC7n *" }) }), _jsx("input", { type: "text", name: "bookTitle", id: "wishlist-book-title", class: "input input-bordered w-full", placeholder: "T\u00EAn truy\u1EC7n...", required: true })] }), _jsxs("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("label", { class: "form-control w-full", children: [_jsx("div", { class: "label", children: _jsx("span", { class: "label-text", children: "T\u1ED5ng s\u1ED1 t\u1EADp" }) }), _jsx("input", { type: "number", name: "volumeNumber", class: "input input-bordered w-full", min: "0", placeholder: "0" })] }), _jsxs("label", { class: "form-control w-full", children: [_jsx("div", { class: "label", children: _jsx("span", { class: "label-text", children: "Gi\u00E1 d\u1EF1 t\u00EDnh (\u20AB)" }) }), _jsx("input", { type: "number", name: "estimatedPrice", class: "input input-bordered w-full", min: "0", placeholder: "0" })] })] }), _jsxs("label", { class: "form-control w-full", children: [_jsx("div", { class: "label", children: _jsx("span", { class: "label-text", children: "Ghi ch\u00FA" }) }), _jsx("input", { type: "text", name: "notes", class: "input input-bordered w-full", placeholder: "Ghi ch\u00FA th\u00EAm..." })] }), _jsx("div", { class: "flex justify-end mt-1", children: _jsxs("button", { type: "submit", class: "btn btn-primary gap-2 w-full sm:w-auto", children: [_jsx(Icon, { name: "Plus", size: 16 }), "Th\u00EAm v\u00E0o wishlist"] }) })] })] }), items.length === 0 ? (_jsx("div", { class: "hero min-h-48 bg-base-100 rounded-xl border border-base-200", children: _jsx("div", { class: "hero-content text-center", children: _jsxs("div", { children: [_jsx(Icon, { name: "ShoppingCart", size: 48, class: "text-base-content/20 mx-auto mb-3" }), _jsx("h2", { class: "text-xl font-bold mb-2", children: "Wishlist c\u00F2n tr\u1ED1ng" }), _jsx("p", { class: "text-base-content/50", children: "Th\u00EAm c\u00E1c t\u1EADp b\u1EA1n mu\u1ED1n mua!" })] }) }) })) : (_jsx("div", { class: "flex flex-col gap-4", children: [...grouped.entries()].map(([title, groupItems]) => (_jsxs("div", { class: "bg-base-100 rounded-2xl border border-base-200 shadow overflow-hidden", children: [_jsxs("div", { class: "flex items-center gap-2 px-4 py-3 border-b border-base-200 bg-base-200/40", children: [_jsx(Icon, { name: "BookOpen", size: 14, class: "text-base-content/40 shrink-0" }), _jsx("span", { class: "font-semibold truncate", children: title })] }), _jsx("div", { class: "divide-y divide-base-200", children: groupItems.map(item => (_jsxs("div", { class: "flex items-center justify-between px-4 py-3 gap-3", children: [_jsxs("div", { class: "flex flex-col gap-0.5 min-w-0", children: [_jsx("span", { class: "font-medium", children: item.volumeNumber > 0 ? `${item.volumeNumber} tập` : 'Chưa rõ số tập' }), item.estimatedPrice ? (_jsxs("span", { class: "text-sm text-primary", children: [item.estimatedPrice.toLocaleString('vi-VN'), "\u20AB"] })) : null, item.notes ? (_jsx("span", { class: "text-xs text-base-content/50 truncate", children: item.notes })) : null] }), _jsx("button", { class: "btn btn-ghost btn-sm btn-square text-error shrink-0", "data-delete-url": `/wishlist/${item.id}`, "data-delete-confirm": "X\u00F3a m\u1EE5c n\u00E0y?", "data-delete-redirect": "/wishlist", children: _jsx(Icon, { name: "Trash2", size: 15 }) })] }))) })] }))) }))] }), _jsx("script", { dangerouslySetInnerHTML: { __html: `
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
      ` } })] }));
};
export default WishlistPage;
