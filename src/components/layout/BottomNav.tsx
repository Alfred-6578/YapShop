"use client"
import React from 'react'
import { usePathname } from 'next/navigation'
import {
  HiOutlineSquares2X2,
  HiOutlineShoppingBag,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineEllipsisHorizontalCircle,
} from 'react-icons/hi2'
import { LiaHeadsetSolid } from 'react-icons/lia'

import TabItem from './TabItem'

const tabs = [
  { icon: <HiOutlineSquares2X2 size={20} />, label: 'Home', href: '/dashboard' },
  { icon: <HiOutlineShoppingBag size={20} />, label: 'Orders', href: '/orders' },
  { icon: <HiOutlineChatBubbleLeftEllipsis size={20} />, label: 'Chats', href: '/conversations' },
  { icon: <LiaHeadsetSolid size={20} />, label: 'Handoffs', href: '/handoffs', badge: true },
  { icon: <HiOutlineEllipsisHorizontalCircle size={20} />, label: 'More', href: '/more' },
]

const BottomNav = () => {
  const pathname = usePathname()
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
    </nav>
  )
}

export default BottomNav
