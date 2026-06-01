"use client"
import React from 'react'
import { usePathname } from 'next/navigation'
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineSquares2X2,
  HiOutlineShoppingBag,
  HiOutlineCube,
  HiOutlineUsers,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineIdentification,
  HiOutlineCog6Tooth,
} from 'react-icons/hi2'
import { LiaHeadsetSolid } from 'react-icons/lia'

import BrandMark from './BrandMark'
import NavItem from './NavItem'
import Avatar from '@/components/ui/Avatar'

const navItems = [
  { icon: <HiOutlineChatBubbleLeftRight size={18} />, label: 'Inbox', href: '/inbox' },
  { icon: <HiOutlineSquares2X2 size={18} />, label: 'Dashboard', href: '/dashboard' },
  { icon: <HiOutlineShoppingBag size={18} />, label: 'Orders', href: '/orders' },
  { icon: <HiOutlineCube size={18} />, label: 'Products', href: '/products' },
  { icon: <HiOutlineUsers size={18} />, label: 'Customers', href: '/customers' },
  { icon: <HiOutlineChatBubbleLeftEllipsis size={18} />, label: 'Conversations', href: '/conversations' },
  { icon: <LiaHeadsetSolid size={18} />, label: 'Handoffs', href: '/handoffs', badge: true },
  { icon: <HiOutlineIdentification size={18} />, label: 'Staff', href: '/staff' },
]

const Sidebar = () => {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex sticky top-0 self-start h-screen w-16 shrink-0 flex-col items-center bg-panel border-r border-border py-4 z-30 overflow-y-auto">
      <BrandMark />
      <nav className="mt-6 flex flex-col items-center gap-2 flex-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={pathname?.startsWith(item.href)}
            badge={item.badge}
          />
        ))}
      </nav>
      <div className="flex flex-col items-center gap-3 mt-auto">
        <NavItem
          icon={<HiOutlineCog6Tooth size={18} />}
          label="Settings"
          href="/settings"
          active={pathname?.startsWith('/settings')}
        />
        <Avatar name="Admin" size="md" />
      </div>
    </aside>
  )
}

export default Sidebar
