import { type ReactNode, type HTMLAttributes } from 'react'

// =============================================================================
// Section / SectionHeader
// =============================================================================

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode
}

/**
 * **Section** — one labeled region of a page: a heading (via `SectionHeader`)
 * followed by its content (cards, a `Grid`, a list). Purely a vertical
 * spacing + semantic wrapper — carries no border, background, or padding of
 * its own.
 *
 * @example
 * <Section>
 *   <SectionHeader title="Do this week" lead="Two things, neither urgent." />
 *   <Grid columns={2}>...</Grid>
 * </Section>
 */
export function Section({ className, children, ...rest }: SectionProps) {
  const cls = ['pz-section', className].filter(Boolean).join(' ')
  return (
    <section className={cls} {...rest}>
      {children}
    </section>
  )
}
Section.displayName = 'Section'

export interface SectionHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The section's label, e.g. "Standing" or "Slower reads that still matter". Rendered as an uppercase eyebrow. */
  title: ReactNode
  /** Optional one-line description under the title, e.g. "Read 10 Aug, next 7 Sep." */
  lead?: ReactNode
  /** Heading level for the title. Defaults to `h2`. */
  as?: 'h2' | 'h3' | 'h4'
}

/**
 * **SectionHeader** — the small uppercase label + optional lead line that
 * introduces a `Section`. Not a page title (`PageHeader` owns that) — this is
 * one step down, for a region within the page.
 */
export function SectionHeader({ title, lead, as: Tag = 'h2', className, ...rest }: SectionHeaderProps) {
  const cls = ['pz-section-header', className].filter(Boolean).join(' ')
  return (
    <div className={cls} {...rest}>
      <Tag className="pz-section-header__title">{title}</Tag>
      {lead && <span className="pz-section-header__lead">{lead}</span>}
    </div>
  )
}
SectionHeader.displayName = 'SectionHeader'
