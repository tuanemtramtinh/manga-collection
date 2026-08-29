import type { FC } from 'hono/jsx'
import Icon from '../components/Icon.js'

type Props = { error?: string; email?: string }

const RegisterPage: FC<Props> = ({ error, email }) => (
  <html lang="vi" data-theme="light">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Đăng ký — Kệ Truyện</title>
      <link rel="stylesheet" href="/public/output.css" />
      <script dangerouslySetInnerHTML={{ __html: `
        const t = localStorage.getItem('theme') || 'light'
        document.documentElement.setAttribute('data-theme', t)
      ` }} />
    </head>
    <body class="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div class="w-full max-w-sm">
        <div class="text-center mb-8">
          <div class="flex justify-center mb-3">
            <Icon name="BookOpen" size={40} class="text-primary" />
          </div>
          <h1 class="text-2xl font-bold">Kệ Truyện</h1>
          <p class="text-base-content/50 text-sm mt-1">Tạo tài khoản mới</p>
        </div>

        <div class="card bg-base-100 shadow-lg border border-base-200">
          <div class="card-body gap-4">
            {error && (
              <div class="alert alert-error text-sm py-2">
                <Icon name="AlertCircle" size={16} />
                {error}
              </div>
            )}

            <form method="post" action="/register" class="flex flex-col gap-4">
              <div class="form-control gap-1.5">
                <label class="label py-0">
                  <span class="label-text font-medium">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={email ?? ''}
                  class="input input-bordered"
                  placeholder="you@example.com"
                  required
                  autofocus
                />
              </div>

              <div class="form-control gap-1.5">
                <label class="label py-0">
                  <span class="label-text font-medium">Mật khẩu</span>
                </label>
                <div class="relative">
                  <input
                    type="password"
                    name="password"
                    id="pw-reg"
                    class="input input-bordered w-full pr-10"
                    placeholder="Ít nhất 8 ký tự"
                    minlength={8}
                    required
                  />
                  <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors" onclick="togglePw('pw-reg', this)">
                    <Icon name="Eye" size={18} />
                  </button>
                </div>
              </div>

              <div class="form-control gap-1.5">
                <label class="label py-0">
                  <span class="label-text font-medium">Xác nhận mật khẩu</span>
                </label>
                <div class="relative">
                  <input
                    type="password"
                    name="confirm"
                    id="pw-confirm"
                    class="input input-bordered w-full pr-10"
                    placeholder="Nhập lại mật khẩu"
                    required
                  />
                  <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors" onclick="togglePw('pw-confirm', this)">
                    <Icon name="Eye" size={18} />
                  </button>
                </div>
              </div>

              <button type="submit" class="btn btn-primary w-full mt-1">
                Tạo tài khoản
              </button>
            </form>

            <div class="divider text-xs text-base-content/40 my-0">đã có tài khoản?</div>

            <a href="/login" class="btn btn-outline w-full">
              Đăng nhập
            </a>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        function togglePw(id, btn) {
          const input = document.getElementById(id)
          const isText = input.type === 'text'
          input.type = isText ? 'password' : 'text'
          btn.style.opacity = isText ? '0.4' : '1'
        }
      ` }} />
    </body>
  </html>
)

export default RegisterPage
