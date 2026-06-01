'use client'

import SegmentedControl from '@/components/ui/SegmentedControl'

export type HandoffTab = 'pending' | 'active' | 'resolved'

type Props = {
  value: HandoffTab
  onChange: (v: HandoffTab) => void
  pendingCount: number
  activeCount: number
}

const HandoffsTabs = ({ value, onChange, pendingCount, activeCount }: Props) => {
  const isSelected = (v: HandoffTab) => v === value

  const countBadge = (count: number, selected: boolean) => (
    <span
      className={`text-[9.5px] px-1.5 py-0 rounded-[4px] ml-1.5 ${
        selected
          ? 'bg-[rgba(240,169,43,0.22)] text-[#F0C36B]'
          : 'bg-white/[0.08] text-fg-muted'
      }`}
    >
      {count}
    </span>
  )

  const options: { value: HandoffTab; label: React.ReactNode }[] = [
    { value: 'pending', label: <>Pending {countBadge(pendingCount, isSelected('pending'))}</> },
    { value: 'active', label: <>Active {countBadge(activeCount, isSelected('active'))}</> },
    { value: 'resolved', label: 'Resolved' },
  ]

  return (
    <div className="w-fit">
      <SegmentedControl<HandoffTab> options={options} value={value} onChange={onChange} />
    </div>
  )
}

export default HandoffsTabs
