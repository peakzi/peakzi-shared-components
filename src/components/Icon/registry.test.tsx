import { render, screen } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF'
import { Icon, type IconName } from './Icon'
import { getIconDefinition, iconNames } from './registry'

vi.mock('./fontAwesome', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./fontAwesome')>()
  return {
    ...actual,
    fontAwesomeIcons: { ...actual.fontAwesomeIcons, 'test-overlap': actual.fontAwesomeIcons.facebook },
  }
})

vi.mock('./customIcon', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./customIcon')>()
  return {
    ...actual,
    customIcons: {
      ...actual.customIcons,
      'test-overlap': { viewBox: '0 0 24 24', paths: ['M0 0h24v24H0z'] },
      'test-custom-svg': {
        viewBox: '0 0 24 24',
        Render: ({ id }: { id: string }) => (
          <g id={`${id}-custom`}><circle cx="12" cy="12" r="10" fill="currentColor" /></g>
        ),
      },
    },
  }
})

describe('Icon registry', () => {
  it('uses Font Awesome first when both sources register the same name', () => {
    const definition = getIconDefinition('test-overlap')
    expect(definition?.paths).toEqual([faFacebookF.icon[4]])
    expect(iconNames.filter((name) => name === ('test-overlap' as IconName))).toHaveLength(1)
  })

  it('renders a newly registered custom SVG component without changing Icon', () => {
    render(<Icon name={'test-custom-svg' as IconName} color="red" title="Custom artwork" />)
    const svg = screen.getByRole('img', { name: 'Custom artwork' })
    expect(svg.querySelector('circle')).toHaveAttribute('fill', 'currentColor')
    expect(svg.querySelector('g')?.id).toMatch(/^pz-icon-.*-custom$/)
    expect(svg).toHaveAttribute('color', 'red')
    expect(renderToStaticMarkup(<Icon name={'test-custom-svg' as IconName} />)).toContain('<circle')
  })

  it('uses registered local artwork when a name has no Font Awesome entry', () => {
    const bbb = getIconDefinition('bbb')
    expect(bbb?.paths?.length).toBeGreaterThan(0)
    expect(getIconDefinition('angi')?.paths?.length).toBeGreaterThan(0)
  })

  it.each(['missing', '__proto__', 'constructor', 'toString'])('omits unsupported names safely: %s', (name) => {
    expect(getIconDefinition(name)).toBeUndefined()
  })
})
