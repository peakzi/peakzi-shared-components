import { useId } from 'react'
import { Minus, Plus } from 'lucide-react'
import { businessSiteIcon } from '../../utils/businessSiteIcon'
import { safeHref } from '../../utils/safeHref'
import { faqStyle } from './helpers/appearance'
import type { BusinessSiteFaqProps } from './helpers/types'

export function BusinessSiteFaq({
  items,
  title = 'Frequently asked questions',
  eyebrow = 'FAQs',
  intro,
  contact,
  defaultOpenFirst = true,
  appearance = {},
  sectionId,
  className,
}: BusinessSiteFaqProps) {
  const instanceId = useId()
  const visibleItems = items.filter((item) =>
    item.question.trim() && item.answer !== null && item.answer !== undefined &&
    item.answer !== false && (typeof item.answer !== 'string' || item.answer.trim()),
  )
  if (visibleItems.length === 0) return null

  const contactTitle = contact?.title.trim()
  const headingId = `${instanceId}-heading`
  const actions = (contact?.actions ?? []).flatMap((action) => {
    const href = safeHref(action.href)
    return href && action.label.trim() ? [{ ...action, href }] : []
  })

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className={['pz-business-faq', className].filter(Boolean).join(' ')}
      data-density={appearance.density === 'compact' ? 'compact' : 'comfortable'}
      data-motion={appearance.motion === 'subtle' ? 'subtle' : 'none'}
      style={faqStyle(appearance)}
    >
      <div className="pz-business-faq__inner">
        <div className="pz-business-faq__aside">
          {eyebrow.trim() && <p className="pz-business-faq__eyebrow">{eyebrow}</p>}
          <h2 id={headingId}>{title.trim() || 'Frequently asked questions'}</h2>
          {intro?.trim() && <p className="pz-business-faq__intro">{intro}</p>}
          {contactTitle && (
            <div className="pz-business-faq__contact">
              <h3>{contactTitle}</h3>
              {contact?.description?.trim() && <p>{contact.description}</p>}
              {actions.length > 0 && (
                <div className="pz-business-faq__actions">
                  {actions.map((action) => {
                    const newTab = action.newTab === true && /^https?:\/\//i.test(action.href)
                    const icon = businessSiteIcon(action.iconName)
                    return (
                      <a
                        key={action.id}
                        href={action.href}
                        target={newTab ? '_blank' : undefined}
                        rel={newTab ? 'noopener noreferrer' : undefined}
                        data-action-id={action.id}
                      >
                        {action.iconPosition !== 'after' && icon}
                        <span>{action.label}</span>
                        {action.iconPosition === 'after' && icon}
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="pz-business-faq__list">
          {visibleItems.map((item, index) => (
            <details
              className="pz-business-faq__item"
              key={item.id}
              name={`${instanceId}-questions`}
              open={defaultOpenFirst && index === 0}
            >
              <summary>
                <span>{item.question}</span>
                <span className="pz-business-faq__icon" aria-hidden="true">
                  <Plus className="pz-business-faq__expand" size={20} />
                  <Minus className="pz-business-faq__collapse" size={20} />
                </span>
              </summary>
              <div className="pz-business-faq__answer">
                {typeof item.answer === 'string' ? <p>{item.answer}</p> : item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

BusinessSiteFaq.displayName = 'BusinessSiteFaq'
