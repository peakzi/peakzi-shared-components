import type { ComponentProps } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { BusinessSiteServicePricing } from './BusinessSiteServicePricing'
import type {
  BusinessSiteServicePricingFactor, BusinessSiteServicePricingSentiment, BusinessSiteServicePricingTier,
} from './helpers/types'

const repairTier: BusinessSiteServicePricingTier = {
  name: 'Water heater repair', low: 180, high: 450, typicalLow: 220, typicalHigh: 500,
  included: ['Diagnostic visit', 'Parts up to $50'],
  factors: [
    { label: 'Easy access to unit', low: -40, high: -60 },
    { label: 'Tankless unit', low: 120, high: 200 },
  ],
}
const installTier: BusinessSiteServicePricingTier = { name: 'Water heater installation', low: 1200, high: 2400 }
const sentiments: BusinessSiteServicePricingSentiment[] = [
  { key: 'great', label: 'Great price', businessPercentage: 64, marketPercentage: 36 },
  { key: 'ok', label: 'Reasonable', businessPercentage: 36, marketPercentage: 64 },
]

describe('BusinessSiteServicePricing', () => {
  it('returns nothing when not loading and there are no tiers at all', () => {
    const { container } = render(<BusinessSiteServicePricing businessName="Acme Plumbing" service="Water heater" tiers={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows skeleton placeholders while loading', () => {
    const { container } = render(<BusinessSiteServicePricing isLoading businessName="Acme Plumbing" service="Water heater" />)
    expect(container.querySelectorAll('.pz-service-pricing__skeleton').length).toBeGreaterThan(0)
  })

  it('defaults the eyebrow to "Pricing · {service}" and title to "What you can expect to pay"', () => {
    const html = renderToStaticMarkup(
      <BusinessSiteServicePricing businessName="Acme Plumbing" service="Water heater" tiers={[installTier]} />
    )
    expect(html).toContain('Pricing · Water heater')
    expect(html).toContain('What you can expect to pay')
  })

  it('supports a custom eyebrow and title', () => {
    const html = renderToStaticMarkup(
      <BusinessSiteServicePricing businessName="Acme" service="Water heater" tiers={[installTier]} eyebrow="Custom eyebrow" title="Custom title" />
    )
    expect(html).toContain('Custom eyebrow')
    expect(html).toContain('Custom title')
  })

  it('writes the one-tier lede using that tier\'s own price range', () => {
    const html = renderToStaticMarkup(<BusinessSiteServicePricing businessName="Acme" service="Water heater" tiers={[installTier]} />)
    expect(html).toContain('Water heater installation usually costs $1,200 – $2,400.')
  })

  it('writes the multi-tier lede using the min/max across all tiers', () => {
    const html = renderToStaticMarkup(<BusinessSiteServicePricing businessName="Acme" service="Water heater" tiers={[repairTier, installTier]} />)
    expect(html).toContain('Water heater jobs cost $180 to $2,400, depending on the work. Each job type is broken down below.')
  })

  it('writes the no-price lede and "priced on site" card when no tier has a price', () => {
    const html = renderToStaticMarkup(
      <BusinessSiteServicePricing businessName="Acme" service="Sewer line" tiers={[{ name: 'Sewer line repair' }]} />
    )
    expect(html).toContain('Every sewer line job is priced after the technician sees it.')
    expect(html).toContain('Priced on site')
    expect(html).toContain('Call for a free quote')
  })

  it('uses "call for an exact quote" once at least one tier is priced', () => {
    const html = renderToStaticMarkup(<BusinessSiteServicePricing businessName="Acme" service="Water heater" tiers={[installTier]} />)
    expect(html).toContain('Call for an exact quote')
  })

  it('keeps every tier so additional cards can wrap into further rows', () => {
    const tiers = Array.from({ length: 6 }, (_, index) => ({ name: `Tier ${index}`, low: 10, high: 20 }))
    const { container } = render(<BusinessSiteServicePricing businessName="Acme" service="Water heater" tiers={tiers} />)
    expect(container.querySelectorAll('.pz-service-pricing__tier-card')).toHaveLength(6)
    expect(container.querySelector('[data-count]')).toHaveAttribute('data-count', '6')
  })

  it('shows the vs-market stat only when below market, never when at or above', () => {
    const below = render(<BusinessSiteServicePricing businessName="Acme" service="X" tiers={[installTier]} vsMarketPercentage={-12} />)
    expect(within(below.container).getByText('12%')).toBeInTheDocument()
    expect(within(below.container).getByText('below the local market average')).toBeInTheDocument()
    below.unmount()

    const atMarket = render(<BusinessSiteServicePricing businessName="Acme" service="X" tiers={[installTier]} vsMarketPercentage={0} />)
    expect(within(atMarket.container).queryByText('below the local market average')).toBeNull()
  })

  it('shows the fair-value stat only when business percentage is at or above market', () => {
    const fair = render(
      <BusinessSiteServicePricing businessName="Acme" service="X" tiers={[installTier]} fairValue={{ businessPercentage: 88, marketPercentage: 74 }} />
    )
    expect(within(fair.container).getByText('88%')).toBeInTheDocument()
    expect(within(fair.container).getByText('Market average 74%')).toBeInTheDocument()
    fair.unmount()

    const unfair = render(
      <BusinessSiteServicePricing businessName="Acme" service="X" tiers={[installTier]} fairValue={{ businessPercentage: 60, marketPercentage: 74 }} />
    )
    expect(within(unfair.container).queryByText('rate the price fair or better')).toBeNull()
  })

  it('shows the perception bars with 2+ sentiments, and with exactly 1 only when there is no fair-value stat', () => {
    const multi = render(<BusinessSiteServicePricing businessName="Acme" service="X" tiers={[installTier]} sentiments={sentiments} />)
    expect(multi.container.querySelector('.pz-service-pricing__perception')).toBeInTheDocument()

    const singleNoFair = render(
      <BusinessSiteServicePricing businessName="Acme" service="X" tiers={[installTier]} sentiments={[sentiments[0]!]} />
    )
    expect(singleNoFair.container.querySelector('.pz-service-pricing__perception')).toBeInTheDocument()

    const singleWithFair = render(
      <BusinessSiteServicePricing
        businessName="Acme" service="X" tiers={[installTier]} sentiments={[sentiments[0]!]}
        fairValue={{ businessPercentage: 88, marketPercentage: 74 }}
      />
    )
    expect(singleWithFair.container.querySelector('.pz-service-pricing__perception')).toBeNull()
  })

  it('renders a business row and a market-average row, with the short name used for the business row', () => {
    render(
      <BusinessSiteServicePricing businessName="Acme Plumbing" shortBusinessName="Acme" service="X" tiers={[installTier]} sentiments={sentiments} />
    )
    expect(screen.getByText('Acme')).toBeInTheDocument()
    expect(screen.getByText('Market average')).toBeInTheDocument()
  })

  it('shows the typical-price comparison, included items, and factor groups only when present', () => {
    const { container } = render(<BusinessSiteServicePricing businessName="Acme" service="Water heater" tiers={[repairTier, installTier]} />)
    expect(container.querySelectorAll('.pz-service-pricing__typical')).toHaveLength(1) // only repairTier has typical data
    expect(screen.getByText('Diagnostic visit')).toBeInTheDocument()
    expect(screen.getByText('Lowers the price')).toBeInTheDocument()
    expect(screen.getByText('Raises the price')).toBeInTheDocument()
    expect(screen.getByText('−$40 to $60')).toBeInTheDocument() // low !== high -> a range
    expect(screen.getByText('+$120 to $200')).toBeInTheDocument()
  })

  it('formats a percentage factor distinctly from a dollar factor', () => {
    render(
      <BusinessSiteServicePricing
        businessName="Acme" service="Plumbing"
        tiers={[{ name: 'Repair', low: 100, high: 200, factors: [{ label: 'Membership discount', percent: -10 }] }]}
      />
    )
    expect(screen.getByText('−10%')).toBeInTheDocument()
  })

  it('shows the bare-note fallback when a tier has neither included items nor factors', () => {
    const { container } = render(<BusinessSiteServicePricing businessName="Acme" service="X" tiers={[installTier]} />)
    expect(container.querySelector('.pz-service-pricing__bare-note')).toHaveTextContent('No add-ons or discounts on record.')
  })

  it('shows the typical comparison only when the business range is at or below typical under "lower-only"', () => {
    const lower: BusinessSiteServicePricingTier = { name: 'A', low: 100, high: 150, typicalLow: 120, typicalHigh: 200 }
    const higher: BusinessSiteServicePricingTier = { name: 'B', low: 250, high: 300, typicalLow: 120, typicalHigh: 200 }
    const { container } = render(
      <BusinessSiteServicePricing businessName="Acme" service="X" tiers={[lower, higher]} typicalComparison="lower-only" />
    )
    expect(container.querySelectorAll('.pz-service-pricing__typical')).toHaveLength(1)
    expect(screen.getByText('Below typical · area $120 – $200')).toBeInTheDocument()
  })

  it('never renders a link built from an unsafe phoneHref', () => {
    const { container } = render(
      <BusinessSiteServicePricing businessName="Acme" service="X" tiers={[installTier]} phoneHref="javascript:alert(1)" />
    )
    const cta = container.querySelector('.pz-service-pricing__cta')!
    expect(cta).toHaveAttribute('href', '#')
  })

  it.each(['comfortable', 'compact'] as const)('shares website fonts, radius, palette and motion in %s density', (density) => {
    const html = renderToStaticMarkup(
      <BusinessSiteServicePricing
        businessName="Acme" service="X" tiers={[installTier]}
        appearance={{ density, motion: 'subtle', backgroundColor: '#fff8ee', gradientStartColor: '#123456', gradientEndColor: '#456789', buttonRadius: '16px' }}
      />
    )
    expect(html).toContain(`data-density="${density}"`)
    expect(html).toContain('data-motion="subtle"')
    expect(html).toContain('--pz-business-services-background:#fff8ee')
    expect(html).toContain('linear-gradient(135deg, #123456, #456789)')
    expect(html).toContain('--pz-business-services-radius:16px')
  })

  it('defaults to the compact stacked layout unless comfortable is passed', () => {
    const density = (appearance?: { density?: 'comfortable' | 'compact' }) =>
      renderToStaticMarkup(<BusinessSiteServicePricing businessName="Acme" service="X" tiers={[installTier]} {...(appearance ? { appearance } : {})} />)
    expect(density()).toContain('data-density="compact"')
    expect(density({})).toContain('data-density="compact"')
    expect(density({ density: 'comfortable' })).toContain('data-density="comfortable"')
  })

  it('applies a custom sectionId so it can be a BusinessSiteServiceDetail "on this page" anchor target', () => {
    const { container } = render(<BusinessSiteServicePricing businessName="Acme" service="X" tiers={[installTier]} sectionId="pricing" />)
    expect(container.querySelector('section')).toHaveAttribute('id', 'pricing')
  })
})

describe('BusinessSiteServicePricing data handling', () => {
  const renderPricing = (props: Partial<ComponentProps<typeof BusinessSiteServicePricing>> = {}) =>
    render(<BusinessSiteServicePricing businessName="Acme" service="Water heater" tiers={[installTier]} {...props} />)
  const texts = (container: HTMLElement, selector: string) => [...container.querySelectorAll(selector)].map((node) => node.textContent)
  const lede = (container: HTMLElement) => container.querySelector('.pz-service-pricing__lede')

  describe('prices', () => {
    it('shows one price when low and high match', () => {
      const { container } = renderPricing({ tiers: [{ name: 'Flat', low: 500, high: 500 }] })
      expect(texts(container, '.pz-service-pricing__tier-range')).toEqual(['$500'])
      expect(lede(container)).toHaveTextContent('Flat usually costs $500.')
    })

    it('rounds to whole dollars and groups thousands', () => {
      const { container } = renderPricing({ tiers: [{ name: 'Big', low: 1234.56, high: 12345.4 }] })
      expect(texts(container, '.pz-service-pricing__tier-range')).toEqual(['$1,235 – $12,345'])
    })

    it('treats incomplete or non-finite prices as unpriced', () => {
      const tiers = [
        { name: 'Low only', low: 100 }, { name: 'High only', high: 200 },
        { name: 'Not a number', low: NaN, high: 10 }, { name: 'Infinite', low: 1, high: Infinity },
      ]
      const { container } = renderPricing({ tiers })
      expect(texts(container, '.pz-service-pricing__tier-no-price')).toEqual(Array(4).fill('Priced on site'))
      expect(lede(container)).toHaveTextContent('Every water heater job is priced after')
    })

    it('builds the multi-tier lede only from fully priced tiers', () => {
      const tiers = [{ name: 'A', low: 100, high: 200 }, { name: 'B', low: 300, high: 400 }, { name: 'Partial', low: 50 }, { name: 'Unpriced' }]
      const { container } = renderPricing({ tiers })
      expect(lede(container)).toHaveTextContent('Water heater jobs cost $100 to $400,')
    })

    it.each([
      ['HVAC', 'Every HVAC job'],
      ['AC repair', 'Every AC repair job'],
      ['Water Heater', 'Every water heater job'],
      ['Sewer line', 'Every sewer line job'],
    ])('keeps acronyms when lowercasing the service "%s"', (service, expected) => {
      const { container } = renderPricing({ service, tiers: [{ name: 'Unpriced' }] })
      expect(lede(container)).toHaveTextContent(expected)
    })
  })

  describe('typical-price comparison', () => {
    it.each([
      ['below', { low: 100, high: 150 }, 'Below typical', true],
      ['at the typical upper bound', { low: 150, high: 200 }, 'Below typical', true],
      ['overlapping', { low: 100, high: 300 }, 'Within typical', false],
      ['above', { low: 250, high: 300 }, 'Above typical', false],
    ])('labels a range that is %s', (_case, prices, note, below) => {
      const { container } = renderPricing({ tiers: [{ name: 'A', ...prices, typicalLow: 120, typicalHigh: 200 }] })
      const chip = container.querySelector('.pz-service-pricing__typical-chip')!
      expect(chip).toHaveTextContent(`${note} · area $120 – $200`)
      expect(chip.classList.contains('pz-service-pricing__typical-chip--below')).toBe(below)
    })

    it('hides overlapping and higher ranges under "lower-only"', () => {
      const typical = { typicalLow: 120, typicalHigh: 200 }
      const tiers = [{ name: 'Within', low: 100, high: 300, ...typical }, { name: 'Above', low: 250, high: 300, ...typical }]
      const { container } = renderPricing({ tiers, typicalComparison: 'lower-only' })
      expect(container.querySelectorAll('.pz-service-pricing__typical')).toHaveLength(0)
    })

    it('needs a priced tier and both typical bounds', () => {
      const tiers = [
        { name: 'No upper', low: 100, high: 200, typicalLow: 120 },
        { name: 'No lower', low: 100, high: 200, typicalHigh: 220 },
        { name: 'Unpriced', typicalLow: 120, typicalHigh: 220 },
      ]
      const { container } = renderPricing({ tiers })
      expect(container.querySelectorAll('.pz-service-pricing__typical')).toHaveLength(0)
    })

    it('positions both bars proportionally against the larger upper bound', () => {
      const html = renderToStaticMarkup(<BusinessSiteServicePricing businessName="Acme" service="X" tiers={[repairTier]} />)
      expect(html).toContain('left:33.33%;width:calc(83.33% - 33.33%)')
      expect(html).toContain('left:40.74%;width:calc(92.59% - 40.74%)')
    })
  })

  describe('price factors', () => {
    const withFactors = (factors: BusinessSiteServicePricingFactor[]) =>
      renderPricing({ tiers: [{ name: 'T', low: 100, high: 200, factors }] })

    it('shows a point amount without a range', () => {
      withFactors([{ label: 'Rebate', low: -300, high: -300 }, { label: 'Fee', low: 60, high: 60 }])
      expect(screen.getByText('−$300')).toBeInTheDocument()
      expect(screen.getByText('+$60')).toBeInTheDocument()
    })

    it('treats a single dollar bound as a point amount', () => {
      withFactors([{ label: 'Only high', high: 50 }, { label: 'Only low', low: -20 }])
      expect(screen.getByText('+$50')).toBeInTheDocument()
      expect(screen.getByText('−$20')).toBeInTheDocument()
    })

    it('prefers a percentage over dollar bounds', () => {
      const { container } = withFactors([{ label: 'Mixed', percent: -10, low: 50, high: 80 }])
      expect(screen.getByText('−10%')).toBeInTheDocument()
      expect(container.querySelector('.pz-service-pricing__factor-group--down')).not.toBeNull()
      expect(container.querySelector('.pz-service-pricing__factor-group--up')).toBeNull()
    })

    it('rounds percentages to one decimal', () => {
      withFactors([{ label: 'Odd', percent: -12.34 }, { label: 'Fee', percent: 7.25 }])
      expect(screen.getByText('−12.3%')).toBeInTheDocument()
      expect(screen.getByText('+7.3%')).toBeInTheDocument()
    })

    it('drops factors with no usable amount', () => {
      const { container } = withFactors([{ label: 'Nothing' }, { label: 'Bad percent', percent: NaN }, { label: 'Real', low: 10, high: 20 }])
      expect(screen.queryByText('Nothing')).toBeNull()
      expect(screen.queryByText('Bad percent')).toBeNull()
      expect(screen.getByText('Real')).toBeInTheDocument()
      expect(texts(container, '.pz-service-pricing__factor-group-count')).toEqual(['1'])
    })

    it('shows the bare note when every factor is unusable', () => {
      const { container } = withFactors([{ label: 'Nothing' }])
      expect(container.querySelector('.pz-service-pricing__bare-note')).not.toBeNull()
      expect(container.querySelector('.pz-service-pricing__factor-group')).toBeNull()
    })

    it('counts each group separately, lowers first', () => {
      const { container } = withFactors([
        { label: 'R', low: 5, high: 5 }, { label: 'L1', low: -5, high: -5 }, { label: 'L2', percent: -5 },
      ])
      expect(texts(container, '.pz-service-pricing__factor-group-count')).toEqual(['2', '1'])
    })
  })

  describe('market stats', () => {
    it.each([[0], [8], [null], [NaN], [Infinity], [-Infinity]])('hides the vs-market stat for %s', (value) => {
      renderPricing({ vsMarketPercentage: value })
      expect(screen.queryByText('below the local market average')).toBeNull()
    })

    it.each([[-12, '12%'], [-12.34, '12.3%'], [-12.56, '12.6%']])('shows %s as %s below market', (value, shown) => {
      const { container } = renderPricing({ vsMarketPercentage: value })
      expect(texts(container, '.pz-service-pricing__stat-value')).toEqual([shown])
    })

    it('shows fair value when the business equals the market, rounded to one decimal', () => {
      const equal = renderPricing({ fairValue: { businessPercentage: 80, marketPercentage: 80 } })
      expect(within(equal.container).getByText('80%')).toBeInTheDocument()
      equal.unmount()
      const rounded = renderPricing({ fairValue: { businessPercentage: 87.66, marketPercentage: 74.04 } })
      expect(within(rounded.container).getByText('87.7%')).toBeInTheDocument()
      expect(within(rounded.container).getByText('Market average 74%')).toBeInTheDocument()
    })

    it.each([[NaN, 50], [Infinity, 50], [60, NaN]])('hides fair value for %s vs %s', (business, market) => {
      const { container } = renderPricing({ fairValue: { businessPercentage: business, marketPercentage: market } })
      expect(container.querySelector('.pz-service-pricing__stat')).toBeNull()
    })
  })

  describe('customer perception', () => {
    it('ignores sentiments without usable percentages', () => {
      const unusable = [null, { key: 'ok', label: 'Reasonable', businessPercentage: NaN, marketPercentage: 10 }] as unknown as BusinessSiteServicePricingSentiment[]
      const { container } = renderPricing({ sentiments: [sentiments[0]!, ...unusable] })
      expect(texts(container, '.pz-service-pricing__legend-item')).toEqual(['Great price'])
    })

    it('prints a percentage on segments of 9% or more only', () => {
      const { container } = renderPricing({ sentiments: [
        { key: 'great', label: 'Great', businessPercentage: 9, marketPercentage: 8.9 },
        { key: 'ok', label: 'Ok', businessPercentage: 91, marketPercentage: 91.1 },
      ] })
      const [business, market] = [...container.querySelectorAll('.pz-service-pricing__perception-row')]
      expect(texts(business as HTMLElement, '.pz-service-pricing__perception-segment')).toEqual(['9%', '91%'])
      expect(texts(market as HTMLElement, '.pz-service-pricing__perception-segment')).toEqual(['', '91.1%'])
    })

    it('clamps segment widths to the bar', () => {
      const html = renderToStaticMarkup(
        <BusinessSiteServicePricing businessName="Acme" service="X" tiers={[installTier]} sentiments={[
          { key: 'great', label: 'Great', businessPercentage: 140, marketPercentage: -5 },
          { key: 'ok', label: 'Ok', businessPercentage: 10, marketPercentage: 10 },
        ]} />
      )
      expect(html).toContain('width:100%')
      expect(html).toContain('width:0%')
    })

    it('describes each bar to assistive tech with rounded values', () => {
      const { container } = renderPricing({ shortBusinessName: 'Acme', sentiments: [
        { key: 'great', label: 'Great price', businessPercentage: 63.64, marketPercentage: 36 },
        { key: 'ok', label: 'Reasonable', businessPercentage: 36, marketPercentage: 64 },
      ] })
      const labels = [...container.querySelectorAll('[role="img"]')].map((node) => node.getAttribute('aria-label'))
      expect(labels).toEqual(['Acme: Great price 63.6%, Reasonable 36%', 'Market average: Great price 36%, Reasonable 64%'])
    })

    it('falls back to the business name when the short name is blank', () => {
      renderPricing({ businessName: 'Acme Plumbing', shortBusinessName: '   ', sentiments })
      expect(screen.getByText('Acme Plumbing')).toBeInTheDocument()
    })
  })

  describe('contact link', () => {
    it('keeps a tel link in the same tab', () => {
      const { container } = renderPricing({ phoneHref: 'tel:+15550100142' })
      const cta = container.querySelector('.pz-service-pricing__cta')!
      expect(cta).toHaveAttribute('href', 'tel:+15550100142')
      expect(cta).not.toHaveAttribute('target')
    })

    it('opens a web link in a new tab without leaking the opener', () => {
      const { container } = renderPricing({ phoneHref: 'https://example.com/book' })
      const cta = container.querySelector('.pz-service-pricing__cta')!
      expect(cta).toHaveAttribute('target', '_blank')
      expect(cta).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('falls back to an inert link when no href is given', () => {
      const { container } = renderPricing()
      expect(container.querySelector('.pz-service-pricing__cta')).toHaveAttribute('href', '#')
    })
  })

  describe('loading and text safety', () => {
    it('shows only skeletons while loading, even when data is supplied', () => {
      const { container } = renderPricing({
        isLoading: true, tiers: [repairTier, installTier], vsMarketPercentage: -12,
        fairValue: { businessPercentage: 88, marketPercentage: 74 }, sentiments,
      })
      expect(container.querySelectorAll('.pz-service-pricing__tier-card')).toHaveLength(0)
      expect(container.querySelector('.pz-service-pricing__lede')).toBeNull()
      expect(container.querySelector('.pz-service-pricing__stat')).toBeNull()
      expect(container.querySelector('.pz-service-pricing__perception')).toBeNull()
      expect(container.querySelectorAll('.pz-service-pricing__skeleton').length).toBeGreaterThan(0)
    })

    it('renders markup in supplied text as plain text', () => {
      const { container } = renderPricing({ tiers: [{ name: '<b>Bold</b>', low: 1, high: 2, included: ['<img src=x onerror=alert(1)>'] }] })
      expect(container.querySelector('b, img')).toBeNull()
      expect(screen.getByText('<b>Bold</b>')).toBeInTheDocument()
    })

    it('uses the default eyebrow when a custom one is blank', () => {
      const { container } = renderPricing({ eyebrow: '   ' })
      expect(container.querySelector('.pz-service-pricing__eyebrow')).toHaveTextContent('Pricing · Water heater')
    })
  })
})
