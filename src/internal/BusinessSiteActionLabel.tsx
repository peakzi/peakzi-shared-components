interface ActionLabelProps {
  label: string
  desktopLabel?: string | undefined
}

/** Include both visible labels for screen readers and voice control. */
export function businessSiteActionAriaLabel({ label, desktopLabel }: ActionLabelProps): string | undefined {
  const desktop = desktopLabel?.trim()
  return desktop && desktop !== label.trim() ? label.trim() + ' ' + desktop : undefined
}

/** CSS switches copy at the shared header breakpoint; no client detection or hydration change. */
export function BusinessSiteActionLabel({ label, desktopLabel }: ActionLabelProps) {
  const desktop = desktopLabel?.trim()
  if (!desktop || desktop === label.trim()) return <>{label}</>
  return <>
    <span className="pz-business-action-label__mobile">{label}</span>
    <span className="pz-business-action-label__desktop">{desktop}</span>
  </>
}
