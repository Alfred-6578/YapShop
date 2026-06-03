"use client"
import React from 'react'
import { usePathname } from 'next/navigation'
import { HiOutlineBell } from 'react-icons/hi2'

import SearchTrigger from './SearchTrigger'
import BrandMark from './BrandMark'
import ThemeToggle from '@/components/ui/ThemeToggle'
import IconButton from '@/components/ui/IconButton'
import Avatar from '@/components/ui/Avatar'

const segmentLabels: Record<string, string> = {
  dashboard: 'Overview',
  orders: 'Orders',
  products: 'Products',
  customers: 'Customers',
  conversations: 'Conversations',
  handoffs: 'Handoffs',
  staff: 'Staff',
  settings: 'Settings',
  inbox: 'Inbox',
}

const cap = (s: string) =>
  segmentLabels[s] ?? s.charAt(0).toUpperCase() + s.slice(1)

/** Walk segments back-to-front and pick the first one that resolves to a known route label.
 *  Stops dynamic ID segments (cust-tunde, ord-2841, edit, [staffId]) from leaking into the
 *  page title — falls back to the nearest meaningful parent route instead. */
const resolveTitleSegment = (segments: string[]): string | null => {
  for (let i = segments.length - 1; i >= 0; i--) {
    if (segmentLabels[segments[i]]) return segments[i]
  }
  return segments[segments.length - 1] ?? null
}

const TopBar = () => {
  const pathname = usePathname() ?? '/'
  const segments = pathname.split('/').filter(Boolean)
  const titleSegment = resolveTitleSegment(segments)
  const title = titleSegment ? cap(titleSegment) : 'Home'

  return (
    <header className="sticky top-0 z-20 h-14 px-4 flex items-center gap-3 bg-panel border-b border-border">
      <div className="flex md:hidden items-center gap-2.5 flex-1 min-w-0">
        <BrandMark size="sm" />
        <div className="min-w-0">
          <h1 className="text-base font-bold leading-tight truncate">{title}</h1>
          <p className="text-xs text-fg-muted leading-tight truncate">Naijamart store</p>
        </div>
      </div>

      <div className="hidden md:block flex-1 max-w-md">
        <SearchTrigger />
      </div>

      <div className="hidden md:block flex-1" />

      <div className="flex items-center gap-2">
        <div className="hidden md:block">
          <ThemeToggle />
        </div>
        <IconButton
          aria-label="Notifications"
          icon={<HiOutlineBell size={18} />}
          badge
        />
        <div className="md:hidden">
          <Avatar name="Admin" size="sm" />
        </div>
      </div>
    </header>
  )
}

export default TopBar
