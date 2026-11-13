import { useId, type CSSProperties, type ReactNode } from 'react'
import { Award, ShieldCheck } from 'lucide-react'
import { BusinessSiteHero, type BusinessSiteHeroAction, type BusinessSiteHeroAppearance, type BusinessSiteHeroImage, type BusinessSiteHeroProps } from '../BusinessSiteHero'
import { BusinessSiteCta } from '../BusinessSiteCta'
import { readableText, safeColor, safeFont, type BusinessSiteMotion } from '../../utils/siteAppearance'
import './BusinessSiteAbout.scss'

export type BusinessSiteAboutSectionId = 'who-we-are' | 'why-choose-us' | 'awards-and-certifications' | 'our-promise' | 'our-motto'

export interface BusinessSiteAboutSection {
  id: BusinessSiteAboutSectionId
  title: string
  /** Safely rendered text or rich content supplied by the consuming application. */
  content: ReactNode
}

export interface BusinessSiteAboutAppearance {
  font?: string
  headingFont?: string
  backgroundColor?: string
  textColor?: string
  darkBackgroundColor?: string
  gradientEndColor?: string
  textOnDark?: string
  accentColor?: string
  buttonRadius?: BusinessSiteHeroAppearance['buttonRadius']
  density?: 'comfortable' | 'compact'
  motion?: BusinessSiteMotion
}

export interface BusinessSiteAboutProps {
  headline: string
  description?: string
  businessName?: string
  eyebrow?: string
  breadcrumb?: ReactNode
  sections: readonly BusinessSiteAboutSection[]
  actions?: readonly BusinessSiteHeroAction[]
  /** Optional About-specific image. Omit it when that content source supplies no image. */
  image?: BusinessSiteHeroImage & { caption?: string }
  hero?: Pick<BusinessSiteHeroProps, 'headlineSize' | 'imageFit' | 'imageBackdrop' | 'imagePosition'>
  cta?: { title: string; description?: string; placement?: string }
  appearance?: BusinessSiteAboutAppearance
  /** Stable anchor prefix when provided; otherwise each instance receives unique IDs. */
  sectionId?: string
  className?: string
}

function definedProps<T extends object>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as {
    [Key in keyof T]?: Exclude<T[Key], undefined>
  }
}
function aboutStyle(appearance: BusinessSiteAboutAppearance): CSSProperties {
  const background = safeColor(appearance.backgroundColor, '') || undefined
  const text = safeColor(appearance.textColor, '') || undefined
  const dark = safeColor(appearance.darkBackgroundColor, '') || undefined
  const onDark = safeColor(appearance.textOnDark, '') || undefined
  return {
    '--pz-business-about-background': background,
    '--pz-business-about-text': background && text ? readableText(text, background) : text,
    '--pz-business-about-dark': dark,
    '--pz-business-about-gradient-end': safeColor(appearance.gradientEndColor, '') || dark,
    '--pz-business-about-on-dark': dark && onDark ? readableText(onDark, dark) : onDark,
    '--pz-business-about-accent': safeColor(appearance.accentColor, '') || undefined,
    '--pz-business-about-font': appearance.font ? safeFont(appearance.font) : undefined,
    '--pz-business-about-heading-font': appearance.headingFont ? safeFont(appearance.headingFont) : undefined,
    '--pz-business-about-radius': ['2px', '8px', '16px', '32px'].find((radius) => radius === appearance.buttonRadius),
  } as CSSProperties
}

/** Reusable, server-safe presentation. Fetching, routing and Markdown/link policy belong to the application. */
export function BusinessSiteAbout({
  headline, description, businessName, eyebrow = 'About us', breadcrumb, sections, actions = [],
  image, hero, cta, appearance = {}, sectionId, className,
}: BusinessSiteAboutProps) {
  const generatedId = useId()
  const id = sectionId || generatedId + '-about'
  const find = (kind: BusinessSiteAboutSectionId) => sections.find((item) =>
    item.id === kind && item.title.trim() && item.content !== null && item.content !== undefined &&
    item.content !== false && (typeof item.content !== 'string' || item.content.trim()),
  )
  const who = find('who-we-are'), promise = find('our-promise'), motto = find('our-motto')
  const why = find('why-choose-us'), credentials = find('awards-and-certifications')
  const headingId = (item: BusinessSiteAboutSection) => id + '-' + item.id
  const copy = (item: BusinessSiteAboutSection, modifier?: string) => <div className={[
    'pz-business-about__copy', modifier && 'pz-business-about__' + modifier,
  ].filter(Boolean).join(' ')}>{item.content}</div>
  const heroAppearance = definedProps({
    font: appearance.font, headingFont: appearance.headingFont, backgroundColor: appearance.backgroundColor,
    textColor: appearance.textColor, accentColor: appearance.accentColor, buttonRadius: appearance.buttonRadius,
    density: appearance.density, motion: appearance.motion,
  })

  return <div id={sectionId} className={['pz-business-about', className].filter(Boolean).join(' ')}
    data-density={appearance.density === 'compact' ? 'compact' : 'comfortable'}
    data-motion={appearance.motion === 'subtle' ? 'subtle' : 'none'} style={aboutStyle(appearance)}>
    {breadcrumb && <div className="pz-business-about__breadcrumb">{breadcrumb}</div>}
    <BusinessSiteHero {...hero} headline={headline} headingId={id + '-heading'} eyebrow={eyebrow}
      {...definedProps({ answer: description, images: image ? [image] : undefined, mediaCaption: image?.caption })} actions={actions}
      layout={image ? 'split' : 'flat'} background="surface" align="left" contentOrder="text-first"
      intervalMs={0} variant="inner-page" appearance={heroAppearance} />
    <article aria-label="About the company">
      {motto && <section className="pz-business-about__motto" data-section={motto.id} aria-labelledby={headingId(motto)}>
        <div className="pz-business-about__container">
          <h2 className="pz-business-about__eyebrow" id={headingId(motto)}>{motto.title}</h2>
          {copy(motto, 'motto-copy')}
        </div>
      </section>}
      {(who || promise) && <div className="pz-business-about__container pz-business-about__story-grid" data-paired={Boolean(who && promise)}>
        {who && <section className="pz-business-about__story" data-section={who.id} aria-labelledby={headingId(who)}>
          <p className="pz-business-about__eyebrow">Our story</p>
          <h2 className="pz-business-about__heading" id={headingId(who)}>{who.title}</h2>
          {copy(who)}
        </section>}
        {promise && <section className="pz-business-about__promise" data-section={promise.id} aria-labelledby={headingId(promise)}>
          <h2 id={headingId(promise)}><ShieldCheck aria-hidden="true" size={22} />{promise.title}</h2>
          {copy(promise)}
        </section>}
      </div>}
      {why && <section className="pz-business-about__why" data-section={why.id} aria-labelledby={headingId(why)}>
        <div className="pz-business-about__container">
          <p className="pz-business-about__eyebrow">{why.title}</p>
          <h2 className="pz-business-about__heading" id={headingId(why)}>
            {businessName?.trim() ? 'What sets ' + businessName.trim() + ' apart' : why.title}
          </h2>
          {copy(why, 'why-copy')}
        </div>
      </section>}
      {credentials && <section className="pz-business-about__container pz-business-about__credentials"
        data-section={credentials.id} aria-labelledby={headingId(credentials)}>
        <p className="pz-business-about__eyebrow">Our credentials</p>
        <h2 className="pz-business-about__heading" id={headingId(credentials)}>
          <span className="pz-business-about__credential-icon"><Award aria-hidden="true" size={24} /></span>{credentials.title}
        </h2>
        {copy(credentials)}
      </section>}
    </article>
    {cta && <BusinessSiteCta {...cta} actions={actions} variant="direct-line" appearance={definedProps({
      font: appearance.font, headingFont: appearance.headingFont,
      surfaceColor: appearance.backgroundColor, surfaceTextColor: appearance.textColor,
      backgroundColor: appearance.darkBackgroundColor, gradientEndColor: appearance.gradientEndColor,
      textColor: appearance.textOnDark, accentColor: appearance.accentColor, buttonColor: appearance.accentColor,
      buttonRadius: appearance.buttonRadius, density: appearance.density, motion: appearance.motion,
    })} />}
  </div>
}

BusinessSiteAbout.displayName = 'BusinessSiteAbout'
