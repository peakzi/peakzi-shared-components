import { Snowflake, Wrench, Zap } from 'lucide-react'
import { businessSiteIcon } from '../../../utils/businessSiteIcon'

const TRADE_ICONS = new Map([
  ['plumbing', Wrench], ['hvac', Snowflake], ['electrical', Zap],
])

export function tradeIcon(trade: string, iconName?: string) {
  if (iconName?.trim()) return businessSiteIcon(iconName)
  const Icon = TRADE_ICONS.get(trade.trim().toLowerCase())
  return Icon ? <Icon size={18} aria-hidden="true" /> : null
}
