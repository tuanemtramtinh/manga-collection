import { Hono } from 'hono'
import * as XLSX from 'xlsx'
import { bookRepository }     from '../repositories/bookRepository.js'
import { spendingRepository } from '../repositories/spendingRepository.js'

const router = new Hono()

const STATUS_LABELS: Record<string, string> = {
  ongoing:  'Đang tiếp tục',
  complete: 'Hoàn thành',
  dropped:  'Đã bỏ',
}

// GET /export/books — Export all books as Excel
router.get('/books', async (c) => {
  const books = await bookRepository.findAll()

  const rows = books.map(b => ({
    'Tên truyện':  b.title,
    'Tác giả':     b.author,
    'Trạng thái':  STATUS_LABELS[b.status] ?? b.status,
    'Tổng tập':    b.totalVolumes,
    'Đang có':     b.ownedVolumes,
    'Ghi chú':     b.notes ?? '',
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Kệ Truyện')

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  c.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  c.header('Content-Disposition', 'attachment; filename="ke-truyen-books.xlsx"')
  return c.body(buf)
})

// GET /export/spending — Export spending as Excel
router.get('/spending', async (c) => {
  const month = c.req.query('month') ?? ''
  const rows = await spendingRepository.findAll(month || undefined)
  const sortedRows = [...rows].sort((a, b) => {
    const byBook = a.bookTitle.localeCompare(b.bookTitle, 'vi')
    if (byBook !== 0) return byBook

    if (a.type === 'volume' && b.type === 'volume') {
      return (a.volumeNumber ?? 0) - (b.volumeNumber ?? 0)
    }
    if (a.type === 'volume') return -1
    if (b.type === 'volume') return 1
    return a.label.localeCompare(b.label, 'vi')
  })

  const data = sortedRows.map(r => ({
    'Ngày mua':   r.purchaseDate,
    'Bộ truyện':  r.bookTitle,
    'Loại':       r.type === 'volume' ? 'Tập truyện' : r.type === 'bundle' ? 'Mua theo bộ' : 'Item',
    'Số tập':     r.volumeNumber ?? '',
    'Tên':        r.label,
    'Giá (₫)':   r.price,
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Chi tiêu')

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  c.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  c.header('Content-Disposition', `attachment; filename="ke-truyen-spending${month ? `-${month}` : ''}.xlsx"`)
  return c.body(buf)
})

export default router
