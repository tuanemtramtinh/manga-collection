import type { FC } from 'hono/jsx'
import {
  BookOpen, Bookmark, Gift, Banknote,
  Calendar, Pencil, X, ArrowLeft,
  Star, Sun, Moon, Trash2, Plus, Upload,
  Download, ShoppingCart, LayoutGrid, List,
  AlertCircle, Eye, EyeOff, ChevronDown,
} from 'lucide-static'

// Map icon names → SVG strings
export const ICONS = {
  BookOpen, Bookmark, Gift, Banknote,
  Calendar, Pencil, X, ArrowLeft,
  Star, Sun, Moon, Trash2, Plus, Upload,
  Download, ShoppingCart, LayoutGrid, List,
  AlertCircle, Eye, EyeOff, ChevronDown,
} as const

export type IconName = keyof typeof ICONS

type Props = {
  name: IconName
  size?: number
  class?: string
}

// Renders a lucide-static SVG, overriding width/height to `size`
const Icon: FC<Props> = ({ name, size = 16, class: cls }) => {
  const raw = ICONS[name] as string
  const svg = raw
    .replace(/width="\d+"/, `width="${size}"`)
    .replace(/height="\d+"/, `height="${size}"`)

  return (
    <span
      class={`inline-flex items-center justify-center shrink-0 ${cls ?? ''}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export default Icon
