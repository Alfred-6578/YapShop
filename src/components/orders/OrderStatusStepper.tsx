import React from 'react'
import { HiCheck, HiClock, HiXCircle } from 'react-icons/hi2'

import type { OrderStatus } from '@/lib/orders/mockData'

type Props = {
  status: OrderStatus
}

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'paid', label: 'Paid' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
]

const OrderStatusStepper = ({ status }: Props) => {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center justify-center gap-2 py-2 text-[#F09595] text-[12px]">
        <HiXCircle size={14} /> This order was cancelled
      </div>
    )
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status)

  return (
    <div className="flex items-start mt-3">
      {STEPS.map((step, i) => {
        const state =
          i < currentIndex ? 'done' : i === currentIndex ? 'now' : 'next'
        const isLast = i === STEPS.length - 1

        const dotClass =
          state === 'done'
            ? 'bg-accent text-accent-fg'
            : state === 'now'
              ? 'bg-[#F0A92B] text-[#3D2806]'
              : 'bg-[#26282E] border border-[rgba(255,255,255,0.1)] text-transparent'

        const dotStyle =
          state === 'now' ? { boxShadow: '0 0 0 3px rgba(240,169,43,0.18)' } : undefined

        const labelClass =
          state === 'done'
            ? 'text-[#C5CAD0]'
            : state === 'now'
              ? 'text-[#F0C36B]'
              : 'text-fg-subtle'

        // Line is "complete" if BOTH this step and the next are reached
        // (i.e., this step is done — including the current one — and the next exists)
        const lineComplete = state === 'done'
        const lineClass = lineComplete ? 'bg-accent' : 'bg-[#26282E]'

        return (
          <div key={step.key} className="relative flex-1 flex flex-col items-center gap-1.5">
            {!isLast && (
              <span
                className={`absolute top-[8px] left-1/2 h-px w-full ${lineClass}`}
                aria-hidden
              />
            )}
            <span
              className={`relative z-10 h-[18px] w-[18px] rounded-full flex items-center justify-center text-[10px] ${dotClass}`}
              style={dotStyle}
            >
              {state === 'done' && <HiCheck size={10} />}
              {state === 'now' && <HiClock size={10} />}
            </span>
            <span className={`text-[10px] ${labelClass}`}>{step.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export default OrderStatusStepper
