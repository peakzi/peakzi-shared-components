import type { CSSProperties } from 'react'
import { readableText, safeColor } from '../../../utils/siteAppearance'
import { servicesStyle } from '../../BusinessSiteServices/helpers/appearance'
import type { BusinessSiteServicesAppearance } from '../../BusinessSiteServices/helpers/types'

export interface BusinessSiteServiceDetailAppearance extends BusinessSiteServicesAppearance {
  /** Primary action color, normally the same accent as the website header. */
  buttonColor?: string
}

export function serviceDetailStyle(appearance: BusinessSiteServiceDetailAppearance): CSSProperties {
  const button = safeColor(appearance.buttonColor, '')
  return {
    ...servicesStyle(appearance),
    ...(button ? {
      '--pz-service-detail-button': button,
      '--pz-service-detail-on-button': readableText('#ffffff', button),
    } : {}),
  } as CSSProperties
}
