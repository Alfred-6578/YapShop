'use client'

import React from 'react'
import type { StaffRole } from '@/lib/staff/mockData'

type Props = {
  value: StaffRole
  onChange: (v: StaffRole) => void
  allowedRoles: StaffRole[]
  showOwner?: boolean
  ownerNote?: React.ReactNode
}

const ROLE_INFO: Record<StaffRole, { name: string; description: string }> = {
  owner: { name: 'Owner', description: 'Full access to everything in YapShop' },
  admin: { name: 'Admin', description: 'Manage products, staff, and view all data' },
  support: { name: 'Support', description: 'Handle conversations, claim handoffs, view orders' },
}

const RoleOptions = ({ value, onChange, allowedRoles, showOwner, ownerNote }: Props) => {
  const roles: StaffRole[] = []
  if (showOwner) roles.push('owner')
  roles.push('admin', 'support')

  return (
    <div className="flex flex-col gap-1.5">
      {roles.map((role) => {
        const allowed = allowedRoles.includes(role)
        const selected = value === role
        const disabled = role === 'owner' || !allowed

        const containerClasses =
          'rounded-[9px] px-2.5 py-2.5 flex items-start gap-2.5 transition-colors' +
          (selected
            ? ' border border-accent bg-[rgba(21,194,106,0.06)]'
            : ' border border-border bg-bg') +
          (disabled
            ? ' opacity-55 cursor-not-allowed'
            : ' cursor-pointer hover:bg-card-hover')

        return (
          <div
            key={role}
            className={containerClasses}
            onClick={() => {
              if (!disabled) onChange(role)
            }}
          >
            <span
              className={`mt-0.5 inline-flex h-[13px] w-[13px] rounded-full border-[1.5px] items-center justify-center ${
                selected ? 'border-accent' : 'border-border-strong'
              }`}
            >
              {selected && <span className="h-[6px] w-[6px] rounded-full bg-accent" />}
            </span>
            <div className="flex flex-col">
              <span className="text-[12px] text-fg font-medium">{ROLE_INFO[role].name}</span>
              <span className="text-[10.5px] text-fg-muted leading-tight">
                {ROLE_INFO[role].description}
              </span>
            </div>
          </div>
        )
      })}
      {ownerNote && (
        <p className="text-[10.5px] text-fg-subtle leading-snug px-1 pt-1">{ownerNote}</p>
      )}
    </div>
  )
}

export default RoleOptions
