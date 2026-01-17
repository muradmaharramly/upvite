export function createSlugForName(firstName, lastName) {
  const normalize = (value) =>
    String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  const first = normalize(firstName)
  const last = normalize(lastName)
  if (first && last) return `${first}-${last}`
  return first || last || 'guest'
}

