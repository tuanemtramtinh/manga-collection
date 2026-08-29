import { Hono } from 'hono'
import { wishlistRepository } from '../repositories/wishlistRepository.js'
import WishlistPage from '../pages/Wishlist.js'
import { getUserEmail } from '../lib/ctx.js'

const router = new Hono()

// GET /wishlist — Trang wishlist
router.get('/', async (c) => {
  const items = await wishlistRepository.findAll()
  return c.html(<WishlistPage items={items} userEmail={getUserEmail(c)} />)
})

// POST /wishlist — Thêm mục vào wishlist
router.post('/', async (c) => {
  const body      = await c.req.parseBody()
  const bookTitle = String(body.bookTitle || '').trim()
  if (!bookTitle) return c.redirect('/wishlist')
  await wishlistRepository.create({
    bookId:         null,
    bookTitle,
    volumeNumber:   Number(body.volumeNumber) || 0,
    estimatedPrice: body.estimatedPrice ? Number(body.estimatedPrice) : null,
    notes:          body.notes ? String(body.notes) : null,
  })
  return c.redirect('/wishlist')
})

// DELETE /wishlist/:id — Xóa (fetch)
router.delete('/:id', async (c) => {
  await wishlistRepository.delete(Number(c.req.param('id')))
  return c.json({ ok: true })
})

// POST /wishlist/:id/delete — Xóa (form fallback)
router.post('/:id/delete', async (c) => {
  await wishlistRepository.delete(Number(c.req.param('id')))
  return c.redirect('/wishlist')
})

export default router
