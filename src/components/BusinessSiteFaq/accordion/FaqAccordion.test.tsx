import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BusinessSiteFaq } from '../BusinessSiteFaq'

const items = [
  { id: 'one', question: 'First question', answer: 'First full answer' },
  { id: 'two', question: 'Second question', answer: <p>Second full answer <a href="#help">Help</a></p> },
  { id: 'three', question: 'Third question', answer: 'Third full answer' },
]
let frames: Map<number, FrameRequestCallback>
let nextFrame: number
const flush = () => act(() => {
  const callbacks = [...frames.values()]
  frames.clear()
  callbacks.forEach((callback) => callback(0))
})

beforeEach(() => {
  frames = new Map()
  nextFrame = 0
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    frames.set(++nextFrame, callback)
    return nextFrame
  })
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => { frames.delete(id) })
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))
})
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals() })

function setup(motion: 'none' | 'subtle' = 'subtle') {
  const result = render(<BusinessSiteFaq items={items} layout="stack" revealOnOpen appearance={{ motion }} />)
  const details = [...result.container.querySelectorAll('details')]
  const summaries = details.map((item) => item.querySelector('summary')!)
  return { ...result, details, summaries }
}

describe('FAQ reveal on opening', () => {
  it('server-renders complete answers with only the first open and no client-only content', () => {
    const html = renderToStaticMarkup(<BusinessSiteFaq items={items} revealOnOpen />)
    expect(html).toContain('First full answer')
    expect(html).toContain('Second full answer')
    expect(html).toContain('Third full answer')
    expect(html.match(/open=""/g)).toHaveLength(1)
    expect(html).toContain('data-reveal-on-open="true"')
    expect(renderToStaticMarkup(<BusinessSiteFaq items={items} />)).not.toContain('data-reveal-on-open')
  })

  it('does not scroll or move focus on initial mount, including the default open answer', () => {
    setup()
    flush()
    expect(window.scrollTo).not.toHaveBeenCalled()
    expect(document.activeElement?.tagName).toBe('BODY')
  })

  it('closes the other answers and focuses the newly opened question without a second focus scroll', () => {
    const { details, summaries } = setup()
    const focus = vi.spyOn(summaries[1]!, 'focus')
    fireEvent.click(summaries[1]!.querySelector('span')!)
    flush()
    expect(details.map((item) => item.open)).toEqual([false, true, false])
    expect(focus).toHaveBeenCalledWith({ preventScroll: true })
    expect(document.activeElement).toBe(summaries[1])
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('scrolls below the actual sticky header instead of hiding the question beneath it', () => {
    const { summaries } = setup()
    const header = document.createElement('header')
    header.className = 'pz-business-header'
    header.style.position = 'sticky'
    vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({ bottom: 80 } as DOMRect)
    vi.spyOn(summaries[1]!, 'getBoundingClientRect').mockReturnValue({ top: 400 } as DOMRect)
    document.body.prepend(header)
    try {
      fireEvent.click(summaries[1]!)
      flush()
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 304, behavior: 'smooth' })
    } finally { header.remove() }
  })

  it.each(['reduced-motion', 'motion-none'] as const)('does not animate scrolling for %s', (preference) => {
    if (preference === 'reduced-motion') vi.mocked(window.matchMedia).mockReturnValue({ matches: true } as MediaQueryList)
    const { summaries } = setup(preference === 'motion-none' ? 'none' : 'subtle')
    fireEvent.click(summaries[1]!)
    flush()
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })
  })

  it('does not scroll when closing the current answer or clicking inside its content', () => {
    const { summaries } = setup()
    fireEvent.click(summaries[0]!)
    flush()
    expect(window.scrollTo).not.toHaveBeenCalled()
    fireEvent.click(summaries[1]!)
    flush()
    vi.mocked(window.scrollTo).mockClear()
    fireEvent.click(screen.getByText('Second full answer', { exact: false }))
    flush()
    expect(window.scrollTo).not.toHaveBeenCalled()
  })

  it('does not move focus for a prevented click or a non-primary pointer', () => {
    const { summaries } = setup()
    summaries[1]!.addEventListener('click', (event) => event.preventDefault(), { once: true })
    fireEvent.click(summaries[1]!)
    fireEvent.click(summaries[2]!, { button: 2 })
    flush()
    expect(window.scrollTo).not.toHaveBeenCalled()
  })

  it('keeps only the latest question reveal during rapid changes', () => {
    const { details, summaries } = setup()
    fireEvent.click(summaries[1]!)
    fireEvent.click(summaries[2]!)
    flush()
    expect(details.map((item) => item.open)).toEqual([false, false, true])
    expect(document.activeElement).toBe(summaries[2])
    expect(window.scrollTo).toHaveBeenCalledTimes(1)
  })

  it('cancels a reveal if the answer is closed before the next frame', () => {
    const { summaries } = setup()
    fireEvent.click(summaries[1]!)
    fireEvent.click(summaries[1]!)
    flush()
    expect(window.scrollTo).not.toHaveBeenCalled()
  })

  it('does not close answers belonging to another FAQ instance', () => {
    const { details, summaries } = setup()
    const other = render(<BusinessSiteFaq items={items} revealOnOpen />)
    fireEvent.click(summaries[1]!)
    flush()
    expect(details[0]!.open).toBe(false)
    expect(other.container.querySelector('details')?.open).toBe(true)
  })

  it('cleans up pending work and event listeners when unmounted', () => {
    const { unmount, summaries, container } = setup()
    const list = container.querySelector('.pz-business-faq__list')!
    const remove = vi.spyOn(list, 'removeEventListener')
    fireEvent.click(summaries[1]!)
    unmount()
    flush()
    expect(remove).toHaveBeenCalledWith('click', expect.any(Function))
    expect(window.cancelAnimationFrame).toHaveBeenCalled()
    expect(window.scrollTo).not.toHaveBeenCalled()
  })
})
