"use client"
import { useState } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'

import HandoffQueue, { HandoffItem } from '@/components/dashboard/HandoffQueue'
import ActivityFeed, { ActivityEvent } from '@/components/dashboard/ActivityFeed'

const handoffs: HandoffItem[] = [
  { id: '1', name: 'Emperor', waited: '4m' },
  { id: '2', name: 'Ada Obi', waited: '11m' },
  { id: '3', name: 'Tunde B.', waited: '22m' },
]

const activity: ActivityEvent[] = [
  {
    id: '1',
    kind: 'payment',
    title: (
      <>
        Payment received — <span className="font-medium">₦18,000</span>
      </>
    ),
    meta: 'just now',
  },
  { id: '2', kind: 'order', title: 'New order #ORD-2841', meta: '2m ago' },
  { id: '3', kind: 'conversation', title: 'New conversation', meta: '6m ago' },
  { id: '4', kind: 'stock', title: 'Low stock: Gele', meta: '14m ago' },
]

const RightRail = () => {
  const [open, setOpen] = useState(true)

  return (
    <>
      <aside
        className={`hidden xl:flex sticky top-0 self-start h-screen shrink-0 flex-col gap-6 ${
          open ? 'w-72 py-4 overflow-y-auto border-l border-border' : 'w-0 py-0 overflow-hidden border-l-0'
        } bg-panel z-20 transition-[width,padding] duration-200`}
      >
        <HandoffQueue items={handoffs} />
        <ActivityFeed events={activity} />
      </aside>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Collapse activity panel' : 'Expand activity panel'}
        className="hidden xl:flex fixed top-17 z-30 h-7 w-7 items-center justify-center bg-card border border-border rounded-full text-fg-muted hover:text-fg hover:bg-card-hover cursor-pointer transition-[right] duration-200 shadow"
        style={{ right: open ? '276px' : '12px' }}
      >
        {open ? <HiChevronRight size={14} /> : <HiChevronLeft size={14} />}
      </button>
    </>
  )
}

export default RightRail
