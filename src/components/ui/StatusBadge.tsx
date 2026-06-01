import React from 'react'

export type StatusValue =
  | 'pending'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'none'
  | 'active'
  | 'inactive'
  | 'completed'
  | 'failed'
  | 'requested'
  | 'resolved'

type Props = {
  status: StatusValue
  label?: string
  className?: string
}

const styles: Record<StatusValue, string> = {
  pending: 'bg-status-pending/15 text-status-pending',
  paid: 'bg-status-paid/15 text-status-paid',
  shipped: 'bg-status-shipped/15 text-status-shipped',
  delivered: 'bg-status-delivered/15 text-status-delivered',
  cancelled: 'bg-status-cancelled/15 text-status-cancelled',
  none: 'bg-status-none/15 text-status-none',
  active: 'bg-[rgba(21,194,106,0.18)] text-[#6FD9A0]',
  inactive: 'bg-[rgba(107,112,121,0.22)] text-[#B8BDC4]',
  completed: 'bg-status-paid/15 text-status-paid',
  failed: 'bg-status-cancelled/15 text-status-cancelled',
  requested: 'bg-status-pending/15 text-status-pending',
  resolved: 'bg-status-paid/15 text-status-paid',
}

const StatusBadge = ({ status, label, className = '' }: Props) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-pill text-xs font-medium ${styles[status]} ${className}`}
    >
      {label ?? status}
    </span>
  )
}

export default StatusBadge
