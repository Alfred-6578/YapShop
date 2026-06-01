import React from 'react'
import { FaArrowUp } from 'react-icons/fa6'
import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import AreaChart from '@/components/ui/AreaChart'

type Props = {
  points: number[]
  delta?: string
  xLabels?: string[]
}

const RevenueTrendCard = ({ points, delta, xLabels }: Props) => {
  return (
    <Card>
      <CardHeader
        title="Revenue trend"
        meta={
          delta && (
            <span className="flex items-center gap-1 text-accent">
              <FaArrowUp /> {delta}
            </span>
          )
        }
      />
      <div className="mt-4">
        <AreaChart points={points} xLabels={xLabels} height={160} />
      </div>
    </Card>
  )
}

export default RevenueTrendCard
