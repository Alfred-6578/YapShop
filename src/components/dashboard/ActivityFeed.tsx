import React from 'react'
import ActivityItem, { ActivityKind } from './ActivityItem'

export type ActivityEvent = {
  id: string
  kind: ActivityKind
  title: React.ReactNode
  meta: string
}

type Props = {
  events: ActivityEvent[]
}

const ActivityFeed = ({ events }: Props) => {
  return (
    <section>
      <h2 className="text-[15px] font-semibold px-3 mb-2">Activity</h2>
      <ul className="space-y-0.5">
        {events.map((e) => (
          <ActivityItem key={e.id} kind={e.kind} title={e.title} meta={e.meta} />
        ))}
      </ul>
    </section>
  )
}

export default ActivityFeed
