const VI_MAP: [RegExp, string][] = [
  [/[àáảãạăắặằẳẵâấầẩẫậ]/g, 'a'],
  [/[èéẻẽẹêếềểễệ]/g,       'e'],
  [/[ìíỉĩị]/g,              'i'],
  [/[òóỏõọôốồổỗộơớờởỡợ]/g, 'o'],
  [/[ùúủũụưứừửữự]/g,       'u'],
  [/[ỳýỷỹỵ]/g,             'y'],
  [/[đ]/g,                  'd'],
]

export function slugify(text: string): string {
  let s = text.toLowerCase()
  for (const [re, r] of VI_MAP) s = s.replace(re, r)
  return s
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

/** Generate a unique slug, appending -2 -3 ... if collision */
export async function uniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const root = slugify(base) || 'book'
  let slug = root
  let n = 2
  while (await exists(slug)) {
    slug = `${root}-${n++}`
  }
  return slug
}
