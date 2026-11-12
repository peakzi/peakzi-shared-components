import { forwardRef, useId, type SVGProps } from 'react'
import { getIconDefinition, type IconName } from './registry'
import './Icon.scss'

export type { IconName } from './registry'

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'dangerouslySetInnerHTML' | 'name' | 'size' | 'viewBox' | 'title'> {
  /** Any registered icon name, independent of its artwork source. */
  name: IconName
  /** Monochrome colour, including CSS variables or currentColor. Defaults to black. */
  color?: string | undefined
  /** Default width and height, unless individually supplied. Defaults to 24. Accepts SVG lengths such as 1em. */
  size?: number | string | undefined
  /** Accessible name for a standalone icon. Omit when the surrounding link/button already has a label. */
  title?: string | undefined
  testId?: string | undefined
}

/** Shared SVG renderer. Artwork is resolved by name in the registry, never fetched at runtime. */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { name, color = 'black', size = 24, title, className, testId, width, height, ...rest },
  ref,
) {
  const id = `pz-icon-${useId()}`
  const definition = getIconDefinition(name)
  if (!definition) return null

  const titleText = title?.trim()
  const titleId = `${id}-title`
  const labelled = Boolean(titleText || rest['aria-label']?.trim() || rest['aria-labelledby']?.trim())
  const Artwork = definition.Render

  return (
    <svg
      {...rest}
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={definition.viewBox}
      width={width ?? size}
      height={height ?? size}
      color={color}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      focusable="false"
      className={['pz-icon', className].filter(Boolean).join(' ')}
      data-icon={name}
      {...(testId !== undefined ? { 'data-testid': testId } : {})}
      role={rest.role ?? (labelled ? 'img' : undefined)}
      aria-hidden={rest['aria-hidden'] ?? (labelled ? undefined : true)}
      aria-labelledby={rest['aria-labelledby'] ?? (!rest['aria-label'] && titleText ? titleId : undefined)}
    >
      {titleText && <title id={titleId}>{titleText}</title>}
      {Artwork
        ? <Artwork id={id} />
        : definition.paths?.map((path, index) => <path key={index} d={path} fill="currentColor" fillRule={definition.fillRule} />)}
    </svg>
  )
})

Icon.displayName = 'Icon'
