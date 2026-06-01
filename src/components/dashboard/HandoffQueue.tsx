import React from 'react'
import HandoffQueueItem from './HandoffQueueItem'

export type HandoffItem = {
  id: string
  name: string
  waited: string
}

type Props = {
  items: HandoffItem[]
}

const HandoffQueue = ({ items }: Props) => {
  return (
    <section>
      <div className="flex items-center justify-between px-3 mb-2">
        <h2 className="text-[15px] font-semibold">Handoff queue</h2>
        <span className="text-xs text-fg-muted tnum">{items.length}</span>
      </div>
      <div className="space-y-1">
        {items.map((item, i) => (
          <HandoffQueueItem
            key={item.id}
            name={item.name}
            waited={item.waited}
            active={i === 0}
          />
        ))}
      </div>
    </section>
  )
}

export default HandoffQueue
