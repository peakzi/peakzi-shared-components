import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { BusinessSiteHeroCarousel } from './BusinessSiteHeroCarousel'
it('uses shared progress indicators and an explicit pause control for hero autoplay', () => {
 const {container}=render(<BusinessSiteHeroCarousel images={[{src:'/one.jpg',alt:'One'},{src:'/two.jpg',alt:'Two'}]} intervalMs={3000} />)
 expect(screen.getByRole('button',{name:'Pause slideshow'})).toBeInTheDocument()
 expect(container.querySelector('.pz-photo-gallery__pagination')).toBeInTheDocument()
})
