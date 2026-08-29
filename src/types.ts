export type BookStatus = 'ongoing' | 'complete' | 'dropped'

export type Book = {
  id: number
  userId: number
  slug: string
  title: string
  author: string
  totalVolumes: number
  ownedVolumes: number
  status: BookStatus
  color: string
  hasGoods: boolean
  goodsCount: number
  coverUrl: string | null
  notes: string | null
}

export type Volume = {
  id: number
  bookId: number
  volumeNumber: number
  edition: string
  coverUrl: string | null
  purchaseDate: string | null
  price: number | null
  purchaseBatchId?: number | null
}

export type Goods = {
  id: number
  bookId: number
  name: string
  type: string
  imageUrl: string | null
  purchaseDate: string | null
  price: number | null
}

export type SectionItem = {
  id: number
  sectionId: number
  name: string
  type: string
  imageUrl: string | null
  purchaseDate: string | null
  price: number | null
}

export type Section = {
  id: number
  bookId: number
  name: string
  position: number
  items: SectionItem[]
}

export const SPINE_COLORS = [
  { name: 'Đỏ',        value: '#dc2626' },
  { name: 'Cam',       value: '#ea580c' },
  { name: 'Vàng',      value: '#ca8a04' },
  { name: 'Xanh lá',   value: '#16a34a' },
  { name: 'Ngọc',      value: '#0d9488' },
  { name: 'Xanh dương',value: '#2563eb' },
  { name: 'Tím',       value: '#7c3aed' },
  { name: 'Hồng',      value: '#db2777' },
  { name: 'Nâu',       value: '#92400e' },
  { name: 'Xám',       value: '#475569' },
]

export const STATUS_LABELS: Record<BookStatus, string> = {
  ongoing:  'Đang mua tiếp',
  complete: 'Đã đủ bộ',
  dropped:  'Ngừng sưu tập',
}
