'use client'

import { Modal } from '../Modal'
import { BusinessSiteContactForm } from '../BusinessSiteContactForm'
import type { BusinessSiteContactFormProps } from '../BusinessSiteContactForm'
import { contactFormStyle } from '../BusinessSiteContactForm/helpers/appearance'

export interface BusinessSiteContactDialogProps extends BusinessSiteContactFormProps {
  open: boolean
  onClose: () => void
}

/** Shared, themed dialog presentation. The consumer owns the business API and disclosure. */
export function BusinessSiteContactDialog({ open, onClose, appearance = {}, className, ...form }: BusinessSiteContactDialogProps) {
  return <Modal open={open} onClose={onClose} aria-label={form.title?.trim() || 'Request service'} size="lg"
    className={['pz-business-contact-dialog', appearance.motion === 'none' && 'pz-business-contact-dialog--no-motion', className].filter(Boolean).join(' ')} style={contactFormStyle(appearance)}>
    <BusinessSiteContactForm {...form} appearance={appearance} />
  </Modal>
}

BusinessSiteContactDialog.displayName = 'BusinessSiteContactDialog'
