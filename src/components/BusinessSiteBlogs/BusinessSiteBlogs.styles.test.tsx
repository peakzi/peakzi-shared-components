import { afterEach, describe, expect, it } from 'vitest'
import { compile } from 'sass'
import { resolve } from 'node:path'

// Check the compiled shared rules. jsdom does not measure image/card geometry;
// the portrait-image regression is also checked in the actual browser preview.
const css = compile(resolve('src/components/BusinessSiteBlogs/BusinessSiteBlogs.scss')).css
const styles: HTMLStyleElement[] = []

afterEach(() => {
  styles.splice(0).forEach((style) => style.remove())
  document.body.innerHTML = ''
})

function card(kind: 'cover' | 'logo' | 'placeholder', density = 'comfortable', layout = 'grid') {
  const sheet = document.createElement('style')
  sheet.textContent = css
  document.head.append(sheet)
  // Container/media-query geometry is verified in the real responsive preview.
  const rules = Array.from(sheet.sheet!.cssRules).filter((rule) => rule.type === CSSRule.STYLE_RULE)
  const style = document.createElement('style')
  style.textContent = rules.map((rule) => rule.cssText).join('\n')
  sheet.remove()
  styles.push(style)
  document.head.append(style)
  document.body.innerHTML = `<section class="pz-business-blogs" data-layout="${layout}" data-density="${density}">
    <article class="pz-business-blogs__article"><a class="pz-business-blogs__card" href="/blogs/example">
      <div class="pz-business-blogs__cover" data-image-kind="${kind}">
        ${kind === 'placeholder' ? '<span>Image unavailable</span>' : '<img width="800" height="1600" alt="Portrait service photo">'}
      </div>
      <div class="pz-business-blogs__content"><h3>A long article title</h3>
        <div class="pz-business-blogs__excerpt">A short preview.</div><span class="pz-business-blogs__read">Read more</span>
      </div>
    </a></article>
  </section>`
  return {
    frame: getComputedStyle(document.querySelector('.pz-business-blogs__cover')!),
    image: document.querySelector('img') ? getComputedStyle(document.querySelector('img')!) : undefined,
    heading: getComputedStyle(document.querySelector('h3')!),
    excerpt: getComputedStyle(document.querySelector('.pz-business-blogs__excerpt')!),
    content: getComputedStyle(document.querySelector('.pz-business-blogs__content')!),
    card: getComputedStyle(document.querySelector('.pz-business-blogs__card')!),
    read: getComputedStyle(document.querySelector('.pz-business-blogs__read')!),
  }
}

describe('blog grid image sizing', () => {
  it.each(['comfortable', 'compact'])('keeps %s portrait photos out of intrinsic frame sizing', (density) => {
    const { frame, image } = card('cover', density)
    expect(frame.aspectRatio.replace(/\s/g, '')).toBe('16/9')
    expect(frame.position).toBe('relative')
    expect(frame.minHeight).toMatch(/^0(?:px)?$/)
    expect(image?.position).toBe('absolute')
    expect(image?.width).toBe('100%')
    expect(image?.height).toBe('100%')
    expect(image?.objectFit).toBe('cover')
    expect(image?.objectPosition).toBe('center 25%')
  })

  it('uses the same frame without cropping or stretching the fallback logo', () => {
    const { frame, image } = card('logo')
    expect(frame.aspectRatio.replace(/\s/g, '')).toBe('16/9')
    expect(image?.position).toBe('absolute')
    expect(image?.objectFit).toBe('contain')
    expect(image?.width).toBe('56%')
    expect(image?.height).toBe('58%')
    expect(image?.margin).toBe('auto')
  })

  it('reserves a consistent placeholder frame when no image is available', () => {
    expect(card('placeholder').frame.aspectRatio.replace(/\s/g, '')).toBe('16/9')
  })

  it('shows full grid titles with short excerpts and aligned Read more without a fixed card height', () => {
    const { heading, excerpt, content, card: box, read } = card('cover')
    expect(heading.getPropertyValue('-webkit-line-clamp')).toBe('')
    expect(heading.overflow).not.toBe('hidden')
    expect(excerpt.getPropertyValue('-webkit-line-clamp')).toBe('2')
    expect(content.display).toBe('flex')
    expect(content.flexDirection).toBe('column')
    expect(read.marginTop).toBe('auto')
    expect(['', '0', 'auto']).toContain(box.minHeight)
  })

  it('leaves the featured homepage layout unchanged', () => {
    const { frame, image, heading } = card('cover', 'comfortable', 'featured')
    expect(frame.aspectRatio.replace(/\s/g, '')).toBe('16/9')
    expect(image?.position).not.toBe('absolute')
    expect(heading.getPropertyValue('-webkit-line-clamp')).not.toBe('2')
  })
})
