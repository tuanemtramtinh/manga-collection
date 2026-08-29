import type { FC } from 'hono/jsx'
import { Sun, Moon } from 'lucide-static'

type Props = {
  title?: string
  userEmail?: string
  children?: any
}

const BaseLayout: FC<Props> = ({ title = 'My App', userEmail, children }) => {
  return (
    <html lang="vi" data-theme="light">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="stylesheet" href="/public/output.css" />
        {/* Apply saved theme before paint to avoid flash */}
        <script dangerouslySetInnerHTML={{ __html: `
          const t = localStorage.getItem('theme') || 'light'
          document.documentElement.setAttribute('data-theme', t)
        ` }} />
      </head>
      <body class="min-h-screen bg-base-200">
        {/* Top bar — full width, fixed, same height as page titles */}
        <header class="fixed top-0 left-0 right-0 z-50 h-12 flex items-center justify-end px-3 bg-base-200/95 backdrop-blur-sm border-b border-base-200">
          {/* Theme toggle */}
          <button
            id="theme-toggle"
            class="btn btn-ghost btn-sm btn-circle"
            title="Đổi giao diện"
            aria-label="Toggle dark mode"
          >
            <span id="icon-sun"  dangerouslySetInnerHTML={{ __html: (Sun  as string).replace(/width="\d+"/, 'width="18"').replace(/height="\d+"/, 'height="18"') }} />
            <span id="icon-moon" dangerouslySetInnerHTML={{ __html: (Moon as string).replace(/width="\d+"/, 'width="18"').replace(/height="\d+"/, 'height="18"') }} />
          </button>

          {/* User menu */}
          {userEmail && (
            <div class="dropdown dropdown-end">
              <button tabindex={0} class="btn btn-ghost btn-sm gap-1.5 normal-case">
                <span class="text-xs text-base-content/60 max-w-[140px] truncate">{userEmail}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <ul tabindex={0} class="dropdown-content menu menu-sm bg-base-100 rounded-box shadow-lg border border-base-200 w-40 mt-1 z-50">
                <li>
                  <form method="post" action="/logout">
                    <button type="submit" class="w-full text-left text-error">
                      Đăng xuất
                    </button>
                  </form>
                </li>
              </ul>
            </div>
          )}
        </header>

        {/* Page content — pushed down by header height */}
        <div class="pt-12">

        {children}

        {/* Toasts */}
        <div id="toast-container" class="toast toast-top toast-center z-[100]"></div>

        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            const params = new URLSearchParams(location.search)
            const messages = {
              welcome: 'Tạo tài khoản thành công! Chào mừng bạn.',
              login:   'Đăng nhập thành công!',
              'quick-success': 'Đã thêm giao dịch mua nhanh.',
              'quick-duplicate': 'Các tập này đã có trong bộ truyện.',
              'quick-error': 'Không thể lưu giao dịch. Hãy kiểm tra lại dữ liệu.',
            }
            const quickKey = params.get('quick') ? 'quick-' + params.get('quick') : ''
            const key = Object.keys(messages).find(k => params.get(k) === '1') || (messages[quickKey] ? quickKey : '')
            if (key) {
              const container = document.getElementById('toast-container')
              if (container) {
                const alert = document.createElement('div')
                alert.className = 'alert alert-success shadow-lg'
                alert.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span>' + messages[key] + '</span>'
                container.appendChild(alert)
                setTimeout(() => alert.remove(), 4000)
              }
              history.replaceState(null, '', location.pathname)
            }
          })()
        ` }} />

        <script src="/public/js/main.js" defer></script>
        </div>
      </body>
    </html>
  )
}

export default BaseLayout
