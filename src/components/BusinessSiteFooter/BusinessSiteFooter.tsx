import { safeHref } from '../../utils/safeHref'
import { footerStyle } from './helpers/appearance'
import { footerLink, validFooterLinks } from './helpers/links'
import type { BusinessSiteFooterProps } from './helpers/types'

export type {
  BusinessSiteFooterAppearance,
  BusinessSiteFooterColumn,
  BusinessSiteFooterLink,
  BusinessSiteFooterLogo,
  BusinessSiteFooterPhone,
  BusinessSiteFooterProps,
} from './helpers/types'

export function BusinessSiteFooter({
  businessName,
  logo,
  addressLines = [],
  phone,
  columns = [],
  bottomLinks = [],
  attribution,
  copyrightYear,
  appearance = {},
  navigationLabel = 'Footer navigation',
  className,
}: BusinessSiteFooterProps) {
  const name = businessName.trim()
  const logoSrc = safeHref(logo?.src, true)
  const logoHref = safeHref(logo?.homeHref) ?? '/'
  const address = addressLines.filter((line) => line?.trim())
  const validPhoneHref = safeHref(phone?.href)
  const phoneHref = phone?.display?.trim() && validPhoneHref?.startsWith('tel:')
    ? validPhoneHref
    : null
  const linkColumns = columns
    .filter((column) => column?.heading?.trim())
    .map((column) => ({ ...column, links: validFooterLinks(column.links ?? []) }))
    .filter((column) => column.links.length > 0)
  const legalLinks = validFooterLinks(bottomLinks)
  const year = copyrightYear && Number.isFinite(copyrightYear) && copyrightYear > 0
    ? copyrightYear
    : new Date().getUTCFullYear()

  return (
    <footer
      className={['pz-business-footer', className].filter(Boolean).join(' ')}
      data-density={appearance.density === 'compact' ? 'compact' : 'comfortable'}
      data-motion={appearance.motion === 'subtle' ? 'subtle' : 'none'}
      style={footerStyle(appearance)}
    >
      <div className="pz-business-footer__inner">
        <div className="pz-business-footer__content">
          <div className="pz-business-footer__brand">
            {logoSrc && logo && (
              <a className="pz-business-footer__logo" href={logoHref}>
                <img
                  src={logoSrc}
                  alt={logo.alt}
                  width={Number.isFinite(logo.width) && logo.width > 0 ? logo.width : 150}
                  height={Number.isFinite(logo.height) && logo.height > 0 ? logo.height : 44}
                  decoding="async"
                />
              </a>
            )}
            {(name || address.length > 0 || phoneHref) && (
              <address>
                {name && <strong>{name}</strong>}
                {address.map((line, index) => <span key={`${index}-${line}`}>{line}</span>)}
                {phoneHref && phone && <a href={phoneHref}>{phone.display}</a>}
              </address>
            )}
          </div>

          {linkColumns.length > 0 && (
            <nav className="pz-business-footer__nav" aria-label={navigationLabel}>
              {linkColumns.map((column) => (
                <div className="pz-business-footer__column" key={column.id}>
                  <h2>{column.heading}</h2>
                  <ul>{column.links.map((link) => <li key={link.id}>{footerLink(link)}</li>)}</ul>
                </div>
              ))}
            </nav>
          )}
        </div>

        <div className="pz-business-footer__bottom">
          <span>© {year} {name}. All rights reserved.</span>
          {legalLinks.length > 0 && (
            <nav aria-label="Legal navigation">
              <ul>{legalLinks.map((link) => <li key={link.id}>{footerLink(link)}</li>)}</ul>
            </nav>
          )}
          {attribution && footerLink(attribution)}
        </div>
      </div>
    </footer>
  )
}

BusinessSiteFooter.displayName = 'BusinessSiteFooter'
