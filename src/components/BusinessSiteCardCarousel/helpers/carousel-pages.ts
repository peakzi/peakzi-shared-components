// Arrow steps follow real card positions after swiping and responsive resizing.
export function carouselPages(starts: readonly number[], width: number, maxScroll: number): number[] {
  if (width <= 0 || maxScroll <= 1 || starts.length < 2) return [0]
  const step = starts[1]! - starts[0]!
  if (step <= 0) return [0, maxScroll]
  const visible = Math.max(1, Math.floor((width + 1) / step))
  const pages = [0]
  for (let index = visible; index < starts.length; index += visible) {
    const position = Math.min(starts[index]!, maxScroll)
    if (position - pages[pages.length - 1]! > 1) pages.push(position)
  }
  if (maxScroll - pages[pages.length - 1]! > 1) pages.push(maxScroll)
  return pages
}

export function nearestPage(pages: readonly number[], left: number): number {
  return pages.reduce((nearest, page, index) => Math.abs(page - left) < Math.abs(pages[nearest]! - left) ? index : nearest, 0)
}
