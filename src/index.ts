// =============================================================================
// @peakzi/components — Public API
// =============================================================================
// Import styles ONCE in your app root:
//   import '@peakzi/components/styles'
//
// Then import components as needed:
//   import { Button, Card, Input } from '@peakzi/components'
// =============================================================================

// ---------------------------------------------------------------------------
// Inputs
// ---------------------------------------------------------------------------
export { Button } from './components/Button'
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button'

export { Field, Input, Textarea, Select } from './components/Input'
export type { FieldProps, InputProps, InputSize, TextareaProps, SelectProps } from './components/Input'

export { Checkbox, Radio } from './components/Checkbox'
export type { CheckboxProps, RadioProps } from './components/Checkbox'

export { Switch, Slider } from './components/Switch'
export type { SwitchProps, SliderProps } from './components/Switch'

// ---------------------------------------------------------------------------
// Surfaces
// ---------------------------------------------------------------------------
export { Card, CardTitle, CardBody, Stat } from './components/Card'
export type { CardProps, CardVariant, CardTitleProps, CardBodyProps, StatProps, StatDelta } from './components/Card'

export { Badge, Chip } from './components/Badge'
export type { BadgeProps, BadgeVariant, BadgeSize, ChipProps } from './components/Badge'

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
export { Tabs, TabList, Tab, TabPanel } from './components/Tabs'
export type { TabsProps, TabsVariant, TabListProps, TabProps, TabPanelProps } from './components/Tabs'

export { Navbar, NavBrand, NavLinks, NavLink, NavActions } from './components/Navbar'
export type { NavbarProps, NavBrandProps, NavLinksProps, NavLinkProps, NavActionsProps } from './components/Navbar'

export { Breadcrumbs, Pagination } from './components/Breadcrumbs'
export type { BreadcrumbsProps, BreadcrumbItem, PaginationProps } from './components/Breadcrumbs'

// ---------------------------------------------------------------------------
// Feedback
// ---------------------------------------------------------------------------
export { Alert } from './components/Alert'
export type { AlertProps, AlertVariant } from './components/Alert'

export { Progress, Ring, Spinner, Skeleton } from './components/Progress'
export type {
  ProgressProps,
  ProgressVariant,
  ProgressSize,
  RingProps,
  SpinnerProps,
  SpinnerSize,
  SpinnerVariant,
  SkeletonProps,
  SkeletonVariant,
} from './components/Progress'

// ---------------------------------------------------------------------------
// Overlays
// ---------------------------------------------------------------------------
export { Modal } from './components/Modal'
export type { ModalProps, ModalSize } from './components/Modal'

export {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
} from './components/Dropdown'
export type {
  DropdownProps,
  DropdownTriggerProps,
  DropdownMenuProps,
  DropdownAlign,
  DropdownItemProps,
  DropdownLabelProps,
} from './components/Dropdown'

export { Tooltip } from './components/Tooltip'
export type { TooltipProps } from './components/Tooltip'

// ---------------------------------------------------------------------------
// Data display
// ---------------------------------------------------------------------------
export { Table, Thead, Tbody, Tr, Th, Td } from './components/Table'
export type { TableProps, ThProps, TdProps, SortDirection } from './components/Table'

export { Avatar, AvatarStack } from './components/Avatar'
export type {
  AvatarProps,
  AvatarSize,
  AvatarVariant,
  AvatarStatus,
  AvatarStackProps,
} from './components/Avatar'

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/Accordion'
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from './components/Accordion'

// ---------------------------------------------------------------------------
// Brand
// ---------------------------------------------------------------------------
export { PeakziLogo } from './components/PeakziLogo'
export type { PeakziLogoProps, LogoVariant, LogoSize } from './components/PeakziLogo'
