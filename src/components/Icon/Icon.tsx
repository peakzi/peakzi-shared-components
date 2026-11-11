import { forwardRef, useId, type SVGProps } from 'react'
import { iconDefinitions, type IconDefinition } from './icons'
import './Icon.scss'

export type IconName = keyof typeof iconDefinitions
export type IconVariant = 'monochrome' | 'color'

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'dangerouslySetInnerHTML' | 'name' | 'viewBox'> {
  name: IconName
  /** Width and height, unless individually supplied. Defaults to 24. Accepts SVG lengths such as 1em. */
  size?: number | string
  /** Monochrome inherits currentColor. Color uses supplied artwork when available, otherwise monochrome. */
  variant?: IconVariant
  /** Accessible name for a standalone icon. Omit when the surrounding link/button already has a label. */
  title?: string
  testId?: string
}

/** Local, server-renderable SVG artwork; no network requests or client-only boundary. */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon({ name, size = 24, variant = 'monochrome', title, className, testId, width, height, ...rest }, ref) {
  const id = `pz-icon-${useId()}`
  const definition: IconDefinition | undefined = Object.prototype.hasOwnProperty.call(iconDefinitions, name)
    ? iconDefinitions[name] : undefined
  if (!definition) return null
  const titleText = title?.trim()
  const titleId = `${id}-title`
  const labelled = Boolean(titleText || rest['aria-label']?.trim() || rest['aria-labelledby']?.trim())
  const Color = variant === 'color' ? definition.Color : undefined

  return <svg {...rest} ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox={definition.viewBox}
    width={width ?? size} height={height ?? size} fill="none" focusable="false"
    className={['pz-icon', className].filter(Boolean).join(' ')} data-icon={name}
    data-icon-variant={Color ? 'color' : 'monochrome'} {...(testId !== undefined ? { 'data-testid': testId } : {})}
    role={rest.role ?? (labelled ? 'img' : undefined)} aria-hidden={rest['aria-hidden'] ?? (labelled ? undefined : true)}
    aria-labelledby={rest['aria-labelledby'] ?? (!rest['aria-label'] && titleText ? titleId : undefined)}>
    {titleText && <title id={titleId}>{titleText}</title>}
    {Color ? <Color id={id} /> : <path d={definition.path} fill="currentColor" fillRule={definition.fillRule} />}
  </svg>
})

Icon.displayName = 'Icon'
