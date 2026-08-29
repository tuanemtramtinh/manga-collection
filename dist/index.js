import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { requireAuth } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import homeRoutes from './routes/home.js';
import bookRoutes from './routes/books.js';
import uploadRoutes from './routes/upload.js';
import spendingRoutes from './routes/spending.js';
import apiRoutes from './routes/api.js';
import exportRoutes from './routes/export.js';
import importRoutes from './routes/import.js';
import wishlistRoutes from './routes/wishlist.js';
const app = new Hono();
// Static files — không cần auth
app.use('/public/*', serveStatic({ root: './' }));
// Auth routes (login, register, logout) — không cần auth
app.route('/', authRoutes);
// Tất cả routes bên dưới đều yêu cầu đăng nhập
app.use('*', requireAuth);
app.route('/', homeRoutes);
app.route('/books', bookRoutes);
app.route('/upload', uploadRoutes);
app.route('/spending', spendingRoutes);
app.route('/api', apiRoutes);
app.route('/export', exportRoutes);
app.route('/import', importRoutes);
app.route('/wishlist', wishlistRoutes);
serve({
    fetch: app.fetch,
    port: 3000,
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
