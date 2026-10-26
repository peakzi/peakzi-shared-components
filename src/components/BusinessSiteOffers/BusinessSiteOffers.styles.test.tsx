import { afterEach, describe, expect, it } from 'vitest'
import { compileString } from 'sass'
import { resolve } from 'node:path'

// Exercise the actual compiled selectors, including the generic carousel rule
// that previously stretched lone coupons. No browser geometry is mocked.
const css = compileString(`
  @use '../BusinessSiteCardCarousel/BusinessSiteCardCarousel';
  @use './BusinessSiteOffers';
`, { loadPaths: [resolve('src/components/BusinessSiteOffers')] }).css

const styles: HTMLStyleElement[] = []
afterEach(() => { styles.splice(0).forEach((style) => style.remove()); document.body.innerHTML = '' })

function activeRules(rules: CSSRuleList, width: number): string {
  return Array.from(rules).flatMap((rule) => {
    if ('conditionText' in rule && 'cssRules' in rule) {
      const maximum = /max-width:\s*(\d+)px/.exec(String(rule.conditionText))
      return maximum && width <= Number(maximum[1]) ? [activeRules(rule.cssRules as CSSRuleList, width)] : []
    }
    return [rule.cssText]
  }).join('\n')
}

function columns(width: number, prefix = 'offers', single = true) {
  const parsed = document.createElement('style')
  parsed.textContent = css
  document.head.append(parsed)
  const applicableCss = activeRules(parsed.sheet!.cssRules, width)
  parsed.remove()
  const style = document.createElement('style')
  style.textContent = applicableCss
  styles.push(style)
  document.head.append(style)
  document.body.innerHTML = `<section class="pz-business-${prefix}" data-layout="carousel">
    <div class="pz-business-card-carousel pz-business-${prefix}__carousel" data-single="${single}">
      <ul class="pz-business-card-carousel__list pz-business-${prefix}__list" data-single="${single}"><li>Card</li></ul>
    </div></section>`
  return getComputedStyle(document.querySelector('ul')!).gridAutoColumns
}

describe('single-coupon responsive sizing', () => {
  it.each([1440, 1024, 961])('uses one desktop column at %ipx instead of stretching', (width) => {
    expect(columns(width)).toBe('calc((100% - var(--space-8)) / 3)')
  })

  it.each([960, 768, 601])('uses one tablet column at %ipx', (width) => {
    expect(columns(width)).toBe('calc((100% - var(--space-4)) / 2)')
  })

  it.each([600, 390, 320])('fills the available mobile width at %ipx', (width) => {
    expect(columns(width)).toBe('100%')
  })

  it.each([1440, 768, 390])('preserves the generic single-card behavior for blogs at %ipx', (width) => {
    expect(columns(width, 'blogs')).toBe('100%')
  })

  it.each([1440, 768, 390])(
    'does not alter multi-coupon columns at %ipx', (width) => {
      const originalColumns = columns(width, 'blogs', false)
      expect(columns(width, 'offers', false)).toBe(originalColumns)
    },
  )
})
