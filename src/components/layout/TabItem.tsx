"use client"
import React from 'react'
import Link from 'next/link'

type Props = {
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
  badge?: boolean
}

const TabItem = ({ icon, label, href, active, badge }: Props) => {
  return (
    <Link
      href={href}
      className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 ${
        active ? 'text-accent' : 'text-fg-muted'
      }`}
    >
      <span className="relative">
        {icon}
        {badge && (
          <span className="absolute -top-1 -right-2 h-2 w-2 rounded-full bg-status-pending" />
        )}
      </span>
      <span className="text-[11px]">{label}</span>
    </Link>
  )
}

export default TabItem
