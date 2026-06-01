import React from 'react'
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
  return (
    <aside className="hidden xl:flex sticky top-0 self-start h-screen w-72 shrink-0 flex-col gap-6 py-4 border-l border-border bg-panel overflow-y-auto z-20">
      <HandoffQueue items={handoffs} />
      <ActivityFeed events={activity} />
    </aside>
  )
}

export default RightRail
