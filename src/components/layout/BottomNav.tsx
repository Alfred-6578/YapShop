"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HiOutlineSquares2X2,
  HiOutlineShoppingBag,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineEllipsisHorizontalCircle,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCube,
  HiOutlineUsers,
  HiOutlineIdentification,
  HiOutlineCog6Tooth,
} from 'react-icons/hi2'
import { LiaHeadsetSolid } from 'react-icons/lia'

import TabItem from './TabItem'
import { useClickOutside } from '@/hooks/useClickOutside'

const tabs = [
  { icon: <HiOutlineSquares2X2 size={20} />, label: 'Home', href: '/dashboard' },
  { icon: <HiOutlineShoppingBag size={20} />, label: 'Orders', href: '/orders' },
  { icon: <HiOutlineChatBubbleLeftEllipsis size={20} />, label: 'Chats', href: '/conversations' },
  { icon: <LiaHeadsetSolid size={20} />, label: 'Handoffs', href: '/handoffs', badge: true },
]

const moreItems = [
  { icon: <HiOutlineChatBubbleLeftRight size={18} />, label: 'Inbox', href: '/inbox' },
  { icon: <HiOutlineCube size={18} />, label: 'Products', href: '/products' },
  { icon: <HiOutlineUsers size={18} />, label: 'Customers', href: '/customers' },
  { icon: <HiOutlineIdentification size={18} />, label: 'Staff', href: '/staff' },
  { icon: <HiOutlineCog6Tooth size={18} />, label: 'Settings', href: '/settings' },
]

const BottomNav = () => {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)
  const popoverRef = useClickOutside<HTMLDivElement>(moreOpen, () => setMoreOpen(false))

  const moreActive = moreItems.some((m) => pathname?.startsWith(m.href))

  return (
    <nav className="flex md:hidden fixed bottom-0 inset-x-0 z-40 bg-panel border-t border-border justify-around py-1.5">
      {tabs.map((t) => (
        <TabItem
          key={t.href}
          icon={t.icon}
          label={t.label}
          href={t.href}
          active={pathname?.startsWith(t.href)}
          badge={t.badge}
        />
      ))}

      <div ref={popoverRef} className="relative">
        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 cursor-pointer ${
            moreOpen || moreActive ? 'text-accent' : 'text-fg-muted'
          }`}
          aria-expanded={moreOpen}
          aria-haspopup="menu"
        >
          <HiOutlineEllipsisHorizontalCircle size={20} />
          <span className="text-[11px]">More</span>
        </button>

        {moreOpen && (
          <div
            role="menu"
            className="absolute bottom-full right-2 mb-2 min-w-[180px] bg-panel border border-border rounded-[10px] shadow-lg p-1 z-50"
          >
            {moreItems.map((m) => {
              const active = pathname?.startsWith(m.href)
              return (
                <Link
                  key={m.href}
                  href={m.href}
                  role="menuitem"
                  onClick={() => setMoreOpen(false)}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[12.5px] ${
                    active ? 'bg-card-hover text-accent' : 'text-fg hover:bg-card-hover'
                  }`}
                >
                  <span className={active ? 'text-accent' : 'text-fg-muted'}>{m.icon}</span>
                  <span>{m.label}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}

export default BottomNav
