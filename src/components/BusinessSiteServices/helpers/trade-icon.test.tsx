import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { tradeIcon } from './trade-icon'

describe('tradeIcon', () => {
  it.each([['Plumbing', 'wrench'], ['HVAC', 'snowflake'], [' Electrical ', 'zap']])('renders %s immediately as a decorative icon', (trade, icon) => {
    const html = renderToStaticMarkup(<>{tradeIcon(trade)}</>)
    expect(html).toContain(`lucide-${icon}`)
    expect(html).toContain('aria-hidden="true"')
    expect(html).not.toContain('Suspense')
  })
  it('supports explicit icons and does not guess an icon for unknown trades', () => {
    expect(renderToStaticMarkup(<>{tradeIcon('Other', 'phone')}</>)).toContain('lucide-phone')
    expect(tradeIcon('Other')).toBeNull()
  })
})
