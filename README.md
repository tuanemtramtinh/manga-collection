```
npm install
npm run dev
```

```
open http://localhost:3000
```

## Deploy với PM2

Workflow CI/CD sẽ tự build khi tạo pull request hoặc push lên `main`. Khi push thành công lên `main`, GitHub Actions SSH vào server và chạy trong thư mục `manga-collection`:

```bash
git fetch origin main
git reset --hard origin/main
npm i
npm run db:generate
npm run db:migrate
npm run build
pm2 startOrRestart ecosystem.config.cjs --update-env
pm2 save
```

Cấu hình ba GitHub Secrets: `SERVER_HOST`, `SERVER_USER`, và `SERVER_PASSWORD`. Server cần cho phép SSH đăng nhập bằng mật khẩu, có sẵn repository tại `~/manga-collection` và Node.js 22. Workflow tự nạp Node từ `~/.nvm` và cài PM2 nếu chưa có; file `.env` phải được tạo riêng trên server.
