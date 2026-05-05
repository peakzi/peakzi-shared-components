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
export type { CheckboxProps, RadioProps, CheckboxLabelPosition } from './components/Checkbox'

export { Switch } from './components/Switch'
export type { SwitchProps } from './components/Switch'

export { Slider } from './components/Slider'
export type { SliderProps, SliderSize, SliderTextPosition } from './components/Slider'

export { Segmented } from './components/Segmented'
export type { SegmentedProps, SegmentedOption } from './components/Segmented'

// ---------------------------------------------------------------------------
// Surfaces
// ---------------------------------------------------------------------------
export { Card, CardTitle, CardBody, Stat } from './components/Card'
export type { CardProps, CardVariant, CardTitleProps, CardBodyProps, StatProps, StatDelta } from './components/Card'

export { StatCard } from './components/StatCard'
export type { StatCardProps } from './components/StatCard'

export { Badge, Chip } from './components/Badge'
export type { BadgeProps, BadgeVariant, BadgeSize, ChipProps } from './components/Badge'

export { StatusPill } from './components/StatusPill'
export type { StatusPillProps, StatusPillStatus } from './components/StatusPill'

// ---------------------------------------------------------------------------
// App shell
// ---------------------------------------------------------------------------
export { PageHeader } from './components/PageHeader'
export type { PageHeaderProps } from './components/PageHeader'

export { SideNav, SideNavGroup, SideNavItem } from './components/SideNav'
export type { SideNavProps, SideNavGroupProps, SideNavItemProps } from './components/SideNav'

export { TopBar } from './components/TopBar'
export type { TopBarProps } from './components/TopBar'

export { AppFooter } from './components/AppFooter'
export type { AppFooterProps, AppFooterPosition, AppFooterVersionPlacement } from './components/AppFooter'

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
export { Tabs, TabList, Tab, TabPanel } from './components/Tabs'
export type { TabsProps, TabsVariant, TabListProps, TabProps, TabPanelProps } from './components/Tabs'

export { Navbar, NavBrand, NavLinks, NavLink, NavActions } from './components/Navbar'
export type { NavbarProps, NavBrandProps, NavLinksProps, NavLinkProps, NavActionsProps } from './components/Navbar'

export { Breadcrumbs, Pagination } from './components/Breadcrumbs'
export type { BreadcrumbsProps, BreadcrumbItem, PaginationProps } from './components/Breadcrumbs'

export { Stepper, StepperItem } from './components/Stepper'
export type { StepperProps, StepperItemProps, StepperStatus } from './components/Stepper'

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

export { EmptyState } from './components/EmptyState'
export type { EmptyStateProps } from './components/EmptyState'

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

export { CopyField } from './components/CopyField'
export type { CopyFieldProps } from './components/CopyField'

export { EditableField } from './components/EditableField'
export type { EditableFieldProps } from './components/EditableField'

export { DefList, DefRow } from './components/DefList'
export type { DefListProps, DefRowProps } from './components/DefList'

// ---------------------------------------------------------------------------
// Brand
// ---------------------------------------------------------------------------
export { PeakziLogo } from './components/PeakziLogo'
export type { PeakziLogoProps, LogoVariant, LogoSize } from './components/PeakziLogo'
