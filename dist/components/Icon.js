import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import { BookOpen, Bookmark, Gift, Banknote, Calendar, Pencil, X, ArrowLeft, Star, Sun, Moon, Trash2, Plus, Upload, Download, ShoppingCart, LayoutGrid, List, AlertCircle, Eye, EyeOff, } from 'lucide-static';
// Map icon names → SVG strings
export const ICONS = {
    BookOpen, Bookmark, Gift, Banknote,
    Calendar, Pencil, X, ArrowLeft,
    Star, Sun, Moon, Trash2, Plus, Upload,
    Download, ShoppingCart, LayoutGrid, List,
    AlertCircle, Eye, EyeOff,
};
// Renders a lucide-static SVG, overriding width/height to `size`
const Icon = ({ name, size = 16, class: cls }) => {
    const raw = ICONS[name];
    const svg = raw
        .replace(/width="\d+"/, `width="${size}"`)
        .replace(/height="\d+"/, `height="${size}"`);
    return (_jsx("span", { class: `inline-flex items-center justify-center shrink-0 ${cls ?? ''}`, dangerouslySetInnerHTML: { __html: svg } }));
};
export default Icon;
