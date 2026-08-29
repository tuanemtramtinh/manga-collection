import { Hono } from 'hono'
import HomePage from '../pages/Home.js'
import { bookRepository } from '../repositories/bookRepository.js'
import { volumeRepository } from '../repositories/volumeRepository.js'
import { purchaseBatchRepository } from '../repositories/purchaseBatchRepository.js'
import { getUserEmail } from '../lib/ctx.js'
import type { BookStatus } from '../types.js'

const router = new Hono()

const validStatuses: BookStatus[] = ['ongoing', 'complete', 'dropped']
const validSorts = ['newest', 'title', 'volumes'] as const

router.get('/', async (c) => {
  const qParam = c.req.query('q') ?? ''
  const q      = qParam.trim()
  const statusParam = c.req.query('status') ?? ''
  const status = validStatuses.includes(statusParam as BookStatus)
    ? statusParam as BookStatus
    : ''
  const sortParam = c.req.query('sort') ?? ''
  const sort = validSorts.includes(sortParam as typeof validSorts[number])
    ? sortParam
    : 'newest'
  const view   = c.req.query('view') === 'shelf' ? 'shelf' : 'grid'
  const returnParams = new URLSearchParams()
  if (q) returnParams.set('q', q)
  if (status) returnParams.set('status', status)
  if (sort) returnParams.set('sort', sort)
  if (view === 'grid') returnParams.set('view', view)

  const [books, quickBooks, individualSpent, bundleSpent] = await Promise.all([
    bookRepository.findAll({ q, status, sort }),
    bookRepository.findAll({ sort: 'title' }),
    volumeRepository.sumAllPrices(),
    purchaseBatchRepository.sumAllPrices(),
  ])
  const totalSpent = individualSpent + bundleSpent
  return c.html(<HomePage books={books} quickBooks={quickBooks} totalSpent={totalSpent} userEmail={getUserEmail(c)} q={q} status={status} sort={sort} view={view} returnQuery={returnParams.toString()} />)
})

export default router
