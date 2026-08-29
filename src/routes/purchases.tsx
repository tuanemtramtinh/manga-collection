import { Hono } from 'hono'
import { bookRepository } from '../repositories/bookRepository.js'
import { volumeRepository } from '../repositories/volumeRepository.js'
import { purchaseBatchRepository } from '../repositories/purchaseBatchRepository.js'
import { getUserId } from '../lib/ctx.js'

const router = new Hono()

function parseNumbers(raw: string): number[] {
  const nums = new Set<number>()
  for (const part of raw.split(',')) {
    const value = part.trim()
    const range = value.match(/^(\d+)-(\d+)$/)
    if (range) {
      for (let i = Math.min(Number(range[1]), Number(range[2])); i <= Math.max(Number(range[1]), Number(range[2])); i++) nums.add(i)
    } else if (/^\d+$/.test(value)) {
      nums.add(Number(value))
    }
  }
  return [...nums].sort((a, b) => a - b)
}

router.post('/quick', async (c) => {
  const userId = getUserId(c)
  const body = await c.req.parseBody()
  const bookId = Number(body.bookId)
  const numbers = parseNumbers(String(body.numbers ?? ''))
  const purchaseDate = String(body.purchaseDate ?? '').trim()
  const price = Number(body.price)
  const book = await bookRepository.findById(bookId, userId)

  if (!book || !numbers.length || !purchaseDate || !Number.isFinite(price) || price <= 0) {
    return c.redirect('/?quick=error')
  }

  const existing = await volumeRepository.findByBookId(bookId)
  const existingNumbers = new Set(existing.map(volume => volume.volumeNumber))
  const newNumbers = numbers.filter(number => !existingNumbers.has(number))
  if (!newNumbers.length) return c.redirect('/?quick=duplicate')

  if (body.mode === 'bundle') {
    await purchaseBatchRepository.createWithVolumes({
      bookId,
      volumeNumbers: newNumbers,
      purchaseDate,
      totalPrice: price,
    })
  } else {
    await Promise.all(newNumbers.map(volumeNumber => volumeRepository.create({
      bookId,
      volumeNumber,
      edition: '',
      coverUrl: null,
      purchaseDate,
      price,
    })))
  }

  await bookRepository.syncOwnedVolumes(bookId)
  return c.redirect('/?quick=success')
})

export default router
