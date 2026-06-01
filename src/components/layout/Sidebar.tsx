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
  { icon: <HiOutlineSquares2X2 size={18} />, label: 'Dashboard', href: '/dashboard' },
  { icon: <HiOutlineShoppingBag size={18} />, label: 'Orders', href: '/orders' },
  { icon: <HiOutlineCube size={18} />, label: 'Products', href: '/products' },
  { icon: <HiOutlineUsers size={18} />, label: 'Customers', href: '/customers' },
  { icon: <HiOutlineChatBubbleLeftEllipsis size={18} />, label: 'Conversations', href: '/conversations' },
  { icon: <LiaHeadsetSolid size={18} />, label: 'Handoffs', href: '/handoffs', badge: true },
  { icon: <HiOutlineIdentification size={18} />, label: 'Staff', href: '/staff' },
  // { icon: <HiOutlineChatBubbleLeftRight size={18} />, label: 'Inbox', href: '/inbox' },
]

const Sidebar = () => {
  const pathname = usePathname()
  return (
    <>
      {/* Reserves a fixed 64px column so the main content never reflows
          when the sidebar expands on hover. */}
      <div className="hidden md:block w-16 shrink-0" aria-hidden />

      <aside className="group/sidebar hidden md:flex fixed top-0 left-0 h-screen w-16 hover:w-56 z-40 flex-col bg-panel border-r border-border py-4 overflow-y-auto overflow-x-hidden transition-[width] duration-200 ease-out">
        <div className="flex items-center gap-3 px-3 mb-4">
          <BrandMark size="sm" />
          <span className="text-[14px] font-medium whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150">
            YapShop
          </span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
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

        <div className="flex flex-col gap-2 mt-auto">
          <NavItem
            icon={<HiOutlineCog6Tooth size={18} />}
            label="Settings"
            href="/settings"
            active={pathname?.startsWith('/settings')}
          />
          <div className="flex items-center gap-3 px-3 h-10">
            <span className="shrink-0">
              <Avatar name="Admin" size="md" />
            </span>
            <span className="text-[12.5px] font-medium whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150">
              Admin
            </span>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
