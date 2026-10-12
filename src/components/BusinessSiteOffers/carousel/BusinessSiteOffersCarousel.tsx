'use client'

import type { ReactNode } from 'react'
import { BusinessSiteCardCarousel } from '../../BusinessSiteCardCarousel/BusinessSiteCardCarousel'

interface BusinessSiteOffersCarouselProps {
  children: ReactNode
  count: number
  animate: boolean
}

export function BusinessSiteOffersCarousel(props: BusinessSiteOffersCarouselProps) {
  return <BusinessSiteCardCarousel {...props} classPrefix="pz-business-offers" labels={{ carousel: 'Offers', cards: 'Offer cards', previous: 'Previous offers', next: 'Next offers' }} />
}
