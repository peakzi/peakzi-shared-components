import { forwardRef, useId, type SVGProps } from 'react'
import { iconDefinitions, type IconDefinition } from './icons'
import './Icon.scss'

export type IconName = keyof typeof iconDefinitions
export type IconVariant = 'monochrome' | 'color'
export type IconAppearance = 'filled' | 'outline'
export type IconSurface = 'light' | 'dark'

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'dangerouslySetInnerHTML' | 'name' | 'viewBox'> {
  name: IconName
  /** Width and height, unless individually supplied. Defaults to 24. Accepts SVG lengths such as 1em. */
  size?: number | string
  /** Monochrome inherits currentColor. Color uses supplied artwork when available, otherwise monochrome. */
  variant?: IconVariant
  /** Uses the requested supplied treatment, falling back to an available one. */
  appearance?: IconAppearance
  /** Selects supplied dark-surface color artwork. Monochrome always inherits currentColor. */
  surface?: IconSurface
  /** Accessible name for a standalone icon. Omit when the surrounding link/button already has a label. */
  title?: string
  testId?: string
}

/** One SVG contract for local artwork, including server rendering. */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon({ name, size = 24, variant = 'monochrome', appearance = 'filled', surface = 'light', title, className, testId, width, height, ...rest }, ref) {
  const id = `pz-icon-${useId()}`
  const definition: IconDefinition | undefined = Object.prototype.hasOwnProperty.call(iconDefinitions, name)
    ? iconDefinitions[name] : undefined
  if (!definition) return null
  const titleText = title?.trim()
  const titleId = `${id}-title`
  const labelled = Boolean(titleText || rest['aria-label']?.trim() || rest['aria-labelledby']?.trim())
  const resolvedAppearance = definition[appearance] ? appearance : definition.filled ? 'filled' : 'outline'
  const variants = definition[resolvedAppearance]
  if (!variants) return null
  const color = variant === 'color' ? (surface === 'dark' ? variants.dark ?? variants.color : variants.color) : undefined
  const { viewBox, Content } = color ?? variants.monochrome

  return <svg {...rest} ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox={viewBox}
    width={width ?? size} height={height ?? size} fill="none" focusable="false"
    className={['pz-icon', className].filter(Boolean).join(' ')} data-icon={name}
    data-icon-variant={color ? 'color' : 'monochrome'} data-icon-appearance={resolvedAppearance}
    {...(testId !== undefined ? { 'data-testid': testId } : {})}
    role={rest.role ?? (labelled ? 'img' : undefined)} aria-hidden={rest['aria-hidden'] ?? (labelled ? undefined : true)}
    aria-labelledby={rest['aria-labelledby'] ?? (!rest['aria-label'] && titleText ? titleId : undefined)}>
    {titleText && <title id={titleId}>{titleText}</title>}
    <Content id={id} />
  </svg>
})

Icon.displayName = 'Icon'
